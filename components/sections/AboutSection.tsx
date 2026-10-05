'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Anchor, Compass, Layers } from 'lucide-react';
import { TIMELINE_DATA } from '@/data/portfolioData';
import { getZone } from '@/lib/depthZones';

const ZONE = getZone('about');

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/** Shared section header so every zone reads the same way. */
function ZoneHeading({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-16 text-center">
      <p className="mb-4 font-mono text-[10px] tracking-[0.34em] text-[#6fa9b0] uppercase">
        {ZONE.zone} · {ZONE.depth} M
      </p>
      <h2
        id={id}
        className="mb-4 text-3xl font-light tracking-tight text-[#f2fbfa] text-balance sm:text-4xl"
      >
        {title}
      </h2>
      <p className="font-mono text-[11px] tracking-[0.22em] text-[#8fd8d4] uppercase">
        {subtitle}
      </p>
    </div>
  );
}

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      id="section-about"
      className="deep-section relative px-6"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rise}
        >
          <ZoneHeading
            id="about-heading"
            title="The Diver"
            subtitle="Operator profile · First light in the water"
          />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          {/* Identity — presented as a salvaged logbook, not a dashboard card */}
          <motion.article
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={rise}
            custom={0.15}
            className="glass rim-top relative overflow-hidden rounded-3xl p-8 md:p-10"
          >
            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#9fd8d4]/25 bg-[#0d3a4a]/70">
                <Anchor className="h-6 w-6 text-[#a8e4e0]" />
              </div>
              <div>
                <h3 className="text-2xl font-light tracking-tight text-[#f2fbfa]">
                  BLANI JOYSTAN DCUNHA
                </h3>
                <p className="mt-1 font-mono text-[10px] tracking-[0.24em] text-[#6fa9b0]/80 uppercase">
                  Computer Science Engineering Student
                </p>
              </div>
            </div>

            <div className="space-y-5 text-[15px] leading-relaxed text-[#cfe4e2]">
              <p>
                I am a Computer Science Engineering student focused on becoming a
                strong software engineer through building real-world systems,
                solving algorithmic problems and exploring modern technologies.
              </p>
              <p className="border-l-2 border-[#6fd0cc]/40 pl-4 font-mono text-[13px] tracking-[0.04em] text-[#a8e4e0] italic">
                &ldquo;Student today. Engineer in progress. Builder by nature.&rdquo;
              </p>
            </div>

            {/* Focus, kept identical to the original content */}
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {[
                { icon: Compass, label: 'Full Stack Development' },
                { icon: Layers, label: 'AI / Machine Learning' },
                { icon: Anchor, label: 'Cloud / DevOps' },
                { icon: Layers, label: 'Distributed Systems' },
              ].map((item) => (
                <div key={item.label} className="glass-soft flex items-center gap-3 rounded-2xl px-4 py-3.5">
                  <item.icon className="h-4 w-4 shrink-0 text-[#8fd8d4]" />
                  <span className="text-[13px] text-[#cfe4e2]/90">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.article>

          {/* Timeline — a descent log rather than a stepper widget */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={rise}
            custom={0.3}
            className="relative"
          >
            {/* Continuous sounding line down the side of the timeline */}
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-[#6fd0cc]/40 via-[#4f8a91]/30 to-transparent"
            />

            <ol className="space-y-8">
              {TIMELINE_DATA.map((entry, idx) => (
                <motion.li
                  key={entry.year}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  variants={rise}
                  custom={0.4 + idx * 0.12}
                  className="relative pl-9"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-1.5 left-0 h-3.5 w-3.5 rounded-full border ${
                      entry.status === 'future'
                        ? 'border-[#4f8a91]/60 bg-transparent'
                        : 'border-[#8fd8d4]/70 bg-[#0d3a4a]'
                    }`}
                  />
                  <p className="mb-1.5 font-mono text-[10px] tracking-[0.28em] text-[#8fd8d4] uppercase">
                    {entry.year}
                    {entry.status === 'active' && (
                      <span className="ml-2 text-[#9ff2ec]">· current</span>
                    )}
                    {entry.status === 'future' && (
                      <span className="ml-2 text-[#4f8a91]">· ahead</span>
                    )}
                  </p>
                  <h4 className="mb-2 text-lg font-light tracking-tight text-[#eef8f7]">
                    {entry.title}
                  </h4>
                  <p className="mb-2.5 text-[14px] leading-relaxed text-[#b8d4d2]">
                    {entry.description}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.14em] text-[#6fa9b0] uppercase">
                    {entry.milestone}
                  </p>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { ZoneHeading };
