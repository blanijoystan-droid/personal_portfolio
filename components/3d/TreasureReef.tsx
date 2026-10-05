'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * TreasureReef — artefacts resting where they were left.
 *
 * Achievements are things surfaced rather than things awarded, so the
 * environment is a scatter of half-buried objects: a chest, medallions catching
 * the last of the surface light, pearls, and coins half in the sand. Nothing
 * glows; it is found, not lit up.
 */

export function TreasureReef({ isMobile = false }: { isMobile?: boolean }) {
  const chestLid = useRef<THREE.Mesh>(null);
  const medallions = useRef<THREE.Group>(null);
  const { clock } = useThree();

  const woodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#4a3a2c'),
        roughness: 0.94,
        metalness: 0.06,
        flatShading: true,
      }),
    []
  );

  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#8a6f43'),
        roughness: 0.42,
        metalness: 0.9,
      }),
    []
  );

  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#b08a45'),
        roughness: 0.34,
        metalness: 0.95,
      }),
    []
  );

  const pearlMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#eaf6f4'),
        roughness: 0.1,
        metalness: 0.02,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        iridescence: 0.8,
        iridescenceIOR: 1.3,
      }),
    []
  );

  const coinCount = isMobile ? 16 : 42;
  const pearlCount = isMobile ? 9 : 22;

  const coins = useMemo(() => {
    return Array.from({ length: coinCount }, (_, i) => {
      const s1 = Math.sin(i * 91.3) * 43758.5453;
      const s2 = Math.sin(i * 173.9) * 43758.5453;
      const s3 = Math.sin(i * 53.7) * 43758.5453;
      const a = s1 - Math.floor(s1);
      const b = s2 - Math.floor(s2);
      const c = s3 - Math.floor(s3);
      return {
        x: (a - 0.5) * 22,
        z: (b - 0.5) * 22,
        tilt: c * 0.9,
        yaw: a * Math.PI * 2,
        scale: 0.7 + c * 0.6,
      };
    });
  }, [coinCount]);

  const pearls = useMemo(() => {
    return Array.from({ length: pearlCount }, (_, i) => {
      const s1 = Math.sin(i * 127.1) * 43758.5453;
      const s2 = Math.sin(i * 211.7) * 43758.5453;
      const s3 = Math.sin(i * 41.3) * 43758.5453;
      const a = s1 - Math.floor(s1);
      const b = s2 - Math.floor(s2);
      const c = s3 - Math.floor(s3);
      return {
        x: (a - 0.5) * 16,
        z: (b - 0.5) * 16,
        scale: 0.16 + c * 0.24,
      };
    });
  }, [pearlCount]);

  useFrame((state) => {
    const t = clock.getElapsedTime();

    // The chest lid creaks open a little further, then settles. Slow, mechanical.
    if (chestLid.current) {
      chestLid.current.rotation.x = -0.42 - (Math.sin(t * 0.18) * 0.5 + 0.5) * 0.16;
    }

    // Medallions turn almost imperceptibly, catching the light as they go.
    if (medallions.current) {
      medallions.current.children.forEach((child, i) => {
        child.rotation.y = t * (0.06 + i * 0.018) + i;
      });
    }

    void state;
  });

  return (
    <group position={[-32, 0, -18]}>
      {/* Half-buried chest */}
      <group position={[0, -50.6, 0]} rotation={[0, 0.4, 0]}>
        <mesh material={woodMaterial} position={[0, 1.1, 0]}>
          <boxGeometry args={[4.6, 2.2, 2.9]} />
        </mesh>
        {/* Lid, hinged and half open */}
        <mesh ref={chestLid} material={woodMaterial} position={[0, 2.3, -1.45]} rotation={[-0.5, 0, 0]}>
          <cylinderGeometry args={[1.45, 1.45, 4.6, 14, 1, false, 0, Math.PI]} />
        </mesh>
        {/* Brass banding */}
        {[-1.5, 0, 1.5].map((x) => (
          <mesh key={x} material={brassMaterial} position={[x, 1.1, 0]}>
            <boxGeometry args={[0.22, 2.3, 3.0]} />
          </mesh>
        ))}
        {/* Lock plate */}
        <mesh material={brassMaterial} position={[0, 1.5, 1.5]}>
          <boxGeometry args={[0.7, 0.9, 0.16]} />
        </mesh>
      </group>

      {/* Medallions standing in the sand, like markers */}
      <group ref={medallions}>
        {[-3.2, 0, 3.2].map((x, i) => (
          <mesh
            key={x}
            material={goldMaterial}
            position={[x, -49.6 + (i % 2) * 0.4, 3.2 + i * 0.6]}
            rotation={[-0.32 + i * 0.1, i * 0.9, 0.2 - i * 0.15]}
          >
            <cylinderGeometry args={[0.85, 0.85, 0.14, 20]} />
          </mesh>
        ))}
      </group>

      {/* Scattered coins */}
      {coins.map((c, i) => (
        <mesh
          key={`coin-${i}`}
          material={goldMaterial}
          position={[c.x, -50.5, c.z]}
          rotation={[c.tilt, c.yaw, c.tilt * 0.4]}
          scale={c.scale}
        >
          <cylinderGeometry args={[0.28, 0.28, 0.05, 12]} />
        </mesh>
      ))}

      {/* Pearls nestled in the sand */}
      {pearls.map((p, i) => (
        <mesh key={`pearl-${i}`} material={pearlMaterial} position={[p.x, -50.4, p.z]} scale={p.scale}>
          <sphereGeometry args={[1, 14, 12]} />
        </mesh>
      ))}

      {/* A broken amphora, because treasure should look found rather than placed */}
      <group position={[6.5, -50.2, -4]}>
        <mesh material={rustMaterial} rotation={[0.2, 0, 1.35]}>
          <cylinderGeometry args={[0.7, 0.42, 3.2, 12, 1, true]} />
        </mesh>
        <mesh material={rustMaterial} position={[1.4, -0.3, 0.4]} rotation={[0.9, 0.4, 1.9]}>
          <cylinderGeometry args={[0.5, 0.32, 2.2, 12, 1, true]} />
        </mesh>
      </group>
    </group>
  );
}

const rustMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#6b5748'),
  roughness: 0.96,
  metalness: 0.1,
  side: THREE.DoubleSide,
});
