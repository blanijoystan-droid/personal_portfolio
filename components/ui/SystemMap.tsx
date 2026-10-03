'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { soundFx } from '@/lib/soundEffects';

interface SystemMapProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

interface MapNode {
  id: string;
  label: string;
  code: string;
  col: number; // 0–4 grid column
  row: number; // 0–4 grid row
  color: string;
}

const MAP_NODES: MapNode[] = [
  { id: 'achievements', label: 'ACHIEVEMENTS', code: 'ACH-05', col: 2, row: 0, color: '#f59e0b' },
  { id: 'about',        label: 'ABOUT',        code: 'BIO-01', col: 0, row: 1, color: '#00f0ff' },
  { id: 'home',         label: 'BLANI CORE',   code: 'CORE-00', col: 2, row: 1, color: '#ffffff' },
  { id: 'projects',     label: 'PROJECTS',     code: 'PRJ-03', col: 4, row: 1, color: '#10b981' },
  { id: 'skills',       label: 'TECH LAB',     code: 'SKL-02', col: 0, row: 2, color: '#3b82f6' },
  { id: 'experience',   label: 'EXPERIENCE',   code: 'EXP-04', col: 2, row: 2, color: '#8b5cf6' },
  { id: 'certifications', label: 'CERTS',      code: 'CRT-06', col: 4, row: 2, color: '#ec4899' },
  { id: 'contact',      label: 'CONTACT',      code: 'COM-07', col: 2, row: 3, color: '#06b6d4' },
];

// SVG connection lines between nodes (as [fromId, toId] pairs)
const CONNECTIONS = [
  ['home', 'achievements'],
  ['home', 'about'],
  ['home', 'projects'],
  ['home', 'experience'],
  ['about', 'skills'],
  ['projects', 'certifications'],
  ['experience', 'contact'],
];

const COLS = 5;
const ROWS = 4;
const CELL_W = 100 / (COLS - 1);
const CELL_H = 100 / (ROWS - 1);

function getNodePos(n: MapNode): { x: number; y: number } {
  return { x: n.col * CELL_W, y: n.row * CELL_H };
}

export function SystemMap({ isOpen, onClose, activeSection, onNavigate }: SystemMapProps) {
  const handleSelect = (id: string) => {
    onNavigate(id);
    soundFx.playWarp();
    onClose();
  };

  const posMap: Record<string, { x: number; y: number }> = {};
  MAP_NODES.forEach(n => { posMap[n.id] = getNodePos(n); });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020408]/80 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl shadow-black/60"
            style={{ border: '1px solid rgba(0, 240, 255, 0.2)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#070f1e] border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-xs text-cyan-300 font-bold tracking-wider">
                  BLANI UNIVERSE // CONSTELLATION MAP
                </span>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition p-1 rounded hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Map area */}
            <div className="bg-[#040912] p-6 relative" style={{ minHeight: 320 }}>
              {/* Decorative scanner line */}
              <div className="absolute inset-0 bg-tech-grid opacity-40 pointer-events-none" />

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-6 w-[calc(100%-48px)] h-[calc(100%-48px)] pointer-events-none"
              >
                {CONNECTIONS.map(([fromId, toId]) => {
                  const from = posMap[fromId];
                  const to = posMap[toId];
                  if (!from || !to) return null;
                  return (
                    <line
                      key={`${fromId}-${toId}`}
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke="rgba(0, 240, 255, 0.15)"
                      strokeWidth="0.5"
                      strokeDasharray="2 3"
                    />
                  );
                })}
              </svg>

              {/* Node Badges */}
              <div className="relative" style={{ minHeight: 260 }}>
                {MAP_NODES.map((node) => {
                  const pos = getNodePos(node);
                  const isActive = activeSection === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => handleSelect(node.id)}
                      data-cursor="WARP"
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group transition-all duration-150 focus:outline-none"
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                      }}
                    >
                      {/* Node dot */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 group-hover:scale-125 ${isActive ? 'scale-125' : ''}`}
                        style={{
                          borderColor: node.color,
                          backgroundColor: isActive ? node.color : `${node.color}22`,
                          boxShadow: isActive ? `0 0 14px ${node.color}` : `0 0 6px ${node.color}55`,
                        }}
                      >
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        )}
                      </div>

                      {/* Label */}
                      <span
                        className="font-mono text-[8px] tracking-wider font-semibold whitespace-nowrap group-hover:opacity-100 transition"
                        style={{ color: isActive ? node.color : '#94a3b8', opacity: isActive ? 1 : 0.75 }}
                      >
                        {node.code}
                      </span>
                      <span
                        className="font-mono text-[7px] tracking-wider whitespace-nowrap hidden sm:block"
                        style={{ color: isActive ? node.color : '#64748b' }}
                      >
                        {node.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#040912] border-t border-white/10 px-5 py-2 flex justify-between items-center">
              <span className="font-mono text-[9px] text-slate-400">CLICK A NODE TO WARP TO THAT SECTION</span>
              <span className="font-mono text-[9px] text-cyan-400">ACTIVE: {activeSection.toUpperCase()}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
