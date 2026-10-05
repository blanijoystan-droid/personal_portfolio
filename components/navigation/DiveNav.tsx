'use client';

import React from 'react';
import { DEPTH_ZONES, type SectionId } from '@/lib/depthZones';

interface DiveNavProps {
  activeSection: SectionId;
  onNavigate: (section: string) => void;
}

/**
 * DiveNav — the expedition interface.
 *
 * A single thin rail rather than a dashboard: the current zone name, and a
 * column of zone markers that read as depth ticks on a dive gauge. Selecting a
 * marker surfaces to that part of the ocean.
 */
export function DiveNav({ activeSection, onNavigate }: DiveNavProps) {
  const activeIndex = Math.max(
    DEPTH_ZONES.findIndex((z) => z.id === activeSection),
    0
  );

  return (
    <nav
      aria-label="Expedition zones"
      className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 md:block"
    >
      <div className="flex flex-col items-center gap-1">
        <span className="mb-2 font-mono text-[9px] tracking-[0.34em] uppercase text-[#7fd9d6]/50 [writing-mode:vertical-rl]">
          Expedition
        </span>

        {DEPTH_ZONES.map((zone, index) => {
          const isActive = zone.id === activeSection;
          const isPassed = index < activeIndex;

          return (
            <button
              key={zone.id}
              onClick={() => onNavigate(zone.id)}
              aria-current={isActive ? 'true' : undefined}
              className="group relative flex items-center gap-3 py-1.5 pl-1 pr-2"
            >
              {/* Depth tick */}
              <span
                className={`block rounded-full transition-all duration-500 ${
                  isActive
                    ? 'h-2.5 w-2.5 bg-[#9ff2ec] shadow-[0_0_12px_rgba(159,242,236,0.7)]'
                    : isPassed
                      ? 'h-1.5 w-1.5 bg-[#5aa8ab]/70'
                      : 'h-1.5 w-1.5 bg-[#2f6a72]/70 group-hover:bg-[#6fc3c6]'
                }`}
              />

              {/* Zone label, revealed on hover or when active */}
              <span
                className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-300 ${
                  isActive
                    ? 'text-[#c9f6f2] opacity-100'
                    : 'text-[#7fb8bd]/70 opacity-0 group-hover:opacity-100'
                }`}
              >
                {zone.zone}
              </span>

              {/* Depth readout */}
              <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap font-mono text-[9px] text-[#6fa9b0] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {zone.depth} M
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * MobileZoneBar — the same expedition control, flattened for small screens.
 * A slim horizontal strip of dots with the active zone name.
 */
export function MobileZoneBar({
  activeSection,
  onNavigate,
}: DiveNavProps) {
  const activeIndex = Math.max(
    DEPTH_ZONES.findIndex((z) => z.id === activeSection),
    0
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="mx-3 mb-3 rounded-2xl border border-[#6fd0cc]/15 bg-[#04121f]/85 px-3 py-2 backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#8fd8d4]">
            {DEPTH_ZONES[activeIndex]?.zone}
          </span>
          <span className="font-mono text-[9px] text-[#6fa9b0]">
            {DEPTH_ZONES[activeIndex]?.depth} M
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {DEPTH_ZONES.map((zone, index) => (
            <button
              key={zone.id}
              onClick={() => onNavigate(zone.id)}
              aria-label={`Go to ${zone.zone}`}
              aria-current={zone.id === activeSection ? 'true' : undefined}
              className="group h-6 flex-1"
            >
              <span
                className={`mx-auto block rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'h-1.5 w-full bg-[#9ff2ec]'
                    : 'h-1 w-full bg-[#2f6a72] group-hover:bg-[#6fc3c6]'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
