'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CentralCore } from './CentralCore';
import { FloatingNodes } from './FloatingNodes';
import { ParticleField } from './ParticleField';
import { CameraRig } from './CameraRig';

interface SceneCanvasProps {
  activeSection: string;
  onSelectNode: (nodeId: string) => void;
  hoveredNode: string | null;
  setHoveredNode: (node: string | null) => void;
}

// Lazy initializers to avoid setState in effect
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
  activeSection,
  onSelectNode,
  hoveredNode,
  setHoveredNode,
}: SceneCanvasProps) {
  const [hasWebGL] = useState<boolean>(checkWebGL);
  const [isMobile, setIsMobile] = useState<boolean>(checkMobile);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(checkReducedMotion);

  useEffect(() => {
    // Check Mobile
    const checkMobileResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobileResize);

    // Check Reduced Motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', checkMobileResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  if (!hasWebGL) {
    // Elegant 2D Fallback if WebGL is disabled or unsupported
    return (
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#04060a] bg-tech-grid flex items-center justify-center pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse" />
        <div className="absolute w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[80px]" />
        
        {/* Central Core Fallback Emblem */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-48 h-48 rounded-full border border-cyan-500/30 flex items-center justify-center p-4 relative">
            <div className="w-36 h-36 rounded-full border border-dashed border-cyan-400/40 animate-spin" style={{ animationDuration: '30s' }} />
            <div className="absolute w-20 h-20 rounded-full bg-cyan-950/80 border border-cyan-400 flex items-center justify-center">
              <span className="font-mono text-xs text-cyan-300 font-bold">CORE-00</span>
            </div>
          </div>
          <p className="font-mono text-xs text-slate-400 mt-4 tracking-widest uppercase">
            2D SYSTEM MODE ACTIVE
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
      >
        <Suspense fallback={null}>
          {/* Atmospheric Lighting */}
          <fog attach="fog" args={['#04060a', 6, 26]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} color="#00f0ff" intensity={4} distance={12} />
          <directionalLight position={[10, 10, 5]} color="#38bdf8" intensity={0.8} />
          <directionalLight position={[-10, -10, -5]} color="#818cf8" intensity={0.6} />

          {/* Core Universe Entities */}
          <CentralCore
            hoveredNode={hoveredNode}
            setHoveredNode={setHoveredNode}
            onNodeClick={onSelectNode}
          />
          <FloatingNodes
            activeSection={activeSection}
            onSelectNode={onSelectNode}
            hoveredNode={hoveredNode}
            setHoveredNode={setHoveredNode}
          />
          <ParticleField isMobile={isMobile} />
          <CameraRig activeSection={activeSection} isReducedMotion={isReducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
