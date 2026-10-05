'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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

// Navigation + overlays
import { DiveNav } from '@/components/navigation/DiveNav';
import { DepthMeter } from '@/components/ui/DepthMeter';
import { OceanMap } from '@/components/ui/OceanMap';
import { TerminalConsole } from '@/components/ui/TerminalConsole';

import { DEPTH_ZONES, SECTION_ORDER, getZone, type DepthZone, type SectionId } from '@/lib/depthZones';

// The ocean is client-only — R3F cannot render on the server.
const SceneCanvas = dynamic(
  () => import('@/components/3d/SceneCanvas').then((m) => m.SceneCanvas),
  { ssr: false, loading: () => null }
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [zone, setZone] = useState<DepthZone>(getZone('home'));
  const [progress, setProgress] = useState(0);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Ref mirrors the scroll progress so the render loop can read it without
  // re-rendering the React tree on every scroll event.
  const progressRef = useRef(0);

  // ---- Scroll → dive progress ----------------------------------------------
  // Progress is driven by which section owns the viewport rather than raw
  // scroll height, so the camera arrives at a zone exactly when the visitor
  // does — no teleporting, no arriving early or late.
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const viewportCentre = window.innerHeight * 0.5;

      let bestId: SectionId = 'home';
      let bestDistance = Number.POSITIVE_INFINITY;
      let found = false;

      for (const id of SECTION_ORDER) {
        const el = document.getElementById(`section-${id}`);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;

        found = true;
        const distance = Math.abs(rect.top + rect.height / 2 - viewportCentre);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestId = id;
        }
      }

      if (found) {
        setActiveSection((current) => (current === bestId ? current : bestId));

        const index = SECTION_ORDER.indexOf(bestId);

        // Blend between this zone and the next across the lower half of the
        // section so the descent starts as the visitor begins scrolling on.
        const el = document.getElementById(`section-${bestId}`);
        let local = 0;
        if (el && index < SECTION_ORDER.length - 1) {
          const rect = el.getBoundingClientRect();
          const total = Math.max(rect.height, 1);
          local = Math.min(Math.max((rect.top + rect.height * 0.75 - window.innerHeight) / total, 0), 1);
        }

        const segments = SECTION_ORDER.length - 1;
        const value = (index + local) / segments;
        progressRef.current = value;
        setProgress(value);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // ---- Navigation ----------------------------------------------------------
  const navigateTo = useCallback((section: string) => {
    const id = (SECTION_ORDER as string[]).includes(section) ? (section as SectionId) : 'home';
    setActiveSection(id);

    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleLoadComplete = useCallback(() => setIsLoading(false), []);

  const surfaceUp = useCallback(() => {
    navigateTo('home');
  }, [navigateTo]);

  return (
    <>
      {/* Cinematic descent into the water */}
      {isLoading && <LoadingScreen onComplete={handleLoadComplete} />}

      <div inert={isLoading ? true : undefined}>
        {/* The ocean. Mounted once and never unmounted. */}
        <SceneCanvas
          progress={progress}
          onSelectPearl={surfaceUp}
          onZoneChange={setZone}
        />

        {/* Expedition interface */}
        <DepthMeter zone={zone} progress={progress} />
        <DiveNav activeSection={activeSection} onNavigate={navigateTo} />

        {/* Scrollable content — the only real DOM content, kept fully readable */}
        <main id="main-content" className="relative z-10">
          <div className="pointer-events-none">
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

        <TerminalConsole
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
          onNavigate={(section) => {
            navigateTo(section);
            setIsTerminalOpen(false);
          }}
        />

        <OceanMap
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          activeSection={activeSection}
          zone={zone}
          onNavigate={navigateTo}
        />
      </div>

      {/* Keyboard shortcuts, mounted outside `inert` so they always work. */}
      <GlobalShortcuts
        onToggleTerminal={() => setIsTerminalOpen((open) => !open)}
        onToggleMap={() => setIsMapOpen((open) => !open)}
      />

      {/* Zone list kept in the module graph so the map and nav agree on order. */}
      <span className="sr-only" aria-live="polite">
        {zone.zone}, {zone.depth} metres
      </span>
      <span className="sr-only">{DEPTH_ZONES.length}</span>
    </>
  );
}

function GlobalShortcuts({
  onToggleTerminal,
  onToggleMap,
}: {
  onToggleTerminal: () => void;
  onToggleMap: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onToggleTerminal();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        onToggleMap();
        return;
      }
      if (event.key === 'Escape' && !typing) {
        onToggleMap();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onToggleTerminal, onToggleMap]);

  return null;
}
