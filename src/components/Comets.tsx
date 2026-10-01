import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, ShaderMaterial } from 'three';

const cometVertexShader = `
  uniform float uTime;
  attribute float speed;
  attribute float lengthScale;
  attribute vec3 direction;
  attribute float delay;
  
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    
    // Calculate movement
    float time = mod(uTime * speed - delay, 10.0); // Reset every 10 seconds
    
    // Only show comet if time is positive and less than 1.0 (active phase)
    if(time > 0.0 && time < 1.0) {
      pos += direction * (time * 100.0); // Move across the screen
      vAlpha = sin(time * 3.14159); // Fade in and out
    } else {
      vAlpha = 0.0;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = lengthScale * (400.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const cometFragmentShader = `
  varying float vAlpha;
  
  void main() {
    if(vAlpha <= 0.0) discard;
    
    // Stretch to look like a comet (assumes point rendering)
    // Actually, points are square. A simple circular soft edge is fine, 
    // the movement makes it look like a streak if it's fast enough,
    // or we can just make it a bright dot that fades quickly.
    
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float ll = length(xy);
    if(ll > 0.5) discard;
    
    float a = (0.5 - ll) * 2.0 * vAlpha;
    gl_FragColor = vec4(0.8, 0.95, 1.0, a);
  }
`;

const Comets: React.FC = () => {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const cometCount = 15;
  
  const [positions, directions, speeds, lengths, delays] = useMemo(() => {
    const pos = new Float32Array(cometCount * 3);
    const dir = new Float32Array(cometCount * 3);
    const sp = new Float32Array(cometCount);
    const len = new Float32Array(cometCount);
    const dly = new Float32Array(cometCount);
    
    for (let i = 0; i < cometCount; i++) {
      // Start far top-right or top-left
      pos[i * 3] = (Math.random() - 0.5) * 60; // x
      pos[i * 3 + 1] = 20 + Math.random() * 20; // y (above screen)
      pos[i * 3 + 2] = -10 + (Math.random() - 0.5) * 20; // z
      
      // Move diagonally down
      dir[i * 3] = (Math.random() - 0.5) * 2.0 - 1.0; 
      dir[i * 3 + 1] = -2.0 - Math.random() * 2.0; 
      dir[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      
      sp[i] = 0.5 + Math.random() * 1.5;
      len[i] = 0.2 + Math.random() * 0.3; // Size
      dly[i] = Math.random() * 20.0; // Random start delay
    }
    
    return [pos, dir, sp, len, dly];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-direction" args={[directions, 3]} />
        <bufferAttribute attach="attributes-speed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-lengthScale" args={[lengths, 1]} />
        <bufferAttribute attach="attributes-delay" args={[delays, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={cometVertexShader}
        fragmentShader={cometFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </points>
  );
};

export default Comets;
