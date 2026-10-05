'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * LightShafts — volumetric sunlight piercing down from the surface.
 * Soft additive cones that widen and fade with depth, drifting slowly so the
 * water reads as moving. Additive blending keeps them volumetric-looking
 * without needing a full raymarch pass.
 */
export function LightShafts({
  isMobile = false,
  count = 7,
}: {
  isMobile?: boolean;
  count?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const shaftCount = isMobile ? Math.max(3, Math.floor(count * 0.5)) : count;

  const shafts = useMemo(() => {
    return Array.from({ length: shaftCount }, (_, i) => {
      const t = i / shaftCount;
      return {
        position: [
          (t - 0.5) * 46 + THREE.MathUtils.randFloatSpread(9),
          THREE.MathUtils.randFloat(2, 10),
          (t - 0.5) * 34 + THREE.MathUtils.randFloatSpread(7),
        ] as [number, number, number],
        rotation: THREE.MathUtils.randFloatSpread(0.34) as number,
        tilt: THREE.MathUtils.randFloatSpread(0.13) as number,
        height: THREE.MathUtils.randFloat(30, 46),
        topRadius: THREE.MathUtils.randFloat(0.7, 1.9),
        bottomRadius: THREE.MathUtils.randFloat(5.5, 10),
        opacity: THREE.MathUtils.randFloat(0.05, 0.115),
        speed: THREE.MathUtils.randFloat(0.06, 0.16),
        phase: THREE.MathUtils.randFloat(0, Math.PI * 2),
        hue: THREE.MathUtils.randFloat(0.44, 0.53),
      };
    });
  }, [shaftCount]);

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#7fdfe8'),
      transparent: true,
      opacity: 0.075,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, []);

  const geometry = useMemo(() => {
    // Open-ended cone, apex up at the surface, flaring downward.
    return new THREE.CylinderGeometry(1, 1, 1, 18, 1, true);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const shaft = shafts[i];
        if (!shaft) return;
        // Gentle sway and a slow breathing opacity.
        child.rotation.z = shaft.tilt + Math.sin(t * shaft.speed + shaft.phase) * 0.05;
        child.rotation.x = shaft.rotation + Math.cos(t * shaft.speed * 0.8 + shaft.phase) * 0.035;
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = shaft.opacity * (0.7 + Math.sin(t * shaft.speed * 2.2 + shaft.phase) * 0.3);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {shafts.map((shaft, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={material.clone()}
          position={shaft.position}
          rotation={[shaft.tilt, shaft.rotation, shaft.tilt * 0.6]}
          scale={[shaft.topRadius, shaft.height, shaft.topRadius]}
          renderOrder={2}
        >
          <meshBasicMaterial
            attach="material"
            color="#7fdfe8"
            transparent
            opacity={shaft.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}