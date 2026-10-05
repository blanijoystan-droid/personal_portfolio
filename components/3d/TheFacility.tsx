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

/**
 * TheFacility — a sunken research station on the seabed.
 *
 * The projects section is the centrepiece of the dive, so the environment around
 * it has real architecture: a ring corridor of glass observation tubes, a hub
 * tower, radiating conduits, and current-borne motes that stream through the
 * structure as if data were moving through pipes.
 *
 * Weathered steel and algae-softened glass. Nothing here is sci-fi chrome; it
 * looks like equipment that has been down here a long time.
 */

const MODULES = [
  { id: 'chamber-1', angle: 0.0, dist: 17, height: 3.4, radius: 3.1 },
  { id: 'chamber-2', angle: (Math.PI * 2) / 5, dist: 20, height: 4.2, radius: 3.6 },
  { id: 'chamber-3', angle: (Math.PI * 4) / 5, dist: 16.5, height: 2.8, radius: 2.9 },
  { id: 'chamber-4', angle: (Math.PI * 6) / 5, dist: 21, height: 5.0, radius: 3.3 },
  { id: 'chamber-5', angle: (Math.PI * 8) / 5, dist: 18, height: 3.8, radius: 3.0 },
];

function glassMaterial(tint: string, opacity: number) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(tint),
    transparent: true,
    opacity,
    roughness: 0.08,
    metalness: 0,
    transmission: 0.9,
    thickness: 0.6,
    ior: 1.45,
    iridescence: 0.4,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

