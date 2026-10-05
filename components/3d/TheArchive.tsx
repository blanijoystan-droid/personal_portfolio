'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * TheArchive — sealed glass capsules on submerged shelving.
 *
 * Certifications are the quietest section: things that were earned, sealed, and
 * left to be found. The environment is an archive vault — dark stone shelving,
 * brass-toned frames, and a row of capsules each holding a slowly turning
 * document, lit by one narrow shaft of light.
 */

const CAPSULES = [
  { id: 'cap-1', slot: 0 },
  { id: 'cap-2', slot: 1 },
  { id: 'cap-3', slot: 2 },
];

export function TheArchive({ isMobile = false }: { isMobile?: boolean }) {
  const documents = useRef<THREE.Group[]>([]);
  const shafts = useRef<THREE.Group>(null);
  const { clock } = useThree();

  const shelfMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#22333a'),
        roughness: 0.92,
        metalness: 0.18,
        flatShading: true,
      }),
    []
  );

  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#6d5a3c'),
        roughness: 0.52,
        metalness: 0.85,
      }),
    []
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#a9dfe4'),
        transparent: true,
        opacity: 0.16,
        roughness: 0.06,
        metalness: 0,
        transmission: 0.94,
        thickness: 0.5,
        ior: 1.47,
        iridescence: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  const paperMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#cfc4a8'),
        roughness: 0.95,
        metalness: 0,
        emissive: new THREE.Color('#2a3d42'),
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Three tiers, each capsule sits in its own lit alcove.
  const tiers = useMemo(
    () => (isMobile ? [0, 1] : [0, 1, 2]),
    [isMobile]
  );

  useFrame((state) => {
    const t = clock.getElapsedTime();

    documents.current.forEach((doc, i) => {
      if (!doc) return;
      // Each document turns at its own slow, distinct rate.
      doc.rotation.y = t * (0.12 + i * 0.045) + i;
      doc.position.y = Math.sin(t * 0.3 + i * 2.1) * 0.07;
    });

    if (shafts.current) {
      shafts.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.055 + Math.sin(t * 0.42 + i * 1.7) * 0.02;
      });
    }

    void state;
  });

  return (
    <group position={[-30, 0, 14]}>
      {/* Vault back wall */}
      <mesh material={shelfMaterial} position={[0, -44, -5]}>
        <boxGeometry args={[26, 14, 1]} />
      </mesh>

      {/* Shelf tiers */}
      {tiers.map((tier) => {
        const y = -47.5 + tier * 3.6;
        const capsule = CAPSULES[tier];

        return (
          <group key={`tier-${tier}`} position={[0, y, 0]}>
            {/* Shelf plank */}
            <mesh material={shelfMaterial} position={[0, 0, 0]}>
              <boxGeometry args={[24, 0.42, 5]} />
            </mesh>
            {/* Side supports */}
            {[-11, 11].map((x) => (
              <mesh key={x} material={shelfMaterial} position={[x, 1.7, 0]}>
                <boxGeometry args={[0.6, 3.6, 4.4]} />
              </mesh>
            ))}

            {capsule && (
              <group position={[(tier - 1) * 0, 1.9, 0.6]}>
                {/* Capsule frame */}
                <mesh material={frameMaterial}>
                  <cylinderGeometry args={[1.05, 1.05, 2.3, 12, 1, true]} />
                </mesh>
                {/* Brass end caps */}
                <mesh material={frameMaterial} position={[0, 1.18, 0]}>
                  <cylinderGeometry args={[1.12, 1.05, 0.26, 12]} />
                </mesh>
                <mesh material={frameMaterial} position={[0, -1.18, 0]}>
                  <cylinderGeometry args={[1.05, 1.12, 0.26, 12]} />
                </mesh>
                {/* Glass shell */}
                <mesh material={glassMaterial}>
                  <cylinderGeometry args={[0.98, 0.98, 2.2, 16, 1, true]} />
                </mesh>

                {/* The document inside, slowly turning */}
                <group ref={(el) => { if (el) documents.current[tier] = el; }}>
                  <mesh material={paperMaterial}>
                    <boxGeometry args={[0.9, 1.4, 0.02]} />
                  </mesh>
                  {/* Seal ribbon across the document */}
                  <mesh material={frameMaterial} position={[0, 0.1, 0.02]}>
                    <boxGeometry args={[0.94, 0.14, 0.015]} />
                  </mesh>
                </group>
              </group>
            )}

            {/* Narrow light shaft falling on this capsule */}
            <mesh position={[(capsule?.slot ?? 0) * 0, 3.6, 0.6]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.15, 1.5, 6.6, 10, 1, true]} />
              <meshBasicMaterial
                color="#a9e4e8"
                transparent
                opacity={0.06}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}

      {/* Ambient shafts group so they can be animated together */}
      <group ref={shafts} />

      {/* Reference plaques on the wall between tiers */}
      {tiers.map((tier) => (
        <mesh key={`plaque-${tier}`} material={frameMaterial} position={[8.5, -46.4 + tier * 3.6, -4.4]}>
          <boxGeometry args={[2.6, 1.5, 0.12]} />
        </mesh>
      ))}
    </group>
  );
}
