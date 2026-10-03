'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("INITIALIZING 3D ENVIRONMENT...");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const steps = [
      { at: 20, label: "CALIBRATING GEOMETRY MATRICES..." },
      { at: 45, label: "BOOTING EVENT-DRIVEN GRAPHICS ENGINE..." },
      { at: 70, label: "SPAWNING ORBITAL TELEMETRY NODES..." },
      { at: 92, label: "SYNCHRONIZING DIGITAL CORE..." },
      { at: 100, label: "SYSTEM READY // WELCOME" },
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setVisible(false);
            setTimeout(() => onComplete(), 300);
          }, 350);
          return 100;
        }

        const match = steps.find((s) => next >= s.at && prev < s.at);
        if (match) {
          setCurrentStep(match.label);
        }

        return next;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!visible) return null;

  // Generate ASCII block progress bar [████████░░░░░]
  const totalBlocks = 20;
  const filledBlocks = Math.round((progress / 100) * totalBlocks);
  const asciiBar = '█'.repeat(filledBlocks) + '░'.repeat(totalBlocks - filledBlocks);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030509] text-white select-none px-6"
    >
      {/* Ambient background glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center">
        {/* Header Monogram / Title */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-[11px] tracking-[0.25em] text-cyan-400 uppercase">
            BLANI JOYSTAN DCUNHA // DIGITAL SYSTEM
          </span>
        </div>

        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6">
          DIGITAL LAB & EXPLORATION CORE
        </h1>

        {/* ASCII Progress Bar Box */}
        <div className="w-full bg-[#080d1a] border border-cyan-500/30 rounded-lg p-5 font-mono shadow-2xl shadow-cyan-950/40">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span className="text-cyan-300 font-semibold">{currentStep}</span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>

          {/* ASCII bar rendering */}
          <div className="text-cyan-400 font-mono text-sm tracking-wider my-2 font-bold select-none overflow-hidden text-center">
            [{asciiBar}]
          </div>

          {/* Micro visual progress line */}
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-3">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-400">
            <span>ENVIRONMENT: PROD-UNIVERSE</span>
            <span>ARCHITECTURE: 3D-R3F-NEXT15</span>
            <span>STATUS: ONLINE</span>
          </div>
        </div>

        <div className="mt-6 font-mono text-xs text-slate-400 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span>PRESS ANYWHERE TO SKIP OR WAIT FOR AUTO-CALIBRATION</span>
        </div>
      </div>
    </motion.div>
  );
}