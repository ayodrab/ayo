// Assets resolved for GitHub pages deploy base compatibility - Revision 2
import React, { useState } from 'react';
import { PortfolioProject, Theme } from '../types';
import { PORTFOLIO_PROJECTS } from '../data';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function getVimeoEmbedUrl(url?: string): string | null {
  if (!url) return null;
  if (url.includes('player.vimeo.com')) {
    return url;
  }
  const match = url.match(/(?:vimeo\.com\/)(?:video\/|channels\/[^\/]+\/|groups\/[^\/]+\/forum\/topic\/|showcase\/[^\/]+\/video\/|manage\/videos\/)?([0-9]+)/);
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}?autoplay=0&loop=1&muted=1`;
  }
  return url;
}

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

interface PortfolioProps {
  theme: Theme;
}

interface ProjectCardProps {
  key?: React.Key;
  project: PortfolioProject;
  theme: Theme;
  onClick: () => void;
  getDottedTitle: (id: string, originalTitle: string) => string;
}

function ProjectCard({ project, theme, onClick, getDottedTitle }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!isHovered && project.thumbnailTimePercent !== undefined) {
      video.currentTime = video.duration * project.thumbnailTimePercent;
    }
  };

  React.useEffect(() => {
    if (project.hoverVideo && videoRef.current) {
      if (isHovered) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log("Video auto-play interrupted:", err);
          });
        }
      } else {
        videoRef.current.pause();
        if (project.thumbnailTimePercent !== undefined && !isNaN(videoRef.current.duration)) {
          videoRef.current.currentTime = videoRef.current.duration * project.thumbnailTimePercent;
        } else {
          videoRef.current.currentTime = 0;
        }
      }
    }
  }, [isHovered, project.hoverVideo, project.thumbnailTimePercent]);

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer select-none space-y-4"
    >
      {/* Image Container: Square by default, morphs to fully-rounded coordinates with zoom on hover. No border outlines. */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100/30 dark:bg-neutral-900/40 rounded-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rounded-[3.5rem]">
        {project.hoverVideo ? (
          <video
            ref={videoRef}
            src={resolveAsset(project.hoverVideo)}
            loop
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            className="absolute inset-0 w-full h-full object-cover rounded-none transition-all duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-104 group-hover:rounded-[3.5rem]"
          />
        ) : (
          <img 
            src={resolveAsset(project.image)} 
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-none transition-all duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-104 group-hover:rounded-[3.5rem]"
          />
        )}
      </div>

      {/* Text metadata container with matched website typography */}
      <div className="space-y-1.5 px-1">
        <div className="flex items-center justify-between gap-4">
          <h3 className={`text-lg md:text-xl font-display font-medium tracking-tight transition-colors duration-300 ${
            theme === 'facilitation'
              ? 'text-[var(--accent-color)] group-hover:text-[var(--accent-hover)]'
              : 'text-[var(--text-main)] group-hover:text-[var(--accent-color)]'
          }`}>
            {getDottedTitle(project.id, project.title)}
          </h3>
          
          {/* Micro clean tag pills */}
          <div className="flex flex-wrap gap-1.5 shrink-0">
            {project.tags.slice(0, 1).map((tag) => (
              <span 
                key={tag} 
                className="text-[9px] font-sans font-medium tracking-widest uppercase border border-[var(--border-color)] text-[var(--accent-color)] px-3 py-1 rounded-full bg-[var(--badge-bg)] whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <p className="text-xs md:text-sm text-[var(--text-muted)] font-sans tracking-normal leading-relaxed">
          {project.description}
        </p>
      </div>
    </div>
  );
}

export default function Portfolio({ theme }: PortfolioProps) {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  
  // Display all of Ayo's real signature projects (Mastercard, Optiver, Adidas, Datscha)
  const filteredProjects = PORTFOLIO_PROJECTS;

  // Helper to map project id to editorial dotted titles
  const getDottedTitle = (id: string, originalTitle: string) => {
    switch (id) {
      case 'mastercard':
        return 'Mastercard. A life in numbers.';
      case 'optiver':
        return 'Optiver. Making Waves.';
      case 'adidas-all-blacks':
        return 'Adidas. All Blacks.';
      case 'datscha':
        return "Datscha. What's behind the wall?";
      default:
        return originalTitle;
    }
  };

  // Dynamically obtain blocks, falling back to legacy fields if none exist
  const getProjectBlocks = (project: PortfolioProject) => {
    if (project.blocks && project.blocks.length > 0) {
      return project.blocks;
    }

    const fallbackBlocks = [];

    // The Brief
    fallbackBlocks.push({
      type: 'text' as const,
      title: project.id === 'mastercard' ? 'The Choice' : 'The Brief',
      text: project.longDescription
    });

    // Gallery Image 1 (Interleaved)
    if (project.galleryImages && project.galleryImages[0]) {
      fallbackBlocks.push({
        type: 'image' as const,
        image: project.galleryImages[0],
        imageAlt: `${project.title} Detail 1`
      });
    }

    // The Delivery / Synthesis
    fallbackBlocks.push({
      type: 'text' as const,
      title: project.id === 'mastercard' ? 'The Synthesis' : 'The Delivery',
      text: project.outcome
    });

    // Gallery Image 2 (Interleaved) or more in a gallery format
    if (project.galleryImages && project.galleryImages[1]) {
      if (project.galleryImages.length === 2) {
        fallbackBlocks.push({
          type: 'image' as const,
          image: project.galleryImages[1],
          imageAlt: `${project.title} Detail 2`
        });
      } else {
        fallbackBlocks.push({
          type: 'image' as const,
          title: 'Process & Exhibition Documentation',
          images: project.galleryImages.slice(1)
        });
      }
    }

    return fallbackBlocks;
  };

  return (
    <section id="portfolio-section" className="relative z-10 mt-12 md:mt-16 pt-8">
      
      {/* Symmetrical Responsive Grid Aligning project cards side-by-side with matched heights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 w-full">
        {filteredProjects.map((project) => (
          <ProjectCard 
            key={project.id}
            project={project}
            theme={theme}
            onClick={() => setSelectedProject(project)}
            getDottedTitle={getDottedTitle}
          />
        ))}
      </div>

      {/* Floating Detailed Case Study Panel Full Viewport Page */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            id="project-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
            className="fixed inset-0 bg-neutral-950/45 backdrop-blur-md z-50 flex flex-col items-center py-6 md:py-12 lg:py-16 px-4 md:px-8 selection:bg-[var(--accent-color)] selection:text-white overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            {/* Main Centered Floating Case Study Card */}
            <motion.div 
              id="project-drawer-panel"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
              className="w-full max-w-4xl h-auto p-6 md:p-10 relative z-10 rounded-[1.5rem] flex flex-col bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Navigation Close Bar (Simplified editorial bar) */}
              <div className="flex justify-end items-center py-4 border-b border-[var(--border-color)]/30 mb-8 md:mb-10">
                <button
                  id="close-drawer-btn"
                  onClick={() => setSelectedProject(null)}
                  className="group flex items-center gap-2 bg-transparent text-[var(--text-main)] transition-colors duration-300 text-[11px] font-sans tracking-[0.2em] uppercase cursor-pointer py-1.5 focus:outline-none"
                  aria-label="Close case study details"
                >
                  <span className="relative font-bold">
                    CLOSE
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--accent-color)] transition-all duration-300 group-hover:w-full" />
                  </span>
                  <X className="w-3.5 h-3.5 transition-transform group-hover:rotate-90 duration-350 text-[var(--text-muted)] group-hover:text-[var(--accent-color)]" />
                </button>
              </div>

              {/* Case Study Content */}
              <div className="flex-1 space-y-10 md:space-y-12">
                
                {/* Header Title Block */}
                <div className="space-y-3 max-w-4xl text-left">
                  <h2 className="text-3xl sm:text-5xl md:text-5xl font-display font-medium leading-[1.12] tracking-tight text-[var(--text-main)]">
                    {selectedProject.title}
                  </h2>
                  <p className="text-base md:text-lg font-light italic text-[var(--accent-color)] tracking-normal max-w-2xl font-display">
                    {selectedProject.subtitle}
                  </p>
                </div>

                {/* Primary Cover Media / Artwork */}
                <div id="project-cover-media" className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-neutral-900/10 rounded-xl relative shadow-md">
                  {selectedProject.coverVimeo ? (
                    <iframe
                      src={getVimeoEmbedUrl(selectedProject.coverVimeo) || ""}
                      className="w-full h-full border-0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={selectedProject.title}
                    />
                  ) : selectedProject.coverVideo ? (
                    <video
                      src={resolveAsset(selectedProject.coverVideo)}
                      controls
                      autoPlay
                      playsInline
                      loop
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={resolveAsset(selectedProject.image)} 
                      alt={selectedProject.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-101"
                    />
                  )}
                </div>

                {/* Case Metadata List (Simplified, no timeline or methodology) */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 py-5 border-t border-b border-[var(--border-color)]/30 font-sans text-xs text-left">
                  <div>
                    <span className="text-[var(--text-muted)] uppercase tracking-widest block text-[9px] mb-1 font-bold">Client Partner</span>
                    <span className="text-[var(--text-main)] font-semibold">{selectedProject.client}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] uppercase tracking-widest block text-[9px] mb-1 font-bold">Role / Practice</span>
                    <span className="text-[var(--text-main)] font-semibold">{selectedProject.role}</span>
                  </div>
                </div>

                {/* Simplified Text Block Narrative */}
                <div className="max-w-2xl mx-auto space-y-12 pt-2 text-left">
                  
                  {getProjectBlocks(selectedProject).map((block, index) => {
                    switch (block.type) {
                      case 'text':
                        return (
                          <div key={index} className="space-y-3 animate-fade-in">
                            {block.title && (
                              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--accent-color)] font-bold block">
                                {block.title}
                              </span>
                            )}
                            <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--text-muted)] font-sans font-light whitespace-pre-line">
                              {block.text}
                            </p>
                          </div>
                        );
                      case 'image':
                        return (
                          <div key={index} className="space-y-4 pt-2">
                             {block.title && (
                              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--accent-color)] font-bold block mb-1">
                                {block.title}
                              </span>
                            )}
                            {block.images && block.images.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {block.images.map((imgUrl, idx) => (
                                  <div 
                                    key={idx} 
                                    className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900/10 dark:bg-neutral-800/10 border border-[var(--border-color)]/40 group/img shadow-sm"
                                  >
                                    <img 
                                      src={resolveAsset(imgUrl)} 
                                      alt={`${block.title || 'Detail'} ${idx + 1}`}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-104"
                                    />
                                    <div className="absolute bottom-3 left-3 bg-neutral-950/75 dark:bg-neutral-900/80 backdrop-blur-md text-[9px] font-mono tracking-widest text-[var(--text-muted)] dark:text-neutral-300 font-medium px-2.5 py-1 rounded border border-[var(--border-color)]/30 uppercase select-none">
                                      Artifact 0{idx + 1}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : block.image ? (
                              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-900/10 dark:bg-neutral-800/10 border border-[var(--border-color)]/30 group/img shadow-md">
                                <img 
                                  src={resolveAsset(block.image)} 
                                  alt={block.imageAlt || block.title || `Detail ${index + 1}`}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-102"
                                />
                              </div>
                            ) : null}
                            {block.text && (
                              <p className="text-xs text-[var(--text-muted)] font-sans tracking-normal leading-relaxed italic mt-1.5">
                                {block.text}
                              </p>
                            )}
                          </div>
                        );
                      case 'video':
                        const vimeoUrl = getVimeoEmbedUrl(block.vimeo || (block.video?.includes('vimeo.com') ? block.video : undefined));
                        return (
                          <div key={index} className="space-y-4 pt-2">
                            {block.title && (
                              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--accent-color)] font-bold block mb-1">
                                {block.title}
                              </span>
                            )}
                            {vimeoUrl ? (
                              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-900/10 dark:bg-neutral-800/10 border border-[var(--border-color)]/30 group/vid shadow-md">
                                <iframe
                                  src={vimeoUrl}
                                  className="w-full h-full border-0"
                                  allow="autoplay; fullscreen; picture-in-picture"
                                  allowFullScreen
                                  title={block.title || "Embedded Video"}
                                />
                              </div>
                            ) : block.video ? (
                              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-900/10 dark:bg-neutral-800/10 border border-[var(--border-color)]/30 group/vid shadow-md">
                                <video 
                                  src={resolveAsset(block.video)} 
                                  poster={block.videoPoster ? resolveAsset(block.videoPoster) : undefined}
                                  controls
                                  autoPlay
                                  playsInline
                                  loop
                                  muted
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : null}
                            {block.text && (
                              <p className="text-xs text-[var(--text-muted)] font-sans tracking-normal leading-relaxed italic mt-1.5">
                                {block.text}
                              </p>
                            )}
                          </div>
                        );
                      case 'quote':
                        return (
                          <div key={index} className="pl-6 border-l-2 border-[var(--accent-color)] py-2 my-2 animate-fade-in">
                            {block.title && (
                              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--accent-color)] font-bold block mb-1">
                                {block.title}
                              </span>
                            )}
                            <p className="text-base sm:text-lg text-[var(--text-main)] font-light italic font-display">
                              "{block.text}"
                            </p>
                          </div>
                        );
                      case 'deliverables':
                        return (
                          <div key={index} className="space-y-3 pt-4 border-t border-[var(--border-color)]/20 animate-fade-in">
                            {block.title && (
                              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--accent-color)] font-bold block">
                                {block.title}
                              </span>
                            )}
                            <div className="flex flex-wrap gap-2 pt-1">
                              {(block.images || []).map((deliv, idx) => (
                                <span 
                                  key={idx} 
                                  className="text-xs font-sans text-[var(--text-muted)] border border-[var(--border-color)]/35 px-3 py-1 bg-neutral-900/5 dark:bg-neutral-800/5 rounded"
                                >
                                  {deliv}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}

                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
