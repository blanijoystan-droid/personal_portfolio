'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const DESCENT_STEPS = [
  'SEALING THE DIVE HATCH',
  'FILLING BALLAST',
  'PASSING THE SUNLIT SURFACE',
  'ENTERING THE SHALLOW REEF',
  'DESCENDING THROUGH THE CAVE',
  'APPROACHING THE FACILITY',
  'LOST SIGNAL · CONTINUING',
];

/**
 * LoadingScreen — the descent itself.
 *
 * Deliberately short and skippable. It reports a real descent rather than an
 * arbitrary progress bar, so the loading state already teaches the interaction
 * the visitor is about to have.
 */
export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(DESCENT_STEPS[0]!);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tick = reduced ? 24 : 38;
    const increment = reduced ? 16 : 9;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * increment + increment * 0.4, 100);

        const stepIndex = Math.min(
          Math.floor((next / 100) * DESCENT_STEPS.length),
          DESCENT_STEPS.length - 1
        );
        setStep(DESCENT_STEPS[stepIndex]!);

        if (next >= 100) {
          window.clearInterval(timer);
          window.setTimeout(() => setFading(true), reduced ? 80 : 320);
        }

        return next;
      });
    }, tick);

    return () => window.clearInterval(timer);
  }, []);

  const finish = () => {
    if (fading) onComplete();
  };

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label="Descending into the deep ocean"
      initial={{ opacity: 1 }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={finish}
      onClick={() => setFading(true)}
      className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-[#020c14] px-6 text-[#d6f7f4]"
    >
      {/* Light from the surface, still visible above at this depth */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(26,92,116,0.55)_0%,transparent_70%)]"
      />

      <div className="relative w-full max-w-sm">
        <p className="mb-3 text-center font-mono text-[10px] tracking-[0.34em] text-[#6fa9b0] uppercase">
          Blani — The Deep
        </p>

        <h1 className="mb-10 text-center text-2xl font-light tracking-[0.18em] text-[#f2fbfa] uppercase sm:text-3xl">
          Descending
        </h1>

        {/* Depth readout counts down as the bar fills */}
        <div className="mb-3 flex items-end justify-between">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#6fa9b0]/80 uppercase">
            {step}
          </span>
          <span className="font-mono text-xl font-light tabular-nums text-[#cfe9e6]">
            {Math.round(progress * 8.9)}
            <span className="ml-0.5 text-[11px] text-[#6fa9b0]">M</span>
          </span>
        </div>

        {/* Descent bar */}
        <div className="h-px w-full overflow-hidden bg-[#123444]">
          <motion.div
            className="h-px bg-gradient-to-r from-[#2f7d8a] via-[#8fd8d4] to-[#d6f7f4]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex justify-between font-mono text-[9px] tracking-[0.18em] text-[#3f7078] uppercase">
          <span>Surface · 0 M</span>
          <span>Abyss · 890 M</span>
        </div>

        <p className="mt-10 text-center font-mono text-[9px] tracking-[0.24em] text-[#3f7078] uppercase">
          Click to skip
        </p>
      </div>
    </motion.div>
  );
}