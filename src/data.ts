// Portfolio Projects data containing relative asset paths - Revision 2
import { PortfolioProject } from './types';

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'mastercard',
    title: 'Mastercard. A life in numbers.',
    subtitle: 'When humour, animation and statistics prove that life is priceless.',
    description: 'When humour, animation and statistics prove that life is priceless.',
    category: 'motion',
    tags: ['Campaign', 'Social'],
    year: '2024',
    client: 'DigitasLBi & Mastercard',
    role: 'Concept, Animation',
    color: 'from-orange-500/20 via-red-600/10 to-transparent',
    longDescription: "We were approached by DigitasLBi with an exciting brief for Mastercard; make a fun, engaging video for social media with high shareability. Together with the creative team at DigitasLBi we expanded on MasterCard's famous Priceless tagline.",
    outcome: "The video was Mastercard's most popular campaign in 2017 with 2.2 million organic views, 20,000 reactions, and over 2,100 shares on Facebook alone. We designed the motion framework, character designs, and led the end-to-end creative direction of this stylized flat vector animation universe.",
    deliverables: ['Priceless Campaign', 'Motion Theory & Grammar', 'Character Design', 'Campaign Localization'],
    image: 'assets/motion_project_assets/mastercard_01.webp',
    coverVimeo: 'https://vimeo.com/manage/videos/385480402',
    hoverVideo: 'assets/motion_project_assets/mastercard_loop.mp4',
    galleryImages: [
      'assets/motion_project_assets/mastercard_01.webp',
      'assets/motion_project_assets/mastercard_02.webp',
      'assets/motion_project_assets/mastercard_03.webp',
      'assets/motion_project_assets/mastercard_04.webp'
    ],
    blocks: [
      {
        type: 'text',
        title: 'The Challenge',
        text: "We were approached by DigitasLBi with an exciting brief for Mastercard; make a fun, engaging video for social media with high shareability. Together with the creative team at DigitasLBi we expanded on MasterCard's famous Priceless tagline through character-driven storytelling."
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/mastercard_02.webp',
        title: 'Storyboarding & Expression',
        text: 'Developing character model sheets and high-fidelity flat vector cartoon styles.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/mastercard_03.webp',
        title: 'Scene Composition',
        text: 'Vibrant color palettes and custom-styled background layers accentuating character dynamics.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/mastercard_04.webp',
        title: 'Final Animation Style',
        text: 'Crisp 2D vector styling with playful physics and expressive secondary details.'
      },
      {
        type: 'quote',
        text: "Proof that humor, character animation, and meticulously mapped life statistics can turn simple metrics into a truly Priceless experience."
      },
      {
        type: 'text',
        title: 'The Campaign Success',
        text: "The video became Mastercard's most popular visual campaign with 2.2 million organic views, 20,000 reactions, and over 2,100 shares on Facebook alone. We designed the motion framework and led the end-to-end creative direction of the stylized flat vector animation universe."
      }
    ]
  },
  {
    id: 'optiver',
    title: 'Optiver. Making Waves.',
    subtitle: 'Making waves is Optiver’s global onboarding campaign.',
    description: 'An energetic, character-driven global onboarding campaign welcoming the next generation of quantitative talent.',
    category: 'motion',
    tags: ['Onboarding', '2D Animation', 'Character Design'],
    year: '2024',
    client: 'Optiver',
    role: 'Concept, Illustration, Art Direction, Animation',
    color: 'from-blue-500/20 via-sky-600/10 to-transparent',
    longDescription: 'Optiver approached us to design and animate a comprehensive global onboarding campaign for their business. Combining trading system narratives, custom character illustrations, and fluid 2D animations, we helped welcome their next general talent.',
    outcome: 'We designed the character model sheets, storyboarded key trading desk scenes, and led the end-to-end animation production of this stylized corporate universe used for international onboarding.',
    deliverables: ['Creative Direction', 'Character Design', 'Storyboarding', '2D Animation Production'],
    image: 'assets/motion_project_assets/optiver_office_image.webp',
    hoverVideo: 'assets/motion_project_assets/optiver_loop.mp4',
    galleryImages: [
      'assets/motion_project_assets/optiver_office_image.webp',
      'assets/motion_project_assets/optiver_screenshot.webp',
      'assets/motion_project_assets/optiver_screenshot_02.webp',
      'assets/motion_project_assets/optiver_storyboard.webp'
    ],
    blocks: [
      {
        type: 'text',
        title: 'The Challenge',
        text: 'Optiver is a leading technology-driven trading firm requiring a highly creative visual language to welcome international interns and graduates. The brief asked for a character-driven animation style that represents their sophisticated trading networks, high-performance technology systems, and collaborative workplace culture on Amsterdam’s canals.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/optiver_design.webp',
        title: 'Character Design & Directing Style',
        text: 'Custom character model layouts, expressions, clothing choices, and color harmonies designed to communicate high performance and approachable teamwork.'
      },
      {
        type: 'text',
        title: 'The Concept: Making Waves',
        text: 'Applying Kingdom of Something’s unique 2D flat vector perspective, we established the concept of "Making Waves." The storyboard moves fluidly across oceans, office trading floors, and city canals, celebrating both the local charm of Amsterdam and the global reach of their trading system grids.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/optiver_storyboard.webp',
        title: 'Storyboard Explorations',
        text: 'Visualizing dynamic transitions and cinematic timing grids to maintain high engagement throughout the onboarding film.'
      },
      {
        type: 'video',
        video: 'assets/motion_project_assets/optiver_small_loop_02.mp4',
        title: 'Atmospheric Micro-Loops',
        text: 'Cozy and dynamic flat-vector scenic loops characterizing daily life and bicycle flows around the office head-quarters.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/optiver_screenshot.webp',
        title: 'Workspace Scenes & Interfaces',
        text: 'High-contrast trading desk compositions blending cartoon assets with quantitative code screens.'
      },
      {
        type: 'video',
        video: 'assets/motion_project_assets/optiver_small_video_01.mp4',
        title: 'Onboarding Journeys',
        text: 'High-speed character animations depicting relocations, global airport travel gates, and welcoming graduate hubs.'
      },
      {
        type: 'quote',
        text: 'Proof that complex system narratives can be transformed into playful, endearing, and highly memorable animations.'
      },
      {
        type: 'text',
        title: 'Campaign Success',
        text: 'The completed onboarding campaign was deployed across Amsterdam, Sydney, and Chicago offices, earning widespread acclaim for humanizing highly algorithmic systems with warm, creative character expressions.'
      }
    ]
  },
  {
    id: 'adidas-all-blacks',
    title: 'Adidas. All Blacks.',
    subtitle: 'To celebrate the launch of the new jersey, we created a high-energy, character-driven story.',
    description: 'An athletic, character-driven campaign celebrating legacy, team pride, and New Zealand’s legendary All Blacks.',
    category: 'motion',
    tags: ['Campaign', 'Character Design', '2D Animation'],
    year: '2023',
    client: 'Adidas',
    role: 'Concept, Illustration, Art Direction, Animation',
    color: 'from-zinc-900/40 via-zinc-800/20 to-transparent',
    longDescription: 'TBWA\\Amsterdam approached us with an exciting brief for Adidas: to celebrate the launch of the new All Blacks jersey through a dynamic, character-driven animation campaign. Combining rugby’s physical power, the iconic Haka, and a bold, illustrative vector style, we crafted a high-energy film that connects the heritage of the team with the raw energy of its fans.',
    outcome: 'The campaign was rolled out globally across digital, social, and in-store displays, generating massive excitement for the new jersey. We handled the complete creative direction, character design, storyboard layout, and end-to-end animation production.',
    deliverables: ['Creative Direction', 'Character Design', 'Storyboarding', '2D Animation'],
    image: 'assets/motion_project_assets/adidas_01.webp',
    coverVideo: 'assets/motion_project_assets/adidas-all-blacks-1.1-adidas_allblack_video.mp4',
    hoverVideo: 'assets/motion_project_assets/adidas_website_thumbnail.mp4',
    galleryImages: [
      'assets/motion_project_assets/adidas_01.webp',
      'assets/motion_project_assets/adidas_02.webp',
      'assets/motion_project_assets/adidas_03.webp',
      'assets/motion_project_assets/adidas_04.webp'
    ],
    blocks: [
      {
        type: 'text',
        title: 'The Challenge',
        text: 'Adidas and TBWA\\Amsterdam wanted a campaign that was more than just a typical jersey reveal. They needed an animation that would capture the heart of New Zealand rugby—the power, the heritage, and the global impact of the All Blacks. The brief required a visual style that blended traditional Māori motifs with modern high-fashion sportswear illustration, bringing the energy of the Haka to life through graphic, stylized movement.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/adidas_02.webp',
        title: 'Character & Style Development',
        text: 'Creating expressive character illustrations that combine the sheer physical power of rugby athletes with fluid, stylized vector curves and dramatic high-contrast lighting.'
      },
      {
        type: 'text',
        title: 'The Concept: We Are the Team',
        text: 'The animation centers around the unifying thread of the All Blacks jersey—linking players on the pitch directly to fans all over the world. Through seamless transitions, the camera moves from street-level supporters performing the legendary Haka to the players themselves running onto the field, culminating in a stylized explosion of energy representing the soul of New Zealand rugby.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/adidas_03.webp',
        title: 'Visual Composition & Textures',
        text: 'Developing rich textures, dramatic backdrops, and ink-like brush strokes that reflect the grit, determination, and cultural roots of the team.'
      },
      {
        type: 'video',
        video: 'assets/motion_project_assets/adidas-all-blacks-1.1-adidas_allblack_video.mp4',
        title: 'Dynamic Motion Dynamics',
        text: 'The full high-energy launch loop, showcasing rapid frame-by-frame animation, sweeping camera angles, and smooth character transitions.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/adidas_04.webp',
        title: 'The Jersey Reveal',
        text: 'Highlighting the intricate design details of the new Adidas jersey, integrated organically into the high-contrast illustrative style.'
      },
      {
        type: 'quote',
        text: 'A jersey that carries the weight of a nation’s pride, captured through the fluid power of hand-drawn animation.'
      },
      {
        type: 'text',
        title: 'Global Impact',
        text: 'The final campaign was distributed globally across Adidas retail environments and digital platforms, receiving wide praise for its artistic depth, cultural respect, and raw energy. By transforming a product launch into a piece of visual art, we helped Adidas celebrate the legacy of the All Blacks in a truly unforgettable way.'
      }
    ]
  },
  {
    id: 'datscha',
    title: 'Datscha. What’s behind the wall?',
    subtitle: 'Sweden’s leading provider of digitized commercial real estate data launches in the UK.',
    description: 'A witty, character-driven narrative campaign utilizing playful 2D animation to peer through the opaque walls of commercial property registries.',
    category: 'motion',
    tags: ['Campaign', '2D Animation', 'Character Design', 'Storytelling'],
    year: '2023',
    client: 'Datscha UK',
    role: 'Concept, Illustration, Art Direction, Animation',
    color: 'from-emerald-500/20 via-teal-600/10 to-transparent',
    longDescription: 'Datscha, Sweden’s market leader in digitized public register and commercial real estate data, required a bold visual entry into the UK market. Partnering with Kingdom of Something, they launched the "What’s Behind the Wall?" campaign. Historically, British property registers have been locked behind expensive and obscure bureaucratic walls. This animation follows a curious, flat-vector real estate analyst who sets out to peek over and through brick obstacles to discover real-time valuations, tax logs, and ownership lines.',
    outcome: 'Introduced Datscha to the UK commercial property sector with high-shareability and immediate brand warmth. The campaign won multiple industry accolades and set a new proptech benchmark, proving that high-contrast 2D storytelling can humanize complex public record indexing.',
    deliverables: ['Creative Direction', 'Character Art Direction', 'Scene Composition', '2D Frame-by-Frame Animation'],
    image: 'assets/motion_project_assets/datscha_01.webp',
    hoverVideo: 'assets/motion_project_assets/datscha-website-thumbnail-1250x698-compressed.mp4',
    galleryImages: [
      'assets/motion_project_assets/datscha_01.webp',
      'assets/motion_project_assets/datscha_02.webp',
      'assets/motion_project_assets/datscha_03.webp',
      'assets/motion_project_assets/datscha_04.webp',
      'assets/motion_project_assets/datscha_05.webp',
      'assets/motion_project_assets/datscha_06.webp',
      'assets/motion_project_assets/datscha_07.webp',
      'assets/motion_project_assets/datscha_08.webp',
      'assets/motion_project_assets/datscha_09.webp',
      'assets/motion_project_assets/datscha_10.webp'
    ],
    blocks: [
      {
        type: 'text',
        title: 'The Challenge',
        text: 'Datscha is Sweden’s leading digitized real estate platform, but proptech in the UK is traditionally a conservative and opaque market. To stand out during their international launch, they needed more than a standard software screencast. They required a playful, narrative-driven campaign that would explain their data-rich mapping tool while being highly memorable and engaging.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/datscha_02.webp',
        title: 'Storyboarding & Narrative Focus',
        text: 'Designing a curious investor archetype navigating through high physical barriers to find the truth behind property lines.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/datscha_03.webp',
        title: 'Vector Architecture & Cityscape',
        text: 'Creating high-contrast, geometric block cities that double as interactive, structural real estate boundaries.'
      },
      {
        type: 'text',
        title: 'The Art Direction',
        text: 'Applying a highly stylized mid-century modern graphic design vocabulary, we replaced boring data streams with charming animations of unfolding buildings, floating documents, and stylized city grids. It represents property search as an intuitive, enjoyable adventure.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/datscha_04.webp',
        title: 'Visualizing Hidden Layers',
        text: 'Mapping data matrices, zoning codes, and property tax histories onto vibrant interactive graphic systems.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/datscha_05.webp',
        title: 'Character Design & Pacing',
        text: 'Character sheets detailing quirky analysts, brokers, and developers styled in clean flat-vector geometries.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/datscha_06.webp',
        title: 'Seamless Urban Metaphor',
        text: 'The full neighborhood layout depicting active city circles where financial vectors are made visible.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/datscha_07.webp',
        title: 'The Proptech Vision',
        text: 'Transforming dense public files and financial assets into delightful frame-by-frame 2D animation highlights.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/datscha_08.webp',
        title: 'Dynamic Mapping Overlay',
        text: 'How Datscha aggregates coordinates, ownership data, and historical property changes into one beautiful layer.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/datscha_09.webp',
        title: 'Intuitive Analytics',
        text: 'Fun scene composition of property experts successfully navigating the new collaborative system.'
      },
      {
        type: 'image',
        image: 'assets/motion_project_assets/datscha_10.webp',
        title: 'Transparent Networks',
        text: 'Tracking complicated corporate portfolios and holding company patterns with absolute visual clarity.'
      },
      {
        type: 'quote',
        text: 'Lifting the brick screens on commercial property registry with charming 2D vector styling and a dose of humor.'
      },
      {
        type: 'text',
        title: 'Campaign Outcome',
        text: 'The completed animation was a massive success for Datscha’s launch, establishing strong brand awareness in the UK commercial real estate industry. Combining beautiful 2D vector layouts with direct, approachable storytelling proved that tech services don’t need to look clinical to be taken seriously.'
      }
    ]
  }
];
