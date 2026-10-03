'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  activeSection: string;
  isReducedMotion?: boolean;
}

const SECTION_CAMERAS: Record<string, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
  home: { pos: [0, 0, 7.5], lookAt: [0, 0, 0] },
  about: { pos: [-2.8, 1.2, 5.0], lookAt: [-4.6, 2.0, -1.5] },
  skills: { pos: [-3.2, -1.0, 5.5], lookAt: [-5.6, -1.8, 2.5] },
  projects: { pos: [3.2, 1.2, 5.5], lookAt: [5.2, 1.8, 2.0] },
  experience: { pos: [2.8, -1.8, 4.5], lookAt: [4.6, -2.8, -2.5] },
  achievements: { pos: [0.0, 2.8, 5.8], lookAt: [0.0, 4.4, 2.2] },
  certifications: { pos: [-2.2, -2.5, 4.8], lookAt: [-3.8, -4.2, 1.0] },
  contact: { pos: [0.0, -3.2, 4.5], lookAt: [0.0, -4.8, -2.2] },
};

export function CameraRig({ activeSection, isReducedMotion = false }: CameraRigProps) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, _delta) => {
    const target = SECTION_CAMERAS[activeSection] || SECTION_CAMERAS.home;
    const targetPos = new THREE.Vector3(...target.pos);
    const targetLookAt = new THREE.Vector3(...target.lookAt);

    if (!isReducedMotion) {
      // Add subtle mouse parallax
      targetPos.x += state.pointer.x * 0.45;
      targetPos.y += state.pointer.y * 0.35;
    }

    // Smooth lerp camera position
    const lerpFactor = isReducedMotion ? 0.2 : 0.045;
    camera.position.lerp(targetPos, lerpFactor);

    // Smooth lerp lookAt target
    currentLookAt.current.lerp(targetLookAt, lerpFactor);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
