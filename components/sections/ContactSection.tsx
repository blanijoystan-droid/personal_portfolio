'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { GitBranch, Link2, Mail, Send, FileText, Download } from 'lucide-react';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { soundFx } from '@/lib/soundEffects';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as const } }),
};

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playWarp();
    setSending(true);

    // Simulated send (replace with actual API call such as Resend / Formspree)
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  const socials = [
    {
      icon: GitBranch,
      label: 'GITHUB',
      href: PERSONAL_INFO.socials.github,
      desc: 'Engineering projects & source code',
      color: '#94a3b8',
    },
    {
      icon: Link2,
      label: 'LINKEDIN',
      href: PERSONAL_INFO.socials.linkedin,
      desc: 'Professional network & career profile',
      color: '#3b82f6',
    },
    {
      icon: Mail,
      label: 'EMAIL',
      href: `mailto:${PERSONAL_INFO.socials.email}`,
      desc: PERSONAL_INFO.socials.email,
      color: '#00f0ff',
    },
  ];

  return (
    <section
      id="section-contact"
      ref={ref}
      aria-label="Contact"
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div custom={0} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="flex items-center gap-3 mb-3">
        <span className="w-6 h-px bg-cyan-400" />
        <span className="font-mono text-[11px] tracking-widest text-cyan-400 uppercase">NODE: COM-07 // COMM GATEWAY</span>
        <span className="w-6 h-px bg-cyan-400" />
      </motion.div>

      <motion.h2 custom={0.1} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
        LET&apos;S <span className="text-cyan-400">BUILD</span> SOMETHING.
      </motion.h2>

      <motion.p custom={0.2} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="text-slate-400 text-sm mb-10 max-w-lg">
        Have a project, opportunity, collaboration or idea worth exploring? Open a channel.
      </motion.p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Social Links + Resume */}
        <div className="flex flex-col gap-5">
          <motion.div custom={0.3} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp}>
            <div className="font-mono text-[10px] text-slate-400 mb-3 tracking-wider uppercase">DIRECT CHANNELS</div>
            <div className="flex flex-col gap-2.5">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.label !== 'EMAIL' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    data-cursor="OPEN"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = `${s.color}50`;
                      (e.currentTarget as HTMLAnchorElement).style.background = `${s.color}0d`;
                      soundFx.playHover();
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-[10px] font-bold tracking-wider" style={{ color: s.color }}>
                        {s.label}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{s.desc}</div>
                    </div>
                    <span className="font-mono text-[9px] text-slate-500 group-hover:text-slate-300 transition-colors">→</span>
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Resume Terminal */}
          <motion.div custom={0.4} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp}>
            <div className="font-mono text-[10px] text-slate-400 mb-3 tracking-wider uppercase">RESUME TERMINAL</div>
            <div
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{
                background: 'rgba(16, 185, 129, 0.07)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <div className="font-mono text-[10px] text-emerald-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                RESUME // HOLOGRAPHIC READER
              </div>
              <div className="font-mono text-[11px] text-slate-400">
                {PERSONAL_INFO.resume.filename}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={PERSONAL_INFO.resume.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="VIEW"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all"
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#34d399',
                  }}
                >
                  <FileText className="w-3.5 h-3.5" />
                  VIEW RESUME
                </a>
                <a
                  href={PERSONAL_INFO.resume.downloadUrl}
                  download={PERSONAL_INFO.resume.filename}
                  data-cursor="DOWNLOAD"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all text-slate-300"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <Download className="w-3.5 h-3.5" />
                  DOWNLOAD
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Contact Form */}
        <motion.div custom={0.45} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp}>
          <div
            className="rounded-xl p-5"
            style={{
              background: 'rgba(0, 240, 255, 0.04)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
            }}
          >
            <div className="font-mono text-[10px] text-cyan-300 mb-4 flex items-center gap-2">
              <Send className="w-3.5 h-3.5" />
              OPEN TRANSMISSION CHANNEL
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center">
                  <Send className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="font-mono text-sm font-bold text-emerald-400">TRANSMISSION SENT</div>
                <div className="text-xs text-slate-400">Your message has been received. I will respond shortly.</div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 font-mono text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  SEND ANOTHER →
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div>
                  <label className="font-mono text-[10px] text-slate-400 block mb-1.5 tracking-wider">NAME</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="ENTER YOUR NAME"
                    className="w-full px-3.5 py-2.5 rounded-lg font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] text-slate-400 block mb-1.5 tracking-wider">EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="YOUR@EMAIL.COM"
                    className="w-full px-3.5 py-2.5 rounded-lg font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] text-slate-400 block mb-1.5 tracking-wider">MESSAGE</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="PROJECT IDEA, OPPORTUNITY, OR COLLABORATION..."
                    className="w-full px-3.5 py-2.5 rounded-lg font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  data-cursor="SEND"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-mono text-sm font-bold tracking-wider text-[#04060a] transition-all disabled:opacity-60"
                  style={{
                    background: sending ? '#334155' : 'linear-gradient(90deg, #00f0ff, #3b82f6)',
                    color: sending ? '#94a3b8' : '#04060a',
                  }}
                >
                  {sending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      TRANSMITTING...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      SEND TRANSMISSION
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        custom={0.6}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUp}
        className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center"
      >
        <div className="font-mono text-[10px] text-slate-500 tracking-wider">
          BLANI DIGITAL UNIVERSE // BUILD 2026.1
        </div>
        <div className="font-mono text-[10px] text-slate-500 tracking-wider">
          Designed &amp; Engineered by <span className="text-cyan-400">Blani Joystan D&apos;Cunha</span>
        </div>
      </motion.div>
    </section>
  );
}
