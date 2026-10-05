'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import { X, Code2, Server, Database, Cloud, Zap, GitBranch, ExternalLink, Layers } from 'lucide-react';
import { PROJECTS_DATA } from '@/data/portfolioData';
import type { Project } from '@/types/portfolio';
import { ZoneHeading } from './AboutSection';

/* Hoisted: an inline `variants={{ ... as const }}` in a JSX attribute breaks
   the TypeScript parser, so every section keeps its variants at module scope. */
const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const TECH_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Node.js': Server,
  'Apache Kafka': Zap,
  Kafka: Zap,
  RabbitMQ: Server,
  Redis: Database,
  PostgreSQL: Database,
  Docker: Cloud,
  Python: Code2,
  AWS: Cloud,
  Flutter: Code2,
  Dart: Code2,
  Supabase: Database,
  React: Code2,
  Express: Server,
  'Socket.io': Zap,
  'Tailwind CSS': Code2,
  'Cellular Protocol': Zap,
};

const CHIP_TONES = [
  'text-[#a8e4e0] border-[#a8e4e0]/20',
  'text-[#8fd8d4] border-[#8fd8d4]/20',
  'text-[#c8f6f4] border-[#c8f6f4]/20',
  'text-[#6ae8e8] border-[#6ae8e8]/20',
];

export function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section
      ref={ref}
      id="section-projects"
      className="deep-section relative px-6"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rise}
          custom={0}
        >
          <ZoneHeading
            id="projects-heading"
            title="The Facility"
            subtitle="Deployed systems recovered from the seabed"
          />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PROJECTS_DATA.map((project, idx) => (
            <motion.article
              key={project.id}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={rise}
              custom={0.12 + idx * 0.1}
              whileHover={{ y: -5 }}
              className="glass-deep group relative flex h-full flex-col overflow-hidden rounded-3xl p-7"
            >
              {/* Chamber number, engraved into the hull plating */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-2 right-5 font-mono text-6xl font-light text-[#9ff2ec]/[0.06]"
              >
                {project.number}
              </span>

              <div className="relative mb-5">
                <p className="mb-2.5 font-mono text-[9px] tracking-[0.24em] text-[#6fa9b0] uppercase">
                  Chamber {project.number} · {project.architectureType?.replace(/-/g, ' ')}
                </p>
                <h3 className="mb-2 text-xl leading-snug font-light tracking-tight text-[#f2fbfa]">
                  {project.name}
                </h3>
                <p className="text-[12px] leading-relaxed text-[#8fb4b2]">{project.subtitle}</p>
              </div>

              <p className="relative mb-6 text-[13px] leading-relaxed text-[#b8d4d2]">
                {project.description}
              </p>

              {/* Problem solved */}
              <div className="relative mb-6">
                <h4 className="mb-2 flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] text-[#9ff2ec] uppercase">
                  <Server className="h-3 w-3" />
                  Problem solved
                </h4>
                <p className="text-[12px] leading-relaxed text-[#a8c4c2]">
                  {project.problemSolved}
                </p>
              </div>

              {/* Features */}
              <div className="relative mb-6">
                <h4 className="mb-2.5 flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] text-[#9ff2ec] uppercase">
                  <Zap className="h-3 w-3" />
                  Key features
                </h4>
                <ul className="space-y-1.5">
                  {project.keyFeatures.slice(0, 4).map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2 text-[12px] leading-relaxed text-[#a8c4c2]"
                    >
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#9ff2ec]/60" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stack */}
              <div className="relative mb-7">
                <h4 className="mb-2.5 flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] text-[#9ff2ec] uppercase">
                  <Code2 className="h-3 w-3" />
                  Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={tech}
                      className={`rounded-md border px-2 py-0.5 font-mono text-[9px] ${CHIP_TONES[i % CHIP_TONES.length]}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions, pushed to the bottom so the cards line up */}
              <div className="relative mt-auto flex gap-2 pt-5">
                <button
                  onClick={() => setSelected(project)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#d6f7f4] px-4 py-2.5 font-mono text-[11px] font-medium tracking-[0.1em] text-[#03202b] transition-all duration-500 hover:bg-white"
                >
                  <Layers className="h-3.5 w-3.5" />
                  Enter chamber
                </button>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.name} on GitHub`}
                    className="glass-soft flex items-center justify-center gap-2 rounded-full px-4 py-2.5 font-mono text-[11px] tracking-[0.1em] text-[#cfe9e6] transition-colors duration-500"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Source
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Inside the chamber */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#020c14]/85 p-4 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.name} details`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 18 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-deep max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl"
            >
              <div className="p-7 md:p-10">
                <div className="mb-8 flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="mb-2.5 font-mono text-[9px] tracking-[0.24em] text-[#6fa9b0] uppercase">
                      Chamber {selected.number} · {selected.architectureType?.replace(/-/g, ' ')}
                    </p>
                    <h3 className="mb-2 text-2xl leading-snug font-light tracking-tight text-[#f2fbfa] sm:text-3xl">
                      {selected.name}
                    </h3>
                    <p className="text-[13px] text-[#8fb4b2]">{selected.subtitle}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    aria-label="Close"
                    className="glass-soft shrink-0 rounded-full p-2.5 text-[#7fb8bd] transition-colors duration-300 hover:text-[#d6f7f4]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="mb-2.5 font-mono text-[10px] tracking-[0.22em] text-[#9ff2ec] uppercase">
                      Problem solved
                    </h4>
                    <p className="text-[14px] leading-relaxed text-[#cfe4e2]">
                      {selected.problemSolved}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-3 font-mono text-[10px] tracking-[0.22em] text-[#9ff2ec] uppercase">
                      Technology
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.technologies.map((tech) => {
                        const Icon = TECH_ICONS[tech] ?? Code2;
                        return (
                          <span
                            key={tech}
                            className="glass-soft flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-[#cfe4e2]"
                          >
                            <Icon className="h-3.5 w-3.5 text-[#8fd8d4]" />
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 font-mono text-[10px] tracking-[0.22em] text-[#9ff2ec] uppercase">
                      Key features
                    </h4>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {selected.keyFeatures.map((feature) => (
                        <li
                          key={feature}
                          className="flex gap-2 text-[13px] leading-relaxed text-[#cfe4e2]"
                        >
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#9ff2ec]/60" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Architecture, as a chain of connected components */}
                  <div>
                    <h4 className="mb-4 font-mono text-[10px] tracking-[0.22em] text-[#9ff2ec] uppercase">
                      Architecture
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      {selected.architectureNodes.map((node, i) => (
                        <React.Fragment key={node.id}>
                          <div className="glass-soft rounded-xl px-3 py-2">
                            <p className="font-mono text-[9px] tracking-[0.14em] text-[#6fa9b0] uppercase">
                              {node.type}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[#cfe4e2]">{node.label}</p>
                          </div>
                          {i < selected.architectureNodes.length - 1 && (
                            <span aria-hidden="true" className="text-[#3f7078]">
                              →
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-9 flex gap-3">
                  {selected.githubUrl && (
                    <a
                      href={selected.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#d6f7f4] px-5 py-3 font-mono text-[12px] font-medium tracking-[0.1em] text-[#03202b] transition-colors duration-500 hover:bg-white"
                    >
                      <GitBranch className="h-3.5 w-3.5" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}