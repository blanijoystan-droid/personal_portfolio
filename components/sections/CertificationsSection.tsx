'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { CERTIFICATIONS_DATA } from '@/data/portfolioData';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as const } }),
};

export function CertificationsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="section-certifications"
      ref={ref}
      aria-label="Certifications"
      className="relative flex flex-col justify-center px-6 py-24 max-w-5xl mx-auto"
    >
      <motion.div custom={0} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="flex items-center gap-3 mb-3">
        <span className="w-6 h-px bg-pink-400" />
        <span className="font-mono text-[11px] tracking-widest text-pink-400 uppercase">NODE: CRT-06 // CREDENTIAL ARCHIVE</span>
        <span className="w-6 h-px bg-pink-400" />
      </motion.div>

      <motion.h2 custom={0.1} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
        CREDENTIAL <span className="text-pink-400">ARCHIVE</span>
      </motion.h2>

      <motion.p custom={0.2} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="text-slate-400 text-sm mb-10 max-w-lg">
        Verified professional learning achievements. Click VERIFY to access original credential sources.
      </motion.p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CERTIFICATIONS_DATA.map((cert, index) => (
          <motion.div
            key={cert.id}
            custom={0.3 + index * 0.1}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="rounded-xl p-5 flex flex-col gap-3 transition-all duration-200"
            style={{
              background: 'rgba(236, 72, 153, 0.06)',
              border: '1px solid rgba(236, 72, 153, 0.2)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(236, 72, 153, 0.45)';
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(236, 72, 153, 0.1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(236, 72, 153, 0.2)';
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(236, 72, 153, 0.06)';
            }}
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-pink-500/15 border border-pink-500/30">
                <ShieldCheck className="w-4.5 h-4.5 text-pink-400" />
              </div>
              <div>
                <div className="font-mono text-[9px] text-pink-300 tracking-wider mb-0.5">{cert.issuer}</div>
                <h3 className="text-sm font-bold text-white leading-snug">{cert.title}</h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11px] text-slate-400 leading-relaxed flex-1">{cert.description}</p>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-1">
              {cert.skills.map(s => (
                <span
                  key={s}
                  className="px-1.5 py-0.5 rounded font-mono text-[8px] tracking-wider"
                  style={{
                    background: 'rgba(236, 72, 153, 0.12)',
                    border: '1px solid rgba(236, 72, 153, 0.25)',
                    color: '#f9a8d4',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Verify Link */}
            {cert.verifyUrl && (
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="VERIFY"
                className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-pink-400 hover:text-pink-300 transition-colors mt-auto self-start"
              >
                <ExternalLink className="w-3 h-3" />
                VERIFY CREDENTIAL
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
