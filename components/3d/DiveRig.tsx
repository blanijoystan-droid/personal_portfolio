'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { DEPTH_ZONES, lerpZone, type DepthZone } from '@/lib/depthZones';

interface DiveRigProps {
  progress: number;
  isReducedMotion?: boolean;
  onZoneChange?: (zone: DepthZone) => void;
}

export function DiveRig({ progress, isReducedMotion = false, onZoneChange }: DiveRigProps) {
  const { camera, scene } = useThree();

  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);
  const smoothedProgress = useRef(0);
  const lastReported = useRef<DepthZone | null>(null);

  const keyLight = useMemo(() => new THREE.DirectionalLight('#cdeef5', 2.5), []);
  const ambientLight = useMemo(() => new THREE.AmbientLight('#5fb8cf', 0.85), []);
  const fillLight = useMemo(() => new THREE.HemisphereLight('#8fe4f0', '#124a5c', 1.1), []);
  const biolumLight = useMemo(() => new THREE.PointLight('#3fd6cf', 22, 80, 2), []);

  useEffect(() => {
    scene.add(keyLight, ambientLight, fillLight, biolumLight);
    return () => {
      scene.remove(keyLight, ambientLight, fillLight, biolumLight);
    };
  }, [scene, keyLight, ambientLight, fillLight, biolumLight]);

  /* eslint-disable react-hooks/immutability */
  useEffect(() => {
    scene.fog = new THREE.Fog('#1d6f8c', 16, 150);
    scene.background = new THREE.Color('#04121f');
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  /* eslint-enable react-hooks/immutability */

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [scene, pointer]);

  const cWater = useMemo(() => new THREE.Color(), []);
  const cKey = useMemo(() => new THREE.Color(), []);
  const cAmbient = useMemo(() => new THREE.Color(), []);
  const cFill = useMemo(() => new THREE.Color(), []);
  const fillGround = useMemo(() => new THREE.Color(), []);

  /* eslint-disable react-hooks/immutability */
  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    const easing = isReducedMotion ? 1 : 1 - Math.pow(0.0016, step);
    smoothedProgress.current += (progress - smoothedProgress.current) * easing;

    const p = THREE.MathUtils.clamp(smoothedProgress.current, 0, 1);

    const scaled = p * (DEPTH_ZONES.length - 1);
    const index = Math.min(Math.floor(scaled), DEPTH_ZONES.length - 2);
    const localT = THREE.MathUtils.clamp(scaled - index, 0, 1);
    const zone = lerpZone(DEPTH_ZONES[index]!, DEPTH_ZONES[index + 1]!, localT);

    const drift = isReducedMotion ? 0 : 1;

    const driftX = Math.sin(t * 0.11) * 1.5 * drift;
    const driftY = Math.sin(t * 0.08 + 1.1) * 0.9 * drift;
    const driftZ = Math.cos(t * 0.07) * 1.1 * drift;

    const parallaxX = pointer.x * 2.1 * drift;
    const parallaxY = -pointer.y * 1.5 * drift;

    targetPos.set(
      driftX + parallaxX,
      zone.cameraY + driftY + parallaxY,
      zone.cameraZ + driftZ
    );
    camera.position.lerp(targetPos, isReducedMotion ? 1 : 0.06);

    targetLook.set(
      pointer.x * 2.6 * drift + Math.sin(t * 0.09) * 1.4 * drift,
      zone.cameraY - 7 + parallaxY * 1.2,
      0
    );
    camera.lookAt(targetLook);

    camera.rotation.z += Math.sin(t * 0.06) * 0.022 * drift;

    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      fog.color.lerp(cWater.set(zone.water), 0.05);
      fog.near = THREE.MathUtils.lerp(fog.near, zone.fogNear, 0.05);
      fog.far = THREE.MathUtils.lerp(fog.far, zone.fogFar, 0.05);
    }

    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(cWater.set(zone.water).multiplyScalar(0.42), 0.05);
    }

    keyLight.color.lerp(cKey.set(zone.keyColor), 0.05);
    keyLight.intensity = THREE.MathUtils.lerp(keyLight.intensity, zone.keyIntensity, 0.05);
    ambientLight.color.lerp(cAmbient.set(zone.ambientColor), 0.05);
    ambientLight.intensity = THREE.MathUtils.lerp(ambientLight.intensity, zone.ambientIntensity, 0.05);
    fillLight.color.lerp(cFill.set(zone.fillColor), 0.05);
    fillLight.groundColor.lerp(fillGround.set(zone.fillGround), 0.05);
    fillLight.intensity = THREE.MathUtils.lerp(fillLight.intensity, zone.fillIntensity, 0.05);

    if (onZoneChange && lastReported.current?.id !== zone.id) {
      lastReported.current = zone;
      onZoneChange(zone);
    }
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <primitive object={keyLight} />
      <primitive object={ambientLight} />
      <primitive object={fillLight} />
      <primitive object={biolumLight} position={[0, -40, 18]} />
    </>
  );
}
