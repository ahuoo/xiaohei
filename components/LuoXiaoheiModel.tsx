
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  isThinking: boolean;
  expression: 'neutral' | 'happy' | 'blink';
  modelRef?: React.RefObject<THREE.Group>;
}

export const LuoXiaoheiModel: React.FC<ModelProps> = ({ isThinking, expression, modelRef }) => {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const heixiuRef = useRef<THREE.Group>(null);

  // Sync internal ref with external ref for export
  useEffect(() => {
    if (modelRef && groupRef.current) {
      // @ts-ignore - Assigning readonly property for purpose of ref forwarding
      modelRef.current = groupRef.current;
    }
  }, [modelRef]);
  
  // Materials
  const blackMaterial = new THREE.MeshStandardMaterial({
    color: '#050505',
    roughness: 0.3,
    metalness: 0.1,
  });

  const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.1,
    metalness: 0.0,
    emissive: '#ffffff',
    emissiveIntensity: 0.2,
  });

  const eyePupilMaterial = new THREE.MeshStandardMaterial({
    color: '#000000',
    roughness: 0,
  });

  const earInsideMaterial = new THREE.MeshStandardMaterial({
    color: '#65a30d', // Green for inside ear
    emissive: '#4ade80',
    emissiveIntensity: 0.2,
    roughness: 0.5,
  });
  
  const mouthMaterial = new THREE.MeshStandardMaterial({
    color: '#4ade80', // Green mouth
    emissive: '#4ade80',
    emissiveIntensity: 0.2,
    roughness: 0.5,
  });

  // Tail Geometry Curve
  const tailCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.4, -0.5),
      new THREE.Vector3(0, 1.0, -0.7),
      new THREE.Vector3(0, 1.5, -0.4),
    ]);
  }, []);

  // Animation State
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Floating body
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }

    // Tail wagging
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 2) * 0.15;
      tailRef.current.rotation.x = Math.sin(t * 1.5) * 0.1;
    }

    // Heixiu Orbit
    if (heixiuRef.current) {
      heixiuRef.current.position.x = Math.sin(t * 2) * 1.5;
      heixiuRef.current.position.z = Math.cos(t * 2) * 1.5;
      heixiuRef.current.position.y = 1.2 + Math.sin(t * 3) * 0.3;
      heixiuRef.current.lookAt(0, 1, 0);
    }

    // Thinking animation (Head tilt)
    if (headRef.current) {
        if (isThinking) {
            headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, 0.2, 0.1);
        } else {
            headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, 0, 0.1);
        }
    }
  });

  // Eye Scale Logic for Blinking/Expression
  const [eyeScaleY, setEyeScaleY] = useState(1);
  
  useEffect(() => {
    if (expression === 'blink') {
        setEyeScaleY(0.1);
        const timer = setTimeout(() => setEyeScaleY(1), 150);
        return () => clearTimeout(timer);
    } else if (expression === 'happy') {
        setEyeScaleY(0.3); // Squint
    } else {
        setEyeScaleY(1);
    }
  }, [expression]);


  return (
    <group ref={groupRef} dispose={null}>
      {/* --- HEAD GROUP --- */}
      <group ref={headRef} position={[0, 1.4, 0]}>
        {/* Main Head Sphere (Ovalish) - Increased segments for smoothness */}
        <mesh castShadow receiveShadow scale={[1.15, 0.95, 1]}>
          <sphereGeometry args={[0.95, 256, 256]} />
          <primitive object={blackMaterial} />
        </mesh>

        {/* Ears */}
        <group>
          {/* Left Ear - High res cone */}
          <mesh position={[-0.7, 0.7, 0]} rotation={[0, 0, 0.5]} castShadow>
            <coneGeometry args={[0.38, 0.85, 128]} />
            <primitive object={blackMaterial} />
          </mesh>
           {/* Left Ear Inside - Green */}
           <mesh position={[-0.7, 0.7, 0.18]} rotation={[-0.2, 0, 0.5]} scale={[0.6, 0.6, 0.1]}>
            <coneGeometry args={[0.38, 0.85, 128]} />
            <primitive object={earInsideMaterial} />
          </mesh>

          {/* Right Ear */}
          <mesh position={[0.7, 0.7, 0]} rotation={[0, 0, -0.5]} castShadow>
            <coneGeometry args={[0.38, 0.85, 128]} />
            <primitive object={blackMaterial} />
          </mesh>
          {/* Right Ear Inside - Green */}
          <mesh position={[0.7, 0.7, 0.18]} rotation={[-0.2, 0, -0.5]} scale={[0.6, 0.6, 0.1]}>
            <coneGeometry args={[0.38, 0.85, 128]} />
            <primitive object={earInsideMaterial} />
          </mesh>
        </group>

        {/* Face */}
        <group position={[0, 0.1, 0.85]}>
          {/* Left Eye - Separated */}
          <group position={[-0.4, 0.05, 0]} scale={[1, eyeScaleY, 1]}>
             {/* White - High res */}
            <mesh rotation={[0.1, -0.3, 0]} scale={[1, 1, 0.25]}>
               <sphereGeometry args={[0.35, 64, 64]} />
               <primitive object={eyeWhiteMaterial} />
            </mesh>
            {/* Pupil - Embedded (Fixed for 3D Printing) - High res */}
            <mesh position={[-0.02, 0, 0.05]} rotation={[0.1, -0.3, 0]} scale={[0.65, 0.65, 0.25]}>
                 <sphereGeometry args={[0.25, 64, 64]} />
                 <primitive object={eyePupilMaterial} />
            </mesh>
          </group>

          {/* Right Eye - Separated */}
          <group position={[0.4, 0.05, 0]} scale={[1, eyeScaleY, 1]}>
             {/* White - High res */}
            <mesh rotation={[0.1, 0.3, 0]} scale={[1, 1, 0.25]}>
               <sphereGeometry args={[0.35, 64, 64]} />
               <primitive object={eyeWhiteMaterial} />
            </mesh>
            {/* Pupil - Embedded (Fixed for 3D Printing) - High res */}
            <mesh position={[0.02, 0, 0.05]} rotation={[0.1, 0.3, 0]} scale={[0.65, 0.65, 0.25]}>
                 <sphereGeometry args={[0.25, 64, 64]} />
                 <primitive object={eyePupilMaterial} />
            </mesh>
          </group>

          {/* Nose/Mouth - Triangle Green */}
          <mesh position={[0, -0.25, 0.1]} rotation={[Math.PI, 0, 0]} scale={[1.6, 1.6, 0.5]}>
             <coneGeometry args={[0.04, 0.04, 3]} />
             <primitive object={mouthMaterial} />
          </mesh>
        </group>
      </group>

      {/* --- BODY GROUP --- */}
      <group position={[0, 0.5, 0]}>
        {/* Torso - High res */}
        <mesh castShadow position={[0, 0.1, 0]} scale={[0.85, 1, 0.75]}>
          <sphereGeometry args={[0.65, 256, 256]} />
          <primitive object={blackMaterial} />
        </mesh>

        {/* Front Legs - High res capsule */}
        <mesh position={[-0.3, -0.4, 0.35]} rotation={[0.2, 0, 0]} castShadow>
           <capsuleGeometry args={[0.14, 0.5, 20, 64]} />
           <primitive object={blackMaterial} />
        </mesh>
        <mesh position={[0.3, -0.4, 0.35]} rotation={[0.2, 0, 0]} castShadow>
           <capsuleGeometry args={[0.14, 0.5, 20, 64]} />
           <primitive object={blackMaterial} />
        </mesh>

        {/* Back Legs - High res capsule */}
        <mesh position={[-0.35, -0.45, -0.3]} rotation={[-0.2, 0, 0]} castShadow>
           <capsuleGeometry args={[0.15, 0.4, 20, 64]} />
           <primitive object={blackMaterial} />
        </mesh>
        <mesh position={[0.35, -0.45, -0.3]} rotation={[-0.2, 0, 0]} castShadow>
           <capsuleGeometry args={[0.15, 0.4, 20, 64]} />
           <primitive object={blackMaterial} />
        </mesh>

        {/* Tail Group - High res tube */}
        <group ref={tailRef} position={[0, -0.1, -0.45]}>
             <mesh castShadow>
                <tubeGeometry args={[tailCurve, 256, 0.08, 64, false]} />
                <primitive object={blackMaterial} />
             </mesh>
             {/* Round tip for tail - High res */}
             <mesh position={[0, 1.5, -0.4]}>
                <sphereGeometry args={[0.08, 32, 32]} />
                <primitive object={blackMaterial} />
             </mesh>
        </group>
      </group>

      {/* Heixiu (Little Black Spirit) - Restored - High res */}
      <group ref={heixiuRef}>
        <mesh castShadow>
          <sphereGeometry args={[0.2, 64, 64]} />
          <primitive object={blackMaterial} />
        </mesh>
        {/* Heixiu Eyes - High res */}
        <group position={[0, 0.05, 0.15]} scale={[0.8, 0.8, 0.8]}>
           <mesh position={[-0.08, 0, 0]}>
             <sphereGeometry args={[0.05, 32, 32]} />
             <primitive object={eyeWhiteMaterial} />
           </mesh>
           <mesh position={[0.08, 0, 0]}>
             <sphereGeometry args={[0.05, 32, 32]} />
             <primitive object={eyeWhiteMaterial} />
           </mesh>
        </group>
      </group>

      {/* Thinking Indicator */}
      {isThinking && (
         <group position={[0, 2.5, 0]}>
             <Html center>
                 <div className="text-white text-xl opacity-80 font-bold drop-shadow-md">?</div>
             </Html>
         </group>
      )}

    </group>
  );
};
