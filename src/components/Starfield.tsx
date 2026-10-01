import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, ShaderMaterial, Vector3 } from 'three';

const starVertexShader = `
  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uViewportHeight;
  
  attribute float size;
  attribute float speed;
  attribute float brightness;
  
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    
    // Convert mouse (which is in viewport coordinates) to world distance approximation
    vec3 dir = worldPosition.xyz - uMouse;
    
    // We only care about x/y distance for the cursor interaction
    float dist = length(dir.xy);
    
    // Interaction radius: ~250-350px translated to world units. 
    // uViewportHeight is the total height in world units.
    float effectRadius = uViewportHeight * 0.35; 
    
    float interaction = 0.0;
    if(dist < effectRadius) {
      // Smooth falloff
      interaction = 1.0 - smoothstep(0.0, effectRadius, dist);
      
      // Move slightly away
      mvPosition.xy += normalize(dir.xy) * interaction * 0.4;
    }

    // Scale up based on interaction (larger effect)
    float finalSize = size * (1.0 + interaction * 3.5);

    gl_PointSize = finalSize * (400.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    // Twinkle effect + interaction brightness
    float twinkle = 0.5 + 0.5 * sin(uTime * speed + position.x * 10.0);
    vAlpha = min(1.0, (brightness * twinkle) + (interaction * 1.5));
    
    // Color shifts slightly blue/white on interaction
    vColor = mix(vec3(0.6, 0.7, 0.9), vec3(1.0, 1.0, 1.0), interaction);
  }
`;

const starFragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  
  void main() {
    // Circular particle with soft edge
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float ll = length(xy);
    if(ll > 0.5) discard;
    
    float a = (0.5 - ll) * 2.0 * vAlpha;
    gl_FragColor = vec4(vColor, a);
  }
`;

const Starfield: React.FC = () => {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const { viewport } = useThree();

  const particleCount = 2000; // Hundreds/thousands, not too many to become noise
  
  const [positions, sizes, speeds, brightnesses] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sz = new Float32Array(particleCount);
    const sp = new Float32Array(particleCount);
    const br = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      
      const rand = Math.random();
      if (rand > 0.85) {
        // Foreground (large, bright)
        sz[i] = Math.random() * 0.15 + 0.08; 
        br[i] = Math.random() * 0.5 + 0.5;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      } else if (rand > 0.4) {
        // Mid (medium)
        sz[i] = Math.random() * 0.08 + 0.04;
        br[i] = Math.random() * 0.4 + 0.3;
      } else {
        // Distant (small but still visible)
        sz[i] = Math.random() * 0.04 + 0.02;
        br[i] = Math.random() * 0.3 + 0.2;
      }

      sp[i] = Math.random() * 1.5 + 0.1;
    }
    
    return [pos, sz, sp, br];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new Vector3(0, 0, 0) },
    uViewportHeight: { value: viewport.height }
  }), [viewport.height]);

  useFrame((state) => {
    if (!materialRef.current) return;
    
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Project mouse to world coordinates at z=0 plane
    const vec = new Vector3(state.pointer.x, state.pointer.y, 0.5);
    vec.unproject(state.camera);
    const dir = vec.sub(state.camera.position).normalize();
    const distance = -state.camera.position.z / dir.z;
    const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));
    
    materialRef.current.uniforms.uMouse.value.lerp(pos, 0.1);
    
    // Very slow cosmic rotation
    if (pointsRef.current) {
      pointsRef.current.rotation.z = state.clock.elapsedTime * 0.01;
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-speed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-brightness" args={[brightnesses, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </points>
  );
};

export default Starfield;
