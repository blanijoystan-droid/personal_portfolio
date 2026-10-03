'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface CentralCoreProps {
  onNodeClick?: (nodeId: string) => void;
  hoveredNode: string | null;
  setHoveredNode: (node: string | null) => void;
}

const ORBITAL_TAGS = [
  { text: "CODE", radius: 2.6, speed: 0.6, yOffset: 0.4, color: "#00f0ff" },
  { text: "AI", radius: 3.1, speed: -0.45, yOffset: -0.5, color: "#a855f7" },
  { text: "CLOUD", radius: 3.6, speed: 0.5, yOffset: 0.7, color: "#3b82f6" },
  { text: "SYSTEMS", radius: 2.9, speed: -0.35, yOffset: -0.3, color: "#10b981" },
  { text: "WEB", radius: 3.4, speed: 0.4, yOffset: 0.2, color: "#06b6d4" },
  { text: "DATA", radius: 2.4, speed: -0.55, yOffset: -0.6, color: "#f59e0b" },
];

export function CentralCore({ onNodeClick, hoveredNode: _hoveredNode, setHoveredNode }: CentralCoreProps) {
  const coreGroup = useRef<THREE.Group>(null);
  const innerIcosahedron = useRef<THREE.Mesh>(null);
  const outerCage = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const orbitalGroup = useRef<THREE.Group>(null);

  // Reusable materials and geometries
  const wireMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#00f0ff"),
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      }),
    []
  );

  const innerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#05162a"),
        emissive: new THREE.Color("#003855"),
        roughness: 0.2,
        metalness: 0.9,
      }),
    []
  );

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#3b82f6"),
        transparent: true,
        opacity: 0.4,
        wireframe: true,
      }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Mouse parallax lerp
    if (coreGroup.current) {
      const targetRotX = state.pointer.y * 0.3;
      const targetRotY = state.pointer.x * 0.4;
      coreGroup.current.rotation.x = THREE.MathUtils.lerp(coreGroup.current.rotation.x, targetRotX, 0.05);
      coreGroup.current.rotation.y = THREE.MathUtils.lerp(coreGroup.current.rotation.y, targetRotY, 0.05);
    }

    // Inner core rotation
    if (innerIcosahedron.current) {
      innerIcosahedron.current.rotation.y += delta * 0.35;
      innerIcosahedron.current.rotation.x += delta * 0.2;
    }

    // Outer wireframe cage
    if (outerCage.current) {
      outerCage.current.rotation.y -= delta * 0.25;
      outerCage.current.rotation.z += delta * 0.15;
    }

    // Orbiting rings
    if (ring1.current) {
      ring1.current.rotation.x = Math.sin(t * 0.4) * 0.5 + 1.2;
      ring1.current.rotation.y = t * 0.3;
    }
    if (ring2.current) {
      ring2.current.rotation.y = Math.cos(t * 0.3) * 0.6 + 0.8;
      ring2.current.rotation.z = -t * 0.25;
    }
    if (ring3.current) {
      ring3.current.rotation.x = Math.cos(t * 0.5) * 0.4;
      ring3.current.rotation.z = t * 0.35;
    }

    // Orbiting data tags
    if (orbitalGroup.current) {
      orbitalGroup.current.children.forEach((child, idx) => {
        const item = ORBITAL_TAGS[idx];
        if (item) {
          const angle = t * item.speed + (idx * Math.PI * 2) / ORBITAL_TAGS.length;
          child.position.x = Math.cos(angle) * item.radius;
          child.position.z = Math.sin(angle) * item.radius;
          child.position.y = item.yOffset + Math.sin(t * 1.5 + idx) * 0.18;
        }
      });
    }
  });

  return (
    <group ref={coreGroup} position={[0, 0, 0]}>
      {/* Central Luminescent Core */}
      <mesh
        ref={innerIcosahedron}
        material={innerMaterial}
        onPointerOver={() => setHoveredNode('BLANI-CORE')}
        onPointerOut={() => setHoveredNode(null)}
        onClick={() => onNodeClick && onNodeClick('home')}
      >
        <icosahedronGeometry args={[1.1, 1]} />
      </mesh>

      {/* Outer Geometric Wireframe Cage */}
      <mesh ref={outerCage} material={wireMaterial}>
        <dodecahedronGeometry args={[1.65, 0]} />
      </mesh>

      {/* Orbiting Gyroscopic Rings */}
      <mesh ref={ring1} material={ringMaterial}>
        <torusGeometry args={[2.0, 0.015, 8, 48]} />
      </mesh>
      <mesh ref={ring2} material={ringMaterial}>
        <torusGeometry args={[2.3, 0.015, 8, 48]} />
      </mesh>
      <mesh ref={ring3} material={ringMaterial}>
        <torusGeometry args={[2.55, 0.015, 8, 48]} />
      </mesh>

      {/* Orbiting Tag Nodes */}
      <group ref={orbitalGroup}>
        {ORBITAL_TAGS.map((item) => (
          <group key={item.text}>
            <mesh>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshBasicMaterial color={item.color} />
            </mesh>
            <Html distanceFactor={14} center>
              <div 
                className="select-none pointer-events-none px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border border-white/10 backdrop-blur-md whitespace-nowrap shadow-lg flex items-center gap-1"
                style={{
                  backgroundColor: 'rgba(5, 10, 20, 0.75)',
                  color: item.color,
                  borderColor: `${item.color}40`,
                }}
              >
                <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: item.color }} />
                {item.text}
              </div>
            </Html>
          </group>
        ))}
      </group>

      {/* Central Core Label */}
      <Html position={[0, -2.0, 0]} center distanceFactor={13}>
        <div className="select-none pointer-events-none text-center flex flex-col items-center">
          <div className="px-3 py-1 rounded-full text-[11px] font-mono tracking-widest text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 backdrop-blur-md shadow-lg shadow-cyan-950/50 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            BLANI-CORE // ONLINE
          </div>
          <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-wider">
            PRIMARY IDENTITY SYSTEM
          </span>
        </div>
      </Html>
    </group>
  );
}
