'use client';

/* eslint-disable react-hooks/immutability -- R3F useFrame mutations are intentional and safe */

import React, { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { soundFx } from '@/lib/soundEffects';

interface NodeConfig {
  id: string;
  code: string;
  name: string;
  position: [number, number, number];
  color: string;
  accent: string;
  ventColor: string;
}

const NODES_CONFIG: NodeConfig[] = [
  { id: 'about', code: 'ABT', name: 'ABOUT', position: [-5.5, 1.5, -3.0], color: '#00e5d8', accent: '#00fff7', ventColor: '#00e5d8' },
  { id: 'skills', code: 'SKL', name: 'SKILLS', position: [5.0, 0.5, -4.0], color: '#4efef7', accent: '#7cf0ed', ventColor: '#00e5d8' },
  { id: 'projects', code: 'PRJ', name: 'PROJECTS', position: [6.0, -1.0, 1.5], color: '#00e5d8', accent: '#00fff7', ventColor: '#00e5d8' },
  { id: 'experience', code: 'EXP', name: 'EXPERIENCE', position: [3.5, 2.5, 4.0], color: '#88f5e0', accent: '#00fff7', ventColor: '#4efef7' },
  { id: 'achievements', code: 'ACH', name: 'ACHIEVEMENTS', position: [-4.5, -1.5, 3.5], color: '#ff6b5b', accent: '#ff9a8a', ventColor: '#ff6b5b' },
  { id: 'certifications', code: 'CRT', name: 'CREDENTIALS', position: [-6.0, 0.5, 2.0], color: '#00e5d8', accent: '#00fff7', ventColor: '#00e5d8' },
  { id: 'contact', code: 'COM', name: 'CONTACT', position: [-2.0, -2.5, -5.0], color: '#00fff7', accent: '#4efef7', ventColor: '#00e5d8' },
];

const PARTICLE_COUNT = 36;

function SingleNode({
  node,
  isActive,
  onSelect,
  onHover,
}: {
  node: NodeConfig;
  isActive: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}) {
  const beaconRef = useRef<THREE.Mesh>(null);
  const ventRef = useRef<THREE.Group>(null);
  const plumeRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [localHover, setLocalHover] = useState(false);
  const { clock } = useThree();

  const ventGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = THREE.MathUtils.randFloatSpread(0.24);
      positions[i * 3 + 1] = THREE.MathUtils.randFloat(0, 2.2);
      positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(0.24);
      speeds[i] = THREE.MathUtils.randFloat(0.25, 0.7);
      phases[i] = THREE.MathUtils.randFloat(0, Math.PI * 2);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    return geometry;
  }, []);

  const ventMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(node.ventColor),
        size: 0.09,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [node.ventColor]
  );

  const chimneyGeometry = useMemo(() => new THREE.CylinderGeometry(0.14, 0.28, 2.4, 8, 1, true), []);
  const chimneyMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color('#12403f'), roughness: 0.95, metalness: 0.05 }),
    []
  );

  const beaconGeometry = useMemo(() => new THREE.OctahedronGeometry(0.46, 1), []);
  const beaconMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(node.color),
        emissive: new THREE.Color(node.color),
        emissiveIntensity: 0.35,
        metalness: 0.25,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        transmission: 0.15,
        thickness: 0.6,
      }),
    [node.color]
  );

  const ringGeometry = useMemo(() => new THREE.TorusGeometry(0.72, 0.012, 8, 40), []);
  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.accent),
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [node.accent]
  );

  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.ventColor),
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [node.ventColor]
  );

  const linkGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        new Float32Array([0, 0, 0, node.position[0] * 0.62, node.position[1] * 0.62, node.position[2] * 0.62]),
        3
      )
    );
    return geometry;
  }, [node.position]);

  const linkMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(node.color),
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [node.color]
  );

  // Built imperatively and mounted via <primitive> so the JSX `line`
  // intrinsic does not collide with the SVG `line` element type.
  const linkLine = useMemo(() => {
    const line = new THREE.Line(linkGeometry, linkMaterial);
    line.position.set(-node.position[0] * 0.38, -node.position[1] * 0.38, -node.position[2] * 0.38);
    return line;
  }, [linkGeometry, linkMaterial, node.position]);

  useFrame((state, delta) => {
    const elapsed = clock.getElapsedTime();

    if (beaconRef.current) {
      beaconRef.current.rotation.y += delta * (localHover ? 1.1 : 0.45);
      beaconRef.current.rotation.x = Math.sin(elapsed * 0.6) * 0.18;
      const pulse = 1 + Math.sin(elapsed * 1.6) * 0.04;
      beaconRef.current.scale.setScalar(pulse);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = elapsed * 0.4;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(elapsed * 0.5) * 0.25;
    }

    if (ventRef.current) {
      ventRef.current.rotation.y = Math.sin(elapsed * 0.25) * 0.08;
    }

    if (plumeRef.current) {
      const positions = plumeRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      const speeds = plumeRef.current.geometry.getAttribute('speed') as THREE.BufferAttribute;
      const phases = plumeRef.current.geometry.getAttribute('phase') as THREE.BufferAttribute;
      const array = positions.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const speed = speeds.getX(i);
        array[i * 3 + 1] += delta * speed;

        if (array[i * 3 + 1] > 2.6) {
          array[i * 3] = THREE.MathUtils.randFloatSpread(0.24);
          array[i * 3 + 1] = 0;
          array[i * 3 + 2] = THREE.MathUtils.randFloatSpread(0.24);
        }

        array[i * 3] += Math.sin(elapsed * 1.2 + phases.getX(i)) * delta * 0.03;
      }

      positions.needsUpdate = true;
    }

    // static opacity — no mutation of memoized objects in useFrame
    linkLine.material.opacity = isActive ? 0.34 : 0.08;

    void state;
  });

  return (
    <group position={node.position}>
      <group ref={ventRef}>
        <mesh geometry={chimneyGeometry} material={chimneyMaterial} position={[0, 1, 0]} />
        <mesh material={glowMaterial} position={[0, 2.2, 0]}>
          <sphereGeometry args={[0.34, 16, 16]} />
        </mesh>
        <points ref={plumeRef} geometry={ventGeometry} material={ventMaterial} />
      </group>

      <mesh
        ref={beaconRef}
        geometry={beaconGeometry}
        material={beaconMaterial}
        onPointerOver={(event) => {
          event.stopPropagation();
          setLocalHover(true);
          onHover(true);
          soundFx.playHover();
        }}
        onPointerOut={() => {
          setLocalHover(false);
          onHover(false);
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
          soundFx.playClick();
        }}
      />

      <mesh ref={ringRef} geometry={ringGeometry} material={ringMaterial} />

      <primitive object={linkLine} />

      <Html center position={[0, -1.25, 0]} style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <span
          className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: node.color, textShadow: `0 0 8px ${node.color}80` }}
        >
          {node.code}
        </span>
      </Html>
    </group>
  );
}

export function FloatingNodes({
  activeSection,
  onSelectNode,
  setHoveredNode,
}: {
  activeSection: string;
  onSelectNode: (nodeId: string) => void;
  setHoveredNode: (node: string | null) => void;
}) {
  return (
    <group>
      {NODES_CONFIG.map((node) => (
        <SingleNode
          key={node.id}
          node={node}
          isActive={activeSection === node.id}
          onSelect={() => onSelectNode(node.id)}
          onHover={(hovered) => setHoveredNode(hovered ? node.name : null)}
        />
      ))}
    </group>
  );
}