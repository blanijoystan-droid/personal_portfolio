'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * TheWreck — a broken hull resting on the seabed, half-swallowed by growth.
 *
 * The experience section is about a journey that ended harder than it began, so
 * the structure is deliberately broken: a snapped keel, ribs opening like a rib
 * cage, collapsed decking, and one surviving lamp still burning faintly.
 * Coral and weed have taken most of it over.
 */

export function TheWreck({ isMobile = false }: { isMobile?: boolean }) {
  const lampRef = useRef<THREE.PointLight>(null);
  const growthRef = useRef<THREE.Group>(null);
  const { clock } = useThree();

  const hullMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#33403f'),
        roughness: 0.94,
        metalness: 0.38,
        flatShading: true,
      }),
    []
  );

  const plateMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#26332f'),
        roughness: 0.88,
        metalness: 0.5,
        flatShading: true,
      }),
    []
  );

  const growthMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2d5148'),
        roughness: 0.96,
        metalness: 0,
        transparent: true,
        opacity: 0.85,
        flatShading: true,
      }),
    []
  );

  const rustMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#5c4a3c'),
        roughness: 1,
        metalness: 0.15,
        flatShading: true,
      }),
    []
  );

  // Ribs of the hull, spread along the keel. The far end snaps off.
  const ribs = useMemo(() => {
    const count = isMobile ? 7 : 13;
    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1);
      return {
        z: -13 + t * 24,
        // The break happens around 70% along the hull.
        spread: 1 - Math.max(0, (t - 0.68) / 0.32) * 0.82,
        height: 3.4 * (0.55 + Math.sin(t * Math.PI) * 0.55),
        tilt: t > 0.68 ? (t - 0.68) * 2.4 : 0,
        lean: Math.sin(i * 1.7) * 0.12,
      };
    });
  }, [isMobile]);

  const growths = useMemo(() => {
    const count = isMobile ? 16 : 44;
    return Array.from({ length: count }, (_, i) => {
      const seed = Math.sin(i * 137.5) * 43758.5453;
      const a = seed - Math.floor(seed);
      const seed2 = Math.sin(i * 271.9) * 43758.5453;
      const b = seed2 - Math.floor(seed2);
      const seed3 = Math.sin(i * 59.3) * 43758.5453;
      const c = seed3 - Math.floor(seed3);
      return {
        x: (a - 0.5) * 9,
        y: -50.6 + c * 0.8,
        z: -14 + b * 26,
        scale: 0.4 + c * 1.5,
        tilt: (a - 0.5) * 1.4,
        hue: 0.36 + c * 0.1,
      };
    });
  }, [isMobile]);

  useFrame((state) => {
    const t = clock.getElapsedTime();
    // The last lamp flickers like it is about to die — an unstable glow.
    if (lampRef.current) {
      const flicker = 0.72 + Math.sin(t * 2.3) * 0.14 + Math.sin(t * 7.1) * 0.06;
      lampRef.current.intensity = 26 * flicker;
    }
    if (growthRef.current) {
      growthRef.current.rotation.z = Math.sin(t * 0.2) * 0.008;
    }
    void state;
  });

  return (
    <group position={[26, 0, -20]}>
      {/* Keel */}
      <mesh material={plateMaterial} position={[0, -48.4, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.6, 1.1, 30]} />
      </mesh>

      {/* Hull ribs, open like a cage */}
      {ribs.map((rib, i) => (
        <group key={`rib-${i}`} position={[0, -48, rib.z]} rotation={[0, 0, rib.tilt]}>
          {/* Port and starboard plates, bent outward */}
          <mesh material={hullMaterial} position={[-rib.spread * 2.6, rib.height * 0.5, 0]} rotation={[0, 0, -0.16]}>
            <boxGeometry args={[0.3, rib.height * 1.5, 1.5]} />
          </mesh>
          <mesh material={hullMaterial} position={[rib.spread * 2.6, rib.height * 0.5, 0]} rotation={[0, 0, 0.16]}>
            <boxGeometry args={[0.3, rib.height * 1.5, 1.5]} />
          </mesh>
          {/* Overhead beam, missing on the broken half */}
          {rib.tilt === 0 && (
            <mesh material={plateMaterial} position={[0, rib.height * 1.05, 0]}>
              <boxGeometry args={[rib.spread * 5.4, 0.28, 0.6]} />
            </mesh>
          )}
        </group>
      ))}

      {/* Collapsed deck plates */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={`deck-${i}`}
          material={plateMaterial}
          position={[(i - 1) * 2.4, -47.6 + i * 0.3, -6 + i * 5]}
          rotation={[0.28 + i * 0.12, i * 0.5, (i - 1) * 0.24]}
        >
          <boxGeometry args={[6.5, 0.22, 7]} />
        </mesh>
      ))}

      {/* Snapped bow section, fallen away from the body */}
      <group position={[5.5, -49.4, 12]} rotation={[0.5, 0.7, 0.6]}>
        <mesh material={hullMaterial}>
          <coneGeometry args={[3, 6.5, 7]} />
        </mesh>
      </group>

      {/* Machinery block amidships */}
      <group position={[-1.2, -46.8, 1]}>
        <mesh material={rustMaterial}>
          <boxGeometry args={[3.4, 2.2, 4.4]} />
        </mesh>
        <mesh material={plateMaterial} position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.8, 1.0, 1.0, 10]} />
        </mesh>
        {/* Pipes */}
        {[-1, 0, 1].map((i) => (
          <mesh
            key={`pipe-${i}`}
            material={rustMaterial}
            position={[i * 0.85, 1.2, -1.4]}
            rotation={[0.2, 0, 0]}
          >
            <cylinderGeometry args={[0.2, 0.2, 4.2, 8]} />
          </mesh>
        ))}
      </group>

      {/* The one surviving lamp */}
      <mesh position={[0, -45.4, -3.5]}>
        <sphereGeometry args={[0.42, 12, 10]} />
        <meshBasicMaterial color="#ffd9a0" transparent opacity={0.55} />
      </mesh>
      <pointLight
        ref={lampRef}
        position={[0, -45.4, -3.5]}
        color="#ffca8a"
        intensity={26}
        distance={30}
        decay={2}
      />

      {/* Cables trailing away into the dark */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={`cable-${i}`}
          material={plateMaterial}
          position={[-4 - i * 1.6, -47 + i * 0.6, 8 + i * 3]}
          rotation={[0.4 + i * 0.2, i * 0.8, 0.6 + i * 0.3]}
        >
          <torusGeometry args={[2.4 + i * 0.6, 0.09, 5, 20, Math.PI * 1.4]} />
        </mesh>
      ))}

      {/* Life reclaiming the structure */}
      <group ref={growthRef}>
        {growths.map((g, i) => (
          <mesh
            key={`growth-${i}`}
            material={growthMaterial}
            position={[g.x, g.y, g.z]}
            rotation={[g.tilt, g.hue * 6, g.tilt * 0.6]}
            scale={g.scale}
          >
            <icosahedronGeometry args={[1, 0]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}