/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';

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
  craft: string;
  impact: string;
}

const PROJECTS_DATA: UnifiedProject[] = [
  {
    id: 'mastercard',
    title: 'Mastercard. A life in numbers.',
    tags: ['Motion System', 'Social Campaign'],
    type: 'visual',
    image: 'assets/motion_project_assets/mastercard_01.webp',
    hoverVideo: 'assets/motion_project_assets/mastercard_loop.mp4',
    videoUrl: 'https://player.vimeo.com/video/385480402',
    context: 'Mastercard required a global social campaign that translated complex financial transaction data into universally relatable human stories.',
    craft: 'Designed and animated a series of humorous flat-vector loops, focusing on precise timing and expressive physics to elevate the brand\'s social presence.',
    impact: 'Generated 2.2 million organic views and became one of Mastercard\'s most highly shared organic campaign segments.'
  },
  {
    id: 'leadership-circle',
    title: 'Designing for Emergence',
    tags: ['Cooperative Governance', 'Culture Design'],
    type: 'typographic',
    statement: 'Untangling a 6-month product bottleneck in 3 days.',
    context: 'A decentralized network of over 80 designers and researchers suffered from severe decision fatigue and strategic alignment bottlenecks.',
    craft: 'Facilitated intensive active listening circles and co-designed a self-governing circle model with rotating coordinator roles.',
    impact: 'Streamlined all decision-making pathways, eliminated persistent administrative deadlocks, and restored long-term collaboration health.'
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
    craft: 'By layering custom 2D animation directly over actual proprietary code screens, the cold data was anchored within warm, recognizable Amsterdam canalscapes.',
    impact: 'Deployed across Amsterdam, Chicago, and Sydney, this visual translation demystified the computational work and drove a measurable increase in graduate engagement.'
  },
  {
    id: 'resilience-blueprint',
    title: 'The Transition Space',
    tags: ['Sprints', 'Systems Mapping', 'Workshops'],
    type: 'typographic',
    statement: 'Moving 15 hostile industrial competitors into a single circular pipeline.',
    context: 'Historically rooted distrust among industrial manufacturers, circular architects, and public policymakers blocked regional material recycling loops.',
    craft: 'Facilitated intensive co-design sprints using physical systems-mapping boards to align mutual resource flow-rates and governance rhythms.',
    impact: 'Delivered a comprehensive co-creative handbook and unified material blueprint officially adopted by three European regions.'
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
    craft: 'Designed a hand-drawn 2D animation framing ink-brushed Māori motifs, syncing fan expressions with on-pitch athletic force during the Haka.',
    impact: 'Rolled out globally across retail and digital platforms, capturing national rugby pride in an artistically deep campaign.'
  },
  {
    id: 'nature-retreat',
    title: 'Executive Realignment Off-site',
    tags: ['Executive Alignment', 'Off-site Facilitation'],
    type: 'typographic',
    statement: 'Untangling leadership friction through structured diagnostic sprints.',
    context: 'High-tempo operational stress caused senior corporate directors to isolate, leading to severe strategic fragmentation and burnout.',
    craft: 'Facilitated a structured off-site diagnostic retreat, conducting intensive alignment sessions to establish new communication protocols.',
    impact: 'Restored organizational trust, yielding a cohesive feedback culture and a sustainable peer-mentorship loop.'
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
    craft: 'Crafted a mid-century illustrative adventure following an analyst peeking over brick walls to visualize zoning and historical valuations.',
    impact: 'Captured immediate brand warmth in a conservative sector, setting a new proptech benchmark.'
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
          Open Reel
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<'work' | 'legal'>('work');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [theaterVideo, setTheaterVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'motion' | 'facilitate'>('motion');

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#facilitate') {
        setActiveTab('facilitate');
      } else {
        setActiveTab('motion');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Filter projects for separate tracks
  const motionProjects = PROJECTS_DATA.filter((p) => p.type === 'visual');
  const facilitateProjects = PROJECTS_DATA.filter((p) => p.type === 'typographic');

  // Scroll back to main page if view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-body selection:bg-[var(--text-primary)] selection:text-[var(--bg-primary)] relative pb-20 pt-28 px-0">
      
      {/* Luxurious film grain overlay */}
      <div className="grain-overlay" />

      {/* Elegant Atmospheric Glow Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="ambient-glow glow-warm" />
        <div className="ambient-glow glow-cool" />
      </div>

      {/* Header (Fixed Navigation) */}
      <header className="fixed top-0 left-0 w-full z-100 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]/40 py-5 px-6 md:px-12 lg:px-20 flex justify-between items-center transition-colors duration-300">
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
            onClick={() => setIsAboutOpen(!isAboutOpen)}
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
            
            {/* Section: Hero */}
            <section id="hero" className="border-b border-[var(--border-color)]/30">
              <div className="section-container space-y-8">
                <span className="section-label text-left !block !text-left">
                  Creative Practice & Group Holding
                </span>
                <h1 className="tracking-tight leading-[1.08] text-balance">
                  Visual clarity. Structural alignment.
                </h1>
                <div className="space-y-6 max-w-3xl">
                  <p className="text-lg md:text-xl font-display text-[var(--text-primary)] font-normal leading-relaxed text-balance">
                    I help teams communicate complex ideas clearly and support the collaboration behind the work so projects can move forward with less friction.
                  </p>
                  <p className="text-sm md:text-base text-[var(--text-secondary)] font-normal leading-relaxed text-balance">
                    Motion design, infographics, social content, and facilitation for organizations navigating complexity and change.
                  </p>
                </div>
              </div>
            </section>

            {/* Section: Selected Clients */}
            <section id="clients" className="border-b border-[var(--border-color)]/30">
              <div className="section-container space-y-12">
                <span className="section-label text-left !block !text-left">
                  // Selected Clients & Collaborators
                </span>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center font-sans font-medium uppercase tracking-[0.05em] text-sm text-[var(--text-primary)]">
                  <div>Mastercard</div>
                  <div>Optiver</div>
                  <div>Adidas</div>
                  <div>Google</div>
                </div>
              </div>
            </section>

            {/* Section: Intro / Manifesto */}
            <section id="intro" className="border-b border-[var(--border-color)]/30">
              <div className="section-container space-y-12">
                <span className="section-label text-left !block !text-left">
                  // Intro
                </span>
                <div className="max-w-3xl space-y-6 text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
                  <p className="font-display font-medium text-lg md:text-xl text-[var(--text-primary)] leading-relaxed">
                    Good work depends on more than strong ideas. It also depends on the way people align, decide, and work together.
                  </p>
                  <p>
                    My practice brings those two sides together. I create visual communication that helps ideas land, and I facilitate the structures and conversations that help teams move without unnecessary confusion, delay, or burnout.
                  </p>
                  <p>
                    That combination matters because craft and process affect each other. Clear design can still fail inside a strained process, and a healthy process still needs clear communication to carry the work forward.
                  </p>
                </div>
              </div>
            </section>

            {/* Section: The Unified Work Gallery */}
            <section id="work" className="border-b border-[var(--border-color)]/30">
              <div className="section-container">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-16 gap-4">
                  <div className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-display font-medium tracking-tight">
                      Selected Work
                    </h2>
                    <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-xl">
                      Two connected practices: one shapes how ideas are understood, the other shapes how teams move.
                    </p>
                  </div>
                </div>

                {/* Section: Why Both Bridge */}
                <div className="max-w-3xl mb-16 space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-secondary)] block">
                    // Why Both
                  </span>
                  <p className="font-display font-medium text-lg md:text-xl text-[var(--text-primary)] leading-relaxed">
                    Over time, I found that many creative problems are not only creative problems. Sometimes the work is strong, but the process around it is unclear. Sometimes the team is capable, but the message itself is not landing.
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Working across both motion design and facilitation allows me to support the work from both sides: how it is communicated, and how it gets made.
                  </p>
                </div>

                {/* The Sticky Toggle */}
                <nav className="state-toggle">
                  <a 
                    href="#motion" 
                    className={`toggle-btn ${activeTab === 'motion' ? 'active' : ''}`} 
                    data-target="motion"
                  >
                    View Motion Design
                  </a>
                  <a 
                    href="#facilitate" 
                    className={`toggle-btn ${activeTab === 'facilitate' ? 'active' : ''}`} 
                    data-target="facilitate"
                  >
                    View Change Facilitation
                  </a>
                </nav>

                <div id="portfolio-container">
                  {/* Motion Track */}
                  <div id="motion-track" className={`track ${activeTab === 'motion' ? 'active' : ''}`}>
                    <div className="max-w-3xl mb-16 space-y-6">
                      <h3 className="font-display font-medium text-2xl text-[var(--text-primary)]">
                        Motion design for ideas that need to land clearly
                      </h3>
                      <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                        I create motion design, advertisement animation, infographics, and social content that help people understand complex ideas quickly and clearly.
                      </p>
                      <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                        Whether it’s a campaign, a product story, or a data-heavy message, I turn complexity into visual communication that people can actually follow.
                      </p>
                      <p className="text-xs font-mono text-[var(--text-secondary)] italic pt-2">
                        From campaign assets to explainer systems, I build visual work that is precise, usable, and ready to carry meaning.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-16 md:gap-x-[4rem] md:gap-y-[8rem] w-full">
                      {motionProjects.map((project, idx) => {
                        const alignClass = idx % 2 === 1 ? "md:translate-y-16" : "";
                        return (
                          <GridItem 
                            key={project.id} 
                            className={`flex flex-col gap-6 ${alignClass}`}
                          >
                            <VisualCard 
                              project={project} 
                              onClick={() => {
                                if (project.videoUrl) {
                                  setTheaterVideo(project.videoUrl);
                                } else {
                                  setTheaterVideo("https://player.vimeo.com/video/826868216");
                                }
                              }}
                            />
                            <div className="case-study-meta">
                              <ul className="project-tags tags">
                                {project.tags.map((tag) => (
                                  <li key={tag}>{tag}</li>
                                ))}
                              </ul>
                              <h3 className="text-base md:text-lg font-display font-medium tracking-tight text-left mb-4">
                                {project.title}
                              </h3>
                              <div className="space-y-3 pt-1 text-[13px] md:text-sm leading-relaxed text-left text-[var(--text-secondary)]">
                                <p><strong>The Context:</strong> {project.context}</p>
                                <p><strong>The Craft:</strong> {project.craft}</p>
                                <p><strong>The Impact:</strong> {project.impact}</p>
                              </div>
                            </div>
                          </GridItem>
                        );
                      })}
                    </div>
                  </div>

                  {/* Facilitation Track */}
                  <div id="facilitate-track" className={`track ${activeTab === 'facilitate' ? 'active' : ''}`}>
                    <div className="max-w-3xl mb-16 space-y-6">
                      <h3 className="font-display font-medium text-2xl text-[var(--text-primary)]">
                        Facilitation for teams that need alignment, momentum, and a more sustainable pace
                      </h3>
                      <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                        I facilitate workshops, team processes, and change work that help people make decisions, work through friction, and keep important projects moving.
                      </p>
                      <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                        This side of the practice is about creating the conditions for better work. That might mean helping a team align around priorities, supporting a leadership group through strain or transition, or designing a process that makes collaboration clearer and more sustainable over time.
                      </p>
                      <p className="text-xs font-mono text-[var(--text-secondary)] italic pt-2">
                        Better work usually needs both clarity in the message and clarity in how people work together.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-16 md:gap-x-[4rem] md:gap-y-[8rem] w-full">
                      {facilitateProjects.map((project, idx) => {
                        const alignClass = idx % 2 === 1 ? "md:translate-y-16" : "";
                        return (
                          <GridItem 
                            key={project.id} 
                            className={`flex flex-col gap-6 ${alignClass}`}
                          >
                            <div className="typo-card rounded-3xl">
                              <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-[var(--text-primary)]/10" />
                              <div className="absolute top-4 right-4 text-[9px] font-mono uppercase tracking-widest text-[var(--text-secondary)]/60">
                                Facilitate
                              </div>
                              <p className="max-w-xl font-display text-lg leading-relaxed text-center">
                                “{project.statement}”
                              </p>
                            </div>
                            <div className="case-study-meta">
                              <ul className="project-tags tags">
                                {project.tags.map((tag) => (
                                  <li key={tag}>{tag}</li>
                                ))}
                              </ul>
                              <h3 className="text-base md:text-lg font-display font-medium tracking-tight text-left mb-4">
                                {project.title}
                              </h3>
                              <div className="space-y-3 pt-1 text-[13px] md:text-sm leading-relaxed text-left text-[var(--text-secondary)]">
                                <p><strong>The Context:</strong> {project.context}</p>
                                <p><strong>The Craft:</strong> {project.craft}</p>
                                <p><strong>The Impact:</strong> {project.impact}</p>
                              </div>
                            </div>
                          </GridItem>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Rules of Engagement Block */}
                <div className="mt-32 pt-20 border-t border-[var(--border-color)]/20">
                  <div className="max-w-3xl space-y-12">
                    <span className="section-label text-left !block !text-left">
                      // How I Work
                    </span>
                    <h3 className="font-display font-medium text-2xl md:text-3xl text-[var(--text-primary)]">
                      How the practice operates
                    </h3>
                    <div className="space-y-8 pt-4">
                      <div className="space-y-3">
                        <h4 className="font-display font-medium text-lg text-[var(--text-primary)]">
                          Clarity before production
                        </h4>
                        <p className="text-[var(--text-secondary)] leading-relaxed text-sm max-w-2xl">
                          Before making the work, I help define what needs to be said, who it is for, and what constraints matter. That usually leads to stronger decisions and fewer unnecessary revisions.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-display font-medium text-lg text-[var(--text-primary)]">
                          Direct collaboration
                        </h4>
                        <p className="text-[var(--text-secondary)] leading-relaxed text-sm max-w-2xl">
                          You work directly with me throughout the process. That keeps communication clear and reduces the loss that often happens between strategy, execution, and delivery.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-display font-medium text-lg text-[var(--text-primary)]">
                          Useful structure
                        </h4>
                        <p className="text-[var(--text-secondary)] leading-relaxed text-sm max-w-2xl">
                          Whether the work is visual or organizational, I look for structures that people can actually use. The aim is not complexity for its own sake, but a way of working that supports clarity, momentum, and follow-through.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extra spacing at the bottom of asymmetric grid */}
                <div className="h-24 hidden md:block" />
              </div>
            </section>

            {/* Section: Methodology */}
            <section id="methodology" className="border-b border-[var(--border-color)]/30">
              <div className="section-container space-y-16">
                <div className="space-y-6 max-w-3xl">
                  <h2 className="text-xl md:text-2xl font-display font-medium tracking-tight">
                    Capabilities & Approach
                  </h2>
                  <p className="lead text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                    I operate as a solo practitioner, directing each project personally. When scale or specialized needs require, I partner with trusted creative and technical collaborators.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                  {/* Capability 1 */}
                  <div className="capability-block space-y-4">
                    <h3 className="font-display font-medium text-lg md:text-xl text-[var(--text-primary)]">
                      Motion & Visual Systems
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                      Translating complex mechanics into clear, accessible visual frameworks. Executing 2D/3D motion libraries, onboarding sequences, and scalable asset systems with strict precision.
                    </p>
                  </div>
                  {/* Capability 2 */}
                  <div className="capability-block space-y-4">
                    <h3 className="font-display font-medium text-lg md:text-xl text-[var(--text-primary)]">
                      Team Process & Facilitation
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                      Untangling the human bottlenecks that prevent good work from shipping. Diagnosing workflow friction, aligning stakeholders through structured sprints, and designing sustainable governance rhythms.
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* VIEW: LEGAL (German Impressum & Privacy Policy compliance) */}
        {view === 'legal' && (
          <div className="space-y-12 max-w-5xl animate-fade-in pt-12 mx-auto px-6 md:px-12 lg:px-20">
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
      <footer className="relative z-10 w-full max-w-6xl mx-auto border-t border-[var(--border-color)]/40 pt-[10rem] pb-[5rem] text-center space-y-16 px-6 md:px-12 lg:px-20">
        
        {/* The Final CTA Content */}
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display font-medium text-3xl md:text-5xl tracking-tight text-[var(--text-primary)] leading-tight">
            Build better work. Build better teams.
          </h2>
          <p className="font-body text-base md:text-lg text-[var(--text-secondary)] leading-relaxed text-balance">
            If you’re working on something that needs both clarity and follow-through, I’d be glad to hear about it.
          </p>
          <p className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-secondary)]">
            For motion projects, facilitation, and collaborations:
          </p>
          <div className="pt-4">
            <a 
              href="mailto:hello@ayodrab.com" 
              className="group inline-flex items-center gap-2 font-sans font-bold text-xs md:text-sm uppercase tracking-[0.2em] text-[var(--text-primary)] border-b border-[var(--text-primary)] pb-1.5 transition-all hover:text-[var(--text-secondary)] hover:border-[var(--text-secondary)]"
            >
              Get in Touch <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </a>
          </div>
        </div>

        {/* Minimal Legal & Copy */}
        <div className="pt-16 border-t border-[var(--border-color)]/20 flex flex-col md:flex-row justify-between items-center gap-6 text-[9.5px] font-sans font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
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
        </div>
      </footer>

      {/* About Overlay */}
      <div 
        id="about-overlay" 
        className={isAboutOpen ? 'is-open' : ''}
        onClick={() => setIsAboutOpen(false)}
      >
        {isAboutOpen && <KeyboardListener onClose={() => setIsAboutOpen(false)} />}
        <div 
          className="overlay-content max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="section-label text-left !block !text-left mb-6">
            // About Ayo Sebastian Dráb
          </span>
          <h2 className="font-display font-medium text-3xl md:text-5xl tracking-tight leading-[1.12] text-[var(--text-primary)]">
            About Ayo
          </h2>
          <div className="font-body text-base md:text-[17px] leading-relaxed text-[var(--text-secondary)] mt-6 space-y-4">
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
          <button
            onClick={() => setIsAboutOpen(false)}
            className="mt-8 font-sans font-bold text-[10.5px] tracking-[0.22em] uppercase text-[var(--text-primary)] border-b border-[var(--text-primary)] pb-1 hover:text-[var(--text-secondary)] hover:border-[var(--text-secondary)] transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>

      {/* Cinematic Fullscreen Theater Lightbox Overlay */}
      <AnimatePresence>
        {theaterVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col justify-center p-4 md:p-12 items-center"
          >
            {/* Keyboard dismiss listener hook effect */}
            <KeyboardListener onClose={() => setTheaterVideo(null)} />

            {/* Top Close Button (floating elegant control) */}
            <div className="absolute top-6 right-6 z-[100000]">
              <button
                onClick={() => setTheaterVideo(null)}
                className="w-12 h-12 rounded-full border border-white/10 hover:border-white/45 bg-black/40 text-white/70 hover:text-white flex items-center justify-center text-lg transition-all duration-300 cursor-pointer outline-none hover:scale-105"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Video Canvas Stage Holder */}
            <motion.div 
              initial={{ scale: 0.98, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 10 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              className="w-full max-w-5xl aspect-video bg-neutral-950 rounded-lg overflow-hidden border border-white/5 shadow-2xl relative"
            >
              {theaterVideo.includes('vimeo.com') ? (
                <iframe
                  src={`${theaterVideo}?autoplay=1&quality=1080p`}
                  className="w-full h-full absolute inset-0 border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  title="Ayo Video Showcase"
                />
              ) : (
                <video
                  src={resolveAsset(theaterVideo)}
                  autoplay
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </motion.div>
          </motion.div>
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
