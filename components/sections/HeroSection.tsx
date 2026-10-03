'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Layers, Zap } from 'lucide-react';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { soundFx } from '@/lib/soundEffects';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const textVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const handleExplore = () => {
    soundFx.playWarp();
    onNavigate('about');
    document.getElementById('section-about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProjects = () => {
    soundFx.playClick();
    onNavigate('projects');
    document.getElementById('section-projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="section-home"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-10 pointer-events-none"
      aria-label="Hero — Blani Joystan D'Cunha"
    >
      {/* Status badge */}
      <motion.div
        custom={0.1}
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="pointer-events-auto mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase font-semibold"
          style={{
            background: 'rgba(16, 185, 129, 0.10)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34d399',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {PERSONAL_INFO.availabilityStatus}
        </div>
      </motion.div>

      {/* System coordinate label */}
      <motion.div
        custom={0.2}
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="font-mono text-[10px] tracking-[0.4em] text-slate-400 uppercase mb-4"
      >
        NODE: CORE-00 // BLANI DIGITAL UNIVERSE
      </motion.div>

      {/* Main Name */}
      <motion.h1
        custom={0.35}
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-4"
        style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
      >
        <span className="text-white">BLANI JOYSTAN</span>
        <br />
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(90deg, #00f0ff 0%, #3b82f6 50%, #8b5cf6 100%)' }}
        >
          D&apos;CUNHA
        </span>
      </motion.h1>

      {/* Title */}
      <motion.p
        custom={0.5}
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="font-mono text-[13px] sm:text-sm tracking-widest text-slate-300 mb-5 flex items-center justify-center gap-3 flex-wrap"
      >
        <span>{PERSONAL_INFO.title}</span>
        <span className="text-cyan-500">•</span>
        <span>{PERSONAL_INFO.subtitle}</span>
      </motion.p>

      {/* Statement */}
      <motion.p
        custom={0.65}
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="max-w-xl text-slate-300 text-base sm:text-[17px] leading-relaxed mb-10 mx-auto"
        style={{ fontFamily: 'var(--font-geist-sans)' }}
      >
        &ldquo;{PERSONAL_INFO.statement}&rdquo;
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        custom={0.8}
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="pointer-events-auto flex flex-col sm:flex-row items-center gap-3"
      >
        <button
          onClick={handleExplore}
          data-cursor="EXPLORE"
          aria-label="Explore my world"
          className="group relative flex items-center gap-2.5 px-6 py-3 rounded-lg font-mono text-sm font-bold tracking-wider text-[#04060a] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          style={{ background: 'linear-gradient(90deg, #00f0ff, #3b82f6)' }}
        >
          <Zap className="w-4 h-4" />
          EXPLORE MY WORLD
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={handleProjects}
          data-cursor="VIEW"
          aria-label="View projects"
          className="flex items-center gap-2.5 px-6 py-3 rounded-lg font-mono text-sm font-bold tracking-wider text-slate-200 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0, 240, 255, 0.4)';
            (e.currentTarget as HTMLButtonElement).style.color = '#00f0ff';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.15)';
            (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0';
          }}
        >
          <Layers className="w-4 h-4" />
          VIEW PROJECTS
        </button>
      </motion.div>

      {/* Philosophy */}
      <motion.div
        custom={0.95}
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="mt-12 font-mono text-[10px] tracking-[0.35em] text-slate-500 uppercase"
      >
        {PERSONAL_INFO.philosophy}
      </motion.div>

      {/* Scroll down hint */}
      <motion.div
        custom={1.1}
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <div className="h-8 w-px bg-gradient-to-b from-transparent to-cyan-400/60" />
        <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase">SCROLL TO BEGIN</span>
      </motion.div>
    </section>
  );
}
