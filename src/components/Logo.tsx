import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, DoubleSide, NormalBlending, Group, ShaderMaterial } from 'three';
import { Vector3 } from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec3 uColor;
  uniform float uAlphaThreshold;
  uniform float uDarken;
  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    
    // The image is dark lines on white background.
    // Invert it to get light lines on black.
    vec3 inverted = vec3(1.0) - texColor.rgb;
    float luma = dot(inverted, vec3(0.299, 0.587, 0.114));
    
    // Create a crisp edge for a solid metallic look, not a soft glow.
    float alpha = smoothstep(uAlphaThreshold - 0.05, uAlphaThreshold + 0.05, luma);
    if(alpha < 0.1) discard;

    // Solid base color, slightly darkened for depth layers
    vec3 finalColor = uColor * (1.0 - uDarken);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const Logo: React.FC = () => {
  const groupRef = useRef<Group>(null);
  const texture = useLoader(TextureLoader, './logo.jpg');
  const { viewport } = useThree();
  
  // Make logo take up about 35-45% of viewport height (smaller than before, more restrained)
  const scale = viewport.height * 0.45; 
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;

  const materials = useMemo(() => {
    // Create multiple materials for physical depth layers (extrusion)
    const createMaterial = (color: Vector3, darken: number, threshold: number) => new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: texture },
        uColor: { value: color },
        uDarken: { value: darken },
        uAlphaThreshold: { value: threshold }
      },
      transparent: true,
      blending: NormalBlending,
      depthWrite: false,
      side: DoubleSide
    });

    const baseColor = new Vector3(0.85, 0.9, 0.95); // Cool white/machined aluminum

    return {
      back2: createMaterial(baseColor, 0.6, 0.1),  // Deepest shadow
      back1: createMaterial(baseColor, 0.4, 0.15), // Mid shadow
      mid: createMaterial(baseColor, 0.2, 0.2),    // Edge
      front: createMaterial(baseColor, 0.0, 0.25)  // Bright crisp front
    };
  }, [texture]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Extremely subtle floating
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.05 + 0.3; // Offset up slightly to leave room for UI
  });

  // Layer offsets for extrusion effect
  const depth = 0.015;

  return (
    <group ref={groupRef}>
      {/* Extrusion Layers */}
      <mesh position={[0, 0, -depth * 3]} scale={[scale * aspect, scale, 1]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <primitive object={materials.back2} attach="material" />
      </mesh>
      
      <mesh position={[0, 0, -depth * 2]} scale={[scale * aspect, scale, 1]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <primitive object={materials.back1} attach="material" />
      </mesh>

      <mesh position={[0, 0, -depth]} scale={[scale * aspect, scale, 1]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <primitive object={materials.mid} attach="material" />
      </mesh>

      {/* Front Face */}
      <mesh position={[0, 0, 0]} scale={[scale * aspect, scale, 1]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <primitive object={materials.front} attach="material" />
      </mesh>
    </group>
  );
};

export default Logo;
