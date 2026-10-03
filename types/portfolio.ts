export type SectionId = 
  | 'home' 
  | 'about' 
  | 'skills' 
  | 'projects' 
  | 'experience' 
  | 'achievements' 
  | 'certifications' 
  | 'contact';

export interface Project {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  description: string;
  technologies: string[];
  problemSolved: string;
  keyFeatures: string[];
  architectureType: 'kafka-streams' | 'data-pipeline' | 'queue-system' | 'offline-mesh';
  architectureNodes: {
    id: string;
    label: string;
    type: 'source' | 'queue' | 'processor' | 'storage' | 'delivery' | 'device';
    desc: string;
  }[];
  githubUrl: string;
  liveDemoUrl?: string;
  metricsOrHighlight?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  skills: {
    name: string;
    tag?: string;
  }[];
}

export interface ExperienceDay {
  day: number;
  phase: string;
  title: string;
  summary: string;
  techFocus: string[];
}

export interface Achievement {
  id: string;
  title: string;
  event: string;
  location?: string;
  award: string;
  isTopAward: boolean;
  description: string;
  badgeType: 'gold' | 'silver' | 'bronze' | 'cyan';
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  description: string;
  verifyUrl?: string;
  skills: string[];
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'future';
  milestone: string;
}
