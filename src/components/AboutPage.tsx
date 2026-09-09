import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NGO_FAQS } from '../data/faqs';
import { trackContactClick } from '../lib/analytics';
import { StaggerItem } from '../transitions';

interface AboutPageProps {
  onBackToWork?: () => void;
}

export default function AboutPage({ onBackToWork }: AboutPageProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-32 text-[var(--text-primary)] font-body">
      {/* Editorial container with generous margins */}
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 space-y-24 md:space-y-32">

        {/* Hero Narrative: Cinematic Typography */}
        <StaggerItem as="header" className="space-y-10">
          <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-balance">
            Visual clarity for <em className="italic font-light pr-1">complex</em> ideas. <br />
            <span className="text-[var(--text-secondary)]">Strategic alignment for the teams behind them.</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-display text-[var(--text-primary)] font-normal leading-[1.4] text-balance max-w-4xl">
            I am an independent motion designer and facilitator based in Berlin, working remotely and traveling on-site globally. I partner directly with NGOs, research consortia, and values-led organizations—assembling curated teams of specialized collaborators when scale demands it—to turn dense policy into resonant visual communication.
          </p>
        </StaggerItem>

        {/* Narrative & Background */}
        <StaggerItem as="section" className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 pt-20 border-t border-[var(--border-color)]/20">
          <div className="md:col-span-5 lg:col-span-4">
            <span className="font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] block">
              The Perspective
            </span>
          </div>
          <div className="md:col-span-7 lg:col-span-8 space-y-8 text-lg md:text-xl leading-relaxed text-[var(--text-secondary)] font-body max-w-2xl">
            <h2 className="font-display font-medium text-3xl md:text-4xl text-[var(--text-primary)] leading-[1.15] mb-10 text-balance">
              Moving <em className="italic font-light">upstream</em> from the animation timeline.
            </h2>
            <p>
              Over a decade in motion design taught me an uncomfortable truth: most communication projects don’t fall short because of animation craft or rendering speed. They struggle because internal teams haven’t reached true consensus on what matters most.
            </p>
            <p>
              When mission-driven initiatives try to communicate with donors, policymakers, or citizens, they often battle three invisible obstacles: competing internal priorities, the curse of institutional jargon, and fear of oversimplifying vital scientific or social nuance.
            </p>
            <p>
              By combining <strong className="text-[var(--text-primary)] font-medium">workshop facilitation</strong> with <strong className="text-[var(--text-primary)] font-medium">high-craft motion design</strong>, I help organizations solve both problems in tandem. We align the team first through structured discovery, and then translate that shared clarity into motion assets that respect the intelligence of your audience.
            </p>
          </div>
        </StaggerItem>

        {/* Dual Disciplines: Editorial Layout (No boxes) */}
        <StaggerItem as="section" className="pt-20 border-t border-[var(--border-color)]/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-5 lg:col-span-4 space-y-6">
              <span className="font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] block">
                Core Practices
              </span>
              <div className="space-y-4 max-w-xs">
                <p className="text-sm text-[var(--text-primary)] font-medium leading-relaxed">
                  The Independent Model
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  I operate as an independent consultant. For comprehensive campaigns, I bring in trusted, specialized collaborators—sound designers, illustrators, and researchers—so you get agency-level craft without the agency overhead.
                </p>
              </div>
            </div>

            <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16">
              {/* Discipline 1: Motion */}
              <div className="space-y-6">
                <h3 className="font-display font-medium text-2xl md:text-3xl text-[var(--text-primary)] leading-tight">
                  Motion & Visual Systems
                </h3>
                <p className="text-base text-[var(--text-secondary)] leading-relaxed font-body">
                  Translating complex scientific data, policy proposals, and advocacy narratives into focused, beautifully paced animation.
                </p>
                <ul className="text-sm text-[var(--text-secondary)] leading-relaxed font-body space-y-2 pt-2">
                  <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Explainer and advocacy films</li>
                  <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Systemic infographics and data visualization</li>
                  <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Multi-channel campaign assets</li>
                  <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Custom graphics for reports and presentations</li>
                </ul>
              </div>

              {/* Discipline 2: Facilitation */}
              <div className="space-y-6">
                <h3 className="font-display font-medium text-2xl md:text-3xl text-[var(--text-primary)] leading-tight">
                  Facilitation & Alignment
                </h3>
                <p className="text-base text-[var(--text-secondary)] leading-relaxed font-body">
                  Neutral, structured facilitation that unlocks multi-stakeholder consensus, clarifies strategic narrative, and accelerates decisions.
                </p>
                <ul className="text-sm text-[var(--text-secondary)] leading-relaxed font-body space-y-2 pt-2">
                  <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Leadership off-sites and retreats</li>
                  <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Core messaging workshops</li>
                  <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Stakeholder alignment sessions</li>
                  <li className="flex gap-3"><span className="text-[var(--text-primary)] opacity-50">—</span> Translating complex goals into clear action plans</li>
                </ul>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* FAQ SECTION (Elegant Typographic List) */}
        <StaggerItem as="section" id="faq" className="pt-20 border-t border-[var(--border-color)]/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-5 lg:col-span-4 space-y-6">
              <span className="font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] block">
                Working Together
              </span>
              <h2 className="font-display font-medium text-3xl md:text-4xl text-[var(--text-primary)] leading-[1.15] text-balance">
                Questions mission-driven teams often ask.
              </h2>
            </div>
            
            <div className="md:col-span-7 lg:col-span-8">
              {/* FAQ Accordion List without boxes */}
              <div className="border-t border-[var(--border-color)]/30">
                {NGO_FAQS.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div key={faq.id} className="border-b border-[var(--border-color)]/30 group">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full text-left py-8 flex items-start justify-between gap-6 cursor-pointer bg-transparent border-0 outline-none"
                        aria-expanded={isOpen}
                      >
                        <h3 className={`font-display font-medium text-xl md:text-2xl leading-snug transition-colors duration-300 ${isOpen ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                          {faq.question}
                        </h3>

                        <div className="relative w-5 h-5 flex-shrink-0 flex items-center justify-center mt-1">
                          <span className={`absolute w-full h-[1.5px] bg-current transition-all duration-300 ${isOpen ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`} />
                          <span className={`absolute w-[1.5px] h-full bg-current transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'opacity-100'} ${isOpen ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`} />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pb-10 pr-8 space-y-6 text-lg leading-relaxed text-[var(--text-secondary)] font-body max-w-2xl">
                              {faq.answer.map((paragraph, i) => (
                                <p key={i}>
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Contact CTA (Massive statement, no boxes) */}
        <StaggerItem as="section" className="pt-28 md:pt-40 pb-16 border-t border-[var(--border-color)]/20 text-center space-y-12">
          <h2 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--text-primary)] tracking-tight leading-[1.05] text-balance mx-auto max-w-4xl">
            Bring your <em className="italic font-light">rough</em> drafts, <em className="italic font-light">messy</em> research, and strategic questions.
          </h2>
          
          <div className="pt-8 space-y-12">
            <a
              href="mailto:hello@ayodrab.com"
              onClick={() => trackContactClick('about_page_cta')}
              className="group inline-flex items-center gap-4 font-sans font-bold text-[11px] uppercase tracking-[0.2em] text-[var(--text-primary)] hover:text-[var(--text-secondary)] transition-colors pb-2"
            >
              <span className="border-b border-[var(--text-primary)] group-hover:border-[var(--text-secondary)] pb-1 transition-colors">Initiate a Conversation</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1 border-b border-transparent pb-1">→</span>
            </a>
          </div>
        </StaggerItem>

      </div>
    </div>
  );
}

