'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import { Gem, Server, Database, Cloud, Cpu } from 'lucide-react';
import { SKILL_CATEGORIES } from '@/data/portfolioData';
import { ZoneHeading } from './AboutSection';

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Languages: Gem,
  'Web / Backend': Server,
  Databases: Database,
  'Cloud / DevOps': Cloud,
  'Systems & Engineering': Cpu,
};

export function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });
  const [active, setActive] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const category = SKILL_CATEGORIES[active];

  return (
    <section
      ref={ref}
      id="section-skills"
      className="deep-section relative px-6"
      aria-labelledby="skills-heading"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rise}
        >
          <ZoneHeading
            id="skills-heading"
            title="The Coral Cave"
            subtitle="Technology, pressed into stone by the sea"
          />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Cave mouths — one per category */}
          <motion.nav
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={rise}
            custom={0.15}
            aria-label="Skill categories"
            className="flex flex-col gap-2 lg:sticky lg:top-10 lg:self-start"
          >
            {SKILL_CATEGORIES.map((cat, idx) => {
              const Icon = CATEGORY_ICONS[cat.name] ?? Gem;
              const isActive = idx === active;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActive(idx)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-all duration-500 ${
                    isActive
                      ? 'glass border-[#9fd8d4]/30'
                      : 'glass-soft hover:border-[#9fd8d4]/25'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-500 ${
                      isActive ? 'bg-[#9ff2ec]/15 text-[#bff4f0]' : 'text-[#6fa9b0]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-[13px] transition-colors duration-500 ${
                        isActive ? 'text-[#eef8f7]' : 'text-[#a8c4c2]'
                      }`}
                    >
                      {cat.name}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[9px] tracking-[0.16em] text-[#5d9aa1] uppercase">
                      {cat.code}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] tabular-nums text-[#4f8a91]">
                    {cat.skills.length}
                  </span>
                </button>
              );
            })}
          </motion.nav>

          {/* The artefacts */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={rise}
            custom={0.3}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="glass rim-top relative overflow-hidden rounded-3xl p-7 md:p-9"
              >
                <p className="mb-8 max-w-lg text-[14px] leading-relaxed text-[#b8d4d2]">
                  {category.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, idx) => (
                    <motion.button
                      key={skill.name}
                      initial={{ opacity: 0, y: 14, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.06 * idx,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{ y: -3 }}
                      onHoverStart={() => setHoveredSkill(skill.name)}
                      onHoverEnd={() => setHoveredSkill(null)}
                      onFocus={() => setHoveredSkill(skill.name)}
                      onBlur={() => setHoveredSkill(null)}
                      className="glass-stone group relative overflow-hidden rounded-2xl px-5 py-3.5 text-left transition-shadow duration-500 focus-visible:ring-2 focus-visible:ring-[#9ff2ec]"
                    >
                      {/* Mineral sheen that lifts on hover, like light on wet stone */}
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-[#9ff2ec]/12 to-transparent transition-opacity duration-500 ${
                          hoveredSkill === skill.name ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      <span className="relative block text-[14px] font-medium text-[#eef8f7]">
                        {skill.name}
                      </span>
                      <span className="relative mt-1 block font-mono text-[9px] tracking-[0.18em] text-[#6fa9b0] uppercase">
                        {skill.tag}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
