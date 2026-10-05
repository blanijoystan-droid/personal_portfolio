'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Mail, Link2, GitBranch, Terminal, Waves } from 'lucide-react';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { ZoneHeading } from './AboutSection';

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFormState('sent');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setFormState('idle'), 3000);
  };

  return (
    <section
      ref={ref}
      id="section-contact"
      className="deep-section relative px-6"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={rise} custom={0}
        >
          <ZoneHeading
            id="contact-heading"
            title="The Abyss"
            subtitle="The deepest point · a signal in the dark"
          />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={rise} custom={0.1}
          >
            <div className="glass-deep h-full rounded-3xl p-8">
              <h3 className="mb-6 flex items-center gap-2 text-white">
                <Waves className="h-6 w-6 text-[#9ff2ec]" />
                FREQUENCIES
              </h3>

              <div className="space-y-5">
                {[
                  { icon: Mail, label: 'EMAIL', value: PERSONAL_INFO.socials.email, action: `mailto:${PERSONAL_INFO.socials.email}` },
                  { icon: GitBranch, label: 'GITHUB', value: PERSONAL_INFO.socials.github, action: PERSONAL_INFO.socials.github },
                  { icon: Link2, label: 'LINKEDIN', value: PERSONAL_INFO.socials.linkedin, action: PERSONAL_INFO.socials.linkedin },
                ].map((contact, idx) => (
                  <motion.a
                    key={contact.label}
                    href={contact.action}
                    target={contact.action.startsWith('http') ? '_blank' : undefined}
                    rel={contact.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="glass-soft rounded-2xl p-5 group flex items-center gap-4 transition-all duration-200"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0a2a34]/70 border border-[#9ff2ec]/15 group-hover:border-[#9ff2ec]/40 group-hover:bg-[#0e3a4a]/70 transition-all duration-300">
                      <contact.icon className="w-6 h-6 text-[#8fd8d4] group-hover:text-[#9ff2ec]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-[#9ff2ec] block mb-1">{contact.label}</span>
                      <span className="font-mono text-sm text-slate-200 truncate block">{contact.value}</span>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#9ff2ec]/10 group-hover:bg-[#9ff2ec]/30 transition-colors"
                    >
                      <Waves className="w-4 h-4 text-[#9ff2ec]" />
                    </motion.div>
                  </motion.a>
                ))}
              </div>

              {/* Resume Terminal */}
              <div className="mt-8 pt-6 border-t border-[#9ff2ec]/10">
                <div className="flex items-center gap-2 text-[#9ff2ec] mb-4">
                  <Terminal className="w-5 h-5" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">RESUME TERMINAL</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { window.open('/resume.pdf', '_blank'); }}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full font-mono text-sm font-medium tracking-wider text-[#04161d] transition-all duration-500"
                    style={{ background: 'linear-gradient(90deg, #9ff2ec, #4fd1d4, #00ffff)' }}
                  >
                    <span className="w-4 h-4" style={{ background: 'linear-gradient(90deg, #9ff2ec, #4fd1d4, #00ffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VIEW RESUME</span>
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/resume.pdf';
                      link.download = 'Blani_Joystan_Dcunha_Resume.pdf';
                      link.click();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full font-mono text-sm font-medium tracking-wider text-[#9ff2ec] transition-all duration-500 glass-soft"
                  >
                    <span>DOWNLOAD</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Transmission Form */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={rise} custom={0.1}
          >
            <div className="glass-deep rounded-3xl p-8 h-full">
              <h3 className="mb-6 flex items-center gap-2 text-white">
                <Waves className="w-6 h-6 text-[#9ff2ec]" />
                TRANSMIT SIGNAL
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block font-mono text-[9px] tracking-widest uppercase text-[#9ff2ec] mb-1.5">
                    OPERATOR IDENTITY
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="YOUR DESIGNATION"
                    className="w-full glass px-4 py-2.5 rounded-lg font-mono text-sm bg-[#062a34]/50 border-[#9ff2ec]/20 focus:border-[#9ff2ec]/50 focus:ring-2 focus:ring-[#9ff2ec]/20 transition-all"
                    required
                    disabled={formState !== 'idle'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-mono text-[9px] tracking-widest uppercase text-[#9ff2ec] mb-1.5">
                    COMMS FREQUENCY
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="secure@channel.com"
                    className="w-full glass px-4 py-2.5 rounded-lg font-mono text-sm bg-[#062a34]/50 border-[#9ff2ec]/20 focus:border-[#9ff2ec]/50 focus:ring-2 focus:ring-[#9ff2ec]/20 transition-all"
                    required
                    disabled={formState !== 'idle'}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-mono text-[9px] tracking-widest uppercase text-[#9ff2ec] mb-1.5">
                    MESSAGE PAYLOAD
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="ENCODE YOUR MESSAGE..."
                    rows={4}
                    className="w-full glass px-4 py-2.5 rounded-lg font-mono text-sm bg-[#062a34]/50 border-[#9ff2ec]/20 focus:border-[#9ff2ec]/50 focus:ring-2 focus:ring-[#9ff2ec]/20 transition-all resize-none"
                    required
                    disabled={formState !== 'idle'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState !== 'idle'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-mono text-sm font-bold tracking-wider text-[#04161d] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(90deg, #9ff2ec, #4fd1d4, #00ffff)' }}
                >
                  {formState === 'sending' && (
                    <motion.span className="w-4 h-4 border-2 border-[#04161d]/30 border-t-[#04161d] rounded-full animate-spin" />
                  )}
                  {formState === 'sending' ? 'ENCODING...' :
                   formState === 'sent' ? (
                     <>
                       <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                         ✓
                       </motion.span>
                       TRANSMISSION COMPLETE
                     </>
                   ) :
                   formState === 'error' ? 'TRANSMISSION FAILED' : (
                     <>
                       <Waves className="w-4 h-4" />
                       LAUNCH TRANSMISSION
                     </>
                   )}
                </button>

                {formState === 'sent' && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-[#9ff2ec] font-mono text-sm mt-3"
                  >
                    Signal received. Awaiting response on secure channel.
                  </motion.p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}