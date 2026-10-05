'use client';

import React, { useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Trophy, Medal, Sparkles, Award } from 'lucide-react';
import { ACHIEVEMENTS_DATA } from '@/data/portfolioData';
import { ZoneHeading } from './AboutSection';

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const BADGE_CONFIG: Record<string, { bg: string; border: string; text: string; icon: React.ComponentType<{ className?: string }>; glow: string }> = {
  gold: {
    bg: 'bg-gradient-to-br from-[#ffd700] to-[#ffaa00]',
    border: 'border-[#ffd700]/50',
    text: 'text-[#04161d]',
    icon: Trophy,
    glow: 'shadow-[#ffd700]/40',
  },
  silver: {
    bg: 'bg-gradient-to-br from-[#c0c0c0] to-[#a8a8a8]',
    border: 'border-[#c0c0c0]/50',
    text: 'text-[#04161d]',
    icon: Medal,
    glow: 'shadow-[#c0c0c0]/40',
  },
  bronze: {
    bg: 'bg-gradient-to-br from-[#cd7f32] to-[#b87333]',
    border: 'border-[#cd7f32]/50',
    text: 'text-[#04161d]',
    icon: Medal,
    glow: 'shadow-[#cd7f32]/40',
  },
  cyan: {
    bg: 'bg-gradient-to-br from-[#4fd1d4] to-[#00c9cc]',
    border: 'border-[#4fd1d4]/50',
    text: 'text-[#04161d]',
    icon: Award,
    glow: 'shadow-[#4fd1d4]/40',
  },
  project: {
    bg: 'bg-gradient-to-br from-[#ff6b55] to-[#ff4455]',
    border: 'border-[#ff6b55]/50',
    text: 'text-white',
    icon: Sparkles,
    glow: 'shadow-[#ff6b55]/40',
  },
};

export function AchievementsSection() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={ref}
      id="section-achievements"
      className="deep-section relative px-6"
      aria-labelledby="achievements-heading"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={rise} custom={0}
        >
          <ZoneHeading
            id="achievements-heading"
            title="The Treasure Reef"
            subtitle="Artefacts recovered from the expedition"
          />
        </motion.div>

        <div className="space-y-6">
          {ACHIEVEMENTS_DATA.map((achievement, idx) => {
            const config = BADGE_CONFIG[achievement.badgeType] || BADGE_CONFIG.cyan;
            const Icon = config.icon;

            return (
              <motion.article
                key={achievement.id}
                initial="hidden"
                animate="visible"
                variants={rise} custom={0.08 * idx}
                whileHover={{ y: -4 }}
              >
                <div className="glass-deep relative overflow-hidden rounded-3xl p-6 md:p-8 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#9ff2ec]/3 via-transparent to-[#ff6b55]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative flex items-start gap-6">
                    {/* Badge */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${config.bg} ${config.border} border-2 ${config.text} ${config.glow}`}>
                        <Icon className="w-10 h-10" />
                      </div>
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#9ff2ec]/20 blur-xl animate-biolum"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase font-medium ${config.bg} ${config.text}`}>
                          {achievement.badgeType.toUpperCase()}
                        </span>
                        <span className="font-mono text-[10px] text-[#8fd8d4]">{achievement.id}</span>
                      </div>
                      <h3 className="text-xl font-light tracking-tight text-[#f2fbfa] mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed mb-2">{achievement.description}</p>

                      {achievement.event && (
                        <p className="mt-2 flex items-center gap-2 text-slate-400 text-sm">
                          <Award className="w-4 h-4 text-[#9fd8d4]/80" />
                          <span>{achievement.event}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bioluminescent accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9ff2ec]/40 to-transparent" />
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={rise} custom={0.5}
          className="mt-12 grid grid-cols-3 gap-4 items-stretch"
        >
          <div className="glass rim-top text-center min-h-[100px] flex flex-col justify-center">
            <div className="text-2xl font-bold text-[#ffd700] mb-1">1</div>
            <div className="font-mono text-[9px] text-slate-400 tracking-wider uppercase leading-tight">TOP 3 FINISH</div>
          </div>
          <div className="glass rim-top text-center min-h-[100px] flex flex-col justify-center">
            <div className="text-2xl font-bold text-[#ff6b55] mb-1">3</div>
            <div className="font-mono text-[9px] text-slate-400 tracking-wider uppercase">HACKATHONS</div>
          </div>
          <div className="glass rim-top text-center min-h-[100px] flex flex-col justify-center">
            <div className="text-2xl font-bold text-[#9ff2ec] mb-1">2</div>
            <div className="font-mono text-[9px] text-slate-400 tracking-wider uppercase">PROJECT WINS</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}