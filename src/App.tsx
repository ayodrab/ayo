/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Theme } from './types';
import Portfolio from './components/Portfolio';
import { AnimatePresence, motion } from 'motion/react';


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
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);

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
            {/* Extremely Minimal, Pure Cinematic Loop Edge-to-Edge Screen-Wide Banner / Group Facilitation Banner */}
            <div className="relative z-10 mb-12 md:mb-16 select-none">
              {theme === 'motion' ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setIsTheaterOpen(true)}
                  className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] border-y border-[var(--border-color)]/10 overflow-hidden shadow-2xl bg-black cursor-pointer group h-[140px] sm:h-[210px] md:h-[280px] lg:h-[320px]"
                >
                  <div className="absolute inset-0 w-full h-full">
                    <iframe
                      src="https://player.vimeo.com/video/826868216?background=1&autoplay=1&loop=1&muted=1&playsinline=1&controls=0&autopause=0"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[112%] h-[240%] sm:h-[260%] md:h-[280%] scale-[1.2] sm:scale-[1.3] md:scale-[1.45] lg:scale-[1.55] pointer-events-none"
                      allow="autoplay; fullscreen"
                    />
                    {/* Subtle, soft ambient top/bottom fade blends */}
                    <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[var(--bg-primary)]/40 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--bg-primary)]/40 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0 pointer-events-none" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.99, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] border-y border-[var(--border-color)]/10 overflow-hidden shadow-2xl bg-neutral-900 h-[140px] sm:h-[210px] md:h-[280px] lg:h-[320px] group"
                >
                  <img
                    src="assets/facilitation_project_assets/group_facilitation_banner.jpg"
                    alt="Collective Leadership & Group Facilitation Arena"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500 grayscale-[10%] group-hover:grayscale-0"
                  />
                  {/* Subtle, soft ambient top/bottom face blends and vignettes */}
                  <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[var(--bg-primary)]/30 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--bg-primary)]/30 to-transparent pointer-events-none" />
                </motion.div>
              )}
            </div>

            {/* Elegant Typographic Slides - static content displaying based on active theme */}
            <div className="max-w-5xl w-full mx-auto text-left mb-12 md:mb-16">
              <div className="max-w-2xl w-full grid grid-cols-1 grid-rows-1 relative min-h-[160px] md:min-h-[140px]">
                {/* Slide A: Motion Practice */}
                <div 
                  className={`col-start-1 row-start-1 space-y-4 transition-all duration-500 ease-in-out ${
                    theme === 'motion'
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <AnimatedLetterHeading 
                    text="Let's choreograph" 
                    italicText="fluid motion." 
                    themeKey={`text-${theme}`} 
                  />
                  <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed max-w-xl">
                    I design purposeful motion to help values-driven organizations tell clear, impactful stories. By bringing dynamic rhythm to visual identity and strategic alignment to creative teams, I help ideas move forward with focus and intent.
                  </p>
                </div>

                {/* Slide B: Facilitation Practice */}
                <div 
                  className={`col-start-1 row-start-1 space-y-4 transition-all duration-500 ease-in-out ${
                    theme === 'facilitation'
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <AnimatedLetterHeading 
                    text="Let's shape" 
                    italicText="regenerative cultures." 
                    themeKey={`text-${theme}`} 
                  />
                  <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed max-w-xl">
                    Guiding conscious team evolution and systemic alignment. I design space for relational trust, shared leadership, and sustainable collaboration—allowing collective growth and creative clarity to unfold organically.
                  </p>
                </div>
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
              <span className="italic text-[var(--accent-color)] font-normal">conscious momentum.</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              {/* Left Column: Distilled Narrative */}
              <div className="md:col-span-8 space-y-6">
                <p className="text-[var(--text-main)] font-semibold text-lg md:text-xl leading-relaxed">
                  Based in Germany, I run a hybrid practice centered on how we move pixels and how we move people. I believe both require a precise sense of rhythm, active listening, and continuous, gentle adjustment.
                </p>
                
                <p className="text-base text-[var(--text-muted)] leading-relaxed font-light">
                  When communication breaks down between complex design systems and engineering teams, I step in as an interpreter. I translate interactive motion guidelines and technical protocols into clean, production-ready systems, resolving the bottlenecks that disconnect vision from momentum.
                </p>

                <p className="text-base text-[var(--text-muted)] leading-relaxed font-light">
                  Similarly, within organizations and networks, I design quiet structures and leadership circles that help teams transition out of friction into relational trust and shared alignment. By holding these complementary spaces, I help teams synchronize their internal focus with their external creative expression.
                </p>
              </div>

              {/* Right Column: Coordinates */}
              <div className="md:col-span-4 bg-[var(--bg-secondary)] rounded-[var(--border-radius)] p-6 md:p-8 space-y-4 border border-[var(--border-color)] h-fit shadow-[var(--offset-shadow)]">
                <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--text-main)] font-bold mb-1">
                  Coordinates
                </h3>
                <div className="space-y-3">
                  <a 
                    href="mailto:hello@ayodrab.com" 
                    className="group/mail relative inline-flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-[0.14em] text-[var(--accent-color)] transition-colors hover:text-[var(--accent-hover)] w-full"
                  >
                    hello@ayodrab.com
                    <span className="inline-block transition-transform duration-300 group-hover/mail:translate-x-1">→</span>
                  </a>
                  
                  <a 
                    href="https://www.linkedin.com/in/ayo-sebastian-dr%C3%A1b-6a007314/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link relative inline-flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-[0.14em] text-[var(--accent-color)] transition-colors hover:text-[var(--accent-hover)] w-full"
                  >
                    LinkedIn
                    <span className="inline-block transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">↗</span>
                  </a>
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
            href="mailto:hello@ayodrab.com" 
            className="text-[var(--accent-color)] hover:text-[var(--text-main)] font-bold transition-colors underline decoration-dotted underline-offset-2"
          >
            hello@ayodrab.com
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

      {/* Cinematic Fullscreen Theater Lightbox Overlay */}
      <AnimatePresence>
        {isTheaterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col justify-center p-4 md:p-12 items-center"
          >
            {/* Keyboard dismiss listener hook effect */}
            <KeyboardListener onClose={() => setIsTheaterOpen(false)} />

            {/* Top Close Button (floating elegant control) */}
            <div className="absolute top-6 right-6 z-[100000]">
              <button
                onClick={() => setIsTheaterOpen(false)}
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
              <iframe
                src="https://player.vimeo.com/video/826868216?autoplay=1&quality=1080p"
                className="w-full h-full absolute inset-0 border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                title="Ayo Cinematic Reel"
              />
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
