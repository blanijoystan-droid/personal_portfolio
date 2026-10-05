'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Waves } from 'lucide-react';
import { DEPTH_ZONES, SECTION_ORDER, type SectionId } from '@/lib/depthZones';
import { PERSONAL_INFO, PROJECTS_DATA, SKILL_CATEGORIES, ACHIEVEMENTS_DATA, CERTIFICATIONS_DATA } from '@/data/portfolioData';

interface TerminalConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

/** Result of running a command: output lines, or a control signal. */
type CommandResult = string[] | '__CLEAR__' | '__CLOSE__' | { dive: SectionId; note: string };

interface Command {
  help: string;
  run: (args: string[]) => CommandResult | { dive: SectionId; note: string };
}

const ZONE_ALIASES: Record<string, SectionId> = {
  surface: 'home',
  home: 'home',
  about: 'about',
  profile: 'about',
  reef: 'about',
  skills: 'skills',
  cave: 'skills',
  tech: 'skills',
  projects: 'projects',
  facility: 'projects',
  experience: 'experience',
  wreck: 'experience',
  voyage: 'experience',
  achievements: 'achievements',
  treasure: 'achievements',
  vault: 'achievements',
  certifications: 'certifications',
  archive: 'certifications',
  creds: 'certifications',
  contact: 'contact',
  abyss: 'contact',
  comms: 'contact',
};

const COMMANDS: Record<string, Command> = {
  help: {
    help: 'List every command',
    run: () => [
      'BLANI — THE DEEP · DIVE TERMINAL',
      '────────────────────────────────────────────',
      '  help              This list',
      '  surface           Return to the surface',
      '  about             Shallow reef — profile',
      '  skills            Coral cave — technologies',
      '  projects          The facility — systems',
      '  experience        The wreck — engineering',
      '  achievements      Treasure reef — hackathons',
      '  certifications    The archive — credentials',
      '  contact           The abyss — comms',
      '  dive <zone>       Descend to a named zone',
      '  depth             Current depth reading',
      '  sonar             List all soundings',
      '  projects.list     Deployed systems',
      '  skills.list       Technology modules',
      '  vaults            Hackathon artefacts',
      '  archive           Credential capsules',
      '  contact.info      Operator frequencies',
      '  clear             Clear the terminal',
      '  exit              Close the terminal',
    ],
  },

  surface: { help: 'Return to the surface', run: () => ({ dive: 'home', note: '' }) },
  about: { help: 'Shallow reef — profile', run: () => ({ dive: 'about', note: '' }) },
  skills: { help: 'Coral cave — technologies', run: () => ({ dive: 'skills', note: '' }) },
  projects: { help: 'The facility — systems', run: () => ({ dive: 'projects', note: '' }) },
  experience: { help: 'The wreck — engineering', run: () => ({ dive: 'experience', note: '' }) },
  achievements: { help: 'Treasure reef — hackathons', run: () => ({ dive: 'achievements', note: '' }) },
  certifications: { help: 'The archive — credentials', run: () => ({ dive: 'certifications', note: '' }) },
  contact: { help: 'The abyss — comms', run: () => ({ dive: 'contact', note: '' }) },

  dive: {
    help: 'Descend to a named zone',
    run: (args) => {
      const target = ZONE_ALIASES[(args[0] ?? '').toLowerCase()];
      if (!target) {
        return [
          `UNKNOWN ZONE: ${args[0] ?? '(none)'}`,
          'TRY: SURFACE, REEF, CAVE, FACILITY, WRECK, TREASURE, ARCHIVE, ABYSS',
        ];
      }
      const z = DEPTH_ZONES.find((d) => d.id === target)!;
      return { dive: target, note: `${z.zone} · ${z.depth} M — ${z.descriptor}` };
    },
  },

  depth: {
    help: 'Current depth reading',
    run: () => {
      const rows = DEPTH_ZONES.map((z) => `  ${String(z.depth).padStart(4)} M   ${z.zone}`);
      return ['SOUNDINGS — SURFACE TO ABYSS', '────────────────────────────────────', ...rows];
    },
  },

  sonar: {
    help: 'List all soundings',
    run: () => DEPTH_ZONES.map((z) => `${z.zone.padEnd(16)} ${String(z.depth).padStart(4)} M  ${z.descriptor}`),
  },

  'projects.list': {
    help: 'Deployed systems',
    run: () => [
      'DEPLOYED SYSTEMS',
      '────────────────────────────────────',
      ...PROJECTS_DATA.map((p) => `  ${p.number}  ${p.name}`),
      '',
      'Detail: projects <number>',
    ],
  },

  projects_detail: {
    help: 'Show a system by number',
    run: (args) => {
      const num = (args[0] ?? '').padStart(3, '0');
      const project = PROJECTS_DATA.find((p) => p.number === num);
      if (!project) return [`NO SYSTEM WITH ID ${args[0] ?? '(none)'}`, 'TRY: 001, 002, 003, 004'];
      return [
        `SYSTEM ${project.number} — ${project.name}`,
        '────────────────────────────────────',
        project.description,
        '',
        'STACK: ' + project.technologies.join(', '),
        '',
        'FEATURES:',
        ...project.keyFeatures.map((f) => `  · ${f}`),
      ];
    },
  },

  'skills.list': {
    help: 'Technology modules',
    run: () =>
      SKILL_CATEGORIES.flatMap((cat) => [
        `${cat.name.toUpperCase()} — ${cat.code}`,
        `  ${cat.skills.map((s) => s.name).join(', ')}`,
        '',
      ]),
  },

  vaults: {
    help: 'Hackathon artefacts',
    run: () => [
      'TREASURE REEF — ARTEFACTS RECOVERED',
      '────────────────────────────────────',
      ...ACHIEVEMENTS_DATA.map((a) => `  ${a.title}\n    ${a.event ?? 'Expedition record'}`),
    ],
  },

  archive: {
    help: 'Credential capsules',
    run: () => [
      'THE ARCHIVE — SEALED CREDENTIALS',
      '────────────────────────────────────',
      ...CERTIFICATIONS_DATA.map((c) => `  ${c.title}\n    ${c.issuer}`),
    ],
  },

  'contact.info': {
    help: 'Operator frequencies',
    run: () => [
      'OPERATOR FREQUENCIES',
      '────────────────────────────────────',
      `  EMAIL    ${PERSONAL_INFO.socials.email}`,
      `  GITHUB   ${PERSONAL_INFO.socials.github}`,
      `  LINKEDIN ${PERSONAL_INFO.socials.linkedin}`,
      '',
      PERSONAL_INFO.availabilityStatus,
    ],
  },

  whoami: {
    help: 'Operator identity',
    run: () => [
      PERSONAL_INFO.name,
      PERSONAL_INFO.title,
      PERSONAL_INFO.subtitle,
      '',
      PERSONAL_INFO.philosophy,
    ],
  },

  clear: { help: 'Clear the terminal', run: () => '__CLEAR__' },
  exit: { help: 'Close the terminal', run: () => '__CLOSE__' },
  quit: { help: 'Close the terminal', run: () => '__CLOSE__' },
};

