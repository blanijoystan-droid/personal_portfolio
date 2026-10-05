'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Seafloor — the terrain the whole scene rests on.
 *
 * Layered for depth:
 *  1. A displaced sand plane with subtle dunes
 *  2. Instanced rock formations, irregular and rotated for natural silhouettes
 *  3. Instanced coral fans / brain forms in muted, desaturated tones
 *  4. Kelp stalks that sway with the current
 *  5. Sunken ruins — broken columns and arch fragments half-buried in sand
 *
 * Colours stay inside the teal / sand / muted-coral range so nothing reads as
 * cartoonish or neon.
 */

function Seabed({ isMobile = false, size = 300 }: { isMobile?: boolean; size?: number }) {
  const geometry = useMemo(() => {
    const segments = isMobile ? 48 : 110;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    // Gentle dune field so the floor is not a flat plane.
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h =
        Math.sin(x * 0.035) * 1.5 +
        Math.sin(z * 0.027) * 1.2 +
        Math.sin((x + z) * 0.014) * 2.1 +
        Math.sin((x - z) * 0.06) * 0.35;
      pos.setY(i, h);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [size, isMobile]);

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1d3f4a'),
      roughness: 0.97,
      metalness: 0.0,
    });
    return mat;
  }, []);

  return <mesh geometry={geometry} material={material} position={[0, -52, 0]} receiveShadow />;
}

