'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { SKILL_CATEGORIES } from '@/data/portfolioData';
import { soundFx } from '@/lib/soundEffects';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const CATEGORY_COLORS: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  languages:    { border: 'rgba(0, 240, 255, 0.3)',    bg: 'rgba(0, 240, 255, 0.08)',    text: '#00f0ff', dot: '#00f0ff' },
  'web-backend':{ border: 'rgba(59, 130, 246, 0.3)',   bg: 'rgba(59, 130, 246, 0.08)',   text: '#60a5fa', dot: '#3b82f6' },
  databases:    { border: 'rgba(16, 185, 129, 0.3)',   bg: 'rgba(16, 185, 129, 0.08)',   text: '#34d399', dot: '#10b981' },
  'cloud-devops':{ border: 'rgba(139, 92, 246, 0.3)', bg: 'rgba(139, 92, 246, 0.08)',   text: '#a78bfa', dot: '#8b5cf6' },
  other:        { border: 'rgba(245, 158, 11, 0.3)',   bg: 'rgba(245, 158, 11, 0.08)',   text: '#fbbf24', dot: '#f59e0b' },
};

export function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <section
      id="section-skills"
      ref={ref}
      aria-label="Technical Skills"
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 max-w-5xl mx-auto"
    >
      {/* Section Header */}
      <motion.div
        custom={0}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUp}
        className="flex items-center gap-3 mb-3"
      >
        <span className="w-6 h-px bg-blue-400" />
        <span className="font-mono text-[11px] tracking-widest text-blue-400 uppercase">NODE: SKL-02 // TECH LAB</span>
        <span className="w-6 h-px bg-blue-400" />
      </motion.div>

      <motion.h2
        custom={0.1}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUp}
        className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2"
      >
        TECH <span className="text-blue-400">LAB</span>
      </motion.h2>

      <motion.p
        custom={0.2}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUp}
        className="text-slate-400 text-sm mb-10 max-w-lg"
      >
        Technologies powering my systems — from languages to cloud infrastructure. Hover a skill to inspect.
      </motion.p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SKILL_CATEGORIES.map((category, ci) => {
          const colors = CATEGORY_COLORS[category.id] || CATEGORY_COLORS.other;
          return (
            <motion.div
              key={category.id}
              custom={0.3 + ci * 0.1}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUp}
              className="rounded-xl p-5 flex flex-col gap-3 transition-all duration-200"
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
              }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Cpu className="w-4 h-4" style={{ color: colors.dot }} />
                <span className="font-mono text-xs font-bold tracking-wider" style={{ color: colors.text }}>
                  {category.code}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">{category.description}</p>

              {/* Skill Chips */}
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill) => {
                  const key = `${category.id}-${skill.name}`;
                  const isH = hoveredSkill === key;
                  return (
                    <button
                      key={skill.name}
                      onMouseEnter={() => { setHoveredSkill(key); soundFx.playHover(); }}
                      onMouseLeave={() => setHoveredSkill(null)}
                      data-cursor="INSPECT"
                      className="group relative px-2.5 py-1 rounded-md font-mono text-[10px] tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2"
                      style={{
                        background: isH ? colors.bg : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isH ? colors.border : 'rgba(255,255,255,0.1)'}`,
                        color: isH ? colors.text : '#94a3b8',
                        boxShadow: isH ? `0 0 12px ${colors.dot}33` : 'none',
                        transform: isH ? 'translateY(-1px)' : 'translateY(0)',
                      }}
                    >
                      {skill.name}
                      {skill.tag && isH && (
                        <span
                          className="absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] font-mono tracking-wider whitespace-nowrap z-10 pointer-events-none"
                          style={{
                            background: 'rgba(5, 10, 20, 0.95)',
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                        >
                          {skill.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
