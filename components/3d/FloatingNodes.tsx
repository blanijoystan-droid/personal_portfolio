'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
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
}

const NODES_CONFIG: NodeConfig[] = [
  {
    id: "about",
    code: "BIO-01",
    name: "ABOUT SYSTEM",
    position: [-4.6, 2.0, -1.5],
    color: "#00f0ff",
    accent: "rgba(0, 240, 255, 0.4)",
  },
  {
    id: "skills",
    code: "SKL-02",
    name: "TECH LAB",
    position: [-5.6, -1.8, 2.5],
    color: "#3b82f6",
    accent: "rgba(59, 130, 246, 0.4)",
  },
  {
    id: "projects",
    code: "PRJ-03",
    name: "PROJECT ARCHIVE",
    position: [5.2, 1.8, 2.0],
    color: "#10b981",
    accent: "rgba(16, 185, 129, 0.4)",
  },
  {
    id: "experience",
    code: "EXP-04",
    name: "ZETHETA EXP",
    position: [4.6, -2.8, -2.5],
    color: "#8b5cf6",
    accent: "rgba(139, 92, 246, 0.4)",
  },
  {
    id: "achievements",
    code: "ACH-05",
    name: "ACHIEVEMENT VAULT",
    position: [0.0, 4.4, 2.2],
    color: "#f59e0b",
    accent: "rgba(245, 158, 11, 0.4)",
  },
  {
    id: "certifications",
    code: "CRT-06",
    name: "CREDENTIAL ARCHIVE",
    position: [-3.8, -4.2, 1.0],
    color: "#ec4899",
    accent: "rgba(236, 72, 153, 0.4)",
  },
  {
    id: "contact",
    code: "COM-07",
    name: "COMM GATEWAY",
    position: [0.0, -4.8, -2.2],
    color: "#06b6d4",
    accent: "rgba(6, 182, 212, 0.4)",
  },
];

interface FloatingNodesProps {
  activeSection: string;
  onSelectNode: (nodeId: string) => void;
  hoveredNode: string | null;
  setHoveredNode: (node: string | null) => void;
}

function SingleNode({
  node,
  isActive,
  _isHovered,
  onSelect,
  onHover,
}: {
  node: NodeConfig;
  isActive: boolean;
  _isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [localHover, setLocalHover] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (localHover ? 1.5 : 0.6);
      meshRef.current.rotation.x = Math.sin(t * 0.8) * 0.2;
      // Gentle floating bob
      meshRef.current.position.y = Math.sin(t * 1.2 + node.position[0]) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.8;
      ringRef.current.rotation.x += delta * 0.3;
    }
  });

  const handlePointerOver = () => {
    setLocalHover(true);
    onHover(true);
    soundFx.playHover();
  };

  const handlePointerOut = () => {
    setLocalHover(false);
    onHover(false);
  };

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    soundFx.playWarp();
    onSelect();
  };

  const scale = localHover || isActive ? 1.3 : 1.0;

  return (
    <group position={node.position}>
      {/* Interactive geometric beacon */}
      <mesh
        ref={meshRef}
        scale={scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={localHover || isActive ? 0.9 : 0.4}
          roughness={0.2}
          metalness={0.8}
          wireframe={!localHover && !isActive}
        />
      </mesh>

      {/* Orbiting wire ring around beacon */}
      <mesh ref={ringRef} scale={scale * 1.2}>
        <torusGeometry args={[0.85, 0.015, 8, 32]} />
        <meshBasicMaterial
          color={node.color}
          transparent
          opacity={localHover || isActive ? 0.8 : 0.3}
        />
      </mesh>

      {/* Connecting ray toward center */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, 0, -node.position[0], -node.position[1], -node.position[2]]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={node.color}
          transparent
          opacity={localHover || isActive ? 0.35 : 0.08}
        />
      </line>

      {/* Futuristic 3D Billboard Badge */}
      <Html position={[0, -0.9, 0]} center distanceFactor={14}>
        <div
          onClick={handleClick}
          onMouseEnter={handlePointerOver}
          onMouseLeave={handlePointerOut}
          className={`cursor-pointer group flex flex-col items-center select-none transition-all duration-300 transform ${
            localHover || isActive ? 'scale-110 -translate-y-1' : 'opacity-85'
          }`}
        >
          <div
            className="px-2.5 py-1 rounded-md text-[11px] font-mono tracking-wider font-semibold border backdrop-blur-md whitespace-nowrap flex items-center gap-1.5 shadow-xl transition-all"
            style={{
              backgroundColor: 'rgba(5, 10, 20, 0.85)',
              borderColor: localHover || isActive ? node.color : 'rgba(255, 255, 255, 0.12)',
              color: localHover || isActive ? '#ffffff' : '#94a3b8',
              boxShadow: localHover || isActive ? `0 0 20px ${node.accent}` : 'none',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: node.color,
                boxShadow: `0 0 8px ${node.color}`,
              }}
            />
            <span className="text-[9px] text-slate-400">[{node.code}]</span>
            <span>{node.name}</span>
          </div>

          {(localHover || isActive) && (
            <div className="mt-1 px-2 py-0.5 rounded text-[8px] font-mono tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 uppercase animate-bounce">
              EXPLORE NODE →
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

export function FloatingNodes({
  activeSection,
  onSelectNode,
  hoveredNode,
  setHoveredNode,
}: FloatingNodesProps) {
  return (
    <group>
      {NODES_CONFIG.map((node) => (
        <SingleNode
          key={node.id}
          node={node}
          isActive={activeSection === node.id}
          _isHovered={hoveredNode === node.name}
          onSelect={() => onSelectNode(node.id)}
          onHover={(hovered) => setHoveredNode(hovered ? node.name : null)}
        />
      ))}
    </group>
  );
}
