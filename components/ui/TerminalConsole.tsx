'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import { PERSONAL_INFO, SKILL_CATEGORIES, PROJECTS_DATA, CERTIFICATIONS_DATA } from '@/data/portfolioData';
import { formatTerminalTimestamp } from '@/lib/utils';
import { soundFx } from '@/lib/soundEffects';

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
}

interface TerminalConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

const WELCOME_LINES: TerminalLine[] = [
  { id: 0, type: 'system', content: '╔══════════════════════════════════════════════╗' },
  { id: 1, type: 'system', content: '║  BLANI DIGITAL SYSTEM  //  TERMINAL CONSOLE  ║' },
  { id: 2, type: 'system', content: '╚══════════════════════════════════════════════╝' },
  { id: 3, type: 'system', content: 'Type [help] for available commands.' },
  { id: 4, type: 'system', content: '' },
];

function processCommand(cmd: string, onNavigate: (s: string) => void): TerminalLine[] {
  const c = cmd.trim().toLowerCase();
  const ts = formatTerminalTimestamp();
  const base = (content: string, type: TerminalLine['type'] = 'output'): TerminalLine => ({
    id: Date.now() + Math.random(),
    type,
    content,
  });

  switch (c) {
    case 'help':
      return [
        base('── AVAILABLE COMMANDS ──────────────────────────'),
        base('  about          → Identity & background'),
        base('  skills         → Tech stack & capabilities'),
        base('  projects       → Engineering projects archive'),
        base('  experience     → ZETHETA internship details'),
        base('  achievements   → Hackathon awards & vault'),
        base('  certifications → Credential archive'),
        base('  contact        → Communication gateway'),
        base('  resume         → Scroll to resume terminal'),
        base('  status         → Live system diagnostics'),
        base('  clear          → Wipe terminal output'),
        base('─────────────────────────────────────────────────'),
      ];

    case 'about':
      onNavigate('about');
      return [
        base(''),
        base('█ BLANI JOYSTAN D\'CUNHA'),
        base('  CLASSIFICATION: CSE Student & Aspiring Software Engineer'),
        base('  FOCUS:  Full-Stack • AI/ML • Cloud • Distributed Systems'),
        base('  STANCE: Student today. Engineer in progress. Builder by nature.'),
        base(''),
        base('  > Navigating to ABOUT node...', 'system'),
      ];

    case 'skills':
      onNavigate('skills');
      return [
        base(''),
        base('█ TECH LAB // SKILL MATRIX LOADED'),
        ...SKILL_CATEGORIES.map(cat => base(`  [${cat.code}] → ${cat.skills.map(s => s.name).join(', ')}`)),
        base(''),
        base('  > Navigating to SKILLS node...', 'system'),
      ];

    case 'projects':
      onNavigate('projects');
      return [
        base(''),
        base('█ PROJECT ARCHIVE // LOADING MANIFEST...'),
        ...PROJECTS_DATA.map(p => base(`  [${p.number}] ${p.name}`)),
        base(`  TOTAL: ${PROJECTS_DATA.length} production systems indexed`),
        base(''),
        base('  > Navigating to PROJECTS node...', 'system'),
      ];

    case 'experience':
      onNavigate('experience');
      return [
        base(''),
        base('█ ZETHETA — SOFTWARE / DEVOPS ENGINEERING INTERNSHIP'),
        base('  CLASSIFICATION: Engineering Intensive (10-Day Journey)'),
        base('  FOCUS: Event-driven systems, Kafka, PostgreSQL, AWS, SRE'),
        base(''),
        base('  > Navigating to EXPERIENCE node...', 'system'),
      ];

    case 'achievements':
      onNavigate('achievements');
      return [
        base(''),
        base('█ ACHIEVEMENT VAULT // RECORD PULL...'),
        base('  [GOLD]   3rd Place — 24-Hour Hackathon @ Malnad Engineering College'),
        base('  [CYAN]   SOS Bridge — Sahyadri DevHost (Featured Innovation)'),
        base('  [SILVER] Singularity Hackathon Participant'),
        base(''),
        base('  > Navigating to ACHIEVEMENTS node...', 'system'),
      ];

    case 'certifications':
      onNavigate('certifications');
      return [
        base(''),
        base('█ CREDENTIAL ARCHIVE'),
        ...CERTIFICATIONS_DATA.map(cert => base(`  [${cert.issuer}] ${cert.title}`)),
        base(''),
        base('  > Navigating to CERTIFICATIONS node...', 'system'),
      ];

    case 'contact':
      onNavigate('contact');
      return [
        base(''),
        base('█ COMM GATEWAY // OPEN CHANNEL'),
        base(`  EMAIL   → ${PERSONAL_INFO.socials.email}`),
        base(`  GITHUB  → ${PERSONAL_INFO.socials.github}`),
        base(`  LINKEDIN → ${PERSONAL_INFO.socials.linkedin}`),
        base(''),
        base('  > Navigating to CONTACT node...', 'system'),
      ];

    case 'resume':
      onNavigate('contact');
      return [
        base(''),
        base('█ RESUME // HOLOGRAPHIC READER'),
        base(`  FILE: ${PERSONAL_INFO.resume.filename}`),
        base('  STATUS: Available — Use the RESUME button in the HUD or contact section.'),
        base(''),
      ];

    case 'status':
      return [
        base(''),
        base('█ SYSTEM DIAGNOSTICS ─────────────────────────'),
        base(`  TIMESTAMP:   ${ts} UTC`),
        base('  ENVIRONMENT: DEVELOPER-WORLD v2026.1'),
        base(`  IDENTITY:    ${PERSONAL_INFO.name}`),
        base(`  AVAILABILITY: ${PERSONAL_INFO.availabilityStatus}`),
        base('  WEBGL:       ACTIVE ● '),
        base('  R3F ENGINE:  ONLINE ● '),
        base('  PARTICLES:   STREAMING ● '),
        base('─────────────────────────────────────────────────'),
        base(''),
      ];

    case 'clear':
      return [{ id: -1, type: 'system', content: '__CLEAR__' }];

    case '':
      return [];

    default:
      return [
        base(`bash: command not found: '${cmd}'`, 'error'),
        base("Type 'help' for available commands.", 'error'),
      ];
  }
}

