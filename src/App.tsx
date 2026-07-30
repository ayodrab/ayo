/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import HeroGooeySmoke from './components/canvas/HeroGooeySmoke';
import VantaCloudsBackground from './components/canvas/VantaCloudsBackground';

// Resolve asset helper for production / github pages deploy base compatibility
function resolveAsset(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  const base = (import.meta as any).env?.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${cleanPath}`;
}

interface ContentBlock {
  type: 'text' | 'image' | 'video' | 'quote';
  title?: string;
  text?: string;
  image?: string;
}

interface UnifiedProject {
  id: string;
  title: string;
  tags: string[];
  type: 'visual' | 'typographic';
  
  // Component A (Visual) fields
  image?: string;
  hoverVideo?: string;
  videoUrl?: string; // High-res playing video URL (e.g. Vimeo/local video)
  
  // Component B (Typographic) fields
  statement?: string; // Bold, brutalist statement
  
  // Universal Metadata Block fields (3-sentence narrative format)
  context: string;
  delivered: string;
  outcome: string;
}

const FEATURED_PROJECTS: UnifiedProject[] = [
  {
    id: 'mastercard',
    title: 'Mastercard. A life in numbers.',
    tags: ['Motion System', 'Social Campaign'],
    type: 'visual',
    image: 'assets/motion_project_assets/mastercard_01.webp',
    hoverVideo: 'assets/motion_project_assets/mastercard_loop.mp4',
    videoUrl: 'https://player.vimeo.com/video/385480402',
    context: 'Mastercard required a global social campaign that translated complex financial transaction data into universally relatable human stories.',
    delivered: 'Designed and animated a series of humorous flat-vector loops, focusing on precise timing and expressive physics to elevate the brand\'s social presence.',
    outcome: 'Generated 2.2 million organic views and became one of Mastercard\'s most highly shared organic campaign segments.'
  },
  {
    id: 'leadership-circle',
    title: 'Leadership Team Alignment',
    tags: ['Cooperative Governance', 'Culture Design'],
    type: 'typographic',
    statement: 'Untangling a 6-month product bottleneck in 3 days.',
    context: 'A decentralized network of over 80 designers and researchers suffered from severe decision fatigue and strategic alignment bottlenecks.',
    delivered: 'Designed and facilitated intensive active listening circles and co-created a self-governing group coordinator model.',
    outcome: 'Streamlined decision-making pathways and resolved administrative deadlocks without adding bureaucratic overhead.'
  },
  {
    id: 'optiver',
    title: 'Optiver. Making Waves.',
    tags: ['Onboarding Campaign', '2D Animation'],
    type: 'visual',
    image: 'assets/motion_project_assets/optiver_office_image.webp',
    hoverVideo: 'assets/motion_project_assets/optiver_loop.mp4',
    videoUrl: 'assets/motion_project_assets/optiver_loop.mp4',
    context: 'Optiver needed to humanize their highly complex, algorithmic quantitative trading systems to make onboarding less intimidating for incoming global graduates.',
    delivered: 'By layering custom 2D animation directly over actual proprietary code screens, the cold data was anchored within warm, recognizable Amsterdam canalscapes.',
    outcome: 'Deployed across Amsterdam, Chicago, and Sydney, this visual translation demystified the computational work and drove a measurable increase in graduate engagement.'
  },
  {
    id: 'resilience-blueprint',
    title: 'The Transition Space',
    tags: ['Sprints', 'Systems Mapping', 'Workshops'],
    type: 'typographic',
    statement: 'Moving 15 hostile industrial competitors into a single circular pipeline.',
    context: 'Historically rooted distrust among industrial manufacturers, circular architects, and public policymakers blocked regional material recycling loops.',
    delivered: 'Facilitated intensive co-design sprints using physical systems-mapping boards to align mutual resource flow-rates and governance rhythms.',
    outcome: 'Delivered a comprehensive co-creative handbook and unified material blueprint officially adopted by three European regions.'
  },
  {
    id: 'adidas-all-blacks',
    title: 'Adidas. All Blacks.',
    tags: ['Character Design', '2D Animation'],
    type: 'visual',
    image: 'assets/motion_project_assets/adidas_01.webp',
    hoverVideo: 'assets/motion_project_assets/adidas_website_thumbnail.mp4',
    videoUrl: 'assets/motion_project_assets/adidas-all-blacks-1.1-adidas_allblack_video.mp4',
    context: 'Sportswear reveals are frequently sterile, lacking the physical weight and deep cultural heritage of the New Zealand rugby team.',
    delivered: 'Designed a hand-drawn 2D animation framing ink-brushed Māori motifs, syncing fan expressions with on-pitch athletic force during the Haka.',
    outcome: 'Rolled out globally across retail and digital platforms, capturing national rugby pride in an artistically deep campaign.'
  },
  {
    id: 'nature-retreat',
    title: 'Executive Realignment Off-site',
    tags: ['Executive Alignment', 'Off-site Facilitation'],
    type: 'typographic',
    statement: 'Untangling leadership friction through structured diagnostic sprints.',
    context: 'High-tempo operational stress caused senior corporate directors to isolate, leading to severe strategic fragmentation and burnout.',
    delivered: 'Facilitated a structured off-site diagnostic retreat, conducting intensive alignment sessions to establish new communication protocols.',
    outcome: 'Restored organizational trust, yielding a cohesive feedback culture and a sustainable peer-mentorship loop.'
  },
  {
    id: 'datscha',
    title: 'Datscha. What’s behind the wall?',
    tags: ['Campaign Storytelling', '2D Animation'],
    type: 'visual',
    image: 'assets/motion_project_assets/datscha_01.webp',
    hoverVideo: 'assets/motion_project_assets/datscha-website-thumbnail-1250x698-compressed.mp4',
    videoUrl: 'assets/motion_project_assets/datscha-website-thumbnail-1250x698-compressed.mp4',
    context: 'The UK commercial real estate registry has historically been guarded behind opaque, expensive, and dry public record walls.',
    delivered: 'Crafted a mid-century illustrative adventure following an analyst peeking over brick walls to visualize zoning and historical valuations.',
    outcome: 'Captured immediate brand warmth in a conservative sector, setting a new proptech benchmark.'
  }
];

// GridItem utilizes clean IntersectionObserver vanilla-like implementation inside React
function GridItem({ children, className = "" }: { children: React.ReactNode; className?: string; key?: React.Key }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`grid-item ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// Component A (Visual Case Study card with seamless video autoplay on hover)
function VisualCard({ project, onClick }: { project: UnifiedProject; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (project.hoverVideo && videoRef.current) {
      if (isHovered) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log("Hover video autoplay blocked:", err);
          });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, project.hoverVideo]);

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full aspect-[16/9] overflow-hidden bg-[#E2DFD5]/40 rounded-3xl cursor-pointer group transition-transform duration-500 hover:scale-[1.01]"
    >
      {project.hoverVideo ? (
        <video
          ref={videoRef}
          src={resolveAsset(project.hoverVideo)}
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-750 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      ) : null}
      
      {/* Fallback image when video is not hovering or missing */}
      <img 
        src={resolveAsset(project.image)} 
        alt={project.title}
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHovered && project.hoverVideo ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        }`}
      />
      
      {/* Minimal Play Overlay indicator on hover */}
      <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 pointer-events-none">
        <span className="bg-white/95 text-black text-[10px] font-semibold tracking-widest uppercase px-5 py-2.5 rounded-full shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
          View Project
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<'work' | 'legal'>('work');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'motion' | 'facilitate'>('all');
  const [selectedProject, setSelectedProject] = useState<UnifiedProject | null>(null);

  // Dynamic color styles matching the active track
  const getHeadingGradient = () => {
    if (activeFilter === 'facilitate') {
      return "bg-gradient-to-r from-rose-700 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent";
    } else if (activeFilter === 'motion') {
      return "bg-gradient-to-r from-fuchsia-700 via-purple-600 to-pink-600 bg-clip-text text-transparent";
    } else {
      return "bg-gradient-to-r from-rose-800 via-pink-700 to-fuchsia-600 bg-clip-text text-transparent";
    }
  };

  const getCTAButtonClass = () => {
    return "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm hover:opacity-90 hover:scale-[1.01] transition-all duration-300";
  };

  // Helper state & URL modal handlers
  const openAbout = () => {
    setIsAboutOpen(true);
    setSelectedProject(null);
    if (window.location.hash !== '#about') {
      window.history.pushState(null, '', '#about');
    }
  };

  const closeAbout = () => {
    setIsAboutOpen(false);
    if (window.location.hash === '#about') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  const openProject = (project: UnifiedProject) => {
    setSelectedProject(project);
    setIsAboutOpen(false);
    if (window.location.hash !== `#project-${project.id}`) {
      window.history.pushState(null, '', `#project-${project.id}`);
    }
  };

  const closeProject = () => {
    setSelectedProject(null);
    if (window.location.hash.startsWith('#project-')) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#about') {
        setIsAboutOpen(true);
        setSelectedProject(null);
      } else if (hash.startsWith('#project-')) {
        const projId = hash.replace('#project-', '');
        const p = FEATURED_PROJECTS.find((proj) => proj.id === projId);
        if (p) {
          setSelectedProject(p);
          setIsAboutOpen(false);
        } else {
          setSelectedProject(null);
        }
      } else {
        setIsAboutOpen(false);
        setSelectedProject(null);
        if (hash === '#facilitate' || hash === '#facilitation') {
          setActiveFilter('facilitate');
        } else if (hash === '#motion' || hash === '#motion-design') {
          setActiveFilter('motion');
        } else {
          setActiveFilter('all');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Filter projects for separate tracks
  const filteredProjects = FEATURED_PROJECTS.filter((project) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'motion') return project.type === 'visual';
    if (activeFilter === 'facilitate') return project.type === 'typographic';
    return true;
  });

  // Scroll back to main page if view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  // Synchronize activeFilter with body classes for the animated background
  useEffect(() => {
    document.body.classList.remove('bg-animated-all', 'bg-animated-facilitate', 'bg-animated-motion');
    if (activeFilter === 'facilitate') {
      document.body.classList.add('bg-animated-facilitate');
    } else if (activeFilter === 'motion') {
      document.body.classList.add('bg-animated-motion');
    } else {
      document.body.classList.add('bg-animated-all');
    }
  }, [activeFilter]);

  return (
    <div 
      className={`min-h-screen text-[var(--text-primary)] font-body selection:bg-[var(--text-primary)] selection:text-[var(--bg-primary)] relative pb-0 pt-0 px-0 transition-all duration-1000 ${
        activeFilter === 'facilitate'
          ? 'bg-animated-facilitate'
          : activeFilter === 'motion'
            ? 'bg-animated-motion'
            : 'bg-animated-all'
      }`}
    >
      
      {/* Luxurious film grain overlay */}
      <div className="grain-overlay" />

      {/* Elegant Atmospheric Glow Backdrop with Dynamic Color Transition */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="ambient-glow transition-all duration-1000" 
          style={{
            background: activeFilter === 'facilitate'
              ? 'radial-gradient(circle, rgba(251, 113, 133, 0.35) 0%, rgba(244, 114, 182, 0.15) 100%)'
              : activeFilter === 'motion'
                ? 'radial-gradient(circle, rgba(244, 114, 182, 0.3) 0%, rgba(251, 113, 133, 0.15) 100%)'
                : 'radial-gradient(circle, rgba(251, 113, 133, 0.25) 0%, rgba(253, 164, 175, 0.15) 100%)',
            top: '-10%',
            left: '-10%',
            transform: activeFilter === 'facilitate' ? 'scale(1.2)' : 'scale(1)',
            opacity: activeFilter === 'facilitate' ? 0.45 : activeFilter === 'motion' ? 0.3 : 0.2,
          }}
        />
        <div 
          className="ambient-glow transition-all duration-1000" 
          style={{
            background: activeFilter === 'facilitate'
              ? 'radial-gradient(circle, rgba(244, 114, 182, 0.3) 0%, rgba(253, 164, 175, 0.15) 100%)'
              : activeFilter === 'motion'
                ? 'radial-gradient(circle, rgba(251, 113, 133, 0.25) 0%, rgba(244, 114, 182, 0.1) 100%)'
                : 'radial-gradient(circle, rgba(244, 114, 182, 0.25) 0%, rgba(251, 113, 133, 0.1) 100%)',
            bottom: '-10%',
            right: '-10%',
            transform: activeFilter === 'facilitate' ? 'scale(1.15)' : 'scale(1)',
            opacity: activeFilter === 'facilitate' ? 0.4 : activeFilter === 'motion' ? 0.35 : 0.2,
          }}
        />
      </div>

      {/* Header (Fixed Navigation) */}
      <header className="fixed top-0 left-0 w-full z-[100] py-5 px-6 md:px-12 lg:px-20 flex justify-between items-center transition-all duration-1000 glass-header">
        <div 
          onClick={() => {
            setView('work');
            setIsAboutOpen(false);
          }}
          className="logo-container logo cursor-pointer select-none"
        >
          <div className="text-4xl md:text-5xl tracking-tighter leading-none flex gap-0">
            <span>a</span>
            <span>y</span>
            <span>o</span>
          </div>
        </div>

        {/* Right Nav buttons */}
        <div className="flex gap-6 items-center">
          <button 
            id="about-toggle"
            onClick={() => (isAboutOpen ? closeAbout() : openAbout())}
            className="group relative flex items-center gap-1.5 font-sans font-bold text-[10.5px] tracking-[0.22em] uppercase text-[var(--text-primary)] py-1 bg-transparent border-0 cursor-pointer outline-none select-none transition-colors"
          >
            <span>{isAboutOpen ? 'CLOSE' : 'ABOUT'}</span>
            <span className={`w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] transition-transform duration-300 ${
              isAboutOpen ? 'scale-150 bg-red-500' : 'group-hover:scale-125'
            }`} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full">
        
        {/* VIEW: WORK (Continuous Scroll Portfolio Grid) */}
        {view === 'work' && (
          <div className="space-y-0">
            
            {/* Section 1: Hero */}
            <section id="hero" className="relative overflow-hidden border-b border-[var(--border-color)]/30 min-h-[75vh]">
              <VantaCloudsBackground selector="#hero" />
              
              <div className="section-container relative z-10 space-y-6 pt-24 pb-12 md:pt-28 md:pb-16">
                <h1 className={`tracking-tight leading-[1.08] text-balance font-display font-medium text-4xl md:text-6xl ${getHeadingGradient()}`}>
                  Visual clarity. Structural alignment.
                </h1>
                <div className="space-y-6 max-w-3xl">
                  <p className="text-lg md:text-xl font-display text-[var(--text-primary)] font-normal leading-relaxed text-balance">
                    I help teams communicate complex ideas through motion, and I support the workshops, decisions, and collaboration structures that help good work move forward.
                  </p>
                  <p className="text-sm md:text-base text-[var(--text-secondary)] font-normal leading-relaxed text-balance">
                    Motion design, infographics, social content, workshops, facilitation, and alignment support for complex teams and ideas.
                  </p>
                  <div className="pt-4 flex flex-wrap items-center gap-6">
                    <a 
                      href="#contact-cta"
                      className={`inline-block px-8 py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-widest text-center transition-all duration-300 ${getCTAButtonClass()}`}
                    >
                      Let’s talk
                    </a>
                    <a 
                      href="#selected-work"
                      className="group inline-flex items-center gap-1.5 font-sans font-bold text-xs uppercase tracking-[0.18em] text-[var(--text-primary)] border-b border-[var(--text-primary)] pb-1 transition-colors hover:text-[var(--text-secondary)] hover:border-[var(--text-secondary)]"
                    >
                      View selected work <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Proof Bar */}
            <section id="proof-bar" className="border-b border-[var(--border-color)]/30 py-8">
              <div className="section-container flex flex-col items-center gap-8">
                <span className="text-sm font-mono text-[var(--text-secondary)] tracking-wider uppercase text-center w-full">
                  Trusted by teams including
                </span>
                <div className="w-full flex flex-wrap items-center justify-between gap-x-6 gap-y-8 text-lg md:text-xl font-bold">
                  {/* Mastercard */}
                  <div className="flex items-center opacity-85 hover:opacity-100 transition-opacity">
                    <img src="/logos/mastercard.svg" alt="Mastercard" className="h-7 md:h-9 w-auto object-contain" />
                  </div>
                  
                  {/* Adidas */}
                  <div className="flex items-center opacity-85 hover:opacity-100 transition-opacity">
                    <img src="/logos/adidas.svg" alt="Adidas" className="h-7 md:h-9 w-auto object-contain" />
                  </div>
                  
                  {/* Optiver */}
                  <div className="flex items-center opacity-85 hover:opacity-100 transition-opacity">
                    <img src="/logos/optiver.svg" alt="Optiver" className="h-6 md:h-8 w-auto object-contain" />
                  </div>
                  
                  {/* Deloitte */}
                  <div className="flex items-center opacity-85 hover:opacity-100 transition-opacity">
                    <img src="/logos/deloitte.png" alt="Deloitte" className="h-5 md:h-6.5 w-auto object-contain" />
                  </div>

                  {/* BCG Digital Ventures */}
                  <div className="flex items-center opacity-85 hover:opacity-100 transition-opacity">
                    <img src="/logos/bcg.png" alt="BCG Digital Ventures" className="h-9 md:h-12 w-auto object-contain" />
                  </div>

                  {/* Edelman */}
                  <div className="flex items-center opacity-85 hover:opacity-100 transition-opacity">
                    <img src="/logos/edelman.svg" alt="Edelman" className="h-7 md:h-9 w-auto object-contain" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: What I Do */}
            <section id="what-i-do" className="border-b border-[var(--border-color)]/30 pt-12 md:pt-16 pb-8 md:pb-12">
              <div className="section-container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  {/* Card 1 */}
                  <div className="bg-gradient-to-tr from-rose-500/5 via-pink-500/5 to-[#EBEAE5]/20 border border-rose-500/10 p-6 md:p-8 rounded-3xl space-y-4 hover:border-rose-500/30 transition-all duration-300 shadow-sm">
                    <h3 className="font-display font-medium text-2xl md:text-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent">
                      Motion Design
                    </h3>
                    <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                      Animation and visual communication that make complex ideas clearer, sharper, and easier to understand.
                    </p>
                    <div className="pt-4 border-t border-[var(--border-color)]/50">
                      <ul className="space-y-3 text-sm text-[var(--text-secondary)] font-medium">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500/40" />
                          Explainer animation
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500/40" />
                          UI/UX animations
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500/40" />
                          Infographics
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500/40" />
                          Social content
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500/40" />
                          Editorial motion
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500/40" />
                          Presentation visuals
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-gradient-to-tr from-fuchsia-500/5 via-purple-500/5 to-[#EBEAE5]/20 border border-fuchsia-500/10 p-6 md:p-8 rounded-3xl space-y-4 hover:border-fuchsia-500/30 transition-all duration-300 shadow-sm">
                    <h3 className="font-display font-medium text-2xl md:text-3xl bg-gradient-to-r from-fuchsia-600 via-purple-500 to-pink-600 bg-clip-text text-transparent">
                      Facilitation and Alignment
                    </h3>
                    <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                      Workshops and collaboration structures that help teams align, decide, and move complex work forward more effectively.
                    </p>
                    <div className="pt-4 border-t border-[var(--border-color)]/50">
                      <ul className="space-y-3 text-sm text-[var(--text-secondary)] font-medium">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/40" />
                          Workshop design
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/40" />
                          Facilitation
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/40" />
                          Decision support
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/40" />
                          Governance rhythms
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/40" />
                          Team alignment
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Selected Work */}
            <section id="selected-work" className="border-b border-[var(--border-color)]/30 py-8 md:py-12">
              <div className="section-container space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 border-b border-[var(--border-color)]/20 pb-6 mb-4">
                  <h2 className={`text-xl md:text-2xl font-display font-medium tracking-tight ${getHeadingGradient()}`}>
                    Selected Work
                  </h2>
                  
                  {/* Filter Controls */}
                  <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
                    <button
                      onClick={() => setActiveFilter('all')}
                      className={`pb-1 border-b transition-all ${
                        activeFilter === 'all' 
                          ? 'border-[var(--text-primary)] text-[var(--text-primary)] font-medium' 
                          : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setActiveFilter('facilitate')}
                      className={`pb-1 border-b transition-all ${
                        activeFilter === 'facilitate' 
                          ? 'border-[var(--text-primary)] text-[var(--text-primary)] font-medium' 
                          : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Facilitation
                    </button>
                    <button
                      onClick={() => setActiveFilter('motion')}
                      className={`pb-1 border-b transition-all ${
                        activeFilter === 'motion' 
                          ? 'border-[var(--text-primary)] text-[var(--text-primary)] font-medium' 
                          : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Motion
                    </button>
                  </div>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full relative">
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                      <motion.div
                        layout
                        key={project.id}
                        initial={{ opacity: 0, scale: 0.92, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -12 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-6"
                      >
                        {project.type === 'visual' ? (
                          <VisualCard 
                            project={project as any} 
                            onClick={() => openProject(project as UnifiedProject)}
                          />
                        ) : (
                          <div 
                            onClick={() => openProject(project as UnifiedProject)}
                            className="typo-card rounded-3xl aspect-[16/9] min-h-[200px] flex items-center justify-center p-8 bg-gradient-to-tr from-fuchsia-500/15 via-pink-500/10 to-transparent border border-fuchsia-500/20 relative overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:border-fuchsia-500/40 hover:shadow-lg hover:shadow-fuchsia-500/5 cursor-pointer"
                          >
                            <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-fuchsia-500/40 animate-pulse" />
                            <div className="absolute top-4 right-4 text-[9px] font-mono uppercase tracking-widest text-fuchsia-700/60 font-semibold">
                              Facilitation
                            </div>
                            <p className="max-w-xl font-display text-base md:text-lg leading-relaxed text-center font-medium italic text-fuchsia-950/90 pointer-events-none">
                              “{project.statement}”
                            </p>
                          </div>
                        )}

                        <div className="text-left space-y-4">
                          <h3 className="text-lg md:text-xl font-display font-medium tracking-tight text-[var(--text-primary)]">
                            {project.title}
                          </h3>
                          
                          <div className="space-y-3.5 text-xs md:text-sm leading-relaxed text-[var(--text-secondary)]">
                            <p className="text-balance">
                              <strong className="text-[var(--text-primary)] font-medium">Short context:</strong> {project.context}
                            </p>
                            <p className="text-balance">
                              <strong className="text-[var(--text-primary)] font-medium">Delivered:</strong> {project.delivered}
                            </p>
                            <p className="text-balance">
                              <strong className="text-[var(--text-primary)] font-medium">Outcome:</strong> {project.outcome}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </section>

            {/* Section 5: Why Both */}
            <section id="why-both" className="border-b border-[var(--border-color)]/30 py-8 md:py-12">
              <div className="section-container max-w-3xl space-y-6">
                <h2 className={`text-xl md:text-2xl font-display font-medium tracking-tight ${getHeadingGradient()}`}>
                  Why both
                </h2>
                <p className="font-display font-medium text-lg md:text-xl text-[var(--text-primary)] leading-relaxed text-balance">
                  Clear communication and effective collaboration reinforce each other. Motion helps ideas land. Facilitation helps teams align around them. Bringing both together supports work that is not only well expressed, but also better shaped, shared, and carried forward.
                </p>
              </div>
            </section>

            {/* Section 6: Contact CTA */}
            <section id="contact-cta" className="pt-20 pb-10 md:pt-32 md:pb-16">
              <div className="section-container max-w-2xl text-left space-y-8">
                <h2 className={`font-display font-medium text-3xl md:text-5xl tracking-tight leading-tight ${getHeadingGradient()}`}>
                  Working on something complex?
                </h2>
                <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                  If you need clearer communication, steadier collaboration, or both, let’s talk.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-6">
                  <a 
                    href="mailto:hello@ayodrab.com"
                    className={`inline-block px-8 py-4 rounded-full font-sans font-bold text-xs uppercase tracking-widest text-center transition-all duration-300 ${getCTAButtonClass()}`}
                  >
                    Get in touch
                  </a>
                  <a 
                    href="mailto:hello@ayodrab.com"
                    className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors underline decoration-dotted underline-offset-4"
                  >
                    Or email hello@ayodrab.com
                  </a>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* VIEW: LEGAL (German Impressum & Privacy Policy compliance) */}
        {view === 'legal' && (
          <div className="space-y-12 max-w-5xl animate-fade-in pt-32 pb-16 mx-auto px-6 md:px-12 lg:px-20">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--text-secondary)] block">
              Legal Documentation
            </span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              {/* Impressum */}
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-display font-medium uppercase tracking-tight text-[var(--text-primary)]">Impressum</h2>
                <div className="space-y-4 text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
                  <p className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">Angaben gemäß § 5 DDG (ehemals § 5 TMG)</p>
                  <p>
                    Ayo Sebastian Dráb<br />
                    [Straße, Hausnummer / Street address]<br />
                    [PLZ, Ort / ZIP code, City]<br />
                    Deutschland / Germany
                  </p>
                  <p>
                    <strong>Kontakt:</strong><br />
                    E-Mail: hello@ayodrab.com<br />
                    Telefon: [Telefonnummer / Phone Number]
                  </p>
                  <p>
                    <strong>Aufsichtsbehörde:</strong><br />
                    Falls anwendbar (z.B. freiberufliche Kammermitgliedschaft)<br />
                    [Aufsichtsbehörde / Regulatory Authority]
                  </p>
                  <p>
                    <strong>Umsatzsteuer-ID:</strong><br />
                    Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                    [USt-IdNr. oder "Nicht steuerpflichtig nach § 19 UStG"]
                  </p>
                  <p className="pt-2 border-t border-[var(--border-color)]/40 text-[10px] italic">
                    Hinweis: Als freiberuflicher Designer / Prozess-Facilitator im geschäftsmäßigen Bereich besteht in Deutschland eine gesetzliche Pflicht zur Bereitstellung einer ladungsfähigen Anschrift und direkten Kontaktoptionen.
                  </p>
                </div>
              </div>

              {/* Datenschutz */}
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-display font-medium uppercase tracking-tight text-[var(--text-primary)]">Datenschutzerklärung</h2>
                <div className="space-y-4 text-xs font-mono text-[var(--text-secondary)] leading-relaxed max-h-[420px] overflow-y-auto pr-4 border-r border-[var(--border-color)]/40">
                  <p className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">1. Datenschutz auf einen Blick</p>
                  <p>
                    <strong>Allgemeine Hinweise</strong><br />
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                  </p>
                  <p>
                    <strong>Datenerfassung auf dieser Website</strong><br />
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen. Ihre Daten werden zum einen dadurch erhoben, dass Sie per E-Mail Kontakt aufnehmen. Andere technische Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.
                  </p>

                  <p className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px] pt-2">2. Allgemeine Hinweise und Pflichtinformationen</p>
                  <p>
                    <strong>Datenschutz</strong><br />
                    Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften (DSGVO, BDSG) sowie dieser Datenschutzerklärung.
                  </p>
                  <p>
                    <strong>Hinweis zur verantwortlichen Stelle</strong><br />
                    Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br />
                    Ayo Sebastian Dráb<br />
                    [Straße, Hausnummer, PLZ, Ort]<br />
                    E-Mail: hello@ayodrab.com
                  </p>
                  <p>
                    <strong>Ihre Rechte (Betroffenenrechte)</strong><br />
                    Sie haben das Recht:<br />
                    • Auskunft über Ihre verarbeiteten Daten zu erhalten (Art. 15 DSGVO)<br />
                    • unrichtige Daten berichtigen zu lassen (Art. 16 DSGVO)<br />
                    • die Löschung Ihrer Daten zu verlangen (Art. 17 DSGVO)<br />
                    • die Einschränkung der Verarbeitung zu fordern (Art. 18 DSGVO)<br />
                    • Datenübertragbarkeit zu beanspruchen (Art. 20 DSGVO)<br />
                    • Einwilligungen jederzeit zu widerrufen (Art. 7 Abs. 3 DSGVO)<br />
                    • sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO)
                  </p>

                  <p className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px] pt-2">3. Datenerfassung auf dieser Website</p>
                  <p>
                    <strong>Hosting & Server-Log-Dateien</strong><br />
                    Wir hosten unsere Website bei einem containerbasierten Cloud-Hosting-Dienst. Die Server befinden sich innerhalb der Europäischen Union. Der Provider erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt:<br />
                    • Browsertyp und Browserversion<br />
                    • verwendetes Betriebssystem<br />
                    • Referrer URL (die zuvor besuchte Seite)<br />
                    • Hostname des zugreifenden Rechners<br />
                    • Uhrzeit der Serveranfrage<br />
                    • IP-Adresse (ggf. in anonymisierter Form)
                  </p>
                  <p>
                    Diese Daten sind nicht bestimmten Personen zuzuordnen. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der fehlerfreien Darstellung und Sicherheit der Website).
                  </p>
                  <p>
                    <strong>Keine Cookies, Tracker oder Webanalyse</strong><br />
                    Diese Website ist bewusst minimalistisch und datenschutzfreundlich konzipiert. Wir verwenden <strong>keine analytischen Cookies, Werbe-Tracker oder Drittanbieter-Analysetools</strong> (wie Google Analytics). Es werden keine Surfprofile erstellt. Ein Cookie-Einwilligungsbanner ist daher nicht erforderlich.
                  </p>
                  <p>
                    <strong>E-Mail-Anfragen</strong><br />
                    Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer (The Final CTA) */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto border-t border-[var(--border-color)]/20 py-8 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-6 text-[9.5px] font-sans font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
        <div className="flex gap-2">
          <span>© {new Date().getFullYear()} Ayo Sebastian Dráb</span>
          <span>•</span>
          <span className="uppercase text-[var(--text-primary)] font-bold">Motion & Facilitation</span>
        </div>
        
        <div className="flex gap-6">
          <a 
            href="mailto:hello@ayodrab.com" 
            className="text-[var(--text-primary)] font-bold transition-colors hover:text-[var(--text-secondary)] underline decoration-dotted underline-offset-2"
          >
            hello@ayodrab.com
          </a>
          <button 
            onClick={() => setView('legal')} 
            className={`hover:text-[var(--text-primary)] uppercase transition-colors cursor-pointer border-0 bg-transparent font-bold tracking-widest ${view === 'legal' ? 'text-red-500' : ''}`}
          >
            Impressum & Privacy
          </button>
        </div>
      </footer>

      {/* About Card Overlay */}
      <AnimatePresence>
        {isAboutOpen && (
          <AboutOverlay 
            onClose={closeAbout} 
          />
        )}
      </AnimatePresence>

      {/* Cinematic Fullscreen Theater Lightbox Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectOverlay 
            project={selectedProject} 
            onClose={closeProject} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Small helper component to bind keyboard escape events cleanly within React's lifecycle
function KeyboardListener({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  return null;
}

function AboutOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[99999] bg-black/10 backdrop-blur-md overflow-y-auto flex items-start justify-center p-4 md:p-8 pt-12 md:pt-16"
      onClick={onClose}
    >
      <KeyboardListener onClose={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-[var(--bg-primary)] rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col my-auto border border-[var(--border-color)]/50"
      >
        <div className="text-[var(--text-primary)] relative font-sans">
          {/* Header */}
          <header className="px-6 md:px-10 py-6 flex items-center justify-between sticky top-0 bg-[var(--bg-primary)]/90 backdrop-blur-md z-50 border-b border-[var(--border-color)]/30">
            <div className="text-xs md:text-sm font-bold font-display uppercase tracking-widest text-[var(--text-primary)] truncate pr-4">
              About Ayo Sebastian Dráb
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-[var(--border-color)]/40 hover:bg-[var(--border-color)] transition-colors text-[var(--text-primary)] cursor-pointer"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </header>

          <main className="px-6 md:px-12 py-8 md:py-12 pb-14">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="space-y-8"
            >
              {/* Meta Tags */}
              <div className="flex flex-wrap gap-2">
                {['Motion Systems', 'Facilitation & Sprints', 'Visual Alignment', 'Amsterdam & Global'].map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full border border-[var(--border-color)] text-[10px] md:text-xs font-medium text-[var(--text-secondary)] tracking-wide uppercase">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title / Headline */}
              <h2 className="text-2xl md:text-4xl font-display font-medium tracking-tight text-balance leading-tight text-[var(--text-primary)]">
                Bringing visual clarity to complex ideas and alignment to the teams moving them forward.
              </h2>

              {/* Bio Content */}
              <div className="space-y-4 font-body text-sm md:text-base leading-relaxed text-[var(--text-secondary)] border-t border-[var(--border-color)]/30 pt-6">
                <p>
                  I started in motion design, helping organizations communicate through animation and visual systems. Over time, I kept seeing the same pattern: strong work often depends as much on collaboration, decision-making, and process as it does on craft.
                </p>
                <p>
                  That led me deeper into facilitation and change work. Today, I work across both areas: creating visual communication that brings clarity to ideas, and supporting teams in the work of alignment, transition, and sustainable collaboration.
                </p>
                <p>
                  I still care deeply about the quality of the work itself. I also care about the conditions that allow good work to happen.
                </p>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[var(--border-color)]/30 text-xs md:text-sm">
                <div className="space-y-2">
                  <h3 className="font-bold uppercase tracking-widest text-[var(--text-primary)] text-[11px]">Core Capabilities</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    2D Animation, Motion Design Systems, Infographics, Workshop Design, Group Facilitation, & Decision Support Sprints.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold uppercase tracking-widest text-[var(--text-primary)] text-[11px]">Selected Clients & Partners</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Mastercard, Adidas, Optiver, Deloitte, BCG Digital Ventures, Edelman.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-[var(--border-color)]/30 flex flex-wrap items-center justify-between gap-4">
                <a 
                  href="mailto:hello@ayodrab.com"
                  className="px-6 py-3 rounded-full font-sans font-bold text-xs uppercase tracking-widest bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-all shadow-sm"
                >
                  Get in touch
                </a>
                <button
                  onClick={onClose}
                  className="font-sans font-bold text-[10.5px] tracking-[0.22em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-b border-transparent hover:border-[var(--text-primary)] pb-0.5 transition-colors cursor-pointer"
                >
                  CLOSE
                </button>
              </div>

            </motion.div>
          </main>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectOverlay({ project, onClose }: { project: UnifiedProject, onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[99999] bg-black/10 backdrop-blur-md overflow-y-auto flex items-start justify-center p-4 md:p-8 pt-12 md:pt-16"
      onClick={onClose}
    >
      <KeyboardListener onClose={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl bg-[var(--bg-primary)] rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col my-auto border border-[var(--border-color)]/50"
      >
        <div className="text-[var(--text-primary)] relative font-sans">
          {/* Header */}
          <header className="px-6 md:px-10 py-6 flex items-center justify-between sticky top-0 bg-[var(--bg-primary)]/90 backdrop-blur-md z-50 border-b border-[var(--border-color)]/30">
            <div className="text-sm font-bold font-display uppercase tracking-widest text-[var(--text-primary)] truncate pr-4">
              {project.title}
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-[var(--border-color)]/40 hover:bg-[var(--border-color)] transition-colors text-[var(--text-primary)]"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </header>

          <main className="px-6 md:px-12 py-10 md:py-16 pb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="space-y-12 md:space-y-16"
            >
              {/* Hero Section */}
              <div className="space-y-6 text-center max-w-3xl mx-auto">
                <div className="flex flex-wrap justify-center gap-2">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full border border-[var(--border-color)] text-[10px] md:text-xs font-medium text-[var(--text-secondary)] tracking-wide uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-balance">
                  {project.title}
                </h1>
                {project.statement && (
                  <p className="text-lg md:text-2xl font-display italic text-[var(--text-secondary)]">
                    “{project.statement}”
                  </p>
                )}
              </div>

              {/* Media / Visual */}
              {project.type === 'visual' && (
                <div className="w-full aspect-video bg-[#E2DFD5]/40 rounded-2xl md:rounded-3xl overflow-hidden relative shadow-md border border-[var(--border-color)]/20">
                  {project.videoUrl ? (
                    project.videoUrl.includes('vimeo') ? (
                      <iframe
                        src={`${project.videoUrl}?autoplay=1&muted=1&loop=1&background=1`}
                        className="w-full h-full absolute inset-0 border-0 pointer-events-none"
                        allow="autoplay; fullscreen"
                        title={project.title}
                      />
                    ) : (
                      <video
                        src={resolveAsset(project.videoUrl)}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <img 
                      src={resolveAsset(project.image)} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}

              {/* Details / Narrative Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pt-8 border-t border-[var(--border-color)]/30">
                <div className="space-y-3">
                  <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">Context</h3>
                  <p className="text-sm md:text-base leading-relaxed text-[var(--text-primary)]">
                    {project.context}
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">What We Did</h3>
                  <p className="text-sm md:text-base leading-relaxed text-[var(--text-primary)]">
                    {project.delivered}
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">Outcome</h3>
                  <p className="text-sm md:text-base leading-relaxed text-[var(--text-primary)]">
                    {project.outcome}
                  </p>
                </div>
              </div>
              
            </motion.div>
          </main>
        </div>
      </motion.div>
    </motion.div>
  );
}
