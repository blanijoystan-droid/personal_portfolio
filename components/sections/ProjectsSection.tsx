'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import { GitBranch, ExternalLink, ChevronRight, X } from 'lucide-react';
import { PROJECTS_DATA } from '@/data/portfolioData';
import { Project } from '@/types/portfolio';
import { soundFx } from '@/lib/soundEffects';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as const } }),
};

const ARCH_TYPE_COLORS: Record<string, string> = {
  'kafka-streams': '#00f0ff',
  'data-pipeline': '#3b82f6',
  'queue-system': '#10b981',
  'offline-mesh': '#8b5cf6',
};

function ArchitectureFlow({ project }: { project: Project }) {
  const color = ARCH_TYPE_COLORS[project.architectureType] || '#00f0ff';
  return (
    <div className="flex flex-col gap-2 my-4">
      <div className="font-mono text-[10px] text-slate-400 tracking-widest uppercase mb-1">
        SYSTEM ARCHITECTURE // {project.architectureType.replace('-', ' ').toUpperCase()}
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {project.architectureNodes.map((node, idx) => (
          <React.Fragment key={node.id}>
            <div
              className="group relative px-3 py-2 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all duration-150 cursor-default"
              style={{
                background: `${color}15`,
                border: `1px solid ${color}40`,
                color: color,
              }}
              title={node.desc}
            >
              <span className="text-[8px] text-slate-500 block">{node.type.toUpperCase()}</span>
              {node.label}
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max max-w-[200px] z-20 hidden group-hover:block">
                <div
                  className="px-2.5 py-1.5 rounded text-[9px] font-mono shadow-xl"
                  style={{
                    background: 'rgba(5, 10, 20, 0.97)',
                    border: `1px solid ${color}40`,
                    color: '#cbd5e1',
                  }}
                >
                  {node.desc}
                </div>
              </div>
            </div>
            {idx < project.architectureNodes.length - 1 && (
              <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  isInView,
  onSelect,
}: {
  project: Project;
  index: number;
  isInView: boolean;
  onSelect: (p: Project) => void;
}) {
  const color = ARCH_TYPE_COLORS[project.architectureType] || '#00f0ff';

  return (
    <motion.div
      custom={0.2 + index * 0.1}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className="group rounded-xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-250"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${color}50`;
        (e.currentTarget as HTMLDivElement).style.background = `${color}08`;
        soundFx.playHover();
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
      }}
      onClick={() => { onSelect(project); soundFx.playWarp(); }}
      data-cursor="OPEN"
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(project)}
      aria-label={`Open project: ${project.name}`}
    >
      {/* Number + Title */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-mono text-[9px] tracking-widest" style={{ color: `${color}80` }}>
            PROJECT // {project.number}
          </span>
          <h3 className="text-base font-bold text-white mt-0.5 leading-tight">{project.name}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{project.subtitle}</p>
        </div>
        <div
          className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{project.description}</p>

      {/* Tech Chips */}
      <div className="flex flex-wrap gap-1">
        {project.technologies.slice(0, 5).map(tech => (
          <span
            key={tech}
            className="px-2 py-0.5 rounded font-mono text-[9px] tracking-wider"
            style={{
              background: `${color}12`,
              border: `1px solid ${color}30`,
              color: `${color}CC`,
            }}
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 5 && (
          <span className="font-mono text-[9px] text-slate-500">+{project.technologies.length - 5}</span>
        )}
      </div>

      {/* Metric highlight */}
      {project.metricsOrHighlight && (
        <div
          className="text-[10px] font-mono italic text-slate-400 pt-2 border-t border-white/10"
        >
          ◆ {project.metricsOrHighlight}
        </div>
      )}

      {/* Expand hint */}
      <div className="flex items-center gap-1 text-[10px] font-mono mt-auto" style={{ color }}>
        <ChevronRight className="w-3 h-3" />
        VIEW FULL ARCHITECTURE
      </div>
    </motion.div>
  );
}

function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const color = ARCH_TYPE_COLORS[project.architectureType] || '#00f0ff';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020408]/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
        style={{ background: '#050c1a', border: `1px solid ${color}35` }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-xl"
          style={{ background: 'rgba(5, 12, 26, 0.97)' }}
        >
          <div>
            <span className="font-mono text-[10px] tracking-widest" style={{ color: `${color}90` }}>
              PROJECT // {project.number}
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">{project.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Description + Problem Solved */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div
              className="p-4 rounded-lg"
              style={{ background: `${color}08`, border: `1px solid ${color}25` }}
            >
              <div className="font-mono text-[9px] tracking-widest mb-2" style={{ color }}>SYSTEM OVERVIEW</div>
              <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="font-mono text-[9px] tracking-widest text-slate-400 mb-2">PROBLEM SOLVED</div>
              <p className="text-sm text-slate-300 leading-relaxed">{project.problemSolved}</p>
            </div>
          </div>

          {/* Architecture Flow */}
          <div className="p-4 rounded-lg" style={{ background: 'rgba(5,10,18,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <ArchitectureFlow project={project} />
          </div>

          {/* Tech Stack */}
          <div>
            <div className="font-mono text-[10px] tracking-widest text-slate-400 mb-2 uppercase">Tech Stack</div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(t => (
                <span
                  key={t}
                  className="px-3 py-1 rounded font-mono text-xs font-semibold"
                  style={{ background: `${color}15`, border: `1px solid ${color}35`, color }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div>
            <div className="font-mono text-[10px] tracking-widest text-slate-400 mb-2 uppercase">Key Features</div>
            <div className="grid sm:grid-cols-2 gap-1.5">
              {project.keyFeatures.map((f) => (
                <div key={f} className="flex items-start gap-2 text-xs text-slate-300">
                  <span style={{ color }}>▸</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-white/10">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="OPEN"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold tracking-wider transition-all"
              style={{ background: `${color}15`, border: `1px solid ${color}35`, color }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = `${color}25`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = `${color}15`;
              }}
            >
              <GitBranch className="w-4 h-4" />
              GITHUB
            </a>
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="VIEW"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold tracking-wider bg-white/5 border border-white/15 text-slate-300 hover:border-white/30 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                LIVE DEMO
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <section
        id="section-projects"
        ref={ref}
        aria-label="Projects"
        className="relative min-h-screen flex flex-col justify-center px-6 py-24 max-w-5xl mx-auto"
      >
        <motion.div custom={0} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="flex items-center gap-3 mb-3">
          <span className="w-6 h-px bg-emerald-400" />
          <span className="font-mono text-[11px] tracking-widest text-emerald-400 uppercase">NODE: PRJ-03 // PROJECT ARCHIVE</span>
          <span className="w-6 h-px bg-emerald-400" />
        </motion.div>

        <motion.h2 custom={0.1} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          PROJECT <span className="text-emerald-400">ARCHIVE</span>
        </motion.h2>

        <motion.p custom={0.2} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} className="text-slate-400 text-sm mb-10 max-w-lg">
          Production-grade engineering systems. Click any project to inspect the architecture and tech stack.
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-5">
          {PROJECTS_DATA.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isInView={isInView}
              onSelect={setSelectedProject}
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
