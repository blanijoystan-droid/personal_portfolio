'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface CentralCoreProps {
  onNodeClick?: (nodeId: string) => void;
  setHoveredNode: (node: string | null) => void;
}

const ORBITAL_TAGS = [
  { text: "CODE", radius: 3.4, speed: 0.45, yOffset: 0.6, color: "#00d4ff" },
  { text: "AI", radius: 4.0, speed: -0.35, yOffset: -0.8, color: "#00fff7" },
  { text: "CLOUD", radius: 4.6, speed: 0.4, yOffset: 1.0, color: "#00ffff" },
  { text: "SYSTEMS", radius: 3.8, speed: -0.28, yOffset: -0.5, color: "#4fd1d4" },
  { text: "WEB", radius: 4.2, speed: 0.32, yOffset: 0.4, color: "#00c9cc" },
  { text: "DATA", radius: 3.2, speed: -0.45, yOffset: -0.9, color: "#00fff7" },
];

export function CentralCore({ onNodeClick, setHoveredNode }: CentralCoreProps) {
  const coreGroup = useRef<THREE.Group>(null);
  const pearlCore = useRef<THREE.Mesh>(null);
  const coralBase = useRef<THREE.Group>(null);
  const outerShell = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const orbitalGroup = useRef<THREE.Group>(null);
  const biolumParticles = useRef<THREE.Points>(null);
  const { clock } = useThree();

  // Materials
  const pearlMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#c8ffff"),
      metalness: 0.08,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transmission: 0.4,
      thickness: 2.0,
      ior: 1.45,
      iridescence: 0.9,
      iridescenceIOR: 1.25,
      emissive: new THREE.Color("#00d4ff"),
      emissiveIntensity: 0.15,
    }),
    []
  );

  const coralMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: new THREE.Color("#003d4d"),
      roughness: 0.85,
      metalness: 0.05,
      emissive: new THREE.Color("#002a3a"),
      emissiveIntensity: 0.1,
    }),
    []
  );

  const shellMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#003d4d"),
      metalness: 0.15,
      roughness: 0.2,
      transparent: true,
      opacity: 0.15,
      transmission: 0.6,
      thickness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      iridescence: 0.85,
      emissive: new THREE.Color("#002a3a"),
      emissiveIntensity: 0.1,
    }),
    []
  );

  const ringMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: new THREE.Color("#00d4ff"),
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    }),
    []
  );

  

  // Bioluminescent particles around core
  const biolumGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 120;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    
    const color1 = new THREE.Color("#00d4ff");
    const color2 = new THREE.Color("#00fff7");
    const color3 = new THREE.Color("#00ffff");
    const color4 = new THREE.Color("#4fd1d4");
    
    for (let i = 0; i < count; i++) {
      const radius = THREE.MathUtils.randFloat(2.8, 6.5);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      sizes[i] = THREE.MathUtils.randFloat(0.025, 0.07);
      phases[i] = THREE.MathUtils.randFloat(0, Math.PI * 2);
      
      const rand = THREE.MathUtils.randFloat(0, 1);
      let c = color1;
      if (rand > 0.75) c = color4;
      else if (rand > 0.5) c = color3;
      else if (rand > 0.25) c = color2;
      
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    return geo;
  }, []);

  const biolumMaterial = useMemo(
    () => new THREE.PointsMaterial({
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

    // Pearl core - gentle pulse and rotation
    if (pearlCore.current) {
      pearlCore.current.rotation.y += delta * 0.12;
      pearlCore.current.rotation.x += delta * 0.06;
      const pulse = 1 + Math.sin(t * 1.2) * 0.04;
      pearlCore.current.scale.setScalar(pulse);
      // Emissive pulse
      if (pearlCore.current.material) {
        (pearlCore.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.15 + Math.sin(t * 1.5) * 0.05;
      }
    }

    // Coral base - gentle sway
    if (coralBase.current) {
      coralBase.current.rotation.y += delta * 0.025;
      coralBase.current.children.forEach((child, idx) => {
        child.rotation.z = Math.sin(t * 0.7 + idx * 1.2) * 0.06;
      });
    }

    // Outer iridescent shell
    if (outerShell.current) {
      outerShell.current.rotation.y += delta * 0.06;
      outerShell.current.rotation.x += delta * 0.03;
      const breathe = 1 + Math.sin(t * 0.6) * 0.025;
      outerShell.current.scale.setScalar(breathe);
    }

    // Orbital rings - like water currents
    if (ring1.current) {
      ring1.current.rotation.x = Math.sin(t * 0.25) * 0.35 + 1.1;
      ring1.current.rotation.y = t * 0.15;
      // Pulse opacity
      if (ring1.current.material) {
        (ring1.current.material as THREE.MeshBasicMaterial).opacity = 0.2 + Math.sin(t * 1.8) * 0.08;
      }
    }
    if (ring2.current) {
      ring2.current.rotation.y = Math.cos(t * 0.22) * 0.45 + 0.65;
      ring2.current.rotation.z = -t * 0.14;
      if (ring2.current.material) {
        (ring2.current.material as THREE.MeshBasicMaterial).opacity = 0.18 + Math.sin(t * 2.1) * 0.06;
      }
    }
    if (ring3.current) {
      ring3.current.rotation.x = Math.cos(t * 0.35) * 0.3;
      ring3.current.rotation.z = t * 0.2;
      if (ring3.current.material) {
        (ring3.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(t * 1.5) * 0.05;
      }
    }

    // Orbital tech tags - flowing in currents
    if (orbitalGroup.current) {
      orbitalGroup.current.children.forEach((child, idx) => {
        const item = ORBITAL_TAGS[idx];
        if (item) {
          const angle = t * item.speed + (idx * Math.PI * 2) / ORBITAL_TAGS.length;
          child.position.x = Math.cos(angle) * item.radius;
          child.position.z = Math.sin(angle) * item.radius;
          child.position.y = item.yOffset + Math.sin(t * 1.1 + idx) * 0.3;
          child.rotation.y = -angle + Math.PI / 2;
        }
      });
    }

    // Bioluminescent particles - drift in currents with pulsing
    if (biolumParticles.current) {
      biolumParticles.current.rotation.y += delta * 0.015;
      const positions = biolumParticles.current.geometry.attributes.position.array as Float32Array;
      const sizes = biolumParticles.current.geometry.attributes.size.array as Float32Array;
      const phases = biolumParticles.current.geometry.attributes.phase.array as Float32Array;
      const count = positions.length / 3;
      
      for (let i = 0; i < count; i++) {
        const phase = phases[i];
        // Gentle vertical drift
        positions[i * 3 + 1] += Math.sin(t * 0.4 + phase) * 0.004;
        positions[i * 3] += Math.cos(t * 0.25 + phase) * 0.003;
        positions[i * 3 + 2] += Math.sin(t * 0.35 + phase) * 0.002;
        // Pulsing size
        sizes[i] = 0.03 + Math.sin(t * 2.2 + phase) * 0.015;
      }
      biolumParticles.current.geometry.attributes.position.needsUpdate = true;
      biolumParticles.current.geometry.attributes.size.needsUpdate = true;
    }

    // Mouse parallax
    if (coreGroup.current) {
      const targetRotX = _state.pointer.y * 0.2;
      const targetRotY = _state.pointer.x * 0.25;
      coreGroup.current.rotation.x = THREE.MathUtils.lerp(coreGroup.current.rotation.x, targetRotX, 0.04);
      coreGroup.current.rotation.y = THREE.MathUtils.lerp(coreGroup.current.rotation.y, targetRotY, 0.04);
    }
  });

  return (
    <group ref={coreGroup} position={[0, 0, 0]}>
      {/* Bioluminescent Particle Cloud */}
      <points ref={biolumParticles} geometry={biolumGeometry} material={biolumMaterial} />

      {/* Outer Iridescent Shell - like a nacreous shell */}
      <mesh ref={outerShell} material={shellMaterial}>
        <sphereGeometry args={[3.2, 32, 32]} />
      </mesh>

      {/* Central Pearl Core */}
      <mesh
        ref={pearlCore}
        material={pearlMaterial}
        onPointerOver={() => setHoveredNode('CORE-00')}
        onPointerOut={() => setHoveredNode(null)}
        onClick={() => onNodeClick && onNodeClick('home')}
      >
        <sphereGeometry args={[1.6, 48, 48]} />
      </mesh>

      {/* Coral Base Structure */}
      <group ref={coralBase} position={[0, -2.5, 0]}>
        {/* Main coral branches */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} material={coralMaterial} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.05, 4, 6, 4, true]} />
          </mesh>
        ))}
        {[0, 1, 2].map((i) => (
          <mesh key={`branch-${i}`} material={coralMaterial} 
            position={[Math.cos(i * 2.1) * 0.8, -1.5, Math.sin(i * 2.1) * 0.8]}
            rotation={[Math.PI / 6, i * 2.1, 0]}
          >
            <cylinderGeometry args={[0.1, 0.02, 2.5, 5, 4, true]} />
          </mesh>
        ))}
        {/* Coral polyps - small spheres at tips */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={`polyp-${i}`} material={coralMaterial} 
            position={[Math.cos(i * 1.05) * 1.2, 1.5, Math.sin(i * 1.05) * 1.2]}
          >
            <sphereGeometry args={[0.12, 8, 8]} />
          </mesh>
        ))}
      </group>

      {/* Flowing Current Rings */}
      <mesh ref={ring1} material={ringMaterial}>
        <torusGeometry args={[4.2, 0.02, 8, 64]} />
      </mesh>
      <mesh ref={ring2} material={ringMaterial}>
        <torusGeometry args={[5.0, 0.015, 6, 48]} />
      </mesh>
      <mesh ref={ring3} material={ringMaterial}>
        <torusGeometry args={[5.8, 0.01, 5, 32]} />
      </mesh>

      {/* Orbital Tech Tags - flowing in currents */}
      <group ref={orbitalGroup}>
        {ORBITAL_TAGS.map((item) => (
          <group key={item.text}>
            <Html
              center
              wrapperClass="ocean-tag"
              transform
              style={{
                color: item.color,
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textShadow: `0 0 8px ${item.color}80`,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {item.text}
            </Html>
          </group>
        ))}
      </group>

      {/* Core Label */}
      <Html
        center
        position={[0, -4.5, 0]}
        style={{
          color: '#00e5d8',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          opacity: 0.7,
          textShadow: '0 0 8px #00e5d860',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        NODE: CORE-00
      </Html>
    </group>
  );
}