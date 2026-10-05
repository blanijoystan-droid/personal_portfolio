'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { ShieldCheck, ExternalLink, Award, Verified } from 'lucide-react';
import { CERTIFICATIONS_DATA } from '@/data/portfolioData';
import { ZoneHeading } from './AboutSection';

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function CertificationsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      id="section-certifications"
      className="deep-section relative px-6"
      aria-labelledby="certifications-heading"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rise} custom={0}
        >
          <ZoneHeading
            id="certifications-heading"
            title="The Archive"
            subtitle="Sealed credentials · preserved in the deep"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rise} custom={0.1}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {CERTIFICATIONS_DATA.map((cert, idx) => (
              <motion.article
                key={cert.id}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={rise} custom={idx * 0.1}
                whileHover={{ y: -4 }}
              >
                <div className="glass-deep relative overflow-hidden rounded-3xl p-6 md:p-8 h-full flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#9ff2ec]/3 via-transparent to-[#4fd1d4]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative flex items-start gap-4 mb-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9ff2ec] to-[#4fd1d4]">
                      <ShieldCheck className="w-7 h-7 text-[#04161d]" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase font-medium glass-soft text-[#9ff2ec]">
                        VERIFIED
                      </span>
                      <Verified className="w-4 h-4 ml-2 text-[#9ff2ec] shrink-0" />
                    </div>
                  </div>

                  <h3 className="text-lg font-light tracking-tight text-[#f2fbfa] mb-2 truncate">{cert.title}</h3>
                  <p className="text-slate-300 text-sm mb-4 truncate">{cert.issuer}</p>

                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                    <Award className="w-4 h-4 text-[#9ff2ec]/80 shrink-0" />
                    <span className="font-mono truncate">{cert.id}</span>
                  </div>

                  <div className="mt-auto flex gap-2">
                    {cert.verifyUrl && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-mono text-xs font-bold tracking-wider text-[#04161d] transition-all duration-500 whitespace-nowrap"
                        style={{ background: 'linear-gradient(90deg, #9ff2ec, #4fd1d4, #00ffff)' }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        VERIFY
                      </a>
                    )}
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-mono text-xs font-bold tracking-wider text-[#9ff2ec] transition-all duration-500 glass-soft whitespace-nowrap">
                      <Award className="w-3.5 h-3.5" />
                      DETAILS
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={rise} custom={0.5}
          className="mt-12"
        >
          <div className="glass rim-top rounded-3xl p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShieldCheck className="w-8 h-8 text-[#9ff2ec]" />
              <h3 className="font-light tracking-tight text-white">CREDENTIALS SECURED</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="glass rim-top p-4 text-center">
                <div className="text-2xl font-bold text-[#9ff2ec] mb-1">{CERTIFICATIONS_DATA.length}</div>
                <div className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">TOTAL CERTS</div>
              </div>
              <div className="glass rim-top p-4 text-center">
                <div className="text-2xl font-bold text-[#4fd1d4] mb-1">{CERTIFICATIONS_DATA.filter(c => c.verifyUrl).length}</div>
                <div className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">VERIFIABLE</div>
              </div>
              <div className="glass rim-top p-4 text-center">
                <div className="text-2xl font-bold text-[#ff6b55] mb-1">{new Set(CERTIFICATIONS_DATA.map(c => c.issuer)).size}</div>
                <div className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">ISSUERS</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}