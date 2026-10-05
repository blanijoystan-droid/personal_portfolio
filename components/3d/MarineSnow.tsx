'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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

export function MarineSnow({
  count = 2000,
  isMobile = false,
  depth = 60,
}: {
  count?: number;
  isMobile?: boolean;
  depth?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const total = isMobile ? Math.floor(count * 0.4) : count;

  const data = useMemo(() => {
    const rand = mulberry32(total * 7 + depth * 13);

    const randFloat = (min: number, max: number) => min + rand() * (max - min);
    const randSpread = (range: number) => rand() * range - range / 2;

    const positions = new Float32Array(total * 3);
    const colors = new Float32Array(total * 3);
    const sizes = new Float32Array(total);
    const kinds = new Float32Array(total);
    const speeds = new Float32Array(total);
    const phases = new Float32Array(total);

    for (let i = 0; i < total; i++) {
      const roll = rand();
      const kind = roll < 0.56 ? 0 : roll < 0.78 ? 1 : roll < 0.96 ? 2 : 3;
      kinds[i] = kind;

      const radius = randFloat(5, depth);
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(randSpread(2));

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      let chosenColor = new THREE.Color('#9fc4cf');
      let size = 0;
      const velocity = randFloat(0.01, 0.14);

      switch (kinds[i]) {
        case 0:
          chosenColor = new THREE.Color('#9fc4cf');
          size = randFloat(0.016, 0.055);
          break;
        case 1:
          chosenColor = new THREE.Color('#6f8f9b');
          size = randFloat(0.02, 0.05);
          break;
        case 2:
          const plankRand = rand();
          if (plankRand > 0.6) chosenColor = new THREE.Color('#00c9cc');
          else if (plankRand > 0.3) chosenColor = new THREE.Color('#00fff7');
          else chosenColor = new THREE.Color('#00d4ff');
          size = randFloat(0.015, 0.04);
          break;
        case 3:
          chosenColor = new THREE.Color('#c8fffb');
          size = randFloat(0.02, 0.045);
          break;
      }

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
      sizes[i] = size;
      speeds[i] = velocity;
      phases[i] = randFloat(0, Math.PI * 2);
    }

    return { positions, colors, sizes, kinds, speeds, phases };
  }, [total, depth]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(data.colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(data.sizes, 1));
    geo.setAttribute('aKind', new THREE.BufferAttribute(data.kinds, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(data.speeds, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(data.phases, 1));
    return geo;
  }, [data]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 1,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const attr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    const step = Math.min(delta, 0.05);
    const floor = -depth;

    for (let i = 0; i < total; i++) {
      const kind = data.kinds[i];
      const speed = data.speeds[i];
      const phase = data.phases[i];

      if (kind === 0 || kind === 1) {
        arr[i * 3 + 1] -= speed * step;
        arr[i * 3] += Math.sin(t * 0.11 + phase) * 0.006;
        arr[i * 3 + 2] += Math.cos(t * 0.09 + phase) * 0.005;
        if (arr[i * 3 + 1] < floor) {
          arr[i * 3 + 1] = 14;
          arr[i * 3] = THREE.MathUtils.randFloatSpread(74);
          arr[i * 3 + 2] = THREE.MathUtils.randFloatSpread(74);
        }
      } else {
        const drift = speed * step;
        arr[i * 3 + 1] += Math.sin(t * 0.16 + phase) * drift;
        arr[i * 3] += Math.cos(t * 0.13 + phase) * drift * 0.7;
        arr[i * 3 + 2] += Math.sin(t * 0.19 + phase) * drift * 0.8;
        if (arr[i * 3 + 1] > 14) arr[i * 3 + 1] = floor;
        if (arr[i * 3 + 1] < -depth) arr[i * 3 + 1] = 14;
      }
    }
    attr.needsUpdate = true;
    pointsRef.current.rotation.y = Math.sin(t * 0.017) * 0.05;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} renderOrder={1} />;
}
