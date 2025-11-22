import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, ContactShadows } from '@react-three/drei';
import { LuoXiaoheiModel } from './LuoXiaoheiModel';
import * as THREE from 'three';

interface ExperienceProps {
  isThinking: boolean;
  expression: 'neutral' | 'happy' | 'blink';
  modelRef?: React.RefObject<THREE.Group>;
}

export const Experience: React.FC<ExperienceProps> = ({ isThinking, expression, modelRef }) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 6], fov: 45 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#111']} />
      
      <Suspense fallback={null}>
        {/* Lighting: Dramatic rim lighting for the black cat */}
        <ambientLight intensity={0.4} color="#ffffff" />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          castShadow 
        />
        {/* Blue rim light for style */}
        <pointLight position={[-10, 5, -10]} intensity={5} color="#4ade80" />
        {/* Warm fill */}
        <pointLight position={[10, 0, -10]} intensity={2} color="#fcd34d" />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <group position={[0, -1, 0]}>
          <LuoXiaoheiModel 
            isThinking={isThinking} 
            expression={expression} 
            modelRef={modelRef}
          />
          <ContactShadows opacity={0.5} scale={10} blur={1.5} far={4} resolution={256} color="#000000" />
        </group>

        <Environment preset="city" />
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2}
          maxDistance={10}
          minDistance={3}
        />
      </Suspense>
    </Canvas>
  );
};