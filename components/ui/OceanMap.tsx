'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Compass, Map as MapIcon } from 'lucide-react';
import { DEPTH_ZONES, type DepthZone, type SectionId } from '@/lib/depthZones';

interface OceanMapProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: SectionId;
  zone: DepthZone;
  onNavigate: (section: string) => void;
}

/**
 * OceanMap — a navigation chart, not a radar.
 *
 * Drawn as a hand-annotated sounding chart: concentric depth contours, a
 * sounding line for each zone with its depth, and the diver's current position
 * marked. Deliberately quiet and paper-like rather than tactical.
 */
export function OceanMap({ isOpen, onClose, activeSection, zone, onNavigate }: OceanMapProps) {
  if (!isOpen) return null;

  const maxDepth = DEPTH_ZONES[DEPTH_ZONES.length - 1]?.depth ?? 890;
  // Sounding positions spread across the chart in reading order.
  const positions: Record<string, { x: number; y: number }> = {
    home: { x: 50, y: 12 },
    about: { x: 24, y: 27 },
    skills: { x: 76, y: 30 },
    projects: { x: 82, y: 52 },
    experience: { x: 62, y: 68 },
    achievements: { x: 28, y: 62 },
    certifications: { x: 16, y: 44 },
    contact: { x: 50, y: 88 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020c14]/85 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ocean chart"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-[#6fd0cc]/18 bg-[#04121f]/92"
      >
        {/* Chart header */}
        <div className="flex items-center justify-between border-b border-[#6fd0cc]/12 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#6fd0cc]/25 bg-[#0a2634]">
              <MapIcon className="h-4 w-4 text-[#9ff2ec]" />
            </div>
            <div>
              <h2 className="font-mono text-sm uppercase tracking-[0.24em] text-[#d6f7f4]">
                Sounding Chart
              </h2>
              <p className="mt-0.5 font-mono text-[10px] tracking-[0.18em] text-[#6fa9b0]/70 uppercase">
                Descent from {DEPTH_ZONES[0]?.depth} M to {maxDepth} M
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close chart"
            className="rounded-lg p-2 text-[#7fb8bd] transition-colors hover:bg-[#123444] hover:text-[#d6f7f4]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* The chart itself */}
        <div className="relative aspect-4/5 max-h-[64vh] w-full overflow-hidden sm:aspect-16/10">
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <radialGradient id="chartWater" cx="50%" cy="8%" r="85%">
                <stop offset="0%" stopColor="#0d3d4e" />
                <stop offset="45%" stopColor="#062433" />
                <stop offset="100%" stopColor="#020c14" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#chartWater)" />

            {/* Depth contours */}
            {[0.2, 0.4, 0.6, 0.8, 1].map((f) => (
              <line
                key={`h-${f}`}
                x1="0"
                x2="100%"
                y1={12 + f * 78}
                y2={12 + f * 78}
                stroke="#3d7f88"
                strokeWidth="0.4"
                strokeDasharray={f === 1 ? '0' : '2 3'}
                opacity="0.4"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Sounding line connecting the zones in dive order */}
            <polyline
              points={DEPTH_ZONES.map((z) => {
                const p = positions[z.id];
                return p ? `${p.x},${p.y}` : '';
              }).join(' ')}
              fill="none"
              stroke="#6fd0cc"
              strokeWidth="1"
              strokeDasharray="3 4"
              opacity="0.55"
              vectorEffect="non-scaling-stroke"
            />

            {/* Compass rose */}
            <g transform="translate(88, 14)" opacity="0.4">
              <circle r="9" fill="none" stroke="#6fd0cc" strokeWidth="0.5" />
              <line x1="0" y1="-11" x2="0" y2="11" stroke="#6fd0cc" strokeWidth="0.5" />
              <line x1="-11" y1="0" x2="11" y2="0" stroke="#6fd0cc" strokeWidth="0.5" />
              <text
                x="0"
                y="-12.5"
                textAnchor="middle"
                fontSize="4"
                fill="#9ff2ec"
                fontFamily="monospace"
              >
                N
              </text>
            </g>
          </svg>

          {/* Soundings */}
          {DEPTH_ZONES.map((z) => {
            const p = positions[z.id];
            if (!p) return null;
            const isActive = z.id === activeSection;

            return (
              <button
                key={z.id}
                onClick={() => {
                  onNavigate(z.id);
                  onClose();
                }}
                aria-label={`Descend to ${z.zone}, ${z.depth} metres`}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <span
                  className={`block rounded-full transition-all duration-500 ${
                    isActive
                      ? 'h-3.5 w-3.5 bg-[#9ff2ec] shadow-[0_0_16px_rgba(159,242,236,0.8)]'
                      : 'h-2.5 w-2.5 border border-[#6fd0cc]/60 bg-[#04121f] group-hover:border-[#9ff2ec] group-hover:bg-[#9ff2ec]/40'
                  }`}
                />
                <span
                  className={`absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-[0.14em] uppercase transition-colors ${
                    isActive ? 'text-[#d6f7f4]' : 'text-[#7fb8bd] group-hover:text-[#d6f7f4]'
                  }`}
                >
                  {z.zone}
                </span>
                <span className="absolute left-1/2 top-full mt-[22px] -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tabular-nums text-[#6fa9b0]/80">
                  {z.depth} M
                </span>
              </button>
            );
          })}

          {/* Current position */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: '50%', top: `${12 + (zone.depth / maxDepth) * 78}%` }}
          >
            <Compass className="h-4 w-4 animate-pulse text-[#9ff2ec] drop-shadow-[0_0_8px_rgba(159,242,236,0.8)]" />
          </div>
        </div>

        {/* Chart footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#6fd0cc]/12 px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6fa9b0]">
            {zone.zone} — {zone.descriptor}
          </span>
          <span className="font-mono text-[10px] text-[#4f8a91]">
            CTRL+M TO CLOSE · CLICK A SOUNDING TO DIVE
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