export function TerminalConsole({ isOpen, onClose, onNavigate }: TerminalConsoleProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  if (!isOpen) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const raw = input.trim();
    if (!raw) return;

    const [name, ...args] = raw.split(/\s+/);
    setHistory((h) => [...h, raw]);
    setInput('');
    setHistoryIndex(-1);

    // Normalise "projects 001" and "projects.detail 001" into one command.
    let key = name.toLowerCase();
    if (key === 'projects' && args.length > 0 && /^\d+$/.test(args[0]!)) {
      key = 'projects_detail';
    }

    const command = COMMANDS[key];

    if (!command) {
      setLines((l) => [
        ...l,
        `> ${raw}`,
        `UNKNOWN COMMAND: ${name}. TYPE 'help' FOR THE COMMAND LIST.`,
      ]);
      return;
    }

    const result = command.run(args);

    if (result === '__CLEAR__') {
      setLines([]);
      return;
    }
    if (result === '__CLOSE__') {
      onClose();
      return;
    }
    if (!Array.isArray(result)) {
      const zone = DEPTH_ZONES.find((z) => z.id === result.dive)!;
      setLines((l) => [
        ...l,
        `> ${raw}`,
        result.note || `DESCENDING TO ${zone.zone} · ${zone.depth} M`,
      ]);
      onNavigate(result.dive);
      return;
    }

    setLines((l) => [...l, `> ${raw}`, ...result]);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (historyIndex < history.length - 1) {
        const next = historyIndex + 1;
        setHistoryIndex(next);
        setInput(history[history.length - 1 - next] ?? '');
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex > 0) {
        const next = historyIndex - 1;
        setHistoryIndex(next);
        setInput(history[history.length - 1 - next] ?? '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) setInput(matches[0]!);
      else if (matches.length > 1) setLines((l) => [...l, matches.join('   ')]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020c14]/85 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Dive terminal"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 14 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#6fd0cc]/20 bg-[#03121e]/95"
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-[#6fd0cc]/12 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Waves className="h-4 w-4 text-[#8fd8d4]" />
            <span className="font-mono text-[11px] tracking-[0.2em] text-[#a8e4e0] uppercase">
              Dive Terminal
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-[9px] tracking-[0.18em] text-[#4f8a91] uppercase sm:inline">
              Ctrl+K to close
            </span>
            <button
              onClick={onClose}
              aria-label="Close terminal"
              className="rounded-lg p-1.5 text-[#7fb8bd] transition-colors hover:bg-[#123444] hover:text-[#d6f7f4]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
          <pre className="whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-[#bfe4e2]">
            {lines.length === 0 ? (
              <span className="text-[#5d9aa1]">
{`BLANI — THE DEEP
Dive terminal ready.

This is the operator console for the descent.
Type 'help' for the command list, or 'depth' to read the soundings.`}
              </span>
            ) : (
              lines.join('\n')
            )}
          </pre>
        </div>

        {/* Prompt */}
        <form onSubmit={submit} className="flex items-center gap-2 border-t border-[#6fd0cc]/12 px-4 py-3">
          <span className="shrink-0 font-mono text-[12px] text-[#8fd8d4]">blani@deep</span>
          <span className="shrink-0 font-mono text-[12px] text-[#4f8a91]">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal input"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-[#d6f7f4] caret-[#9ff2ec] outline-none placeholder:text-[#3f7078]"
            placeholder="help"
          />
        </form>
      </motion.div>
    </motion.div>
  );
}

export { SECTION_ORDER };
