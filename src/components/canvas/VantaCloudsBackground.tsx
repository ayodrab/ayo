import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

interface VantaCloudsBackgroundProps {
  selector?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function VantaCloudsBackground({
  selector = '#main-hero-vanta',
  className = '',
  style = {},
}: VantaCloudsBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const initVanta = () => {
      if (!isMounted) return;
      const targetEl = containerRef.current || (selector ? document.querySelector(selector) : null);
      if (!targetEl) return;

      if (window.VANTA && window.VANTA.CLOUDS) {
        if (vantaEffectRef.current) {
          try {
            vantaEffectRef.current.destroy();
          } catch (e) {
            // ignore
          }
        }

        try {
          vantaEffectRef.current = window.VANTA.CLOUDS({
            el: targetEl,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            backgroundColor: 0xd2d2d2,
            skyColor: 0xf5c1d8,
            cloudColor: 0xbac6de,
            cloudShadowColor: 0xcd81a6,
            sunColor: 0xe51ff2,
            sunGlareColor: 0xb8f5,
            sunlightColor: 0xff306c,
            speed: 1.00,
          });
        } catch (err) {
          console.error('Failed to initialize VANTA.CLOUDS:', err);
        }
      }
    };

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });
    };

    const ensureDependenciesAndInit = async () => {
      try {
        if (!window.THREE) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        }
        if (!window.VANTA || !window.VANTA.CLOUDS) {
          await loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.clouds.min.js');
        }
        initVanta();
      } catch (err) {
        console.error('Error loading Vanta script dependencies:', err);
      }
    };

    ensureDependenciesAndInit();

    return () => {
      isMounted = false;
      if (vantaEffectRef.current) {
        try {
          vantaEffectRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [selector]);

  return (
    <div
      ref={containerRef}
      id={selector.replace('#', '')}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden ${className}`}
      style={style}
    />
  );
}
