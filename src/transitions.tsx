import React, { createContext, useContext } from 'react';
import { motion, type Variants, type HTMLMotionProps } from 'motion/react';

export type TransitionVariationKey = 
  | 'frame-snap'
  | 'smooth-cascade'
  | 'soft-blur'
  | 'kinetic-spring'
  | 'parallax-shift';

export interface TransitionVariation {
  id: TransitionVariationKey;
  name: string;
  badge: string;
  description: string;
  page: Variants;
  item: Variants;
}

export const TRANSITION_VARIATIONS: Record<TransitionVariationKey, TransitionVariation> = {
  'frame-snap': {
    id: 'frame-snap',
    name: '1-Frame Snap',
    badge: '40ms Offset',
    description: 'Crisp editorial cadence where blocks lock into place frame-by-frame',
    page: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { staggerChildren: 0.045, delayChildren: 0.03 }
      },
      exit: {
        opacity: 0,
        y: -40,
        transition: { duration: 0.28, ease: [0.76, 0, 0.24, 1] }
      }
    },
    item: {
      initial: { opacity: 0, y: 50 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      },
      exit: {
        opacity: 0,
        y: -25,
        transition: { duration: 0.25 }
      }
    }
  },
  'smooth-cascade': {
    id: 'smooth-cascade',
    name: 'Smooth Cascade',
    badge: '80ms Float',
    description: 'Silky deceleration with generous vertical travel and continuous flow',
    page: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.05 }
      },
      exit: {
        opacity: 0,
        y: -30,
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
      }
    },
    item: {
      initial: { opacity: 0, y: 65 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
      },
      exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 }
      }
    }
  },
  'soft-blur': {
    id: 'soft-blur',
    name: 'Atmospheric Blur',
    badge: 'Lens Rack',
    description: 'Cinematic rack focus from soft micro-blur to crisp focus rising up',
    page: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.04 }
      },
      exit: {
        opacity: 0,
        filter: 'blur(8px)',
        y: -30,
        transition: { duration: 0.3 }
      }
    },
    item: {
      initial: { opacity: 0, y: 55, filter: 'blur(10px)' },
      animate: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.75, ease: [0.25, 1, 0.5, 1] }
      },
      exit: {
        opacity: 0,
        filter: 'blur(6px)',
        y: -20,
        transition: { duration: 0.25 }
      }
    }
  },
  'kinetic-spring': {
    id: 'kinetic-spring',
    name: 'Kinetic Spring',
    badge: 'Micro Rebound',
    description: 'Energetic physical rise with tactile typographic recoil and weight',
    page: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.03 }
      },
      exit: {
        opacity: 0,
        y: -35,
        transition: { duration: 0.25 }
      }
    },
    item: {
      initial: { opacity: 0, y: 60 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 320, damping: 24, mass: 0.8 }
      },
      exit: {
        opacity: 0,
        y: -25,
        transition: { duration: 0.25 }
      }
    }
  },
  'parallax-shift': {
    id: 'parallax-shift',
    name: 'Parallax Shift',
    badge: '110ms Deep Lift',
    description: 'Long travel ascending with pronounced stagger between sections',
    page: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { staggerChildren: 0.11, delayChildren: 0.08 }
      },
      exit: {
        opacity: 0,
        y: -60,
        transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
      }
    },
    item: {
      initial: { opacity: 0, y: 90 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
      },
      exit: {
        opacity: 0,
        y: -30,
        transition: { duration: 0.35 }
      }
    }
  }
};

export const TransitionContext = createContext<TransitionVariationKey>('smooth-cascade');

export function StaggerItem({
  children,
  className = '',
  as = 'div',
  id,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer';
  id?: string;
} & HTMLMotionProps<'div'>) {
  const currentKey = useContext(TransitionContext);
  const variation = TRANSITION_VARIATIONS[currentKey] || TRANSITION_VARIATIONS['smooth-cascade'];

  const MotionTag = as === 'section' 
    ? motion.section 
    : as === 'header' 
      ? motion.header 
      : as === 'footer' 
        ? motion.footer 
        : motion.div;

  return (
    <MotionTag
      id={id}
      variants={variation.item}
      className={className}
      {...(props as any)}
    >
      {children}
    </MotionTag>
  );
}
