'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Briefcase, ChevronRight, Server, Database, Cloud, Code2, Zap, Layers } from 'lucide-react';
import { ZoneHeading } from './AboutSection';

/* Variants are declared at module scope on purpose: an inline
   `variants={{ ... ease: [...] as const }}` inside a JSX attribute trips the
   TypeScript parser, so every section keeps them hoisted. */
const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const FOCUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Architecture Onboarding': Briefcase,
  'API Design': Code2,
  'Streaming Fundamentals': Zap,
  'Persistence Layer': Database,
  'Cloud Provisioning': Cloud,
  'Observability': Zap,
  'Fault Tolerance': Server,
  'Operations & Runbooks': Layers,
  'Performance & Reliability': Server,
  'Synthesis & Delivery': Layers,
};

const SALVAGE_LOG = [
  {
    day: 1,
    phase: 'Architecture Onboarding',
    title: 'Distributed Infrastructure & Tooling Setup',
    summary:
      'Understood repository topography, local containerized services with Docker, and cloud infrastructure baselines.',
    focus: ['Docker', 'Git', 'Dev Environment'],
  },
  {
    day: 2,
    phase: 'API Design',
    title: 'API Development & Specification',
    summary:
      'Authored robust RESTful endpoints with input sanitation, request contract validation, and structured error responses.',
    focus: ['API Design', 'Node/Python', 'Contracts'],
  },
  {
    day: 3,
    phase: 'Streaming Fundamentals',
    title: 'Kafka Event-Driven Architecture',
    summary:
      'Explored topic partitions, producer/consumer group offsets, and message serialization protocols.',
    focus: ['Apache Kafka', 'Message Broker', 'Partitions'],
  },
  {
    day: 4,
    phase: 'Persistence Layer',
    title: 'PostgreSQL Schema & Index Optimization',
    summary:
      'Designed relational schemas, foreign key relationships, connection pooling, and indexing strategies.',
    focus: ['PostgreSQL', 'Database Design', 'Indexing'],
  },
  {
    day: 5,
    phase: 'Cloud Provisioning',
    title: 'AWS Cloud Infrastructure Exploration',
    summary:
      'Explored cloud services, IAM policies, compute instances, secure networking VPCs, and storage buckets.',
    focus: ['AWS', 'IAM', 'VPC', 'EC2'],
  },
  {
    day: 6,
    phase: 'Observability',
    title: 'System Monitoring & Metric Collection',
    summary:
      'Integrated health check endpoints, structured logging formats, and error rate monitoring.',
    focus: ['Telemetry', 'Metrics', 'Logging'],
  },
  {
    day: 7,
    phase: 'Fault Tolerance',
    title: 'Retry Policies & Failure Handling',
    summary:
      'Implemented backoff policies, dead-letter storage, and idempotent event consumer patterns.',
    focus: ['Fault Tolerance', 'DLQ', 'Idempotency'],
  },
  {
    day: 8,
    phase: 'Operations & Runbooks',
    title: 'Runbooks & Incident Response Workflows',
    summary:
      'Documented systematic operational procedures, service recovery protocols, and outage triage checklists.',
    focus: ['Runbooks', 'Standard Ops', 'SRE'],
  },
  {
    day: 9,
    phase: 'Performance & Reliability',
    title: 'System Reliability & Load Stress Review',
    summary:
      'Audited system bottlenecks, concurrency limits, latency benchmarks, and resilience safeguards.',
    focus: ['System Reliability', 'Benchmarking'],
  },
  {
    day: 10,
    phase: 'Synthesis & Delivery',
    title: 'End-to-End System Integration & Review',
    summary:
      'Validated complete flow: API → Processing → Kafka → PostgreSQL → Monitoring, presenting results and insights.',
    focus: ['Full Pipeline', 'Architecture Review'],
  },
];

const DEPLOYED_STACK = [
  'Event-driven systems',
  'API development',
  'Cloud / infrastructure',
  'Monitoring',
  'Kafka',
  'PostgreSQL',
  'AWS',
  'Runbooks',
  'System reliability',
];

const PIPELINE = ['API', 'PROCESSING', 'KAFKA', 'POSTGRESQL', 'MONITORING'];

const PIPELINE_TONE = [
  'text-[#8fd8d4]',
  'text-[#a8e4e0]',
  'text-[#ff8a6b]',
  'text-[#6ae8e8]',
  'text-[#9fd8d4]',
];

