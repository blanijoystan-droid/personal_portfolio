'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { soundFx } from '@/lib/soundEffects';

interface NavItem {
  id: string;
  label: string;
  code: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',           label: 'HOME',           code: 'C-00' },
  { id: 'about',          label: 'ABOUT',          code: 'B-01' },
  { id: 'skills',         label: 'SKILLS',         code: 'S-02' },
  { id: 'projects',       label: 'PROJECTS',       code: 'P-03' },
  { id: 'experience',     label: 'EXPERIENCE',     code: 'E-04' },
  { id: 'achievements',   label: 'ACHIEVEMENTS',   code: 'A-05' },
  { id: 'contact',        label: 'CONTACT',        code: 'X-07' },
];

interface FloatingNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export function FloatingNav({ activeSection, onNavigate }: FloatingNavProps) {
  const handleClick = (id: string) => {
    soundFx.playClick();
    onNavigate(id);

    // Scroll to section
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      aria-label="Portfolio navigation"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 px-2.5 py-1.5 rounded-full backdrop-blur-xl shadow-xl shadow-black/40"
      style={{
        background: 'rgba(7, 12, 22, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        maxWidth: 'calc(100vw - 280px)', // leave room for HUD buttons
        overflowX: 'auto',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            data-cursor="WARP"
            aria-label={`Navigate to ${item.label}`}
            aria-current={isActive ? 'page' : undefined}
            className="relative flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] tracking-wider font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 whitespace-nowrap"
            style={{
              color: isActive ? '#00f0ff' : '#64748b',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: 'rgba(0, 240, 255, 0.12)', border: '1px solid rgba(0, 240, 255, 0.35)' }}
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              />
            )}

            {isActive && (
              <span
                className="relative z-10 w-1.5 h-1.5 rounded-full bg-cyan-400"
                style={{ boxShadow: '0 0 6px #00f0ff' }}
              />
            )}

            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
