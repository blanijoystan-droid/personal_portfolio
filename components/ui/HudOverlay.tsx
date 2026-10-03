'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Compass, Terminal, FileText, Map } from 'lucide-react';
import { soundFx } from '@/lib/soundEffects';

interface HudOverlayProps {
  activeSection: string;
  onOpenMap: () => void;
  onOpenTerminal: () => void;
  onOpenResume: () => void;
}

const SECTION_CODES: Record<string, string> = {
  home: 'CORE-00',
  about: 'BIO-01',
  skills: 'SKL-02',
  projects: 'PRJ-03',
  experience: 'EXP-04',
  achievements: 'ACH-05',
  certifications: 'CRT-06',
  contact: 'COM-07',
};

export function HudOverlay({
  activeSection,
  onOpenMap,
  onOpenTerminal,
  onOpenResume,
}: HudOverlayProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollPercent(Math.min(100, Math.round((window.scrollY / total) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleToggleSound = () => {
    const nextState = soundFx.toggleMute();
    setIsMuted(nextState);
  };

  const nodeCode = SECTION_CODES[activeSection] || 'CORE-00';

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-5 select-none font-mono text-[10px] text-slate-400">
      {/* Top telemetry bar */}
      <div className="flex justify-between items-start gap-4">
        {/* Top-Left: System Telemetry */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#090e18]/80 border border-white/10 backdrop-blur-md text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-cyan-400 font-bold">SYSTEM STATUS:</span> ONLINE
          </div>

          <div className="flex items-center gap-2 px-2.5 py-0.5 text-[9px] text-slate-400 bg-[#090e18]/60 border border-white/5 backdrop-blur-sm rounded w-fit">
            <span>NODE:</span>
            <span className="text-cyan-300 font-bold">{nodeCode}</span>
            <span className="text-slate-400">|</span>
            <span className="hidden sm:inline">ENV:</span>
            <span className="text-slate-300 hidden sm:inline">DEVELOPER-WORLD</span>
          </div>
        </div>

        {/* Top-Right: Quick Shortcuts & Audio */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* System Map Button */}
          <button
            onClick={onOpenMap}
            data-cursor="MAP"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#090e18]/80 hover:bg-cyan-950/80 border border-white/10 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all backdrop-blur-md"
            title="System Map (Constellation Navigation)"
          >
            <Map className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline font-bold">MAP</span>
          </button>

          {/* Terminal Button */}
          <button
            onClick={onOpenTerminal}
            data-cursor="TERM"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#090e18]/80 hover:bg-purple-950/80 border border-white/10 hover:border-purple-500/50 text-slate-300 hover:text-purple-300 transition-all backdrop-blur-md"
            title="Terminal Console (CTRL+K)"
          >
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline font-bold">TERM</span>
            <span className="hidden lg:inline text-[8px] px-1 py-0.5 bg-white/10 rounded text-slate-300">
              ^K
            </span>
          </button>

          {/* Resume Terminal Button */}
          <button
            onClick={onOpenResume}
            data-cursor="RESUME"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#090e18]/80 hover:bg-emerald-950/80 border border-white/10 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 transition-all backdrop-blur-md"
            title="Open Resume Reader"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline font-bold">RESUME</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            data-cursor="AUDIO"
            className="flex items-center justify-center p-1.5 rounded bg-[#090e18]/80 hover:bg-cyan-950/80 border border-white/10 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all backdrop-blur-md"
            title={isMuted ? 'Unmute Sci-Fi Audio FX' : 'Mute Audio FX'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom telemetry bar */}
      <div className="flex justify-between items-end gap-4">
        {/* Bottom-Left: Navigation Hints */}
        <div className="flex flex-col gap-1">
          <div className="px-2.5 py-1 rounded bg-[#090e18]/80 border border-white/10 backdrop-blur-md text-cyan-300 flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            <span className="font-semibold text-[9px] tracking-wider uppercase">
              {isMobile ? 'SWIPE TO EXPLORE • TAP A NODE' : 'DRAG TO EXPLORE • CLICK A NODE'}
            </span>
          </div>

          <div className="text-[8px] text-slate-400 hidden sm:block">
            LATENCY: <span className="text-slate-300">12ms</span> (ILLUSTRATIVE) • BUILD: <span className="text-slate-300">2026.1</span>
          </div>
        </div>

        {/* Bottom-Right: Scroll Progress & Sync */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-[9px] text-slate-400">
            <span>SYNC: {scrollPercent}%</span>
            <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-cyan-400 transition-all duration-150"
                style={{ width: `${scrollPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
