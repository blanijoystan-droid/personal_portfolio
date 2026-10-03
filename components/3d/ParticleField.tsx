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

  const particleCount = isMobile ? 350 : 1100;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color("#00f0ff"); // Cyan
    const color2 = new THREE.Color("#3b82f6"); // Blue
    const color3 = new THREE.Color("#8b5cf6"); // Purple
    const color4 = new THREE.Color("#ffffff"); // White

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution around universe
      const radius = THREE.MathUtils.randFloat(4, 25);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Random palette blend
      const rand = THREE.MathUtils.randFloat(0, 1);
      let chosenColor = color1;
      if (rand > 0.75) chosenColor = color4;
      else if (rand > 0.5) chosenColor = color2;
      else if (rand > 0.25) chosenColor = color3;

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [particleCount]);

  useFrame((_state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.06 : 0.045}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
