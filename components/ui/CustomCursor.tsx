'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function checkIsTouch(): boolean {
  if (typeof window === 'undefined') return true;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch] = useState<boolean>(checkIsTouch);

  useEffect(() => {
    // Disable on touch devices
    if (isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, textarea, [data-cursor], [role="button"]');
      if (interactive) {
        setIsHovered(true);
        const customText = interactive.getAttribute('data-cursor');
        setHoverText(customText || '');
      } else {
        setIsHovered(false);
        setHoverText('');
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isTouch]);

  if (isTouch || !isVisible) return null;

  return (
    <>
      {/* Central pointer point */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full bg-cyan-400 mix-blend-screen"
        animate={{
          x: mousePos.x - 3,
          y: mousePos.y - 3,
          scale: isHovered ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 600, mass: 0.1 }}
        style={{ width: 6, height: 6 }}
      />

      {/* Outer interactive ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-cyan-400/80 flex items-center justify-center backdrop-blur-[1px]"
        animate={{
          x: mousePos.x - (isHovered ? 24 : 16),
          y: mousePos.y - (isHovered ? 24 : 16),
          width: isHovered ? 48 : 32,
          height: isHovered ? 48 : 32,
          borderColor: isHovered ? 'rgba(0, 240, 255, 0.9)' : 'rgba(0, 240, 255, 0.35)',
          backgroundColor: isHovered ? 'rgba(0, 240, 255, 0.08)' : 'rgba(0, 240, 255, 0.01)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 0.2 }}
      >
        {hoverText && (
          <span className="font-mono text-[8px] font-bold tracking-widest text-cyan-300 uppercase pointer-events-none select-none">
            {hoverText}
          </span>
        )}
      </motion.div>
    </>
  );
}
