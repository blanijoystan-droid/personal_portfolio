'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowDown, Compass, Layers } from 'lucide-react';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { getZone } from '@/lib/depthZones';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const SURFACE = getZone('home');

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const handleExplore = () => {
    onNavigate('about');
    document.getElementById('section-about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProjects = () => {
    onNavigate('projects');
    document.getElementById('section-projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="section-home"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-24 text-center"
      aria-label="Surface — Blani Joystan Dcunha"
    >
      {/* Availability — quiet, not a badge shouting for attention */}
      <motion.div
        custom={0.2}
        initial="hidden"
        animate="visible"
        variants={rise}
        className="mb-10"
      >
        <p className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-[#a8e4e0] uppercase">
          <span className="h-1 w-1 rounded-full bg-[#8fe8e2] shadow-[0_0_8px_rgba(143,232,226,0.9)]" />
          {PERSONAL_INFO.availabilityStatus}
        </p>
      </motion.div>

      {/* Name — the only genuinely large type on the page */}
      <motion.h1
        custom={0.5}
        initial="hidden"
        animate="visible"
        variants={rise}
        className="mb-7 text-5xl leading-[1.05] font-light tracking-tight text-balance sm:text-6xl md:text-7xl"
      >
        <span className="block text-[#f2fbfa]">BLANI JOYSTAN</span>
        <span className="block text-[#cfe9e6]">DCUNHA</span>
      </motion.h1>

      {/* Role */}
      <motion.p
        custom={0.8}
        initial="hidden"
        animate="visible"
        variants={rise}
        className="mb-6 flex flex-wrap items-center justify-center gap-3 font-mono text-[13px] tracking-[0.12em] text-[#9fd8d4] uppercase"
      >
        <span>{PERSONAL_INFO.title}</span>
        <span className="text-[#4f8a91]">·</span>
        <span>{PERSONAL_INFO.subtitle}</span>
      </motion.p>

      {/* Statement */}
      <motion.p
        custom={1.05}
        initial="hidden"
        animate="visible"
        variants={rise}
        className="mx-auto mb-12 max-w-xl text-[17px] leading-relaxed text-[#d8ecea] text-balance"
      >
        {PERSONAL_INFO.statement}
      </motion.p>

      {/* Actions */}
      <motion.div
        custom={1.3}
        initial="hidden"
        animate="visible"
        variants={rise}
        className="flex flex-col items-center gap-3 sm:flex-row"
      >
        <button
          onClick={handleExplore}
          className="group inline-flex items-center gap-2.5 rounded-full bg-[#d6f7f4] px-7 py-3.5 font-mono text-[13px] font-medium tracking-[0.12em] text-[#032029] transition-all duration-500 hover:bg-white hover:shadow-[0_0_40px_-8px_rgba(214,247,244,0.45)] focus-visible:ring-2 focus-visible:ring-[#9ff2ec]"
        >
          <Compass className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-12" />
          Begin the descent
        </button>

        <button
          onClick={handleProjects}
          className="glass-soft inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-mono text-[13px] tracking-[0.12em] text-[#cfe9e6] focus-visible:ring-2 focus-visible:ring-[#9ff2ec]"
        >
          <Layers className="h-4 w-4" />
          View projects
        </button>
      </motion.div>

      {/* Philosophy */}
      <motion.p
        custom={1.55}
        initial="hidden"
        animate="visible"
        variants={rise}
        className="mt-16 max-w-md font-mono text-[11px] leading-relaxed tracking-[0.14em] text-[#7fb8bd] uppercase"
      >
        {PERSONAL_INFO.philosophy}
      </motion.p>

      {/* Descent cue */}
      <motion.button
        custom={1.9}
        initial="hidden"
        animate="visible"
        variants={rise}
        onClick={handleExplore}
        className="group absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5"
        aria-label="Scroll to continue the descent"
      >
        <span className="font-mono text-[10px] tracking-[0.28em] text-[#7fb8bd] uppercase transition-colors duration-500 group-hover:text-[#9fd8d4]">
          Descend
        </span>
        <motion.span
          animate={{ y: [0, 7, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-4 w-4 text-[#8fd8d4]" />
        </motion.span>
        <span className="font-mono text-[9px] tracking-[0.2em] text-[#5f9ca3] uppercase">
          {SURFACE.depth} M
        </span>
      </motion.button>
    </section>
  );
}
