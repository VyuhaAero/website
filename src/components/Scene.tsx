import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import * as THREE from 'three';
import Logo from './Logo';
import Starfield from './Starfield';

import Comets from './Comets';

import Planets from './Planets';
import { useThree } from '@react-three/fiber';

interface SceneProps {
  loadingComplete: boolean;
}

const Scene: React.FC<SceneProps> = ({ loadingComplete }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state, delta) => {
    // If loading is complete, fly the camera forward into the solar system
    if (loadingComplete) {
      // Smoothly move camera Z towards the sun (which is at -120)
      // Stop moving forward once we get close enough
      if (camera.position.z > -100) {
        camera.position.z -= delta * 15.0; // Fly forward
      }
    } else {
      // Subtle mouse parallax only when not flying
      if (groupRef.current) {
        const targetX = (state.pointer.x * Math.PI) / 10;
        const targetY = (state.pointer.y * Math.PI) / 10;
        groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.05);
        groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
      }
    }
  });

  return (
    <group>
      <fog attach="fog" args={['#020c1b', 5, 60]} />
      <ambientLight intensity={0.5} />
      <Starfield />
      <Comets />
      {!loadingComplete && <Planets />}
      {!loadingComplete && <group ref={groupRef}>
        <Logo />
      </group>}
    </group>
  );
};

export default Scene;
