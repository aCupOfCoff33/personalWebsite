import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
  uniform vec3 uColor1; // Lighter purple
  uniform vec3 uColor2; // Mid purple
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
    // Use normalized UV coordinates
    vec2 uv = vUv;

    // Slow time for smooth, organic animation
    float time = uTime * 0.08;

    // Scale UVs for the noise pattern
    vec2 noiseUv = uv * 2.5;

    // DOMAIN WARPING - Layer 1
    // First level of distortion
    vec2 q = vec2(0.);
    q.x = snoise(noiseUv + vec2(0.0, time * 0.3));
    q.y = snoise(noiseUv + vec2(5.2, 1.3) + time * 0.25);

    // DOMAIN WARPING - Layer 2
    // Use first distortion to warp the second
    vec2 r = vec2(0.);
    r.x = snoise(noiseUv + 1.2 * q + vec2(1.7, 9.2) + time * 0.15);
    r.y = snoise(noiseUv + 1.2 * q + vec2(8.3, 2.8) + time * 0.12);

    // DOMAIN WARPING - Layer 3
    // Final layer for maximum complexity - like ink in water
    vec2 s = vec2(0.);
    s.x = snoise(noiseUv + 1.5 * r + vec2(3.1, 4.7) + time * 0.08);
    s.y = snoise(noiseUv + 1.5 * r + vec2(2.4, 7.1) + time * 0.1);

    // Get final noise value using all warped coordinates
    float f = snoise(noiseUv + r * 1.0 + s * 0.5);

    // Create smooth flowing patterns
    float pattern = length(q) * 0.6 + length(r) * 0.4 + f * 0.3;

    // Normalize pattern
    pattern = clamp(pattern * 0.5, 0.0, 1.0);

    // Create ridges and swirls by modulating the pattern
    float ridges = abs(sin(pattern * 3.14159 * 3.0 + time * 0.5)) * 0.5 + 0.5;

    // Mix colors based on pattern - from dark base to purple
    vec3 color = mix(uColor3, uColor1, pattern * ridges);
    color = mix(color, uColor2, clamp(length(r) * 0.4, 0.0, 1.0));

    // Add subtle noise variation for texture
    color += f * 0.015;

    // Subtle grain for texture
    float grain = hash(vUv * uResolution + uTime * 0.2);
    float grainIntensity = 0.03; // Very subtle grain
    color += (grain - 0.5) * grainIntensity;

    // Fade the entire effect to keep it subtle
    // Mix with dark background to reduce intensity
    float fadeAmount = 0.25; // Only 25% of the effect shows
    color = mix(uColor3, color, fadeAmount);

    // Add smooth vertical fade from top to bottom
    float verticalFade = smoothstep(1.0, 0.3, vUv.y);
    color = mix(uColor3, color, verticalFade);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const GradientMesh = () => {
  const meshRef = useRef();
  const [resolution, setResolution] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleResize = () => {
      setResolution([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Faded purple color palette
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      // Lighter faded purple for highlights
      uColor1: { value: new THREE.Color("#3d2f4f") }, // Muted purple
      // Mid purple tone
      uColor2: { value: new THREE.Color("#2a1f3a") }, // Deeper purple
      // Dark base matching site background (#151515)
      uColor3: { value: new THREE.Color("#151515") },
      uResolution: { value: new THREE.Vector2(resolution[0], resolution[1]) },
    }),
    [resolution],
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value =
        state.clock.getElapsedTime();
      meshRef.current.material.uniforms.uResolution.value.set(
        resolution[0],
        resolution[1],
      );
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
    <div className="absolute inset-0 w-full h-full z-0 bg-[#151515]">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          toneMapping: THREE.NoToneMapping,
        }}
      >
        <GradientMesh />
      </Canvas>
    </div>
  );
};

export default React.memo(HeroBackground);
