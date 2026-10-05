'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Anchor, Code2, Server, Award, ShieldCheck, Mail } from 'lucide-react';
import { soundFx } from '@/lib/soundEffects';

interface FloatingNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'SURFACE', code: 'HME', icon: Waves },
  { id: 'about', label: 'PROFILE', code: 'ABT', icon: Anchor },
  { id: 'skills', label: 'TECH-STACK', code: 'SKL', icon: Code2 },
  { id: 'projects', label: 'REEF', code: 'PRJ', icon: Server },
  { id: 'achievements', label: 'VAULT', code: 'ACH', icon: Award },
  { id: 'certifications', label: 'CREDS', code: 'CRT', icon: ShieldCheck },
  { id: 'contact', label: 'COMMS', code: 'COM', icon: Mail },
];

export function FloatingNav({ activeSection, onNavigate }: FloatingNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40"
      aria-label="Main navigation"
    >
      <div className="ocean-panel-glow rounded-2xl px-3 py-2 flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                soundFx.playClick();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-br from-teal-bright/20 to-aqua/10 text-teal-bright'
                  : 'text-slate-400 hover:text-teal-bright hover:bg-teal-bright/5'
              }`}
              aria-current={isActive ? 'true' : 'false'}
              aria-label={item.label}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-br from-teal-bright to-aqua text-ocean-deep'
                  : 'bg-ocean-mid/50 text-slate-400 group-hover:bg-teal-bright/10 group-hover:text-teal-bright'
              }`}>
                <Icon className={isActive ? 'w-4 h-4' : 'w-4 h-4'} />
              </div>
              
              <span className="font-mono text-[9px] tracking-widest uppercase hidden sm:block">
                {item.code}
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-teal-bright to-aqua rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}