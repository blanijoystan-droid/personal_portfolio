'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  isMobile?: boolean;
}

export function ParticleField({ isMobile = false }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { clock } = useThree();

  // More particles for deep ocean feel
  const particleCount = isMobile ? 800 : 2400;

  const particleData = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const sz = new Float32Array(particleCount);
    const vel = new Float32Array(particleCount);
    const tp = new Float32Array(particleCount);
    const phase = new Float32Array(particleCount);
    const wobbles = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const rand = THREE.MathUtils.randFloat(0, 1);
      let type: number;
      
      // More bubbles and plankton in deep ocean
      if (rand < 0.28) {
        type = 0; // Large rising bubbles
      } else if (rand < 0.42) {
        type = 5; // Micro bubble streams
      } else if (rand < 0.58) {
        type = 1; // Marine snow
      } else if (rand < 0.82) {
        type = 2; // Bioluminescent plankton
      } else {
        type = 3; // Deep water particulates
      }
      
      tp[i] = type;

      // Distribute in a large ocean volume - deeper
      const radius = THREE.MathUtils.randFloat(8, 60);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Phase and wobble for organic motion
      phase[i] = THREE.MathUtils.randFloat(0, Math.PI * 2);
      wobbles[i] = THREE.MathUtils.randFloat(0.3, 1.2);

      // Assign colors and properties by type
      let chosenColor = new THREE.Color("#4fd1d4");
      let size = 0;
      let velocity = 0;

      switch (type) {
        case 0: // Large rising bubbles
          const bubbleRand = THREE.MathUtils.randFloat(0, 1);
          if (bubbleRand > 0.6) chosenColor = new THREE.Color("#80ffff");
          else if (bubbleRand > 0.3) chosenColor = new THREE.Color("#00ffff");
          else chosenColor = new THREE.Color("#4fd1d4");
          size = THREE.MathUtils.randFloat(0.12, 0.35);
          velocity = THREE.MathUtils.randFloat(0.18, 0.5);
          break;
        case 5: // Micro bubble streams - tiny, fast
          chosenColor = new THREE.Color("#a0ffff");
          size = THREE.MathUtils.randFloat(0.03, 0.08);
          velocity = THREE.MathUtils.randFloat(0.5, 1.2);
          break;
        case 1: // Marine snow
          const snowRand = THREE.MathUtils.randFloat(0, 1);
          if (snowRand > 0.5) chosenColor = new THREE.Color("#b8e8e8");
          else chosenColor = new THREE.Color("#90d8d8");
          size = THREE.MathUtils.randFloat(0.015, 0.045);
          velocity = THREE.MathUtils.randFloat(0.02, 0.07);
          break;
        case 2: // Plankton
          const plankRand = THREE.MathUtils.randFloat(0, 1);
          if (plankRand > 0.6) chosenColor = new THREE.Color("#00c9cc");
          else if (plankRand > 0.3) chosenColor = new THREE.Color("#00fff7");
          else chosenColor = new THREE.Color("#00d4ff");
          size = THREE.MathUtils.randFloat(0.02, 0.06);
          velocity = THREE.MathUtils.randFloat(0.015, 0.05);
          break;
        case 3: // Deep water particulates
          const partRand = THREE.MathUtils.randFloat(0, 1);
          if (partRand > 0.5) chosenColor = new THREE.Color("#204050");
          else chosenColor = new THREE.Color("#183848");
          size = THREE.MathUtils.randFloat(0.006, 0.018);
          velocity = THREE.MathUtils.randFloat(0.005, 0.02);
          break;
      }

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
      sz[i] = size;
      vel[i] = velocity;
      wobbles[i] = THREE.MathUtils.randFloat(0.3, 1.2);
    }

    return { pos, col, sz, vel, tp, phase, wobbles };
  }, [particleCount]);

  const { pos, col, sz, vel, tp, phase, wobbles } = particleData;

  useFrame((_state, delta) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = pointsRef.current.geometry.attributes.userVelocity?.array as Float32Array || new Float32Array(particleCount);
      const types = pointsRef.current.geometry.attributes.userType?.array as Float32Array || new Float32Array(particleCount);
      const phases = pointsRef.current.geometry.attributes.userPhase?.array as Float32Array || new Float32Array(particleCount);
      const wobbles = pointsRef.current.geometry.attributes.userWobble?.array as Float32Array || new Float32Array(particleCount);
      const t = clock.getElapsedTime();
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        const type = types[i];
        const vel = velocities[i] || 0.1;
        const phase = phases[i];
        const wobble = wobbles[i];
        
        switch (type) {
          case 0: // Large bubbles - rise with organic wobble
            positions[i * 3 + 1] += delta * vel * 1.1;
            positions[i * 3] += Math.sin(t * 0.4 + phase) * delta * 0.08 * wobble;
            positions[i * 3 + 2] += Math.cos(t * 0.3 + phase) * delta * 0.05 * wobble;
            if (positions[i * 3 + 1] > 35) {
              positions[i * 3 + 1] = -20;
              positions[i * 3] = THREE.MathUtils.randFloatSpread(80);
              positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(80);
            }
            break;
          case 5: // Micro bubble streams - fast, straight rise with tiny wobble
            positions[i * 3 + 1] += delta * vel * 1.5;
            positions[i * 3] += Math.sin(t * 2 + phase) * delta * 0.02;
            positions[i * 3 + 2] += Math.cos(t * 1.5 + phase) * delta * 0.015;
            if (positions[i * 3 + 1] > 40) {
              positions[i * 3 + 1] = -25;
              positions[i * 3] = THREE.MathUtils.randFloatSpread(90);
              positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(90);
            }
            break;
          case 1: // Marine snow - gentle fall
            positions[i * 3 + 1] -= delta * vel * 0.6;
            positions[i * 3] += Math.sin(t * 0.3 + phase) * delta * 0.02;
            if (positions[i * 3 + 1] < -20) {
              positions[i * 3 + 1] = 40;
              positions[i * 3] = THREE.MathUtils.randFloatSpread(100);
              positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(100);
            }
            break;
          case 2: // Plankton - gentle drift
            positions[i * 3 + 1] += Math.sin(t * 0.35 + phase) * delta * vel * 0.8;
            positions[i * 3] += Math.cos(t * 0.25 + phase) * delta * vel * 0.6;
            positions[i * 3 + 2] += Math.sin(t * 0.3 + phase) * delta * vel * 0.7;
            break;
          case 3: // Deep water particulates - very slow drift
            positions[i * 3 + 1] += Math.sin(t * 0.12 + phase) * delta * vel * 0.5;
            positions[i * 3] += Math.cos(t * 0.08 + phase) * delta * vel * 0.4;
            positions[i * 3 + 2] += Math.sin(t * 0.1 + phase) * delta * vel * 0.35;
            break;
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
        <bufferAttribute attach="attributes-size" args={[sz, 1]} />
        <bufferAttribute attach="attributes-userVelocity" args={[vel, 1]} />
        <bufferAttribute attach="attributes-userType" args={[tp, 1]} />
        <bufferAttribute attach="attributes-userPhase" args={[phase, 1]} />
        <bufferAttribute attach="attributes-userWobble" args={[wobbles, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 1.0 : 0.75}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}