'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function TheBeacon({ isMobile = false }: { isMobile?: boolean }) {
  const lampRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const motesRef = useRef<THREE.Points>(null);
  const { clock } = useThree();

  const caseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1d2b31'),
        roughness: 0.78,
        metalness: 0.6,
      }),
    []
  );

  const cageMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2c3d44'),
        roughness: 0.6,
        metalness: 0.75,
      }),
    []
  );

  const lampMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#a8f0e8'),
        transparent: true,
        opacity: 0.7,
      }),
    []
  );

  const moteCount = isMobile ? 40 : 120;

  const motes = useMemo(() => {
    const rand = mulberry32(7);
    const positions = new Float32Array(moteCount * 3);
    const phases = new Float32Array(moteCount);
    const radii = new Float32Array(moteCount);

    for (let i = 0; i < moteCount; i++) {
      const radius = 3 + rand() * 16;
      const theta = rand() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = rand() * 16;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
      phases[i] = rand() * Math.PI * 2;
      radii[i] = radius;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aRadius', new THREE.BufferAttribute(radii, 1));
    return geo;
  }, [moteCount]);

  const moteMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color('#9fe8e2'),
        size: 0.07,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame(() => {
    const t = clock.getElapsedTime();

    const swell = Math.sin(t * 0.55);
    if (lampRef.current) {
      lampRef.current.scale.setScalar(1 + swell * 0.08);
      (lampRef.current.material as THREE.MeshBasicMaterial).opacity = 0.62 + swell * 0.18;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 34 + swell * 14;
    }

    if (ringsRef.current) {
      ringsRef.current.children.forEach((child, i) => {
        const phase = (t * 0.22 + i * 0.33) % 1;
        const scale = 1 + phase * 7;
        child.scale.setScalar(scale);
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - phase) * 0.16;
      });
    }
  });

  return (
    <group position={[6, 0, 26]}>
      <mesh material={caseMaterial} position={[0, -50.8, 0]}>
        <cylinderGeometry args={[2.4, 3.1, 1.2, 10]} />
      </mesh>

      <mesh material={caseMaterial} position={[0, -49.2, 0]}>
        <cylinderGeometry args={[0.55, 0.75, 2.6, 8]} />
      </mesh>

      <mesh material={cageMaterial} position={[0, -47.6, 0]}>
        <cylinderGeometry args={[1.15, 1.35, 0.5, 10]} />
      </mesh>

      <mesh ref={lampRef} material={lampMaterial} position={[0, -46.9, 0]}>
        <sphereGeometry args={[0.95, 20, 16]} />
      </mesh>

      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={`bar-${i}`}
            material={cageMaterial}
            position={[Math.cos(a) * 1.1, -46.9, Math.sin(a) * 1.1]}
            rotation={[Math.cos(a) * 0.12, 0, -Math.sin(a) * 0.12]}
          >
            <cylinderGeometry args={[0.07, 0.07, 2.1, 5]} />
          </mesh>
        );
      })}

      <mesh material={cageMaterial} position={[0, -45.75, 0]}>
        <coneGeometry args={[1.25, 0.8, 10]} />
      </mesh>

      <group ref={ringsRef}>
        {[0, 1, 2].map((i) => (
          <mesh
            key={`ring-${i}`}
            ref={i === 0 ? ringRef : undefined}
            position={[0, -50.1, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[2.6, 0.035, 6, 40]} />
            <meshBasicMaterial
              color="#9ff0e8"
              transparent
              opacity={0.14}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      <pointLight ref={lightRef} position={[0, -46.9, 0]} color="#9ff0e8" intensity={34} distance={52} decay={2} />

      <points ref={motesRef} geometry={motes} material={moteMaterial} />
    </group>
  );
}
