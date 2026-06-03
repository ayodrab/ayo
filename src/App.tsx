/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Theme } from './types';

type View = 'work' | 'about' | 'legal';

/**
 * A beautiful, high-craft typography animator that splits titles and italic spans
 * into staggered letters to create a tactile cascading reveal when theme switches.
 */
interface AnimatedLetterHeadingProps {
  text: string;
  italicText: string;
  themeKey: string;
}

function AnimatedLetterHeading({ text, italicText, themeKey }: AnimatedLetterHeadingProps) {
  const words = text.split(' ');
  const italicWords = italicText.split(' ');
  let absoluteLetterCount = 0;

  return (
    <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-tight md:leading-[1.12]">
      {words.map((word, wordIdx) => {
        const letters = Array.from(word);
        return (
          <span key={`word-${wordIdx}`} className="inline-block mr-[0.25em]">
            {letters.map((char, charIdx) => {
              const delay = absoluteLetterCount * 11; // 11ms stagger delay for lush, organic overlap wave
              absoluteLetterCount++;
              return (
                <span
                  key={`char-${wordIdx}-${charIdx}-${themeKey}`}
                  className="reveal-letter opacity-0"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
      
      <br />
      
      <span className="inline-block italic font-normal text-[var(--accent-color)] mt-2">
        {italicWords.map((word, wordIdx) => {
          const letters = Array.from(word);
          return (
            <span key={`italic-word-${wordIdx}`} className="inline-block mr-[0.25em]">
              {letters.map((char, charIdx) => {
                const delay = absoluteLetterCount * 11;
                absoluteLetterCount++;
                return (
                  <span
                    key={`italic-char-${wordIdx}-${charIdx}-${themeKey}`}
                    className="reveal-letter opacity-0"
                    style={{ animationDelay: `${delay}ms` }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </h1>
  );
}



export default function App() {
  const [theme, setTheme] = useState<Theme>('motion');
  const [view, setView] = useState<View>('work');

  // Sync state to body data-theme attribute
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] font-body themed-transition flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Immersive Atmospheric Color Glow Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Glow Element 1 */}
        <div 
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-35 transition-all duration-1000 ease-in-out"
          style={{
            backgroundColor: theme === 'motion' ? '#0369a1' : '#bbf7d0'
          }}
        />
        {/* Glow Element 2 */}
        <div 
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-35 transition-all duration-1000 ease-in-out"
          style={{
            backgroundColor: theme === 'motion' ? '#1d4edf' : '#fef08a'
          }}
        />
      </div>

      {/* Dynamic Dot Pattern overlay */}
      <div className="absolute inset-0 dot-pattern pointer-events-none z-0" />

      {/* Header element featuring only 'ayo', centered toggle, and About & Contact link */}
      <header className="relative z-10 grid grid-cols-1 md:grid-cols-3 items-center gap-4 pb-8 border-b border-[var(--border-color)]">
        {/* Left: Brand logo & Explanatory Tagline */}
        <div 
          onClick={() => setView('work')}
          className="flex flex-col cursor-pointer group"
        >
          <span className="font-logo text-5xl font-bold tracking-wide text-[var(--accent-color)] leading-none select-none transition-transform duration-300 group-hover:scale-105 origin-left">
            ayo
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-main)] mt-1.5 font-bold">
            Motion Design & Co-Facilitation
          </span>
          <p className="text-[9px] text-[var(--text-muted)] mt-0.5 max-w-[240px] leading-relaxed hidden md:block">
            Integrating kinetic media & systemic group facilitation.
          </p>
        </div>

        {/* Center: High-visibility transparent sliding toggle track (colored accent slider, high-contrast text) */}
        <div className="justify-self-start md:justify-self-center">
          <div 
            onClick={() => {
              setTheme(theme === 'motion' ? 'facilitation' : 'motion');
              if (view !== 'work') setView('work');
            }}
            className="relative flex items-center bg-transparent border-2 border-[var(--border-color)] p-1 rounded-full w-64 h-11 cursor-pointer themed-transition select-none hover:border-[var(--accent-color)] transition-all duration-300"
          >
            {/* Sliding Custom Accent Thumb */}
            <div 
              className="absolute top-1 bottom-1 rounded-full bg-[var(--accent-color)] themed-transition w-[122px] shadow-md"
              style={{
                transform: theme === 'motion' ? 'translateX(0px)' : 'translateX(124px)',
              }}
            />

            {/* Label: Motion */}
            <span className={`flex-1 text-center font-mono text-xs tracking-wider z-10 transition-colors duration-300 ${
              theme === 'motion' ? 'text-[var(--bg-primary)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}>
              MOTION
            </span>

            {/* Label: Facilitation */}
            <span className={`flex-1 text-center font-mono text-xs tracking-wider z-10 transition-colors duration-300 ${
              theme === 'facilitation' ? 'text-[var(--bg-primary)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}>
              FACILITATION
            </span>
          </div>
        </div>

        {/* Right: Unified About & Contact button */}
        <div className="justify-self-start md:justify-self-end mt-2 md:mt-0">
          <button 
            id="about-contact-btn"
            onClick={() => setView(view === 'about' ? 'work' : 'about')}
            className={`font-mono text-xs uppercase tracking-wider border border-[var(--border-color)] px-4 py-2 transition-all duration-300 rounded-sm cursor-pointer ${
              view === 'about'
                ? 'bg-[var(--accent-color)] text-[var(--bg-primary)] font-bold'
                : 'text-[var(--text-main)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-primary)]'
            }`}
          >
            {view === 'about' ? '[ Close About ]' : 'About & Contact'}
          </button>
        </div>
      </header>

      {/* Main Container - Ground zero for step-by-step building */}
      <main className="relative z-10 flex-1 flex flex-col justify-center py-12 md:py-20">
        {view === 'work' && (
          <div className="max-w-2xl w-full grid grid-cols-1 grid-rows-1 relative min-h-[220px]">
            {/* Slide A: Motion Practice */}
            <div 
              className={`col-start-1 row-start-1 space-y-4 transition-opacity duration-300 ease-in-out ${
                theme === 'motion'
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <p className="font-mono text-xs text-[var(--accent-color)] uppercase tracking-widest">
                PRACTICE 01 : MOTION & INTERACTION
              </p>
              
              <AnimatedLetterHeading 
                text="Let's choreograph" 
                italicText="fluid motion." 
                themeKey={theme} 
              />

              <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed max-w-xl">
                Designing continuous motion, interactive systems, and cinematic animation that bring dynamic dimension, balance, and kinetic life to digital spaces.
              </p>
            </div>

            {/* Slide B: Facilitation Practice */}
            <div 
              className={`col-start-1 row-start-1 space-y-4 transition-opacity duration-300 ease-in-out ${
                theme === 'facilitation'
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <p className="font-mono text-xs text-[var(--accent-color)] uppercase tracking-widest">
                PRACTICE 02 : SYSTEMIC FACILITATION
              </p>

              <AnimatedLetterHeading 
                text="Let's shape" 
                italicText="regenerative cultures." 
                themeKey={theme} 
              />

              <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed max-w-xl">
                Guiding conscious team evolution and systemic change. Designing spaces of slow work that replace urgency and hustle with deep wellbeing, collective resilience, and organic systems.
              </p>
            </div>
          </div>
        )}

        {view === 'about' && (
          <div className="max-w-3xl space-y-8 animate-fade-in">
            <span className="font-mono text-xs text-[var(--accent-color)] uppercase tracking-widest block">
              ABOUT & CONTACT
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-medium tracking-tight">
              A professional duality of <br />
              <span className="italic">science and execution.</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
              <div className="space-y-4">
                <p>
                  Based in Germany, I collaborate with studios and forward-thinking brands to transform creative impulses into concrete, scalable realities. By balancing interaction mechanics with systemic change facilitation, I help bridge organizational values with technical execution.
                </p>
                <div className="pt-4">
                  <p className="font-semibold text-[var(--text-main)]">
                    Get in touch:
                  </p>
                  <p className="font-mono text-sm text-[var(--accent-color)] mt-1">
                    hello@ayo.design (placeholder)
                  </p>
                </div>
              </div>

              {/* Extralinear Interests */}
              <div className="border-t md:border-t-0 md:border-l border-[var(--border-color)] pt-6 md:pt-0 md:pl-8 space-y-4">
                <p className="text-xs font-mono text-[var(--accent-color)] uppercase tracking-wider">
                  Extralinear Practices (Coming Soon)
                </p>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-[var(--text-main)] block">Vinyl Selection & DJing</span>
                    <span className="text-[var(--text-muted)]">Curation of frequencies, slow grooves, atmospheres, and physical room acoustic setups.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--text-main)] block">Culinary Gathering & Cooking</span>
                    <span className="text-[var(--text-muted)]">Processes of local ingredient pairing, heat control, fermentation, and community sharing.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--text-main)] block">Performance & Presence</span>
                    <span className="text-[var(--text-muted)]">Exploration of physical expression, movement dynamics, and spatial interventions.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'legal' && (
          <div className="space-y-12 max-w-5xl animate-fade-in">
            <span className="font-mono text-xs text-[var(--accent-color)] uppercase tracking-widest block">
              LEGAL DOCUMENTATION
            </span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              {/* Impressum */}
              <div className="space-y-6">
                <h1 className="text-2xl font-display font-medium uppercase tracking-tight text-[var(--text-main)]">Impressum</h1>
                <div className="space-y-4 text-xs font-mono text-[var(--text-muted)] leading-relaxed">
                  <p>
                    Angaben gemäß § 5 TMG:<br />
                    Ayo [Nachname/Lastname Pfadhalter]<br />
                    [Straße, Hausnummer / Street, Number]<br />
                    [PLZ, Ort / ZIP, City, Germany]
                  </p>
                  <p>
                    <strong>Kontakt:</strong><br />
                    E-Mail: hello@ayo.design<br />
                    Telefon: [Telefonnummer / Phone Number]
                  </p>
                  <p>
                    <strong>Umsatzsteuer-ID:</strong><br />
                    Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                    [USt-IdNr.]
                  </p>
                </div>
              </div>

              {/* Datenschutz */}
              <div className="space-y-6">
                <h1 className="text-2xl font-display font-medium uppercase tracking-tight text-[var(--text-main)]">Datenschutzerklärung</h1>
                <div className="space-y-4 text-xs font-mono text-[var(--text-muted)] leading-relaxed max-h-[300px] overflow-y-auto pr-4 border-r border-[var(--border-color)]">
                  <p className="font-bold text-[var(--text-main)]">1. Datenschutz auf einen Blick</p>
                  <p>
                    Allgemeine Hinweise: Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                  </p>
                  <p className="font-bold text-[var(--text-main)]">2. Datenerfassung auf dieser Website</p>
                  <p>
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen. Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst.
                  </p>
                  <p className="font-bold text-[var(--text-main)]">3. Hosting</p>
                  <p>
                    Wir hosten die Inhalte unserer Website bei folgendem Anbieter: Cloud-Infrastruktur / Container-Hosting. Die Server befinden sich in der Europäischen Union (bzw. Deutschland).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 pt-6 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-[var(--text-muted)]">
        <div className="flex gap-2">
          <span>© {new Date().getFullYear()} Ayo</span>
          <span>•</span>
          <span className="uppercase text-[var(--accent-color)]">Built step-by-step</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setView('legal')} 
            className={`hover:text-[var(--text-main)] uppercase transition-colors ${view === 'legal' ? 'text-[var(--accent-color)] font-bold' : ''}`}
          >
            Impressum & Datenschutz
          </button>
        </div>
      </footer>
    </div>
  );
}
