'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * OceanSurface — the ceiling of the world.
 * A large translucent plane seen from below, with animated caustic light
 * patterns and a subtle rippling normal displacement. It gives the visitor
 * the sense of having just descended beneath the surface.
 */
export function OceanSurface({
  isMobile = false,
  y = 14,
  size = 260,
}: {
  isMobile?: boolean;
  y?: number;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const segments = isMobile ? 32 : 72;

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(Math.PI / 2); // face downward, toward the diver
    return geo;
  }, [size, segments]);

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0a4a63'),
      transparent: true,
      opacity: 0.32,
      roughness: 0.12,
      metalness: 0.0,
      transmission: 0.75,
      thickness: 0.4,
      ior: 1.33,
      side: THREE.DoubleSide,
      depthWrite: false,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });
    return mat;
  }, []);

  const onBeforeCompile = useMemo(() => {
    return (shader: { uniforms: Record<string, { value: number }>; vertexShader: string; fragmentShader: string }) => {
      shader.uniforms.uTime = { value: 0 };

      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
         uniform float uTime;
         varying vec2 vSurfaceUv;
         varying float vWave;`
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         float wave =
           sin(position.x * 0.055 + uTime * 0.55) * 0.42 +
           sin(position.z * 0.041 - uTime * 0.42) * 0.34 +
           sin((position.x + position.z) * 0.021 + uTime * 0.24) * 0.24;
         transformed.y += wave;
         vWave = wave;
         vSurfaceUv = uv;`
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
         uniform float uTime;
         varying vec2 vSurfaceUv;
         varying float vWave;

         float causticLayer(vec2 p, float t) {
           vec2 i = p;
           float c = 1.0;
           float inten = 0.0045;
           for (int n = 0; n < 3; n++) {
             float tt = t * (1.0 - (3.5 / float(n + 1)));
             i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
             c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
           }
           c /= 3.0;
           c = 1.17 - pow(c, 1.4);
           return clamp(pow(abs(c), 8.0), 0.0, 1.0);
         }`
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
         float caustic = causticLayer(vSurfaceUv * 26.0, uTime * 0.42);
         caustic += causticLayer(vSurfaceUv * 13.0 + 4.7, uTime * 0.28) * 0.7;
         vec3 sunlight = vec3(0.42, 0.78, 0.86);
         gl_FragColor.rgb += sunlight * caustic * 0.85;
         gl_FragColor.a = clamp(gl_FragColor.a + caustic * 0.28, 0.0, 1.0);`
      );
    };
  }, []);

  useFrame((state) => {
    const shader = (meshRef.current?.material as THREE.MeshPhysicalMaterial & { userData: Record<string, unknown> } | undefined)?.userData?.shader as
      | { uniforms: { uTime: { value: number } } }
      | undefined;
    if (shader) {
      shader.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (meshRef.current) {
      meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.05) * 2.2;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, y, 0]}
      onUpdate={(self) => {
        const mat = self.material as THREE.MeshPhysicalMaterial & { onBeforeCompile?: typeof onBeforeCompile };
        mat.onBeforeCompile = onBeforeCompile;
        mat.needsUpdate = true;
      }}
      renderOrder={-1}
    />
  );
}