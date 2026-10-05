'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ThePearl({
  onSelect,
  onHoverChange,
}: {
  onSelect?: () => void;
  onHoverChange?: (hovered: boolean) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const pearl = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const kelpGroup = useRef<THREE.Group>(null);
  const motes = useRef<THREE.Points>(null);
  const [hovered, setHovered] = useState(false);

  const { clock } = useThree();

  const pearlMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#f2fbfa'),
        roughness: 0.08,
        metalness: 0.02,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        transmission: 0.55,
        thickness: 1.8,
        ior: 1.48,
        iridescence: 0.95,
        iridescenceIOR: 1.28,
        iridescenceThicknessRange: [120, 480],
        emissive: new THREE.Color('#3fb6c9'),
        emissiveIntensity: 0.22,
      }),
    []
  );

  const haloMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#7fe6e0'),
        transparent: true,
        opacity: 0.09,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide,
      }),
    []
  );

  const kelpMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1c4a44'),
        roughness: 0.85,
        metalness: 0.02,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  const fronds = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        angle: (i / 9) * Math.PI * 2,
        length: 2.6 + (i % 3) * 0.9,
        lean: 0.5 + (i % 4) * 0.16,
        phase: i * 0.7,
        width: 0.13 + (i % 2) * 0.05,
      })),
    []
  );

  const moteColors = useMemo(() => {
    return [
      new THREE.Color('#00fff7'),
      new THREE.Color('#00e5d8'),
      new THREE.Color('#ff6b5b'),
      new THREE.Color('#4efef7'),
    ];
  }, []);

  const moteGeometry = useMemo(() => {
    const count = 120;
    const rand = mulberry32(99);
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 2.2 + rand() * 3.6;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(rand() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = 0.025 + rand() * 0.045;
      phases[i] = rand() * Math.PI * 2;

      const r = rand();
      const c = moteColors[r < 0.25 ? 0 : r < 0.5 ? 1 : r < 0.75 ? 2 : 3];

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [moteColors]);

  const biolumMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.07,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame((_state, delta) => {
    const t = clock.getElapsedTime();

    if (pearl.current) {
      pearl.current.rotation.y += delta * 0.12;
      pearl.current.rotation.x += delta * 0.06;
      const pulse = 1 + Math.sin(t * 1.5) * 0.035;
      pearl.current.scale.setScalar(pulse);
      (pearl.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.22 + Math.sin(t * 1.5) * 0.09;
    }

    if (halo.current) {
      const pulse = 1 + Math.sin(t * 0.4) * 0.06;
      halo.current.scale.setScalar(pulse * (hovered ? 1.12 : 1));
      (halo.current.material as THREE.MeshBasicMaterial).opacity = (hovered ? 0.15 : 0.09) + Math.sin(t * 0.7) * 0.02;
    }

    if (kelpGroup.current) {
      kelpGroup.current.children.forEach((child, i) => {
        const f = fronds[i];
        if (!f) return;
        child.rotation.z = f.lean + Math.sin(t * 0.34 + f.phase) * 0.15;
        child.rotation.x = Math.cos(t * 0.28 + f.phase) * 0.1;
      });
    }

    if (motes.current) {
      const attr = motes.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      const phaseAttr = motes.current.geometry.getAttribute('phase') as THREE.BufferAttribute;

      for (let i = 0; i < 120; i++) {
        const phase = phaseAttr.getX(i);
        arr[i * 3 + 1] += Math.sin(t * 0.3 + phase) * 0.002;
        arr[i * 3] += Math.cos(t * 0.25 + phase) * 0.0015;
        arr[i * 3 + 2] += Math.sin(t * 0.35 + phase) * 0.0015;
      }
      attr.needsUpdate = true;
      motes.current.rotation.y += delta * 0.015;
    }

    void _state;
  });

  return (
    <group ref={group}>
      <points ref={motes} geometry={moteGeometry} material={biolumMaterial} />

      <mesh ref={halo} material={haloMaterial}>
        <sphereGeometry args={[2.9, 28, 24]} />
      </mesh>

      <mesh
        ref={pearl}
        material={pearlMaterial}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          onHoverChange?.(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHoverChange?.(false);
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect?.();
        }}
      >
        <sphereGeometry args={[1.5, 48, 40]} />
      </mesh>

      <group ref={kelpGroup}>
        {fronds.map((f, i) => (
          <mesh
            key={i}
            material={kelpMaterial}
            position={[Math.cos(f.angle) * 2.1, -1.1, Math.sin(f.angle) * 2.1]}
            rotation={[0, -f.angle, f.lean]}
          >
            <cylinderGeometry args={[f.width * 0.25, f.width, f.length, 5, 6, true]} />
          </mesh>
        ))}
      </group>

      <Html center position={[0, -3.4, 0]} style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <span
          className="font-mono text-[10px] font-semibold tracking-[0.42em] uppercase"
          style={{ color: '#8fe8e2', textShadow: '0 0 8px rgba(120, 220, 215, 0.55)' }}
        >
          Blani · The Deep
        </span>
      </Html>
    </group>
  );
}
