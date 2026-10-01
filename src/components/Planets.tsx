import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

const Planets: React.FC = () => {
  const sunRef = useRef<Mesh>(null);
  const planetsGroupRef = useRef<Group>(null);
  const p1Ref = useRef<Mesh>(null);
  const p2Ref = useRef<Mesh>(null);
  const p3Ref = useRef<Mesh>(null);

  const sunPosition = [-40, 10, -120] as const;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (sunRef.current) {
      // Very slow rotation for the sun
      sunRef.current.rotation.y = t * 0.05;
    }
    
    if (planetsGroupRef.current) {
      // Rotate the entire group of planets around the sun
      planetsGroupRef.current.rotation.y = t * 0.02;
      planetsGroupRef.current.rotation.x = 0.1; // slight tilt to the orbital plane
    }

    if (p1Ref.current) p1Ref.current.rotation.y = t * 0.5;
    if (p2Ref.current) p2Ref.current.rotation.y = t * 0.3;
    if (p3Ref.current) p3Ref.current.rotation.y = t * 0.2;
  });

  return (
    <group>
      {/* Distant Sun (Small Yellow Fireball) */}
      <mesh ref={sunRef} position={sunPosition}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#ffbb00" />
        {/* Glow */}
        <mesh position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
          <sphereGeometry args={[4, 32, 32]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.3} blending={2} />
        </mesh>
        <mesh position={[0, 0, 0]} scale={[2.5, 2.5, 2.5]}>
          <sphereGeometry args={[4, 32, 32]} />
          <meshBasicMaterial color="#ff3300" transparent opacity={0.15} blending={2} />
        </mesh>
        <pointLight intensity={2.0} color="#ffaa00" distance={200} decay={2} />
      </mesh>

      {/* Planets Group centered on the sun */}
      <group ref={planetsGroupRef} position={sunPosition}>
        {/* Planet 1 (Inner, small, fast) */}
        <mesh ref={p1Ref} position={[15, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#885544" roughness={0.9} />
        </mesh>
        
        {/* Planet 2 (Earth-like, medium) */}
        <mesh ref={p2Ref} position={[25, 0, 0]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial color="#336699" roughness={0.7} />
        </mesh>

        {/* Planet 3 (Outer gas giant, slow) */}
        <mesh ref={p3Ref} position={[40, 0, 0]}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial color="#aa9977" roughness={0.5} />
        </mesh>
      </group>
      
      {/* Additional Directional light for ambient fill so logo isn't totally dark */}
      <directionalLight position={[-40, 10, -120]} intensity={1.0} color="#ffeedd" />
      <ambientLight intensity={0.2} color="#445566" />
    </group>
  );
};

export default Planets;
