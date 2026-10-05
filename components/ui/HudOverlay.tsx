'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Terminal, FileText, Waves, Anchor } from 'lucide-react';

interface HudOverlayProps {
  activeSection: string;
  onOpenMap: () => void;
  onOpenTerminal: () => void;
  onOpenResume: () => void;
}

const SECTION_LABELS: Record<string, { label: string; code: string; icon: React.ComponentType<{ className?: string }> }> = {
  home: { label: 'SURFACE', code: 'HME', icon: Waves },
  about: { label: 'PROFILE', code: 'ABT', icon: Anchor },
  skills: { label: 'TECH-STACK', code: 'SKL', icon: Anchor },
  projects: { label: 'REEF', code: 'PRJ', icon: Anchor },
  experience: { label: 'VOYAGE', code: 'EXP', icon: Anchor },
  achievements: { label: 'VAULT', code: 'ACH', icon: Anchor },
  certifications: { label: 'CREDS', code: 'CRT', icon: Anchor },
  contact: { label: 'COMMS', code: 'COM', icon: Anchor },
};

export function HudOverlay({
  activeSection,
  onOpenMap,
  onOpenTerminal,
  onOpenResume,
}: HudOverlayProps) {
  const current = SECTION_LABELS[activeSection] || SECTION_LABELS.home;

  return (
    <>
      {/* Top HUD Bar */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-40 ocean-panel-glow border-b border-teal-bright/20 px-4 py-3"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left - System Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-bright animate-biolum" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-teal-bright">SYSTEM ONLINE</span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-deep/50 border border-teal-bright/20">
              <current.icon className="w-3 h-3 text-teal-bright" />
              <span className="font-mono text-[10px] tracking-wider text-white">{current.label}</span>
              <span className="font-mono text-[10px] text-teal-bright/60">{'// ' + current.code}</span>
            </div>
          </div>

          {/* Center - Depth/Pressure */}
          <div className="hidden lg:flex items-center gap-6 font-mono text-[10px] text-slate-400">
            <div className="flex items-center gap-1">
              <span className="text-teal-bright">DEPTH:</span>
              <span className="text-white font-medium">2,847M</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-coral">PRESSURE:</span>
              <span className="text-white font-medium">284 ATM</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-aqua">TEMP:</span>
              <span className="text-white font-medium">2.1°C</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-teal-bright">SALINITY:</span>
              <span className="text-white font-medium">35.2 PSU</span>
            </div>
          </div>

          {/* Right - Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMap}
              className="ocean-pill px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium tracking-wider flex items-center gap-1.5 hover:bg-teal-bright/10 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              NAV
            </button>
            <button
              onClick={onOpenTerminal}
              className="ocean-pill px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium tracking-wider flex items-center gap-1.5 hover:bg-teal-bright/10 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              TERM
            </button>
            <button
              onClick={onOpenResume}
              className="ocean-pill px-3 py-1.5 rounded-xl text-[10px] font-mono font-medium tracking-wider flex items-center gap-1.5 hover:bg-teal-bright/10 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              LOG
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bottom Progress/Section Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="fixed bottom-0 left-0 right-0 z-40 ocean-panel-glow border-t border-teal-bright/20 px-4 py-2"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] tracking-widest uppercase text-teal-bright/70">
              CURRENT SECTOR
            </span>
            <span className="font-mono text-[9px] tracking-widest text-teal-bright">
              {current.label + ' // ' + current.code}
            </span>
          </div>
          <div className="h-1.5 bg-ocean-deep/50 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-teal-bright via-aqua to-biolum"
              style={{ width: '12.5%' }}
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-ocean-deep/50">
              {[12.5, 25, 37.5, 50, 62.5, 75, 87.5].map((pos) => (
                <div key={pos} className="absolute top-0 bottom-0 w-px bg-teal-bright/20" style={{ left: `${pos}%` }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}