export function TerminalConsole({ isOpen, onClose, onNavigate }: TerminalConsoleProps) {
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME_LINES);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      soundFx.playChirp(440, 0.12, 'triangle');
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Global keyboard shortcut CTRL+K
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();

    const inputLine: TerminalLine = {
      id: Date.now(),
      type: 'input',
      content: `> ${cmd}`,
    };

    const resultLines = processCommand(cmd, onNavigate);

    if (resultLines.length === 1 && resultLines[0].content === '__CLEAR__') {
      setLines(WELCOME_LINES);
    } else {
      setLines(prev => [...prev, inputLine, ...resultLines]);
    }

    if (cmd) {
      setHistory(prev => [cmd, ...prev.slice(0, 49)]);
    }
    setHistoryIdx(-1);
    setInputVal('');
    soundFx.playClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      const idx = historyIdx + 1;
      if (idx < history.length) {
        setHistoryIdx(idx);
        setInputVal(history[idx]);
      }
    } else if (e.key === 'ArrowDown') {
      const idx = historyIdx - 1;
      if (idx >= 0) {
        setHistoryIdx(idx);
        setInputVal(history[idx]);
      } else {
        setHistoryIdx(-1);
        setInputVal('');
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const lineColor: Record<string, string> = {
    input: 'text-cyan-300',
    output: 'text-slate-200',
    error: 'text-red-400',
    system: 'text-slate-400',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed inset-x-4 bottom-4 top-16 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[640px] md:top-auto md:bottom-6 md:h-[450px] z-50 flex flex-col rounded-lg overflow-hidden shadow-2xl shadow-cyan-950/60"
          style={{ border: '1px solid rgba(0, 240, 255, 0.25)' }}
        >
          {/* Title Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#07101e] border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <TerminalIcon className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs text-cyan-300 font-bold tracking-wider">
                BLANI-TERM // SYS-SHELL v1.0
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-slate-400 hidden sm:block">^K TO DISMISS</span>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition p-1 rounded hover:bg-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Output Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#040912]/95 backdrop-blur-xl space-y-0.5">
            {lines.map((line) => (
              <div key={line.id} className={`font-mono text-xs leading-relaxed ${lineColor[line.type] || 'text-slate-300'}`}>
                {line.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#050c1a] border-t border-white/10"
          >
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type a command..."
              className="flex-1 bg-transparent font-mono text-xs text-cyan-200 placeholder-slate-500 focus:outline-none caret-cyan-400"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
            />
            <button
              type="submit"
              className="font-mono text-[9px] text-slate-400 hover:text-cyan-300 transition px-2 py-0.5 border border-white/10 rounded hover:border-cyan-500/40"
            >
              RUN
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
