'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { EXPERIENCE_DATA } from '@/data/portfolioData';
import { soundFx } from '@/lib/soundEffects';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as const } }),
};

export function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const toggleDay = (day: number) => {
    soundFx.playClick();
    setExpandedDay(prev => (prev === day ? null : day));
  };

  return (
    <section
      id="section-experience"
      ref={ref}
      aria-label="Experience"
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div custom={0} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="flex items-center gap-3 mb-3">
        <span className="w-6 h-px bg-purple-400" />
        <span className="font-mono text-[11px] tracking-widest text-purple-400 uppercase">NODE: EXP-04 // ENGINEERING RECORD</span>
        <span className="w-6 h-px bg-purple-400" />
      </motion.div>

      <motion.h2 custom={0.1} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
        <span className="text-purple-400">ZETHETA</span> INTERNSHIP
      </motion.h2>

      <motion.p custom={0.2} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="text-slate-400 text-sm mb-10 max-w-lg">
        {EXPERIENCE_DATA.summary}
      </motion.p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: System Architecture Pipeline */}
        <motion.div custom={0.3} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp}>
          <div className="hud-panel-purple rounded-xl p-5 h-full">
            <div className="font-mono text-[10px] tracking-widest text-purple-300 mb-4">
              SYSTEM ARCHITECTURE // EVENT-DRIVEN PIPELINE
            </div>

            <div className="flex flex-col gap-0">
              {EXPERIENCE_DATA.pipelineSteps.map((step, idx) => (
                <div key={step.step} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-[9px] font-bold border flex-shrink-0"
                      style={{
                        background: 'rgba(139, 92, 246, 0.15)',
                        borderColor: 'rgba(139, 92, 246, 0.4)',
                        color: '#a78bfa',
                      }}
                    >
                      {step.step}
                    </div>
                    {idx < EXPERIENCE_DATA.pipelineSteps.length - 1 && (
                      <div className="w-px h-6 bg-purple-500/30" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="font-semibold text-white text-sm">{step.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{step.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tech Focus Tags */}
            <div className="pt-4 border-t border-purple-500/20">
              <div className="font-mono text-[9px] text-slate-400 mb-2 uppercase tracking-wider">Tech Focus Areas</div>
              <div className="flex flex-wrap gap-1.5">
                {EXPERIENCE_DATA.techFocus.map(t => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded font-mono text-[9px] tracking-wider"
                    style={{
                      background: 'rgba(139, 92, 246, 0.12)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      color: '#c4b5fd',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: 10-Day Journey Timeline */}
        <motion.div custom={0.4} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp}>
          <div className="font-mono text-[10px] tracking-widest text-purple-300 mb-4 flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5" />
            10 DAY ENGINEERING JOURNEY
          </div>

          <div className="flex flex-col gap-2">
            {EXPERIENCE_DATA.journeyDays.map((day) => {
              const isExpanded = expandedDay === day.day;
              return (
                <div
                  key={day.day}
                  className="rounded-lg overflow-hidden transition-all duration-200"
                  style={{
                    background: isExpanded ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isExpanded ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <button
                    onClick={() => toggleDay(day.day)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left focus:outline-none"
                    aria-expanded={isExpanded}
                    aria-controls={`day-${day.day}-content`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{
                          background: 'rgba(139, 92, 246, 0.2)',
                          color: '#c4b5fd',
                        }}
                      >
                        D{day.day.toString().padStart(2, '0')}
                      </span>
                      <div className="text-left">
                        <div className="text-xs font-semibold text-white leading-tight">{day.title}</div>
                        <div className="font-mono text-[9px] text-purple-300">{day.phase}</div>
                      </div>
                    </div>
                    <ChevronDown
                      className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform duration-200"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        id={`day-${day.day}-content`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-purple-500/20">
                          <p className="text-xs text-slate-300 leading-relaxed mb-2">{day.summary}</p>
                          <div className="flex flex-wrap gap-1">
                            {day.techFocus.map(t => (
                              <span
                                key={t}
                                className="px-1.5 py-0.5 rounded font-mono text-[8px] tracking-wider"
                                style={{
                                  background: 'rgba(139, 92, 246, 0.15)',
                                  border: '1px solid rgba(139, 92, 246, 0.25)',
                                  color: '#a78bfa',
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
