'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { User, Calendar, Target } from 'lucide-react';
import { PERSONAL_INFO, TIMELINE_DATA } from '@/data/portfolioData';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="section-about"
      ref={ref}
      aria-label="About Blani"
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 max-w-5xl mx-auto"
    >
      {/* Section Header */}
      <motion.div
        custom={0}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUp}
        className="flex items-center gap-3 mb-10"
      >
        <span className="w-6 h-px bg-cyan-400" />
        <span className="font-mono text-[11px] tracking-widest text-cyan-400 uppercase">NODE: BIO-01</span>
        <span className="w-6 h-px bg-cyan-400" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left Column — Identity Panel */}
        <div className="flex flex-col gap-5">
          <motion.h2
            custom={0.1}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
          >
            ABOUT <span className="text-cyan-400">SYSTEM</span>
          </motion.h2>

          {/* Holographic Identity Card */}
          <motion.div
            custom={0.2}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="hud-panel-glow rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                <User className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="font-bold text-white text-sm tracking-wide">{PERSONAL_INFO.name}</div>
                <div className="font-mono text-[10px] text-cyan-400 tracking-widest">{PERSONAL_INFO.education.degree}</div>
              </div>
            </div>

            <div className="space-y-2.5 text-sm text-slate-300 leading-relaxed">
              <p>
                I am a CSE student focused on becoming a strong software engineer through
                building real-world systems, solving algorithmic problems and exploring modern technologies.
              </p>
              <p>
                My interests span <span className="text-cyan-300 font-semibold">full-stack development</span>,{' '}
                <span className="text-blue-300 font-semibold">AI & machine learning</span>,{' '}
                <span className="text-purple-300 font-semibold">cloud infrastructure</span>, and{' '}
                <span className="text-emerald-300 font-semibold">distributed backend systems</span>.
              </p>
              <p>
                I enjoy building systems rather than just static projects — every line of code I write
                is oriented toward solving a real problem.
              </p>
            </div>

            {/* Focus Areas */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
              {[
                'Full Stack Development',
                'Backend Engineering',
                'Distributed Systems',
                'AI / Machine Learning',
                'Cloud & DevOps',
                'Problem Solving',
              ].map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full font-mono text-[9px] tracking-wider"
                  style={{
                    background: 'rgba(0, 240, 255, 0.1)',
                    border: '1px solid rgba(0, 240, 255, 0.25)',
                    color: '#67e8f9',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column — Timeline */}
        <div className="flex flex-col gap-4">
          <motion.div
            custom={0.25}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="flex items-center gap-2 mb-2"
          >
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="font-mono text-xs text-slate-400 tracking-wider uppercase">Engineering Timeline</span>
          </motion.div>

          {TIMELINE_DATA.map((entry, index) => (
            <motion.div
              key={entry.year}
              custom={0.3 + index * 0.1}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUp}
              className="relative flex gap-4"
            >
              {/* Timeline connector line */}
              {index < TIMELINE_DATA.length - 1 && (
                <div className="absolute left-[18px] top-10 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 to-transparent" />
              )}

              {/* Year badge */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-[9px] font-bold border"
                  style={{
                    background: entry.status === 'active'
                      ? 'rgba(0, 240, 255, 0.15)'
                      : entry.status === 'future'
                      ? 'rgba(139, 92, 246, 0.1)'
                      : 'rgba(255, 255, 255, 0.05)',
                    borderColor: entry.status === 'active'
                      ? 'rgba(0, 240, 255, 0.5)'
                      : entry.status === 'future'
                      ? 'rgba(139, 92, 246, 0.4)'
                      : 'rgba(255, 255, 255, 0.12)',
                    color: entry.status === 'active' ? '#00f0ff'
                      : entry.status === 'future' ? '#a78bfa' : '#94a3b8',
                  }}
                >
                  {entry.year.slice(2)}
                </div>
              </div>

              {/* Content */}
              <div
                className="flex-1 p-3.5 rounded-lg mb-1"
                style={{
                  background: entry.status === 'active'
                    ? 'rgba(0, 240, 255, 0.06)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: entry.status === 'active'
                    ? '1px solid rgba(0, 240, 255, 0.2)'
                    : '1px solid rgba(255, 255, 255, 0.07)',
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] font-bold text-cyan-300 tracking-wider">{entry.year}</span>
                  {entry.status === 'active' && (
                    <span className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 tracking-wider">
                      CURRENT
                    </span>
                  )}
                  {entry.status === 'future' && (
                    <span className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 tracking-wider">
                      HORIZON
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-white mb-1">{entry.title}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{entry.description}</div>
                <div className="flex items-center gap-1.5 mt-2">
                  <Target className="w-2.5 h-2.5 text-slate-500" />
                  <span className="font-mono text-[9px] text-slate-500 tracking-wider">{entry.milestone}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