export function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      id="section-experience"
      className="deep-section relative px-6"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rise}
          custom={0}
        >
          <ZoneHeading
            id="experience-heading"
            title="The Wreck"
            subtitle="A sunken vessel · Zetha Engineering Intensive"
          />
        </motion.div>

        {/* The main record recovered from the wreck */}
        <motion.article
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rise}
          custom={0.15}
          className="glass-deep relative mb-14 overflow-hidden rounded-3xl p-8 md:p-10"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-[#9ff2ec]/4 via-transparent to-[#ff6b55]/4"
          />

          <div className="relative mb-7 flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#ff8a6b]/25 bg-[#33201c]/70">
              <Briefcase className="h-7 w-7 text-[#ffaa88]" />
            </div>
            <div>
              <h3 className="mb-1 text-2xl font-light tracking-tight text-[#f2fbfa]">ZETHETA</h3>
              <p className="font-mono text-[11px] tracking-[0.18em] text-[#ff9a80] uppercase">
                Software / DevOps Engineering Internship
              </p>
            </div>
          </div>

          <p className="relative mb-8 text-[15px] leading-relaxed text-[#cfe4e2]">
            Contributed to event-driven systems, API development, cloud infrastructure, and
            system reliability at Zetha. Focused on building scalable event-driven
            architectures using Kafka, PostgreSQL, and AWS.
          </p>

          {/* The pipeline, still intact */}
          <div className="glass-soft relative overflow-hidden rounded-2xl p-6">
            <h4 className="mb-5 flex items-center gap-2.5 text-[#eef8f7]">
              <Server className="h-4 w-4 text-[#ff9a80]" />
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase">
                Event pipeline architecture
              </span>
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[13px]">
              {PIPELINE.map((step, i) => (
                <React.Fragment key={step}>
                  <span className={`tracking-[0.1em] ${PIPELINE_TONE[i]}`}>{step}</span>
                  {i < PIPELINE.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5 text-[#4f8a91]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.article>

        {/* Ten days of salvage, one at a time */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rise}
          custom={0.3}
        >
          <h3 className="mb-8 flex items-center justify-center gap-2.5 text-center text-[#eef8f7]">
            <Layers className="h-4 w-4 text-[#ff9a80]" />
            <span className="font-mono text-[11px] tracking-[0.26em] uppercase">
              The 10-day descent
            </span>
          </h3>

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SALVAGE_LOG.map((entry, idx) => {
              const Icon = FOCUS_ICONS[entry.phase] ?? Layers;
              return (
                <motion.li
                  key={entry.day}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  variants={rise}
                  custom={0.36 + idx * 0.06}
                  whileHover={{ y: -3 }}
                  className="glass rounded-2xl p-5 transition-colors duration-500 hover:border-[#9fd8d4]/25"
                >
                  <div className="mb-3 flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ff9a80]/20 bg-[#33201c]/60">
                      <Icon className="h-4 w-4 text-[#ffaa88]" />
                    </span>
                    <div className="min-w-0">
                      <p className="mb-1 font-mono text-[9px] tracking-[0.2em] text-[#6fa9b0] uppercase">
                        Day {entry.day}
                      </p>
                      <h4 className="text-[14px] leading-snug font-medium text-[#eef8f7]">
                        {entry.phase}
                      </h4>
                    </div>
                  </div>
                  <p className="mb-3 text-[13px] leading-relaxed text-[#a8c4c2]">
                    {entry.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.focus.map((f) => (
                      <span key={f} className="glass-soft rounded px-2 py-0.5 font-mono text-[9px]">
                        {f}
                      </span>
                    ))}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </motion.div>

        {/* What was on the manifest */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rise}
          custom={0.9}
          className="mt-12"
        >
          <h3 className="mb-6 flex items-center justify-center gap-2.5 text-center text-[#eef8f7]">
            <Code2 className="h-4 w-4 text-[#ff9a80]" />
            <span className="font-mono text-[11px] tracking-[0.26em] uppercase">
              Technology deployed
            </span>
          </h3>
          <ul className="flex flex-wrap justify-center gap-2">
            {DEPLOYED_STACK.map((tech) => (
              <li
                key={tech}
                className="glass-soft rounded-full px-4 py-2 text-[12px] text-[#cfe4e2]"
              >
                {tech}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}