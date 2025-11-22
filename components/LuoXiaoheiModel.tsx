
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

    // Heixiu (Little Spirit) orbiting
    if (heixiuRef.current) {
      heixiuRef.current.position.x = Math.cos(t * 2) * 1.8;
      heixiuRef.current.position.z = Math.sin(t * 2) * 1.8;
      heixiuRef.current.position.y = Math.sin(t * 4) * 0.3 + 1;
      heixiuRef.current.rotation.y += 0.05;
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
        {/* Main Head Sphere (Ovalish) */}
        <mesh castShadow receiveShadow scale={[1.15, 0.95, 1]}>
          <sphereGeometry args={[0.95, 64, 64]} />
          <primitive object={blackMaterial} />
        </mesh>

        {/* Ears */}
        <group>
          {/* Left Ear */}
          <mesh position={[-0.7, 0.7, 0]} rotation={[0, 0, 0.5]} castShadow>
            <coneGeometry args={[0.38, 0.85, 32]} />
            <primitive object={blackMaterial} />
          </mesh>
           {/* Left Ear Inside - Green */}
           <mesh position={[-0.7, 0.7, 0.18]} rotation={[-0.2, 0, 0.5]} scale={[0.6, 0.6, 0.1]}>
            <coneGeometry args={[0.38, 0.85, 32]} />
            <primitive object={earInsideMaterial} />
          </mesh>

          {/* Right Ear */}
          <mesh position={[0.7, 0.7, 0]} rotation={[0, 0, -0.5]} castShadow>
            <coneGeometry args={[0.38, 0.85, 32]} />
            <primitive object={blackMaterial} />
          </mesh>
          {/* Right Ear Inside - Green */}
          <mesh position={[0.7, 0.7, 0.18]} rotation={[-0.2, 0, -0.5]} scale={[0.6, 0.6, 0.1]}>
            <coneGeometry args={[0.38, 0.85, 32]} />
            <primitive object={earInsideMaterial} />
          </mesh>
        </group>

        {/* Face */}
        <group position={[0, 0.1, 0.85]}>
          {/* Left Eye - Moved further apart (-0.42) */}
          <group position={[-0.42, 0.05, 0]} scale={[1, eyeScaleY, 1]}>
             {/* White - Smaller radius (0.35) to prevent connection */}
            <mesh rotation={[0.1, -0.3, 0]} scale={[1, 1, 0.25]}>
               <sphereGeometry args={[0.35, 32, 32]} />
               <primitive object={eyeWhiteMaterial} />
            </mesh>
            {/* Pupil - Bigger and Rounder (No Green Iris) */}
            <mesh position={[-0.02, 0, 0.12]} rotation={[0.1, -0.3, 0]} scale={[0.65, 0.65, 0.1]}>
                 <sphereGeometry args={[0.25, 32, 32]} />
                 <primitive object={eyePupilMaterial} />
            </mesh>
          </group>

          {/* Right Eye - Moved further apart (0.42) */}
          <group position={[0.42, 0.05, 0]} scale={[1, eyeScaleY, 1]}>
             {/* White */}
            <mesh rotation={[0.1, 0.3, 0]} scale={[1, 1, 0.25]}>
               <sphereGeometry args={[0.35, 32, 32]} />
               <primitive object={eyeWhiteMaterial} />
            </mesh>
            {/* Pupil - Bigger and Rounder (No Green Iris) */}
            <mesh position={[0.02, 0, 0.12]} rotation={[0.1, 0.3, 0]} scale={[0.65, 0.65, 0.1]}>
                 <sphereGeometry args={[0.25, 32, 32]} />
                 <primitive object={eyePupilMaterial} />
            </mesh>
          </group>

          {/* Nose/Mouth - Triangle Green - Bigger */}
          <mesh position={[0, -0.25, 0.1]} rotation={[Math.PI, 0, 0]} scale={[1.6, 1.6, 0.5]}>
             <coneGeometry args={[0.04, 0.04, 3]} />
             <primitive object={mouthMaterial} />
          </mesh>
        </group>
      </group>

      {/* --- BODY GROUP --- */}
      <group position={[0, 0.5, 0]}>
        {/* Torso */}
        <mesh castShadow position={[0, 0.1, 0]} scale={[0.85, 1, 0.75]}>
          <sphereGeometry args={[0.65, 32, 32]} />
          <primitive object={blackMaterial} />
        </mesh>

        {/* Front Legs */}
        <mesh position={[-0.3, -0.4, 0.35]} rotation={[0.2, 0, 0]} castShadow>
           <capsuleGeometry args={[0.14, 0.5, 4, 8]} />
           <primitive object={blackMaterial} />
        </mesh>
        <mesh position={[0.3, -0.4, 0.35]} rotation={[0.2, 0, 0]} castShadow>
           <capsuleGeometry args={[0.14, 0.5, 4, 8]} />
           <primitive object={blackMaterial} />
        </mesh>

        {/* Back Legs */}
        <mesh position={[-0.35, -0.45, -0.3]} rotation={[-0.2, 0, 0]} castShadow>
           <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
           <primitive object={blackMaterial} />
        </mesh>
        <mesh position={[0.35, -0.45, -0.3]} rotation={[-0.2, 0, 0]} castShadow>
           <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
           <primitive object={blackMaterial} />
        </mesh>

        {/* Tail Group - Long Tail */}
        <group ref={tailRef} position={[0, -0.1, -0.45]}>
             <mesh castShadow>
                <tubeGeometry args={[tailCurve, 32, 0.09, 12, false]} />
                <primitive object={blackMaterial} />
             </mesh>
             {/* Round tip for tail */}
             <mesh position={[0, 1.5, -0.4]}>
                <sphereGeometry args={[0.09, 16, 16]} />
                <primitive object={blackMaterial} />
             </mesh>
        </group>
      </group>

      {/* --- HEIXIU (The Little Spirit) --- */}
      <group ref={heixiuRef} position={[1.5, 1, 1]}>
         <mesh castShadow>
            <sphereGeometry args={[0.2, 32, 32]} />
            <primitive object={blackMaterial} />
         </mesh>
         {/* Heixiu Eyes */}
         <mesh position={[-0.08, 0.02, 0.16]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <primitive object={eyeWhiteMaterial} />
         </mesh>
         <mesh position={[0.08, 0.02, 0.16]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <primitive object={eyeWhiteMaterial} />
         </mesh>
         <mesh position={[-0.08, 0.02, 0.2]} scale={[0.5, 1, 0.5]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="black" />
         </mesh>
         <mesh position={[0.08, 0.02, 0.2]} scale={[0.5, 1, 0.5]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="black" />
         </mesh>
         {/* Heixiu Label/Bubble */}
         {isThinking && (
             <Html position={[0, 0.3, 0]} center>
                 <div className="text-white text-xs opacity-50 font-bold">?</div>
             </Html>
         )}
      </group>

    </group>
  );
};
