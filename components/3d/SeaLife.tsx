'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * SeaLife — ambient wildlife.
 *
 * Two instanced systems plus a few jellyfish:
 *  - `Fish`      instanced, each on an independent wandering orbit
 *  - `Jellyfish` translucent bells with trailing tentacles, softly pulsing
 *
 * Everything is deliberately slow, lateral and distant. Wildlife should read as
 * atmosphere at the edge of vision, never as something happening to the viewer.
 */

interface FishInstance {
  centre: [number, number, number];
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  scale: number;
  speedFactor: number;
}

function FishSchool({ isMobile = false }: { isMobile?: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const count = isMobile ? 14 : 34;

  const fish = useMemo<FishInstance[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      // A couple of loose schools rather than one dense mass.
      const school = i % 3;
      const centre: [number, number, number] =
        school === 0
          ? [THREE.MathUtils.randFloatSpread(46), THREE.MathUtils.randFloat(-9, 2), THREE.MathUtils.randFloatSpread(40)]
          : school === 1
            ? [THREE.MathUtils.randFloatSpread(56), THREE.MathUtils.randFloat(-20, -6), THREE.MathUtils.randFloatSpread(48)]
            : [THREE.MathUtils.randFloatSpread(60), THREE.MathUtils.randFloat(-34, -18), THREE.MathUtils.randFloatSpread(52)];

      return {
        centre,
        radius: THREE.MathUtils.randFloat(7, 17),
        // Slow: a full orbit should take well over half a minute.
        speed: THREE.MathUtils.randFloat(0.035, 0.085) / Math.max(1, THREE.MathUtils.randFloat(7, 17) * 0.12),
        phase: THREE.MathUtils.randFloat(0, Math.PI * 2),
        tilt: THREE.MathUtils.randFloatSpread(0.22),
        scale: THREE.MathUtils.randFloat(0.5, 1.15),
        speedFactor: THREE.MathUtils.randFloat(0.7, 1.4),
      };
    });
  }, [count]);

  const geometry = useMemo(() => {
    // A simple teardrop body — cheap, and reads clearly at distance.
    const geo = new THREE.SphereGeometry(0.5, 10, 8);
    geo.scale(1.6, 0.62, 0.4);
    // Point the nose along +X so we can orient with lookAt.
    geo.rotateY(Math.PI / 2);
    return geo;
  }, []);

  const tailGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(-0.55, 0.34);
    shape.lineTo(-0.42, 0);
    shape.lineTo(-0.55, -0.34);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#20495c'),
        roughness: 0.55,
        metalness: 0.12,
        transparent: true,
        opacity: 0.82,
      }),
    []
  );

  const tailRef = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < fish.length; i++) {
      const f = fish[i];
      if (!f) continue;

      const angle = f.phase + t * f.speed * f.speedFactor;
      const x = f.centre[0] + Math.cos(angle) * f.radius;
      const z = f.centre[2] + Math.sin(angle) * f.radius;
      // Gentle vertical undulation so they aren't perfectly planar.
      const y = f.centre[1] + Math.sin(angle * 1.7 + f.phase) * 0.85;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(f.scale);

      // Orient along the tangent of the orbit.
      const nextAngle = angle + 0.02;
      const nx = f.centre[0] + Math.cos(nextAngle) * f.radius;
      const nz = f.centre[2] + Math.sin(nextAngle) * f.radius;
      dummy.lookAt(nx, y, nz);
      dummy.rotateZ(f.tilt + Math.sin(t * 1.4 * f.speedFactor + f.phase) * 0.12);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      if (tailRef.current) {
        // Tail trails the body and sweeps side to side.
        dummy.position.set(x - f.radius * 0.03 - 0.95 * f.scale, y, z);
        dummy.rotation.set(0, Math.atan2(nx - x, nz - z), Math.sin(t * 3.2 * f.speedFactor + f.phase) * 0.5);
        dummy.scale.setScalar(f.scale);
        dummy.updateMatrix();
        tailRef.current.setMatrixAt(i, dummy.matrix);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (tailRef.current) tailRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[geometry, material, count]} frustumCulled={false} />
      <instancedMesh ref={tailRef} args={[tailGeometry, material, count]} frustumCulled={false} />
    </group>
  );
}

interface JellyfishInstance {
  position: [number, number, number];
  radius: number;
  speed: number;
  phase: number;
  scale: number;
  hue: number;
}

function Jellyfish({ isMobile = false }: { isMobile?: boolean }) {
  const groupRefs = useRef<THREE.Group[]>([]);
  const count = isMobile ? 3 : 7;

  const jellyfish = useMemo<JellyfishInstance[]>(() => {
    return Array.from({ length: count }, () => ({
      // Keep them mostly deep and to the sides of the dive path.
      position: [
        THREE.MathUtils.randFloatSpread(72),
        THREE.MathUtils.randFloat(-46, -12),
        THREE.MathUtils.randFloatSpread(64),
      ] as [number, number, number],
      radius: THREE.MathUtils.randFloat(4, 11),
      speed: THREE.MathUtils.randFloat(0.012, 0.03),
      phase: THREE.MathUtils.randFloat(0, Math.PI * 2),
      scale: THREE.MathUtils.randFloat(0.7, 1.7),
      hue: THREE.MathUtils.randFloat(0.47, 0.53),
    }));
  }, [count]);

  const bellGeometry = useMemo(() => new THREE.SphereGeometry(1, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), []);

  const bellMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#9fd8e8'),
        transparent: true,
        opacity: 0.24,
        roughness: 0.15,
        transmission: 0.85,
        thickness: 0.5,
        ior: 1.34,
        emissive: new THREE.Color('#2e7f9c'),
        emissiveIntensity: 0.35,
        iridescence: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  const tentacleMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#8fd4e0'),
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const tentacles = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      return {
        angle,
        length: THREE.MathUtils.randFloat(2.2, 4.6),
        offset: THREE.MathUtils.randFloat(-0.2, 0.2),
      };
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    groupRefs.current.forEach((group, i) => {
      const j = jellyfish[i];
      if (!group || !j) return;

      const angle = j.phase + t * j.speed;
      group.position.set(
        j.position[0] + Math.cos(angle) * j.radius,
        j.position[1] + Math.sin(t * 0.14 + j.phase) * 1.9,
        j.position[2] + Math.sin(angle) * j.radius
      );

      // The bell contracts and relaxes — the real swimming motion.
      const pulse = 1 + Math.sin(t * 0.85 + j.phase) * 0.13;
      group.scale.set(j.scale * (2 - pulse) * 0.9, j.scale * pulse, j.scale * (2 - pulse) * 0.9);
      group.rotation.y = -angle + Math.PI / 2;
      group.rotation.z = Math.sin(t * 0.2 + j.phase) * 0.09;
    });
  });

  return (
    <group>
      {jellyfish.map((j, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) groupRefs.current[i] = el;
          }}
        >
          <mesh geometry={bellGeometry} material={bellMaterial} />
          {tentacles.map((t, ti) => (
            <mesh
              key={ti}
              material={tentacleMaterial}
              position={[Math.cos(t.angle) * 0.5, -t.length / 2, Math.sin(t.angle) * 0.5]}
              rotation={[t.offset, 0, 0]}
            >
              <cylinderGeometry args={[0.018, 0.006, t.length, 5, 4, true]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export function SeaLife({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <group>
      <FishSchool isMobile={isMobile} />
      <Jellyfish isMobile={isMobile} />
    </group>
  );
}