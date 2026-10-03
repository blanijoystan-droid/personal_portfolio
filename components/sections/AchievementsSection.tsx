'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Trophy, Star, Award } from 'lucide-react';
import { ACHIEVEMENTS_DATA } from '@/data/portfolioData';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as const } }),
};

const BADGE_CONFIG: Record<string, { bg: string; border: string; text: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; glow: string }> = {
  gold:   { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.5)',  text: '#fbbf24', icon: Trophy, glow: '0 0 30px rgba(245, 158, 11, 0.25)' },
  silver: { bg: 'rgba(148, 163, 184, 0.1)',  border: 'rgba(148, 163, 184, 0.4)', text: '#94a3b8', icon: Award,  glow: '0 0 20px rgba(148, 163, 184, 0.15)' },
  cyan:   { bg: 'rgba(0, 240, 255, 0.1)',    border: 'rgba(0, 240, 255, 0.4)',   text: '#00f0ff', icon: Star,   glow: '0 0 20px rgba(0, 240, 255, 0.2)' },
  bronze: { bg: 'rgba(180, 83, 9, 0.1)',     border: 'rgba(180, 83, 9, 0.4)',    text: '#c2410c', icon: Award,  glow: 'none' },
};

export function AchievementsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="section-achievements"
      ref={ref}
      aria-label="Achievements"
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 max-w-5xl mx-auto"
    >
      <motion.div custom={0} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="flex items-center gap-3 mb-3">
        <span className="w-6 h-px bg-amber-400" />
        <span className="font-mono text-[11px] tracking-widest text-amber-400 uppercase">NODE: ACH-05 // ACHIEVEMENT VAULT</span>
        <span className="w-6 h-px bg-amber-400" />
      </motion.div>

      <motion.h2 custom={0.1} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
        ACHIEVEMENT <span className="text-amber-400">VAULT</span>
      </motion.h2>

      <motion.p custom={0.2} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="text-slate-400 text-sm mb-10 max-w-lg">
        Verified hackathon milestones, project showcases, and competitive engineering records.
      </motion.p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ACHIEVEMENTS_DATA.map((achievement, index) => {
          const config = BADGE_CONFIG[achievement.badgeType] || BADGE_CONFIG.silver;
          const Icon = config.icon;

          return (
            <motion.div
              key={achievement.id}
              custom={0.3 + index * 0.12}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUp}
              className={`rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden ${
                achievement.isTopAward ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
              style={{
                background: config.bg,
                border: `1px solid ${config.border}`,
                boxShadow: config.glow,
              }}
            >
              {/* Top badge / award label */}
              <div className="flex items-start justify-between gap-2">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${config.text}20`,
                    border: `1px solid ${config.border}`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.text }} />
                </div>

                <div
                  className="px-2 py-0.5 rounded font-mono text-[8px] font-bold tracking-widest uppercase"
                  style={{ background: `${config.text}20`, border: `1px solid ${config.border}`, color: config.text }}
                >
                  {achievement.badgeType.toUpperCase()}
                </div>
              </div>

              {/* Award title */}
              <div>
                <div
                  className="font-mono text-[10px] font-bold tracking-widest uppercase mb-1"
                  style={{ color: config.text }}
                >
                  {achievement.award}
                </div>
                <h3 className="text-base font-bold text-white leading-tight">{achievement.title}</h3>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5">{achievement.event}</div>
                {achievement.location && (
                  <div className="font-mono text-[9px] text-slate-500">{achievement.location}</div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed">{achievement.description}</p>

              {/* Top award glow effect */}
              {achievement.isTopAward && (
                <div
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  style={{
                    background: `radial-gradient(circle at top right, ${config.text}12, transparent 60%)`,
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
