/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Theme } from './types';
import Portfolio from './components/Portfolio';


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
    <h1 className="text-3xl md:text-5xl font-display font-medium tracking-tight leading-tight md:leading-[1.12]">
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
      {/* Luxurious Film Grain Texture Overlay */}
      <div className="grain-overlay pointer-events-none" />

      {/* Immersive Atmospheric Color Glow Backdrop (Breathing-animated dual soft auras) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Glow Element 1 */}
        <div 
          className="absolute -top-[15%] -left-[15%] w-[80%] h-[80%] rounded-full blur-[140px] ambient-breathing-1 transition-all duration-1000 ease-in-out"
          style={{
            opacity: theme === 'motion' ? 0.35 : 0.28
          }}
        />
        {/* Glow Element 2 */}
        <div 
          className="absolute -bottom-[15%] -right-[15%] w-[80%] h-[80%] rounded-full blur-[140px] ambient-breathing-2 transition-all duration-1000 ease-in-out"
          style={{
            opacity: theme === 'motion' ? 0.28 : 0.22
          }}
        />
        {/* Localized Dither Overlay specifically targeting glow bands */}
        <div 
          className="absolute inset-0 opacity-[0.14] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='glowDither'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23glowDither)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Dynamic Dot Pattern overlay */}
      <div className="absolute inset-0 dot-pattern pointer-events-none z-0" />

      {/* Header element featuring only 'ayo', centered toggle, and About & Contact link */}
      <header className="relative z-10 grid grid-cols-1 md:grid-cols-3 items-center gap-4 pb-8">
        {/* Left: Brand logo & Explanatory Tagline */}
        <div 
          onClick={() => setView('work')}
          className="flex flex-col cursor-pointer group select-none"
        >
          <span className="font-logo text-5xl font-bold tracking-wide text-[var(--accent-color)] leading-none transition-transform duration-300 group-hover:scale-105 origin-left">
            ayo
          </span>
          <div className="mt-2.5">
            <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-[var(--accent-color)] font-bold block">
              EXPERIENCES THAT MOVE PEOPLE
            </span>
            <p className="text-[10.5px] text-[var(--text-muted)] mt-1.5 max-w-[260px] leading-relaxed hidden md:block">
              Moving pixels with gentle intention, guiding teams with absolute care.
            </p>
          </div>
        </div>

        {/* Center: High-visibility transparent sliding toggle track */}
        <div className="justify-self-start md:justify-self-center">
          <div 
            onClick={() => {
              setTheme(theme === 'motion' ? 'facilitation' : 'motion');
              if (view !== 'work') setView('work');
            }}
            className={`relative flex items-center bg-transparent border p-1 rounded-full w-56 h-10 cursor-pointer themed-transition select-none transition-all duration-350 ${
              theme === 'motion' ? 'border-white' : 'border-black'
            }`}
          >
            {/* Sliding Custom Accent Thumb (Glassy outline pill) */}
            <div 
              className={`absolute top-0.5 bottom-0.5 rounded-full themed-transition w-[104px] ${
                theme === 'motion' ? 'glass-active-thumb-motion' : 'glass-active-thumb-facilitation'
              }`}
              style={{
                transform: theme === 'motion' ? 'translateX(0px)' : 'translateX(108px)',
              }}
            />

            {/* Label: Motion */}
            <span className={`flex-1 text-center font-sans text-[11px] uppercase tracking-widest z-10 transition-colors duration-350 ${
              theme === 'motion' 
                ? 'text-white font-bold' 
                : 'text-black font-normal'
            }`}>
              MOTION
            </span>

            {/* Label: Facilitation */}
            <span className={`flex-1 text-center font-sans text-[11px] uppercase tracking-widest z-10 transition-colors duration-350 ${
              theme === 'facilitation' 
                ? 'text-black font-bold' 
                : 'text-white/40 font-normal'
            }`}>
              FACILITATE
            </span>
          </div>
        </div>

        {/* Right: Interactive Editorial About Link */}
        <div className="justify-self-start md:justify-self-end mt-2 md:mt-0">
          <button 
            id="about-contact-btn"
            onClick={() => setView(view === 'about' ? 'work' : 'about')}
            className="group relative flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.18em] text-[var(--text-main)] hover:text-[var(--accent-color)] py-2 transition-colors duration-300 bg-transparent border-0 cursor-pointer outline-none select-none"
          >
            {/* Micro-animated Underlined Label */}
            <span className="relative font-bold text-[11.5px] tracking-widest py-1">
              {view === 'about' ? 'CLOSE' : 'ABOUT'}
              <span className={`absolute bottom-0 left-0 h-[1.5px] bg-[var(--accent-color)] transition-all duration-300 ${
                view === 'about' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </span>

            {/* Rotating interactive glyph sign constructed of precise vector lines for perfect pixel-centered alignment with negative transform shift to compensate for line-height */}
            <span className={`relative w-2.5 h-2.5 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 -translate-y-[1.5px] ${
              view === 'about' ? 'rotate-[135deg] text-[var(--accent-color)]' : 'group-hover:rotate-90'
            }`}>
              {/* Horizontal line */}
              <span className="absolute w-full h-[1.25px] bg-current" />
              {/* Vertical line */}
              <span className="absolute h-full w-[1.25px] bg-current" />
            </span>
          </button>
        </div>
      </header>

      {/* Main Container - Ground zero for step-by-step building */}
      <main className="relative z-10 flex-1 flex flex-col justify-center py-12 md:py-20">
        {view === 'work' && (
          <>
            <div className="max-w-2xl w-full grid grid-cols-1 grid-rows-1 relative min-h-[220px]">
              {/* Slide A: Motion Practice */}
              <div 
                className={`col-start-1 row-start-1 space-y-4 transition-opacity duration-300 ease-in-out ${
                  theme === 'motion'
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                <AnimatedLetterHeading 
                  text="Let's choreograph" 
                  italicText="fluid motion." 
                  themeKey={theme} 
                />

                <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed max-w-xl">
                  I design purposeful motion to help values-driven organizations tell clear, impactful stories. By bringing dynamic rhythm to visual identity and strategic alignment to creative teams, I help ideas move forward with focus and intent.
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
                <AnimatedLetterHeading 
                  text="Let's shape" 
                  italicText="regenerative cultures." 
                  themeKey={theme} 
                />

                <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed max-w-xl">
                  Guiding conscious team evolution and systemic alignment. I design space for relational trust, shared leadership, and sustainable collaboration—allowing collective growth and creative clarity to unfold organically.
                </p>
              </div>
            </div>

            <Portfolio theme={theme} />
          </>
        )}

        {view === 'about' && (
          <div className="max-w-4xl space-y-12 animate-fade-in pt-4">
            {/* Core Display Typography */}
            <h1 className="text-4xl md:text-5xl font-display font-medium tracking-tight leading-tight">
              Bridging design in motion with <br />
              <span className="italic text-[var(--accent-color)] font-normal">conscious, human-to-human momentum.</span>
            </h1>
            
            {/* Split Editorial columns layout with layered color blocks */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              
              {/* Left Side: Solid Editorial Card Block (Contrasting background section) */}
              <div className="md:col-span-7 bg-[var(--bg-secondary)] rounded-[var(--border-radius)] p-6 md:p-8 space-y-6 shadow-[var(--offset-shadow)] border border-[var(--border-color)]">
                <p className="text-[var(--text-main)] font-semibold text-base md:text-lg leading-relaxed">
                  Based in Germany, I run a hybrid practice centered on how we move pixels and how we move people. I believe both require a precise sense of rhythm, active listening, and continuous, gentle adjustment.
                </p>
                
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  As a creative problem solver, I step in when communication breaks down between complex design systems and engineering architecture. I act as an interpreter between creative visions and technical teams, translating interactive motion guidelines and organizational protocols into elegant code to resolve the bottlenecks that disconnect ideas from momentum.
                </p>

                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  As a group facilitator, I design quiet structures and leadership circles that help creative studios and forward-thinking networks transition out of friction into alignment, relational trust, and collective resilience. By holding these complementary spaces, I help teams sync their internal energy with their external creative expression.
                </p>
                
                {/* Social & Conversation Connection Row */}
                <div className="pt-6 mt-4 border-t border-[var(--border-color)]/60">
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[var(--text-main)] font-bold mb-3">
                    LET'S CONNECT OR SHARE MOMENTS
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <a 
                      href="mailto:hello@ayo.design" 
                      className="group/mail relative inline-flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-[0.14em] text-[var(--accent-color)] transition-colors hover:text-[var(--accent-hover)]"
                    >
                      hello@ayo.design
                      <span className="inline-block transition-transform duration-300 group-hover/mail:translate-x-1.5">→</span>
                    </a>
                    
                    <span className="text-[var(--text-muted)] opacity-30 hidden sm:block">|</span>
                    
                    <a 
                      href="https://www.linkedin.com/in/ayo-sebastian-dr%C3%A1b-6a007314/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link relative inline-flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-[0.14em] text-[var(--accent-color)] transition-colors hover:text-[var(--accent-hover)]"
                    >
                      LINKEDIN PROFILE
                      <span className="inline-block transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side: Extralinear Interests Card Block (Contrasting ambient background section) */}
              <div className="md:col-span-5 bg-[var(--bg-secondary)]/50 rounded-[var(--border-radius)] p-6 md:p-8 space-y-6 border border-[var(--border-color)]">
                <div className="space-y-1">
                  <p className="text-xs font-sans text-[var(--accent-color)] uppercase tracking-[0.16em] font-bold">
                    Extralinear Practices
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] font-sans uppercase tracking-wider opacity-75">Pursuits outside the client work</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="group/item hover:bg-[var(--bg-primary)] p-3 rounded-xl border border-transparent hover:border-[var(--border-color)] transition-all duration-300">
                    <span className="font-bold text-[var(--text-main)] block uppercase tracking-widest text-[10px] mb-1">
                      Vinyl Selection & DJing
                    </span>
                    <span className="text-[var(--text-muted)] leading-relaxed block text-xs">
                      Deep curation of atmospheric frequencies, continuous slow-tempo ambient grooves, and acoustic room resonance configurations.
                    </span>
                  </div>

                  <div className="group/item hover:bg-[var(--bg-primary)] p-3 rounded-xl border border-transparent hover:border-[var(--border-color)] transition-all duration-300 w-full">
                    <span className="font-bold text-[var(--text-main)] block uppercase tracking-widest text-[10px] mb-1">
                      Culinary Assembly
                    </span>
                    <span className="text-[var(--text-muted)] leading-relaxed block text-xs">
                      Experiments in dynamic heat calibration, wild fermentation, seasonal ingredient balance, and the physics of tactile community kitchens.
                    </span>
                  </div>

                  <div className="group/item hover:bg-[var(--bg-primary)] p-3 rounded-xl border border-transparent hover:border-[var(--border-color)] transition-all duration-300 w-full">
                    <span className="font-bold text-[var(--text-main)] block uppercase tracking-widest text-[10px] mb-1">
                      Performance & Presence
                    </span>
                    <span className="text-[var(--text-muted)] leading-relaxed block text-xs">
                      Studies of physical motion paths, body language weight distribution, dynamic room choreography, and spatial interventions.
                    </span>
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
                  <p className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[10px]">Angaben gemäß § 5 DDG (ehemals § 5 TMG)</p>
                  <p>
                    Ayo Sebastian Dráb<br />
                    [Straße, Hausnummer / Street address]<br />
                    [PLZ, Ort / ZIP code, City]<br />
                    Deutschland / Germany
                  </p>
                  <p>
                    <strong>Kontakt:</strong><br />
                    E-Mail: hello@ayo.design<br />
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
                  <p className="pt-2 border-t border-[var(--border-color)]/20 text-[10px] italic">
                    Hinweis: Als freiberuflicher Designer / Prozess-Facilitator im geschäftsmäßigen Bereich besteht in Deutschland eine gesetzliche Pflicht zur Bereitstellung einer ladungsfähigen Anschrift und direkten Kontaktoptionen.
                  </p>
                </div>
              </div>

              {/* Datenschutz */}
              <div className="space-y-6">
                <h1 className="text-2xl font-display font-medium uppercase tracking-tight text-[var(--text-main)]">Datenschutzerklärung</h1>
                <div className="space-y-4 text-xs font-mono text-[var(--text-muted)] leading-relaxed max-h-[420px] overflow-y-auto pr-4 border-r border-[var(--border-color)] scrollbar-thin">
                  <p className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[10px]">1. Datenschutz auf einen Blick</p>
                  <p>
                    <strong>Allgemeine Hinweise</strong><br />
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                  </p>
                  <p>
                    <strong>Datenerfassung auf dieser Website</strong><br />
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen. Ihre Daten werden zum einen dadurch erhoben, dass Sie per E-Mail Kontakt aufnehmen. Andere technische Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.
                  </p>

                  <p className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[10px] pt-2">2. Allgemeine Hinweise und Pflichtinformationen</p>
                  <p>
                    <strong>Datenschutz</strong><br />
                    Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften (DSGVO, BDSG) sowie dieser Datenschutzerklärung.
                  </p>
                  <p>
                    <strong>Hinweis zur verantwortlichen Stelle</strong><br />
                    Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br />
                    Ayo Sebastian Dráb<br />
                    [Straße, Hausnummer, PLZ, Ort]<br />
                    E-Mail: hello@ayo.design
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

                  <p className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[10px] pt-2">3. Datenerfassung auf dieser Website</p>
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
                    Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter (Rechtsgrundlage Art. 6 Abs. 1 lit. b oder f DSGVO).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[9.5px] font-sans font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
        <div className="flex gap-2">
          <span>© {new Date().getFullYear()} Ayo</span>
          <span>•</span>
          <span className="uppercase text-[var(--text-main)] font-semibold">Motion & Facilitation</span>
        </div>
        
        {/* Footer Contact Detail */}
        <div className="flex items-center">
          <a 
            href="mailto:hello@ayo.design" 
            className="text-[var(--accent-color)] hover:text-[var(--text-main)] font-bold transition-colors underline decoration-dotted underline-offset-2"
          >
            hello@ayo.design
          </a>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setView('legal')} 
            className={`hover:text-[var(--text-main)] uppercase transition-colors cursor-pointer ${view === 'legal' ? 'text-[var(--accent-color)] font-bold' : ''}`}
          >
            Impressum & Datenschutz
          </button>
        </div>
      </footer>
    </div>
  );
}
