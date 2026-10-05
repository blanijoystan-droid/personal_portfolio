'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DEPTH_ZONES, type DepthZone } from '@/lib/depthZones';

interface DepthMeterProps {
  zone: DepthZone;
  /** 0..1 progress through the whole dive. */
  progress: number;
}

/**
 * DepthMeter — the live readout that makes the descent legible.
 *
 * Shows the current depth counting down toward the abyss, the zone name, and a
 * vertical gauge that fills as the visitor descends. This is the one place a
 * "technical label" is genuinely useful: it tells you where you are in a world
 * that has no visible horizon.
 */
export function DepthMeter({ zone, progress }: DepthMeterProps) {
  const maxDepth = DEPTH_ZONES[DEPTH_ZONES.length - 1]?.depth ?? 890;

  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex">
      {/* Depth number */}
      <div className="text-right">
        <div className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-[#7fd9d6]/50">
          Depth
        </div>
        <motion.div
          key={zone.depth}
          initial={{ opacity: 0.4, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="font-mono text-2xl font-light tabular-nums tracking-tight text-[#d6f7f4]"
        >
          {Math.round(zone.depth)}
          <span className="ml-1 text-xs text-[#7fb8bd]/70">M</span>
        </motion.div>
        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#8fd8d4]/80">
          {zone.zone}
        </div>
      </div>

      {/* Vertical gauge */}
      <div className="relative h-40 w-px bg-[#2f6a72]/40">
        <motion.div
          className="absolute left-0 top-0 w-px origin-top bg-gradient-to-b from-[#9ff2ec] to-[#3d8f96]"
          style={{ height: '100%' }}
          animate={{ scaleY: progress }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        {/* Zone ticks */}
        {DEPTH_ZONES.map((z) => (
          <span
            key={z.id}
            className={`absolute -right-1 h-1.5 w-1.5 rounded-full border transition-colors duration-500 ${
              z.id === zone.id
                ? 'border-[#9ff2ec] bg-[#9ff2ec]'
                : 'border-[#3d7f88] bg-transparent'
            }`}
            style={{ top: `${(z.depth / maxDepth) * 100}%` }}
          />
        ))}
      </div>

      {/* Descent hint on the first zone only */}
      {zone.id === 'home' && (
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#6fa9b0]/70 [writing-mode:vertical-rl]">
          Descend
        </span>
      )}
    </div>
  );
}

/**
 * DiveStrip — a compact depth band for small screens, where the vertical
 * gauge would eat too much width.
 */
export function DiveStrip({ zone, progress }: DepthMeterProps) {
  const maxDepth = DEPTH_ZONES[DEPTH_ZONES.length - 1]?.depth ?? 890;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 lg:hidden">
      <div className="mx-3 mt-3 flex items-center gap-3 rounded-full border border-[#6fd0cc]/12 bg-[#04121f]/70 px-3 py-1.5 backdrop-blur-xl">
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#7fd9d6]/70">
          {zone.zone}
        </span>
        <span className="relative h-px flex-1 bg-[#2f6a72]/50">
          <span
            className="absolute left-0 top-0 h-px bg-gradient-to-r from-[#9ff2ec] to-[#3d8f96] transition-[width] duration-500 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
          {DEPTH_ZONES.map((z) => (
            <span
              key={z.id}
              className={`absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full ${
                z.id === zone.id ? 'bg-[#9ff2ec]' : 'bg-[#3d7f88]'
              }`}
              style={{ left: `${(z.depth / maxDepth) * 100}%` }}
            />
          ))}
        </span>
        <span className="font-mono text-[10px] tabular-nums text-[#d6f7f4]">
          {Math.round(zone.depth)}M
        </span>
      </div>
    </div>
  );
}
