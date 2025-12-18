import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- GLSL SHADER CODE ---

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1; // Lighter gray
  uniform vec3 uColor2; // Mid gray  
  uniform vec3 uColor3; // Dark base (#151515)
  uniform vec2 uResolution;
  varying vec2 vUv;

  // --- SIMPLEX NOISE FUNCTIONS (Standard WebGL Noise) ---
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // High-frequency grain noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    // Flip Y so top of screen is vUv.y = 1.0
    float yFlipped = 1.0 - vUv.y;
    
    // Animation only in top strip (top ~15% of screen)
    float topEdgeHeight = 0.15;
    float edgeFactor = smoothstep(topEdgeHeight, 0.0, yFlipped);
    
    // If below the top edge, just show solid dark background
    if (edgeFactor <= 0.001) {
      // Add grain to the solid background too
      float grain = hash(vUv * uResolution + uTime * 0.5) * 0.08;
      vec3 bgColor = uColor3 + vec3(grain - 0.04);
      gl_FragColor = vec4(bgColor, 1.0);
      return;
    }
    
    // Slow time for smooth animation
    float time = uTime * 0.1;
    
    // Scale UVs for the noise - stretch horizontally for edge effect
    vec2 uv = vec2(vUv.x * 3.0, yFlipped * 8.0);

    // Domain warping for organic flow
    vec2 q = vec2(0.);
    q.x = snoise(uv + vec2(0.0, time * 0.3));
    q.y = snoise(uv + vec2(5.2, 1.3) + time * 0.2);

    vec2 r = vec2(0.);
    r.x = snoise(uv + 0.8 * q + vec2(1.7, 9.2) + 0.15 * time);
    r.y = snoise(uv + 0.8 * q + vec2(8.3, 2.8) + 0.1 * time);

    float f = snoise(uv + r * 0.5);

    // Color mixing - all in gray/black tones
    vec3 color = mix(uColor3, uColor1, clamp(length(q) * 0.5, 0.0, 1.0));
    color = mix(color, uColor2, clamp(length(r.x) * 0.3, 0.0, 1.0));
    
    // Add subtle variation
    color += f * 0.02;

    // Heavy grain overlay
    float grain = hash(vUv * uResolution + uTime * 0.3);
    float grainIntensity = 0.15; // Strong grain
    color += (grain - 0.5) * grainIntensity;

    // Fade animation into solid background at edge
    color = mix(uColor3, color, edgeFactor);
    
    // Add grain to the transition area too
    float transitionGrain = hash(vUv * uResolution * 0.5 + uTime * 0.2) * 0.05;
    color += vec3(transitionGrain - 0.025);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const GradientMesh = () => {
  const meshRef = useRef();
  const [resolution, setResolution] = useState([window.innerWidth, window.innerHeight]);
  
  useEffect(() => {
    const handleResize = () => {
      setResolution([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Gray/black color palette matching the site
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      // Lighter gray for subtle highlights
      uColor1: { value: new THREE.Color("#2a2a2a") }, 
      // Mid gray
      uColor2: { value: new THREE.Color("#1e1e1e") }, 
      // Dark base matching site background (#151515)
      uColor3: { value: new THREE.Color("#151515") },
      uResolution: { value: new THREE.Vector2(resolution[0], resolution[1]) },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      meshRef.current.material.uniforms.uResolution.value.set(resolution[0], resolution[1]);
    }
  });

  return (
    <mesh ref={meshRef} scale={[10, 10, 1]}> 
      <planeGeometry args={[2, 2, 32, 32]} /> 
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

const HeroBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#151515]">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: false,
          toneMapping: THREE.NoToneMapping 
        }}
      >
        <GradientMesh />
      </Canvas>
    </div>
  );
};

export default React.memo(HeroBackground);