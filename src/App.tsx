/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';

import HeroGooeySmoke from './components/canvas/HeroGooeySmoke';
import VantaCloudsBackground from './components/canvas/VantaCloudsBackground';
import AboutPage from './components/AboutPage';
import { 
  TransitionContext, 
  TRANSITION_VARIATIONS, 
  StaggerItem, 
  type TransitionVariationKey 
} from './transitions';
import { trackAboutOpen, trackContactClick, trackFilterChange, trackProjectView } from './lib/analytics';

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
  subtitle?: string;
  tags: string[];
  type: 'visual' | 'typographic';
  
  // Component A (Visual) fields
  image?: string;
  hoverVideo?: string;
  videoUrl?: string; // High-res playing video URL (e.g. Vimeo/local video)
  
  // Component B (Typographic) fields
  statement?: string; // Bold, brutalist statement
  
  // Optional single description override for home card
  description?: string;

  // Optional multi-paragraph story for modal view
  longStory?: string[];

  // Universal Metadata Block fields (3-sentence narrative format)
  context: string;
  delivered: string;
  outcome: string;
}

const FEATURED_PROJECTS: UnifiedProject[] = [
  {
    id: 'mastercard',
    title: 'Mastercard',
    tags: ['Social Film', '2D Animation'],
    type: 'visual',
    image: 'assets/motion_project_assets/mastercard_01.webp',
    hoverVideo: 'assets/motion_project_assets/mastercard_loop.mp4',
    videoUrl: 'https://player.vimeo.com/video/385480402',
    description: 'A playful social film for Mastercard built around the “Priceless” line, later becoming the brand’s most-viewed video of 2017.',
    longStory: [
      'Digitas approached us to make a social video for Mastercard that would be light, entertaining, and easy to share. The starting point was Mastercard’s long-running “Priceless” line, and the challenge was to use it in a way that felt playful rather than overly familiar.',
      'The concept paired everyday statistics with short, humorous scenarios, giving the piece a simple structure that worked well for social. Rather than overcomplicating the idea, the film kept the format clear and quick, letting the contrast between the numbers and the situations carry the tone.',
      'The result was Mastercard’s most-viewed video of 2017, with 2.2 million views, 20,000 reactions, and 2,181 shares on Facebook alone.'
    ],
    context: 'Digitas approached us to make a social video for Mastercard that would be light, entertaining, and easy to share.',
    delivered: 'Paired everyday statistics with short, humorous scenarios in a clear, quick format.',
    outcome: 'Became Mastercard’s most-viewed video of 2017, generating 2.2M views, 20,000 reactions, and 2,181 shares on Facebook.'
  },
  {
    id: 'leadership-circle',
    title: 'Leadership Team Alignment',
    tags: ['Cooperative Governance', 'Culture Design'],
    type: 'typographic',
    statement: 'Untangling a 6-month product bottleneck in 3 days.',
    description: 'Facilitation and active listening sprints for an 80+ person design and research network to resolve decision-making bottlenecks.',
    context: 'Strategic alignment bottlenecks in a decentralized design and research network.',
    delivered: 'Facilitated active listening circles and co-created a self-governing coordinator model.',
    outcome: 'Streamlined decision-making pathways without adding administrative overhead.'
  },
  {
    id: 'optiver',
    title: 'Optiver',
    tags: ['Onboarding Campaign', '2D Animation'],
    type: 'visual',
    image: 'assets/motion_project_assets/optiver_office_image.webp',
    hoverVideo: 'assets/motion_project_assets/optiver_loop.mp4',
    videoUrl: 'assets/motion_project_assets/optiver_loop.mp4',
    description: 'A film for Optiver that turned internal interviews into a clearer, more grounded way of expressing the company’s culture to new recruits.',
    longStory: [
      'Optiver wanted to show new recruits what made its culture distinct from other trading companies. Rather than relying on generic employer-brand language, the project started by looking more closely at how people inside the company actually described the place.',
      'Working closely with Optiver, we conducted interviews across different levels of the organization to understand what felt specific to the culture from the inside. Those conversations helped identify five values that genuinely resonated, which then became the basis for five scenarios showing those values in practice.',
      'The result was a film designed not just to describe the culture, but to make it easier for new employees to recognise and navigate it. It is now used as part of Optiver’s onboarding process.'
    ],
    context: 'Optiver wanted to show new recruits what made its culture distinct from other trading companies.',
    delivered: 'Conducted internal interviews to identify core values and created a film featuring five real-world scenarios showing those values in practice.',
    outcome: 'The film is now used as part of Optiver’s onboarding process to help new employees recognise and navigate the culture.'
  },
  {
    id: 'resilience-blueprint',
    title: 'The Transition Space',
    tags: ['Sprints', 'Systems Mapping', 'Workshops'],
    type: 'typographic',
    statement: 'Moving 15 hostile industrial competitors into a single circular pipeline.',
    description: 'Co-design workshops and systems mapping bringing cross-industry partners together to align around a circular recycling model.',
    context: 'Historical distrust among industrial partners blocking regional material recycling loops.',
    delivered: 'Facilitated intensive co-design sprints using physical systems-mapping tools.',
    outcome: 'Delivered a circular material blueprint adopted across three European regions.'
  },
  {
    id: 'adidas-all-blacks',
    title: 'Adidas All Blacks',
    tags: ['3D Motion', 'Product Promo'],
    type: 'visual',
    image: 'assets/motion_project_assets/adidas_01.webp',
    hoverVideo: 'assets/motion_project_assets/adidas_website_thumbnail.mp4',
    videoUrl: 'assets/motion_project_assets/adidas-all-blacks-1.1-adidas_allblack_video.mp4',
    description: 'A 3D promo for the Adidas All Blacks jersey, focused on capturing the texture, construction, and technical detail of the garment.',
    longStory: [
      'This project was made to support the launch of a new Adidas All Blacks jersey, first introduced in 1893. The turnaround was tight, so we joined the planned photoshoot to gather the material we needed for the 3D work from the start.',
      'A large part of the job was getting the fabric and construction to feel convincing on screen. During the shoot, we captured texture references of the jersey so the 3D team could recreate the material accurately rather than having to approximate it later under time pressure.',
      'The design itself gave us plenty to work with: anti-grip detailing, second-skin integration, zonal stability, and carbon weave structure. The film focused on bringing those technical features forward through texture, light, and movement, while keeping the overall feel sharp, physical, and in step with the energy of the All Blacks.',
      'What I like about this project is how practical the process was. Getting the right references early made the rest of the production possible, and helped turn a tight timeline into something precise enough to hold up.'
    ],
    context: 'This project was made to support the launch of a new Adidas All Blacks jersey, first introduced in 1893.',
    delivered: 'Captured texture references during the photoshoot to build a 3D promo focused on texture, light, and technical details.',
    outcome: 'Turned a tight timeline into a precise product film that holds up under scrutiny.'
  },
  {
    id: 'nature-retreat',
    title: 'Executive Realignment Off-site',
    tags: ['Executive Alignment', 'Off-site Facilitation'],
    type: 'typographic',
    statement: 'Untangling leadership friction through structured diagnostic sprints.',
    description: 'A structured diagnostic retreat bringing senior leadership together to reset protocols and restore trust.',
    context: 'High operational stress leading to strategic fragmentation among executive directors.',
    delivered: 'Facilitated an off-site retreat focused on honest diagnostic alignment.',
    outcome: 'Restored trust and established clear, sustainable communication rhythms.'
  },
  {
    id: 'datscha',
    title: 'Datscha',
    subtitle: 'The End of Spreadsheets',
    tags: ['Campaign Storytelling', '2D Animation'],
    type: 'visual',
    image: 'assets/motion_project_assets/datscha_01.webp',
    hoverVideo: 'assets/motion_project_assets/datscha-website-thumbnail-1250x698-compressed.mp4',
    videoUrl: 'assets/motion_project_assets/datscha-website-thumbnail-1250x698-compressed.mp4',
    description: 'Datscha wanted to launch its platform in a way that clearly separated it from older, spreadsheet-led workflows. The project turned that contrast into a playful animated world shaped by action cartoons and superhero logic.',
    longStory: [
      'Datscha was launching a new commercial property platform and wanted to mark a clear break from older, spreadsheet-heavy ways of working. In a category where many tools still rely on endless rows and columns, the task was to show a simpler, more usable alternative.',
      'An early idea — the “spreadsheet warrior” — gave the project its shape. Rather than using it as a one-off gag, the concept became a way to build a whole animated world around the frustration of outdated workflows and the appeal of something more intuitive.',
      'The visual direction drew from action cartoons and superhero stories. That gave the piece enough energy and character to feel memorable, while still keeping the message straightforward: Datscha offers a different experience from the systems many people in the industry are used to working with.',
      'What worked well here was the balance between play and clarity. The campaign gave Datscha a more distinct voice and helped frame the platform as a modern alternative in a space that often feels stuck in older habits.'
    ],
    context: 'Datscha wanted to launch its platform in a way that clearly separated it from older, spreadsheet-led workflows.',
    delivered: 'The project turned that contrast into a playful animated world shaped by action cartoons and superhero logic.',
    outcome: 'Helped frame the platform as a modern alternative in a space that often feels stuck in older habits.'
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
      className="relative w-full aspect-[16/9] overflow-hidden bg-[#E2DFD5]/40 rounded-xl cursor-pointer group border border-[var(--border-color)]/20"
    >
      {project.hoverVideo ? (
        <video
          ref={videoRef}
          src={resolveAsset(project.hoverVideo)}
          loop
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => {
            if (videoRef.current && !isHovered) {
              videoRef.current.currentTime = 0;
            }
          }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-[1.03]"
        />
      ) : (
        <img 
          src={resolveAsset(project.image)} 
          alt={project.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-105"
        />
      )}
      
      {/* Minimal Play Overlay indicator on hover */}
      <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 pointer-events-none">
        <span className="bg-white/95 text-black text-[10px] font-semibold tracking-widest uppercase px-5 py-2.5 rounded-full shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
          View Project
        </span>
      </div>
    </div>
  );
}

function PageTransition({ 
  children, 
  routeKey, 
  transitionStyle = 'smooth-cascade', 
  ...props 
}: { 
  children: React.ReactNode, 
  routeKey: string, 
  transitionStyle?: TransitionVariationKey, 
  [key: string]: any 
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [routeKey]);

  const variation = TRANSITION_VARIATIONS[transitionStyle] || TRANSITION_VARIATIONS['smooth-cascade'];

  return (
    <TransitionContext.Provider value={transitionStyle}>
      <motion.div
        key={routeKey}
        variants={variation.page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative w-full"
        {...props}
      >
        {children}
      </motion.div>
    </TransitionContext.Provider>
  );
}

export default function App() {
  const [view, setView] = useState<'work' | 'about' | 'legal'>('work');
  const [activeFilter, setActiveFilter] = useState<'all' | 'motion' | 'facilitate'>('all');
  const [selectedProject, setSelectedProject] = useState<UnifiedProject | null>(null);
  const transitionStyle: TransitionVariationKey = 'smooth-cascade';

  // Dynamic color styles matching the active track
  const getHeadingGradient = () => {
    return "text-[var(--text-primary)]";
  };

  const getCTAButtonClass = () => {
    return "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm hover:opacity-90 hover:scale-[1.01] transition-all duration-300";
  };

  // Helper state & URL navigation handlers
  const openAbout = () => {
    setView('about');
    setSelectedProject(null);
    trackAboutOpen();
    if (window.location.hash !== '#about') {
      window.history.pushState(null, '', '#about');
    }
  };

  const openWork = () => {
    setView('work');
    setSelectedProject(null);
    if (window.location.hash === '#about' || window.location.hash.startsWith('#project-')) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  const openProject = (project: UnifiedProject) => {
    setSelectedProject(project);
    trackProjectView(project.id, project.title);
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
      if (hash === '#about' || hash === '#faq') {
        setView('about');
        setSelectedProject(null);
      } else if (hash.startsWith('#project-')) {
        const projId = hash.replace('#project-', '');
        const p = FEATURED_PROJECTS.find((proj) => proj.id === projId);
        if (p) {
          setSelectedProject(p);
        } else {
          setSelectedProject(null);
        }
      } else {
        if (hash === '#facilitate' || hash === '#facilitation') {
          setView('work');
          setActiveFilter('facilitate');
          setSelectedProject(null);
        } else if (hash === '#motion' || hash === '#motion-design') {
          setView('work');
          setActiveFilter('motion');
          setSelectedProject(null);
        } else if (hash === '' || hash === '#work' || hash === '#hero' || hash === '#selected-work') {
          setView('work');
          setSelectedProject(null);
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
          onClick={() => openWork()}
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
            onClick={() => openWork()}
            className={`font-sans font-bold text-[10.5px] tracking-[0.22em] uppercase py-1 bg-transparent border-0 cursor-pointer outline-none select-none transition-colors ${
              view === 'work' ? 'text-[var(--text-primary)] border-b border-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Work
          </button>
          
          <button 
            id="about-toggle"
            onClick={() => (view === 'about' ? openWork() : openAbout())}
            className={`group relative flex items-center font-sans font-bold text-[10.5px] tracking-[0.22em] uppercase py-1 bg-transparent border-0 cursor-pointer outline-none select-none transition-colors ${
              view === 'about' ? 'text-[var(--text-primary)] border-b border-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>ABOUT & FAQ</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full">
        <AnimatePresence mode="wait">
        
        {/* VIEW: WORK (Continuous Scroll Portfolio Grid) */}
        {view === 'work' && (
          <PageTransition key="work" routeKey="work" transitionStyle={transitionStyle}>
            <div className="space-y-0">
              
              {/* Section 1: Hero */}
            <StaggerItem as="section" id="hero" className="relative overflow-hidden border-b border-[var(--border-color)]/30 min-h-[75vh]">
              <VantaCloudsBackground selector="#hero" />
              
              <div className="section-container relative z-10 space-y-6 pt-24 pb-12 md:pt-28 md:pb-16">
                <h1 className={`tracking-tight leading-[1.08] text-balance font-display text-4xl sm:text-5xl md:text-6xl ${getHeadingGradient()}`}>
                  Moving complex work forward.
                </h1>
                <div className="space-y-6 max-w-3xl">
                  <p className="text-lg md:text-xl font-display text-[var(--text-primary)] font-normal leading-relaxed text-balance">
                    I help teams communicate complex ideas through motion, and I support the workshops, decisions, and collaboration structures that help good work move forward.
                  </p>
                  <p className="text-sm md:text-base text-[var(--text-secondary)] font-normal leading-relaxed text-balance">
                    Bringing commercial advertising and motion experience to values-led organizations, research teams, and complex initiatives.
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
            </StaggerItem>

            {/* Section 2: Proof Bar */}
            <StaggerItem as="section" id="proof-bar" className="border-b border-[var(--border-color)]/30 py-8">
              <div className="section-container flex flex-col items-center gap-8">
                <span className="text-sm font-mono text-[var(--text-secondary)] tracking-wider uppercase text-center w-full">
                  Trusted by teams including
                </span>
                <div className="w-full flex flex-wrap items-center justify-between gap-x-6 gap-y-8 text-lg md:text-xl font-bold">
                  {/* Mastercard */}
                  <div className="flex items-center opacity-85 hover:opacity-100 transition-opacity">
                    <img src={resolveAsset('logos/mastercard.svg')} alt="Mastercard" className="h-7 md:h-9 w-auto object-contain" />
                  </div>
                  
                  {/* Adidas */}
                  <div className="flex items-center opacity-85 hover:opacity-100 transition-opacity">
                    <img src={resolveAsset('logos/adidas.svg')} alt="Adidas" className="h-7 md:h-9 w-auto object-contain" />
                  </div>
                  
                  {/* Optiver */}
                  <div className="flex items-center opacity-85 hover:opacity-100 transition-opacity">
                    <img src={resolveAsset('logos/optiver.svg')} alt="Optiver" className="h-6 md:h-8 w-auto object-contain" />
                  </div>
                  
                  {/* Deloitte */}
                  <div className="flex items-center opacity-85 hover:opacity-100 transition-opacity">
                    <img src={resolveAsset('logos/deloitte.svg')} alt="Deloitte" className="h-5 md:h-6.5 w-auto object-contain" />
                  </div>

                  {/* BCG Digital Ventures */}
                  <div className="flex items-center opacity-85 hover:opacity-100 transition-opacity">
                    <img src={resolveAsset('logos/bcg.svg')} alt="BCG Digital Ventures" className="h-7 md:h-9 w-auto object-contain" />
                  </div>

                  {/* Edelman */}
                  <div className="flex items-center opacity-85 hover:opacity-100 transition-opacity">
                    <img src={resolveAsset('logos/edelman.svg')} alt="Edelman" className="h-7 md:h-9 w-auto object-contain" />
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* Section 3: What I Do */}
            <StaggerItem as="section" id="what-i-do" className="border-b border-[var(--border-color)]/30 pt-16 md:pt-24 pb-16 md:pb-24">
              <div className="section-container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
                  {/* Motion & Visuals */}
                  <div className="space-y-6">
                    <h3 className="font-display font-medium text-3xl text-[var(--text-primary)] leading-tight">
                      Motion & Visuals
                    </h3>
                    <p className="text-base text-[var(--text-secondary)] leading-relaxed font-body max-w-md">
                      Animation and visual communication that help complex ideas become easier to see, share, and understand.
                    </p>
                    <ul className="text-sm text-[var(--text-secondary)] leading-relaxed font-body space-y-2 pt-2">
                      <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Explainer animation</li>
                      <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> UI motion</li>
                      <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Infographics & Data</li>
                      <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Campaign assets</li>
                    </ul>
                  </div>

                  {/* Facilitation */}
                  <div className="space-y-6">
                    <h3 className="font-display font-medium text-3xl text-[var(--text-primary)] leading-tight">
                      Facilitation
                    </h3>
                    <p className="text-base text-[var(--text-secondary)] leading-relaxed font-body max-w-md">
                      Workshops and collaboration support that help teams align, make decisions, and move complex work forward with less friction.
                    </p>
                    <ul className="text-sm text-[var(--text-secondary)] leading-relaxed font-body space-y-2 pt-2">
                      <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Workshop design</li>
                      <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Strategic alignment</li>
                      <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Decision support</li>
                      <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Action roadmaps</li>
                    </ul>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* Section 4: Selected Work */}
            <StaggerItem as="section" id="selected-work" className="border-b border-[var(--border-color)]/30 py-8 md:py-12">
              <div className="section-container space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 border-b border-[var(--border-color)]/20 pb-6 mb-4">
                  <h2 className={`text-xl md:text-2xl font-display font-medium tracking-tight ${getHeadingGradient()}`}>
                    Selected Work
                  </h2>
                  
                  {/* Filter Controls */}
                  <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
                    <button
                      onClick={() => {
                        setActiveFilter('all');
                        trackFilterChange('all');
                      }}
                      className={`pb-1 border-b transition-all ${
                        activeFilter === 'all' 
                          ? 'border-[var(--text-primary)] text-[var(--text-primary)] font-medium' 
                          : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter('facilitate');
                        trackFilterChange('facilitate');
                      }}
                      className={`pb-1 border-b transition-all ${
                        activeFilter === 'facilitate' 
                          ? 'border-[var(--text-primary)] text-[var(--text-primary)] font-medium' 
                          : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Facilitation
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter('motion');
                        trackFilterChange('motion');
                      }}
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

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 w-full relative">
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                      <motion.div
                        layout
                        key={project.id}
                        initial={{ opacity: 0, scale: 0.95, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -12 }}
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
                            className="rounded-xl md:rounded-2xl aspect-[16/9] flex flex-col justify-between p-8 md:p-12 border border-[var(--border-color)]/30 hover:border-[var(--text-primary)]/50 transition-all duration-500 cursor-pointer group bg-transparent"
                          >
                            <div className="flex justify-between items-start w-full">
                              <span className="font-mono text-[10px] tracking-widest text-[var(--text-secondary)] uppercase">
                                Case Study
                              </span>
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-sans text-xs">
                                Read →
                              </span>
                            </div>
                            <p className="font-display text-2xl md:text-3xl lg:text-4xl leading-snug font-medium italic text-[var(--text-primary)]">
                              “{project.statement}”
                            </p>
                          </div>
                        )}

                        <div className="text-left space-y-4 pt-2">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[var(--border-color)]/20 pb-4 gap-2">
                            <h3 className="text-xl md:text-2xl font-display font-medium text-[var(--text-primary)]">
                              {project.title}
                            </h3>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
                              {project.tags[0]}
                            </span>
                          </div>
                          
                          <div className="text-sm md:text-base leading-relaxed text-[var(--text-secondary)] font-body">
                            {project.description ? (
                              <p className="text-balance text-[var(--text-primary)]">
                                {project.description}
                              </p>
                            ) : (
                              <p className="text-balance text-[var(--text-primary)]">
                                {project.context}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </StaggerItem>

            {/* Section 5: Contact CTA */}
            <StaggerItem as="section" id="contact-cta" className="pt-20 pb-10 md:pt-32 md:pb-16">
              <div className="section-container max-w-2xl text-left space-y-8">
                <h2 className={`font-display font-medium text-3xl md:text-5xl tracking-tight leading-tight ${getHeadingGradient()}`}>
                  Working on something complex?
                </h2>
                <div className="space-y-4 text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                  <p>
                    Clear communication and effective collaboration reinforce each other. Motion helps ideas land. Facilitation helps teams align around them.
                  </p>
                  <p>
                    If you need clearer communication, steadier collaboration, or both, let’s talk.
                  </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-6">
                  <a 
                    href="mailto:hello@ayodrab.com"
                    onClick={() => trackContactClick('email_cta_button')}
                    className={`inline-block px-8 py-4 rounded-full font-sans font-bold text-xs uppercase tracking-widest text-center transition-all duration-300 ${getCTAButtonClass()}`}
                  >
                    Get in touch
                  </a>
                  <button
                    onClick={() => openAbout()}
                    className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer bg-transparent border-0 underline decoration-dotted underline-offset-4 text-left"
                  >
                    About & FAQ →
                  </button>
                </div>
              </div>
            </StaggerItem>

          </div>
          </PageTransition>
        )}

        {/* VIEW: ABOUT & FAQ (Dedicated Editorial Page specialized for NGOs & Mission-Driven Teams) */}
        {view === 'about' && (
          <PageTransition key="about" routeKey="about" transitionStyle={transitionStyle}>
            <AboutPage 
              onBackToWork={() => openWork()} 
            />
          </PageTransition>
        )}

        {/* VIEW: LEGAL (German Impressum & Privacy Policy compliance) */}
        {view === 'legal' && (
          <PageTransition key="legal" routeKey="legal" transitionStyle={transitionStyle}>
            <StaggerItem className="space-y-12 max-w-5xl pt-32 pb-16 mx-auto px-6 md:px-12 lg:px-20">
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
            </StaggerItem>
          </PageTransition>
        )}
        </AnimatePresence>
      </main>

      {/* Footer (The Final CTA) */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto border-t border-[var(--border-color)]/20 py-12 px-6 md:px-12 lg:px-20 flex justify-center md:justify-end items-center text-[9.5px] font-sans font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
        <div className="flex gap-6 items-center">
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
                {project.subtitle && (
                  <p className="text-xl md:text-2xl font-display font-normal text-[var(--text-secondary)]">
                    {project.subtitle}
                  </p>
                )}
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
              {project.longStory ? (
                <div className="max-w-3xl mx-auto space-y-6 pt-8 border-t border-[var(--border-color)]/30">
                  {project.longStory.map((paragraph, idx) => (
                    <p key={idx} className="text-base md:text-lg leading-relaxed text-[var(--text-primary)] font-body">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
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
              )}
              
            </motion.div>
          </main>
        </div>
      </motion.div>
    </motion.div>
  );
}
