'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OceanSurface } from './OceanSurface';
import { LightShafts } from './LightShafts';
import { Seafloor } from './Seafloor';
import { MarineSnow } from './MarineSnow';
import { SeaLife } from './SeaLife';
import { ThePearl } from './ThePearl';
import { TheFacility } from './TheFacility';
import { TheWreck } from './TheWreck';
import { TreasureReef } from './TreasureReef';
import { TheArchive } from './TheArchive';
import { TheBeacon } from './TheBeacon';
import { DiveRig } from './DiveRig';
import type { DepthZone } from '@/lib/depthZones';

interface SceneCanvasProps {
  /** 0..1 scroll progress through the document. */
  progress: number;
  onSelectPearl?: () => void;
  onZoneChange?: (zone: DepthZone) => void;
}

function checkWebGL(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

function checkMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function SceneCanvas({
  progress,
  onSelectPearl,
  onZoneChange,
}: SceneCanvasProps) {
  const [hasWebGL] = useState<boolean>(checkWebGL);
  const [isMobile, setIsMobile] = useState<boolean>(checkMobile);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(checkReducedMotion);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    media.addEventListener('change', onMotionChange);

    return () => {
      window.removeEventListener('resize', onResize);
      media.removeEventListener('change', onMotionChange);
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className="fixed inset-0 z-0 bg-ocean-deep" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#124a5e_0%,#04121f_55%,#01070d_100%)]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 9.5, 12], fov: 55, near: 0.1, far: 400 }}
        dpr={isMobile ? [1, 1.35] : [1, 1.75]}
        gl={{
          antialias: !isMobile,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
      >
        <Suspense fallback={null}>
          {/* The dive: camera, fog and all three lights come from here. */}
          <DiveRig
            progress={progress}
            isReducedMotion={isReducedMotion}
            onZoneChange={onZoneChange}
          />

          {/* Surface and the light coming through it. */}
          <OceanSurface isMobile={isMobile} />
          <LightShafts isMobile={isMobile} />

          {/* The world itself. */}
          <Seafloor isMobile={isMobile} />

          {/* Section environments, spread across the descent. */}
          <ThePearl onSelect={onSelectPearl} />
          <TheFacility isMobile={isMobile} />
          <TheWreck isMobile={isMobile} />
          <TreasureReef isMobile={isMobile} />
          <TheArchive isMobile={isMobile} />
          <TheBeacon isMobile={isMobile} />

          {/* Life and particulate. */}
          <SeaLife isMobile={isMobile} />
          <MarineSnow isMobile={isMobile} count={isMobile ? 900 : 2400} />
        </Suspense>
      </Canvas>
    </div>
  );
}