export function TheFacility({ isMobile = false }: { isMobile?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const flowRef = useRef<THREE.Points>(null);
  const { clock } = useThree();

  const hullMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2c4148'),
        roughness: 0.72,
        metalness: 0.55,
      }),
    []
  );

  const trimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#4a5f63'),
        roughness: 0.55,
        metalness: 0.7,
      }),
    []
  );

  const growthMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2f5347'),
        roughness: 0.95,
        metalness: 0,
        transparent: true,
        opacity: 0.82,
      }),
    []
  );

  const glass = useMemo(() => glassMaterial('#8fd6dd', 0.2), []);
  const coreGlass = useMemo(() => glassMaterial('#bff0ef', 0.26), []);

  // Motes streaming along the conduits, like data under pressure.
  const flowGeometry = useMemo(() => {
    const perModule = isMobile ? 40 : 110;
    const total = perModule * MODULES.length;
    const positions = new Float32Array(total * 3);
    const seeds = new Float32Array(total);
    const rand = mulberry32(42);

    let index = 0;
    for (const m of MODULES) {
      for (let i = 0; i < perModule; i++) {
        const radius = m.dist + (rand() - 0.5) * 3.4;
        const angle = m.angle + (rand() - 0.5) * 0.5;
        positions[index * 3] = Math.cos(angle) * radius;
        positions[index * 3 + 1] = -46 + rand() * 8;
        positions[index * 3 + 2] = Math.sin(angle) * radius;
        seeds[index] = rand();
        index++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, [isMobile]);

  const flowMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color('#9ff2ec'),
        size: 0.09,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const algae = useMemo(() => {
    return Array.from({ length: isMobile ? 10 : 26 }, (_, i) => {
      const seed = Math.sin(i * 83.7) * 43758.5453;
      const a = seed - Math.floor(seed);
      const seed2 = Math.sin(i * 191.3) * 43758.5453;
      const b = seed2 - Math.floor(seed2);
      const seed3 = Math.sin(i * 47.1) * 43758.5453;
      const c = seed3 - Math.floor(seed3);
      return {
        module: MODULES[i % MODULES.length]!,
        angleOffset: a * Math.PI * 2,
        radiusOffset: (b - 0.5) * 2.2,
        scale: 0.5 + c * 1.3,
        tilt: (a - 0.5) * 1.2,
      };
    });
  }, [isMobile]);

  useFrame((state, delta) => {
    const t = clock.getElapsedTime();
    const step = Math.min(delta, 0.05);

    if (beaconRef.current) {
      const mat = beaconRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.16 + Math.sin(t * 0.5) * 0.06;
    }

    if (flowRef.current) {
      const attr = flowRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      const seeds = flowRef.current.geometry.getAttribute('aSeed') as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;

      for (let i = 0; i < arr.length / 3; i++) {
        const seed = seeds.getX(i);
        // Motes drift upward and around the ring, wrapping at the top.
        arr[i * 3 + 1] += step * (0.5 + seed * 1.4);
        if (arr[i * 3 + 1] > -38) {
          const mod = MODULES[i % MODULES.length]!;
          const angle = mod.angle + Math.sin(seed * 12.7 + t * 0.1) * 0.4;
          const radius = mod.dist + (seed - 0.5) * 3.4;
          arr[i * 3] = Math.cos(angle) * radius;
          arr[i * 3 + 1] = -46;
          arr[i * 3 + 2] = Math.sin(angle) * radius;
        }
      }
      attr.needsUpdate = true;
    }

    void state;
  });

  return (
    <group ref={groupRef} position={[0, -48, 0]}>
      {/* Central hub tower */}
      <mesh material={hullMaterial} position={[0, 6, 0]}>
        <cylinderGeometry args={[2.6, 3.6, 13, 12, 1, false]} />
      </mesh>
      <mesh material={trimMaterial} position={[0, 12.8, 0]}>
        <cylinderGeometry args={[3.5, 2.9, 1.1, 12]} />
      </mesh>
      <mesh material={coreGlass} position={[0, 8.5, 0]}>
        <cylinderGeometry args={[2.75, 2.75, 4.2, 14, 1, true]} />
      </mesh>
      {/* Hub beacon — the facility's heartbeat. */}
      <mesh ref={beaconRef} position={[0, 14.2, 0]}>
        <sphereGeometry args={[0.85, 16, 14]} />
        <meshBasicMaterial
          color="#9ff2ec"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ring corridor connecting hub to each chamber */}
      <mesh material={trimMaterial} rotation={[Math.PI / 2, 0, 0]} position={[0, 1.2, 0]}>
        <torusGeometry args={[14, 0.42, 8, 64]} />
      </mesh>
      <mesh material={glass} rotation={[Math.PI / 2, 0, 0]} position={[0, 1.2, 0]}>
        <torusGeometry args={[14, 1.25, 12, 64]} />
      </mesh>

      {MODULES.map((module) => {
        const x = Math.cos(module.angle) * module.dist;
        const z = Math.sin(module.angle) * module.dist;

        return (
          <group key={module.id} position={[x, 0, z]} rotation={[0, -module.angle, 0]}>
            {/* Spoke connecting back to the ring */}
            <mesh material={trimMaterial} position={[-module.dist / 2 + 2, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.34, 0.34, module.dist, 8]} />
            </mesh>

            {/* Pressure hull */}
            <mesh material={hullMaterial} position={[0, module.height, 0]}>
              <cylinderGeometry args={[module.radius, module.radius * 1.08, module.height, 14]} />
            </mesh>

            {/* Observation glass */}
            <mesh material={glass} position={[0, module.height * 0.72, module.radius * 0.82]} rotation={[0.3, 0, 0]}>
              <sphereGeometry args={[module.radius * 0.56, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            </mesh>

            {/* Structural ribs */}
            {[0.28, 0.72].map((f) => (
              <mesh key={f} material={trimMaterial} position={[0, module.height * f, 0]}>
                <torusGeometry args={[module.radius * 1.03, 0.11, 6, 20]} />
              </mesh>
            ))}
            {[0.28, 0.72].map((f) => (
              <mesh
                key={`cap-${f}`}
                material={trimMaterial}
                position={[0, module.height * f, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <torusGeometry args={[module.radius * 1.03, 0.11, 6, 20]} />
              </mesh>
            ))}

            {/* Cap */}
            <mesh material={trimMaterial} position={[0, module.height + 0.2, 0]}>
              <cylinderGeometry args={[module.radius * 0.55, module.radius * 1.02, 0.7, 14]} />
            </mesh>

            {/* Perimeter pylons */}
            {[0, 1, 2, 3].map((k) => {
              const a = (k / 4) * Math.PI * 2;
              return (
                <mesh
                  key={`pylon-${k}`}
                  material={trimMaterial}
                  position={[
                    Math.cos(a) * module.radius * 1.16,
                    module.height * 0.5,
                    Math.sin(a) * module.radius * 1.16,
                  ]}
                  rotation={[Math.cos(a) * 0.12, 0, -Math.sin(a) * 0.12]}
                >
                  <cylinderGeometry args={[0.13, 0.18, module.height * 1.15, 6]} />
                </mesh>
              );
            })}
          </group>
        );
      })}

      {/* Life growing back over the structure */}
      {algae.map((a, i) => {
        const m = a.module;
        const angle = m.angle + a.angleOffset * 0.12;
        const radius = m.dist + a.radiusOffset;
        return (
          <mesh
            key={`algae-${i}`}
            material={growthMaterial}
            position={[Math.cos(angle) * radius, 1.5 + a.scale, Math.sin(angle) * radius]}
            rotation={[a.tilt, angle, a.tilt * 0.5]}
            scale={a.scale}
          >
            <sphereGeometry args={[0.9, 8, 6]} />
          </mesh>
        );
      })}

      {/* Conduit flow */}
      <points ref={flowRef} geometry={flowGeometry} material={flowMaterial} />
    </group>
  );
}