function Rocks({ isMobile = false, count = 90 }: { isMobile?: boolean; count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const total = isMobile ? Math.floor(count * 0.45) : count;

  const geometry = useMemo(() => {
    // Low-poly irregular boulder.
    const geo = new THREE.IcosahedronGeometry(1, 1);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const noise = 0.72 + Math.abs(Math.sin(i * 12.9898) * 0.28);
      pos.setXYZ(
        i,
        pos.getX(i) * noise,
        pos.getY(i) * noise * 0.72,
        pos.getZ(i) * noise
      );
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#15303c'),
        roughness: 0.94,
        metalness: 0.04,
        flatShading: true,
      }),
    []
  );

  useMemo(() => {
    return null;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    for (let i = 0; i < total; i++) {
      // Deterministic per-index placement keeps the layout stable across renders.
      const seedA = Math.sin(i * 127.1) * 43758.5453;
      const seedB = Math.sin(i * 311.7) * 43758.5453;
      const seedC = Math.sin(i * 74.7) * 43758.5453;
      const a = seedA - Math.floor(seedA);
      const b = seedB - Math.floor(seedB);
      const c = seedC - Math.floor(seedC);

      const x = (a - 0.5) * 240;
      const z = (b - 0.5) * 240;
      // Cluster near the centre path, thin out toward the edges.
      const dist = Math.hypot(x, z);
      const scale = (0.7 + c * 3.4) * (1.25 - Math.min(dist / 220, 0.7));

      dummy.position.set(x, -51.6 + scale * 0.22, z);
      dummy.rotation.set(a * Math.PI, b * Math.PI * 2, c * Math.PI);
      dummy.scale.set(scale, scale * (0.55 + c * 0.4), scale);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geometry, material, total]} frustumCulled={false} receiveShadow />;
}

function Coral({ isMobile = false }: { isMobile?: boolean }) {
  const count = isMobile ? 16 : 40;

  // Muted, desaturated coral tones — never hot pink or bright orange.
  const palette = useMemo(
    () =>
      [
        new THREE.Color('#b5705f'),
        new THREE.Color('#8d6a72'),
        new THREE.Color('#5f7f77'),
        new THREE.Color('#a37a5c'),
        new THREE.Color('#6d5f7a'),
      ],
    []
  );

  const branches = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      angle: (i / 7) * Math.PI * 2 + 0.4,
      length: THREE.MathUtils.randFloat(0.9, 2.1),
      thickness: THREE.MathUtils.randFloat(0.08, 0.19),
      tilt: THREE.MathUtils.randFloat(0.2, 0.7),
    }));
  }, []);

  const branchGeometry = useMemo(() => new THREE.CylinderGeometry(0.5, 1, 1, 6, 1, true), []);

  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const seedA = Math.sin(i * 91.3) * 43758.5453;
        const seedB = Math.sin(i * 213.7) * 43758.5453;
        const seedC = Math.sin(i * 47.9) * 43758.5453;
        const a = seedA - Math.floor(seedA);
        const b = seedB - Math.floor(seedB);
        const c = seedC - Math.floor(seedC);

        const x = (a - 0.5) * 170;
        const z = (b - 0.5) * 170;
        if (Math.hypot(x, z) > 78) return null;

        const scale = 0.8 + c * 1.6;
        const color = palette[i % palette.length];

        return (
          <group
            key={i}
            position={[x, -51.2, z]}
            rotation={[0, a * Math.PI * 2, 0]}
            scale={scale}
          >
            {branches.map((br, bi) => (
              <mesh
                key={bi}
                geometry={branchGeometry}
                position={[
                  Math.cos(br.angle) * br.length * 0.28,
                  br.length * 0.5,
                  Math.sin(br.angle) * br.length * 0.28,
                ]}
                rotation={[Math.sin(br.angle) * br.tilt, 0, -Math.cos(br.angle) * br.tilt]}
              >
                <meshStandardMaterial
                  color={color}
                  roughness={0.88}
                  metalness={0.02}
                  side={THREE.DoubleSide}
                  flatShading
                />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function Seaweed({ isMobile = false }: { isMobile?: boolean }) {
  const count = isMobile ? 12 : 28;
  const groupRef = useRef<THREE.Group>(null);

  const stalks = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seedA = Math.sin(i * 57.3) * 43758.5453;
      const seedB = Math.sin(i * 129.7) * 43758.5453;
      const seedC = Math.sin(i * 33.1) * 43758.5453;
      return {
        x: (seedA - Math.floor(seedA) - 0.5) * 150,
        z: (seedB - Math.floor(seedB) - 0.5) * 150,
        height: 4 + (seedC - Math.floor(seedC)) * 9,
        phase: (seedA - Math.floor(seedA)) * Math.PI * 2,
        lean: (seedB - Math.floor(seedB) - 0.5) * 0.5,
        hue: (seedC - Math.floor(seedC)) * 0.16 + 0.42,
      };
    }).filter((s) => Math.hypot(s.x, s.z) < 72);
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const s = stalks[i];
      if (!s) return;
      child.rotation.z = s.lean + Math.sin(t * 0.42 + s.phase) * 0.16;
      child.rotation.x = Math.cos(t * 0.31 + s.phase) * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {stalks.map((s, i) => (
        <mesh key={i} position={[s.x, -50.6 + s.height / 2, s.z]}>
          <cylinderGeometry args={[0.035, 0.13, s.height, 5, 6, true]} />
          <meshStandardMaterial
            color={new THREE.Color().setHSL(s.hue * 0.28, 0.32, 0.19)}
            roughness={0.9}
            metalness={0}
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}
    </group>
  );
}

function Ruins({ isMobile = false }: { isMobile?: boolean }) {
  const count = isMobile ? 4 : 9;

  const pieces = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seedA = Math.sin(i * 71.3) * 43758.5453;
      const seedB = Math.sin(i * 187.7) * 43758.5453;
      const seedC = Math.sin(i * 23.9) * 43758.5453;
      const a = seedA - Math.floor(seedA);
      const b = seedB - Math.floor(seedB);
      const c = seedC - Math.floor(seedC);
      return {
        position: [
          (a - 0.5) * 120,
          -50 + c * 1.4,
          (b - 0.5) * 120,
        ] as [number, number, number],
        height: 3.5 + c * 8,
        radius: 0.5 + c * 0.7,
        rotation: [c * 0.35, a * Math.PI * 2, (b - 0.5) * 0.45] as [number, number, number],
        broken: c > 0.55,
      };
    }).filter((p) => Math.hypot(p.position[0], p.position[2]) < 62);
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2a4a4f'),
        roughness: 0.9,
        metalness: 0.08,
        flatShading: true,
      }),
    []
  );

  return (
    <group>
      {pieces.map((p, i) => (
        <group key={i} position={p.position} rotation={p.rotation}>
          {/* Column shaft */}
          <mesh material={material} position={[0, p.height / 2, 0]}>
            <cylinderGeometry args={[p.radius * 0.85, p.radius, p.height, 8, 1]} />
          </mesh>
          {/* Broken capital, tilted off if the piece is snapped */}
          <mesh
            material={material}
            position={[0, p.height + (p.broken ? 0.35 : 0.15), 0]}
            rotation={[p.broken ? 0.28 : 0, 0, p.broken ? -0.2 : 0]}
          >
            <boxGeometry args={[p.radius * 2.5, 0.42, p.radius * 2.5]} />
          </mesh>
          {/* Flanking fragment for silhouette interest */}
          <mesh material={material} position={[p.radius * 2.2, 0.6, 0.4]} rotation={[0.5, 0.6, 0.7]}>
            <boxGeometry args={[p.radius * 1.6, p.radius * 2.2, p.radius * 0.6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Seafloor({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <group>
      <Seabed isMobile={isMobile} />
      <Rocks isMobile={isMobile} />
      <Coral isMobile={isMobile} />
      <Seaweed isMobile={isMobile} />
      <Ruins isMobile={isMobile} />
    </group>
  );
}