'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Waves, Anchor, Code2, Server, Award, ShieldCheck, Wifi } from 'lucide-react';

interface SystemMapProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

const NODES = [
  { id: 'home', label: 'SURFACE', code: 'HME', position: { x: 50, y: 15 }, icon: Waves, color: '#00e5d8', description: 'Entry point — surface telemetry' },
  { id: 'about', label: 'PROFILE', code: 'ABT', position: { x: 20, y: 35 }, icon: Anchor, color: '#00fff7', description: 'Operator identity & mission log' },
  { id: 'skills', label: 'TECH-STACK', code: 'SKL', position: { x: 80, y: 30 }, icon: Code2, color: '#4efef7', description: 'Technology modules & engineering' },
  { id: 'projects', label: 'REEF', code: 'PRJ', position: { x: 85, y: 55 }, icon: Server, color: '#00e5d8', description: 'Deployed systems & architectures' },
  { id: 'experience', label: 'VOYAGE', code: 'EXP', position: { x: 70, y: 75 }, icon: Anchor, color: '#88f5e0', description: 'Engineering descent history' },
  { id: 'achievements', label: 'VAULT', code: 'ACH', position: { x: 30, y: 70 }, icon: Award, color: '#ff6b5b', description: 'Trophy reef & artifacts' },
  { id: 'certifications', label: 'CREDS', code: 'CRT', position: { x: 15, y: 50 }, icon: ShieldCheck, color: '#00e5d8', description: 'Verified credentials archive' },
  { id: 'contact', label: 'COMMS', code: 'COM', position: { x: 10, y: 90 }, icon: Wifi, color: '#00fff7', description: 'Secure comms channel' },
];

const CONNECTIONS = [
  ['home', 'about'],
  ['home', 'skills'],
  ['home', 'projects'],
  ['about', 'skills'],
  ['skills', 'projects'],
  ['skills', 'experience'],
  ['skills', 'certifications'],
  ['projects', 'experience'],
  ['projects', 'achievements'],
  ['experience', 'achievements'],
  ['experience', 'certifications'],
  ['achievements', 'contact'],
  ['certifications', 'contact'],
];

function getNodePos(id: string) {
  const node = NODES.find(n => n.id === id);
  return node?.position || { x: 50, y: 50 };
}

export function SystemMap({ isOpen, onClose, activeSection, onNavigate }: SystemMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-deep/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="ocean-panel-glow rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-teal-bright/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-teal-bright to-aqua">
              <MapPin className="w-5 h-5 text-ocean-deep" />
            </div>
            <div>
              <h2 className="font-bold text-white">SONAR MAP</h2>
              <p className="font-mono text-[10px] text-teal-bright/70 tracking-wider uppercase">OCEANOS NAVIGATION GRID</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ocean-pill p-2 rounded-xl hover:bg-teal-bright/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Canvas */}
        <div className="flex-1 relative p-4 overflow-hidden">
          <div className="absolute inset-0 bg-ocean-deep/50 rounded-xl overflow-hidden">
            {/* Ocean caustics background */}
            <div className="absolute inset-0 ocean-caustics pointer-events-none" />
            
            {/* Grid lines */}
            <div className="absolute inset-0 bg-ocean-grid pointer-events-none" />
            
            {/* Light rays */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full 
              bg-gradient-to-b from-teal-bright/3 via-transparent to-transparent 
              animate-light-rays pointer-events-none" />
            
            {/* Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00e5d8" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#00fff7" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {CONNECTIONS.map(([from, to]) => {
                const fromPos = getNodePos(from);
                const toPos = getNodePos(to);
                const x1 = fromPos.x;
                const y1 = fromPos.y;
                const x2 = toPos.x;
                const y2 = toPos.y;
                
                // Curved path
                const cpX = (x1 + x2) / 2;
                const cpY = Math.min(y1, y2) - 10;
                
                return (
                  <path
                    key={`${from}-${to}`}
                    d={`M${x1}% ${y1}% Q${cpX}% ${cpY}% ${x2}% ${y2}%`}
                    stroke="url(#connectionGradient)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="6 4"
                    style={{ animation: 'dashFlow 3s linear infinite' }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {NODES.map((node) => {
              const isActive = node.id === activeSection;
              const isHovered = hoveredNode === node.id;

              return (
                <motion.button
                  key={node.id}
                  onClick={() => { onNavigate(node.id); onClose(); }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute pointer-events-auto"
                  style={{ 
                    left: `calc(${node.position.x}% - 40px)`, 
                    top: `calc(${node.position.y}% - 40px)`,
                    zIndex: isActive ? 10 : 1,
                  }}
                >
                  {/* Connection indicator for active node */}
                  {isActive && (
                    <motion.div
                      className="absolute -inset-4 rounded-full border-2 border-teal-bright/50"
                      animate={{ scale: [1, 1.3, 1], borderColor: ['#00e5d8', '#00fff7', '#00e5d8'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}

                  {/* Node Core */}
                  <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center group" style={{ background: `linear-gradient(135deg, ${node.color} 0%, ${node.color}dd 100%)` }}>
                    <node.icon className="w-7 h-7 text-ocean-deep" />
                    
                    {/* Pulse ring for active */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-teal-bright"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}

                    {/* Hover glow */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-teal-bright/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>

                  {/* Label Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 ocean-panel-glow rounded-xl p-3 text-center pointer-events-none"
                      >
                        <div className="font-bold text-white mb-1">{node.label}</div>
                        <div className="font-mono text-[10px] text-teal-bright/70 uppercase tracking-wider mb-1">{node.code}</div>
                        <div className="text-slate-300 text-[11px]">{node.description}</div>
                        {node.id === activeSection && (
                          <div className="text-teal-bright font-mono text-[10px] mt-1 animate-biolum">● CURRENT SECTOR</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Code label */}
                  <div className="absolute bottom-[-22px] left-1/2 -translate-x-1/2 font-mono text-[9px] text-teal-bright/70 uppercase tracking-wider whitespace-nowrap">
                    {node.code}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="px-4 py-3 border-t border-teal-bright/10">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-sm">
            <span className="font-mono text-teal-bright/60">LEGEND:</span>
            {NODES.map((node) => (
              <span 
                key={node.id} 
                className={`font-mono px-2 py-1 rounded ${node.id === activeSection ? 'text-teal-bright bg-teal-bright/10' : 'text-slate-400 hover:text-teal-bright'}`}
                style={{ border: `1px solid ${node.id === activeSection ? node.color : 'transparent'}` }}
              >
                {node.code}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}