'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Critical path UI — loaded immediately
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ContactSection } from '@/components/sections/ContactSection';

// Navigation
import { FloatingNav } from '@/components/navigation/FloatingNav';

// HUD UI components
import { HudOverlay } from '@/components/ui/HudOverlay';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { TerminalConsole } from '@/components/ui/TerminalConsole';
import { SystemMap } from '@/components/ui/SystemMap';

// 3D Scene — dynamically imported to avoid SSR issues with WebGL
const SceneCanvas = dynamic(
  () => import('@/components/3d/SceneCanvas').then(m => m.SceneCanvas),
  { ssr: false, loading: () => null }
);

type SectionId = 'home' | 'about' | 'skills' | 'projects' | 'experience' | 'achievements' | 'certifications' | 'contact';

const SECTIONS: SectionId[] = ['home', 'about', 'skills', 'projects', 'experience', 'achievements', 'certifications', 'contact'];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Global CTRL+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Intersection observer to update active section on scroll
  useEffect(() => {
    if (isLoading) return;

    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(sectionId => {
      const el = document.getElementById(`section-${sectionId}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(sectionId);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, [isLoading]);

  const navigateTo = useCallback((sectionId: string) => {
    setActiveSection(sectionId as SectionId);
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const openResume = useCallback(() => {
    window.open('/resume.pdf', '_blank');
  }, []);

  return (
    <>
      {/* Custom cursor — desktop only */}
      <CustomCursor />

      {/* Loading Screen */}
      {isLoading && (
        <LoadingScreen onComplete={handleLoadComplete} />
      )}

      {!isLoading && (
        <>
          {/* 3D Background Canvas — Fixed */}
          <SceneCanvas
            activeSection={activeSection}
            onSelectNode={navigateTo}
            hoveredNode={hoveredNode}
            setHoveredNode={setHoveredNode}
          />

          {/* HUD Telemetry Overlay */}
          <HudOverlay
            activeSection={activeSection}
            onOpenMap={() => setIsMapOpen(true)}
            onOpenTerminal={() => setIsTerminalOpen(true)}
            onOpenResume={openResume}
          />

          {/* Floating Navigation */}
          <FloatingNav activeSection={activeSection} onNavigate={navigateTo} />

          {/* Scrollable Content Pane */}
          <main
            id="main-content"
            className="relative z-10 pointer-events-none"
            style={{ background: 'transparent' }}
          >
            {/* Thin dark gradient edge at very top to softly separate HUD */}
            <div className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#04060a]/70 to-transparent z-20 pointer-events-none" />
            {/* Bottom vignette */}
            <div className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#04060a]/60 to-transparent z-20 pointer-events-none" />

            <div className="pointer-events-auto">
              <HeroSection onNavigate={navigateTo} />
              <AboutSection />
              <SkillsSection />
              <ProjectsSection />
              <ExperienceSection />
              <AchievementsSection />
              <CertificationsSection />
              <ContactSection />
            </div>
          </main>

          {/* Terminal Console Overlay */}
          <TerminalConsole
            isOpen={isTerminalOpen}
            onClose={() => setIsTerminalOpen(false)}
            onNavigate={(section) => {
              navigateTo(section);
              setIsTerminalOpen(false);
            }}
          />

          {/* System Map */}
          <SystemMap
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            activeSection={activeSection}
            onNavigate={(section) => {
              navigateTo(section);
            }}
          />
        </>
      )}
    </>
  );
}
