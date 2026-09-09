export interface FAQItem {
  id: string;
  category: 'strategic' | 'process' | 'scope';
  question: string;
  shortSummary: string;
  answer: string[];
}

export const NGO_FAQS: FAQItem[] = [
  {
    id: 'why-motion-and-facilitation',
    category: 'strategic',
    question: 'Why combine facilitation and motion design for purpose-driven teams?',
    shortSummary: 'Most communication projects stall not in the animation software, but in the boardroom.',
    answer: [
      'In mission-driven initiatives, projects frequently drag on or lose momentum because stakeholders hold conflicting priorities, the topic is weighed down by dense policy language, or team members worry about oversimplifying critical nuances.',
      'By facilitating structured alignment workshops early on, I create clarity and shared ownership around the core narrative before a single frame is designed. Once the committee is genuinely aligned, translating that consensus into high-craft motion design becomes direct, efficient, and impactful.',
      'You get a single partner who can hold the strategic room and deliver the final campaign asset.'
    ]
  },
  {
    id: 'dense-technical-topics',
    category: 'strategic',
    question: 'Our topic is dense, technical, or politically sensitive. Can motion design handle that without dumbing it down?',
    shortSummary: 'Motion design isn’t decorative cartoons—it’s visual translation and systemic clarity.',
    answer: [
      'Whether your focus is climate transition pathways, circular supply chains, decentralized governance, or public health policy, the purpose of motion design is to reveal underlying mechanics rather than decorate a slogan.',
      'I preserve the scientific and institutional integrity of your work while stripping away impenetrable academic jargon. Metaphors, visual pacing, and clear typographic hierarchy ensure that donors, policymakers, and communities immediately understand what is at stake.'
    ]
  },
  {
    id: 'project-process-flow',
    category: 'process',
    question: 'What does an engagement look like from kickoff to final delivery?',
    shortSummary: 'A predictable, transparent 4-stage flow designed to eliminate surprises.',
    answer: [
      '1. Discovery & Narrative Sprint: I align with your team on the primary objective, target audience, and key systemic message through an intake workshop or collaborative briefing.',
      '2. Script & Visual Framework: I draft the voiceover script, develop styleframes, and lock the storyboard so everyone agrees on the visual universe before animation begins.',
      '3. Motion & Sound Architecture: I animate with 2–3 structured, milestone-based review rounds to incorporate feedback without creating endless revision loops.',
      '4. Final Delivery & Multi-Format Assets: I deliver full-resolution master exports, social aspect cuts (16:9, 9:16, 1:1 for LinkedIn, YouTube, Instagram), and burned-in accessible captions.'
    ]
  },
  {
    id: 'timeline-and-deadlines',
    category: 'process',
    question: 'How long does a typical project take, and what if we have an urgent campaign deadline?',
    shortSummary: 'Most end-to-end explainer animations take 3 to 6 weeks; standalone facilitation takes 1 to 2 weeks.',
    answer: [
      'For end-to-end animated explainers, 3 to 6 weeks is the ideal timeframe to allow thoughtful stakeholder reviews across script, storyboard, and motion passes.',
      'If you have an impending COP summit, high-level funder pitch, or international campaign launch, I can run an expedited sprint with locked review windows. Because facilitation happens at the front, we avoid the last-minute rewrites that usually blow project schedules.'
    ]
  },
  {
    id: 'grant-cycles-and-budgets',
    category: 'process',
    question: 'How do you handle procurement, funding cycles, and fixed budgets?',
    shortSummary: 'Transparent, flat-fee scoping tailored to institutional milestones.',
    answer: [
      'I understand the realities of institutional funding: fiscal year cutoffs, grant disbursement tranches, and procurement requirements. Every engagement is scoped with fixed flat pricing and clearly defined deliverables so your board or funding partner knows exactly what to expect.',
      'If your budget is constrained, I right-size the scope (e.g. focusing on a high-impact 60-second animated summary or a modular visual toolkit) rather than cutting corners on strategic clarity.'
    ]
  },
  {
    id: 'standalone-facilitation',
    category: 'scope',
    question: 'Can we hire you purely for facilitation or workshop design, without animation?',
    shortSummary: 'Yes. Strategic alignment and workshop facilitation is a full standalone offering.',
    answer: [
      'Many organizations bring me in specifically for strategy off-sites, coalition alignment, leadership transitions, and theory-of-change mapping.',
      'These sessions give cross-functional teams, multi-stakeholder working groups, and NGO alliances the psychological safety and structured momentum to make real decisions. You receive executive summaries, visual concept maps, and immediate action items.'
    ]
  },
  {
    id: 'getting-started-materials',
    category: 'scope',
    question: 'What do you need from our team to get started?',
    shortSummary: 'Just your raw materials: research white papers, strategy decks, or bullet points.',
    answer: [
      'You do not need a finished creative brief or a polished script before reaching out. Organizations often wait too long because they feel their internal messaging isn’t "ready" for an external partner.',
      'Bring your working documents, donor proposals, raw data, or even a list of bullet points of what isn’t working. Part of my role is distilling that raw material into a sharp, accessible narrative.'
    ]
  },
  {
    id: 'location-and-international',
    category: 'scope',
    question: 'Where are you based, and do you work with international teams?',
    shortSummary: 'Based in Berlin (CET), collaborating with European and global mission-driven partners.',
    answer: [
      'I am based in Berlin, Germany. I work with mission-driven organizations, international NGOs, foundations, and public-interest initiatives across Germany, Europe, and worldwide.',
      'Workshops can be facilitated on-site across Europe or seamlessly remote via interactive digital whiteboards and video sessions. Production communication is async-friendly, clear, and structured.'
    ]
  }
];
