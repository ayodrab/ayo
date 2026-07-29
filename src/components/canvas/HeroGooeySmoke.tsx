import React, { useEffect, useRef } from 'react';

export default function HeroGooeySmoke() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let h = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const smokeParticles: Particle[] = [];
    const maxSmoke = 60;
    
    let mouseX = w / 2;
    let mouseY = h / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    
    let isUserMouse = false;
    let mouseTimeout: NodeJS.Timeout;

    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        targetMouseX = e.clientX - rect.left;
        targetMouseY = e.clientY - rect.top;
        isUserMouse = true;
        
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
          isUserMouse = false;
        }, 2500); // Increased idle timeout for softer transition back to auto
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (canvas.parentElement) {
        w = canvas.width = canvas.parentElement.clientWidth;
        h = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const smokeColors = [
      'rgba(244, 63, 94, ', // rose-500
      'rgba(217, 119, 6, ', // amber-600
      'rgba(192, 38, 211, ' // fuchsia-600
    ];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      radius: number;
      colorStr: string;

      constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x + (Math.random() - 0.5) * 20;
        this.y = y + (Math.random() - 0.5) * 20;
        this.vx = vx + (Math.random() - 0.5) * 1;
        this.vy = vy + (Math.random() - 0.5) * 1;
        this.maxLife = Math.random() * 150 + 100;
        this.life = this.maxLife;
        this.radius = Math.random() * 80 + 60;
        this.colorStr = smokeColors[Math.floor(Math.random() * smokeColors.length)];
      }

      reset(x: number, y: number, vx: number, vy: number) {
        this.x = x + (Math.random() - 0.5) * 20;
        this.y = y + (Math.random() - 0.5) * 20;
        this.vx = vx + (Math.random() - 0.5) * 1;
        this.vy = vy + (Math.random() - 0.5) * 1;
        this.maxLife = Math.random() * 150 + 100;
        this.life = this.maxLife;
        this.radius = Math.random() * 80 + 60;
        this.colorStr = smokeColors[Math.floor(Math.random() * smokeColors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        this.vx += (Math.random() - 0.5) * 0.2;
        this.vy += (Math.random() - 0.5) * 0.2;
        
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        this.vy -= 0.015; // Slow, soft upward drift
        
        this.life--;
        this.radius += 0.35; // Expands beautifully over time
      }

      draw() {
        if (!ctx) return;
        const opacity = Math.max(0, (this.life / this.maxLife) * 0.08); // Ultra soft opacity
        if (opacity <= 0) return;
        
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.colorStr + opacity + ')');
        gradient.addColorStop(1, this.colorStr + '0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class FluidBlob {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
      phaseX: number;
      phaseY: number;
      
      constructor(bx: number, by: number, r: number, color: string, sx: number, sy: number) {
        this.baseX = bx;
        this.baseY = by;
        this.x = bx;
        this.y = by;
        this.radius = r;
        this.color = color;
        this.speedX = sx;
        this.speedY = sy;
        this.phaseX = Math.random() * Math.PI * 2;
        this.phaseY = Math.random() * Math.PI * 2;
      }

      update(t: number, mx: number, my: number) {
        // Very slow, abstract fluid wandering using Lissajous curves
        const wanderX = Math.sin(t * this.speedX + this.phaseX) * (w * 0.3);
        const wanderY = Math.cos(t * this.speedY + this.phaseY) * (h * 0.3);
        
        // Soft, gentle attraction to mouse
        const dx = mx - (this.baseX + wanderX);
        const dy = my - (this.baseY + wanderY);
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        let pullX = 0;
        let pullY = 0;
        
        if (dist < w * 0.8) {
          const strength = (1 - dist / (w * 0.8)) * 0.12;
          pullX = dx * strength;
          pullY = dy * strength;
        }

        this.x = this.baseX + wanderX + pullX;
        this.y = this.baseY + wanderY + pullY;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        
        const colorStart = this.color;
        const colorEnd = this.color.replace(/[\d.]+\)$/g, '0)');
        
        grad.addColorStop(0, colorStart);
        grad.addColorStop(1, colorEnd);
        
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const blobs = [
      new FluidBlob(w * 0.4, h * 0.4, Math.max(w, h) * 0.55, 'rgba(244, 63, 94, 0.16)', 0.4, 0.5),   // Rose
      new FluidBlob(w * 0.6, h * 0.6, Math.max(w, h) * 0.5, 'rgba(192, 38, 211, 0.14)', 0.3, 0.4),    // Fuchsia
      new FluidBlob(w * 0.3, h * 0.7, Math.max(w, h) * 0.45, 'rgba(217, 119, 6, 0.11)', 0.5, 0.3),    // Amber
      new FluidBlob(w * 0.7, h * 0.3, Math.max(w, h) * 0.5, 'rgba(244, 114, 182, 0.14)', 0.35, 0.45), // Pink
    ];

    let animationFrameId: number;
    const animate = () => {
      ctx!.clearRect(0, 0, w, h);
      
      time += 0.003; // Ultra slow, abstract morphing speed

      if (!isUserMouse) {
        // Auto-animate mouse target for a beautiful, organic idle state
        targetMouseX = w / 2 + Math.sin(time * 0.6) * (w * 0.25);
        targetMouseY = h / 2 + Math.cos(time * 0.4) * (h * 0.25);
      }

      // Smooth mouse interpolation (very low tension for fluid delay)
      mouseX += (targetMouseX - mouseX) * 0.015;
      mouseY += (targetMouseY - mouseY) * 0.015;

      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      if (speed > 0.5) {
        const count = Math.min(Math.floor(speed / 2.5), 3);
        for (let i = 0; i < count; i++) {
          if (smokeParticles.length < maxSmoke) {
            smokeParticles.push(new Particle(mouseX, mouseY, dx * 0.015, dy * 0.015));
          } else {
            const p = smokeParticles.shift();
            if (p) {
              p.reset(mouseX, mouseY, dx * 0.015, dy * 0.015);
              smokeParticles.push(p);
            }
          }
        }
      }

      lastMouseX = mouseX;
      lastMouseY = mouseY;

      // Draw Blobs (Multiply for rich, deep color overlaps)
      ctx!.globalCompositeOperation = 'multiply';
      blobs.forEach(b => {
        b.update(time, mouseX, mouseY);
        b.draw();
      });

      // Draw Smoke (Source-over for lighter, atmospheric top layer)
      ctx!.globalCompositeOperation = 'source-over';
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        p.update();
        p.draw();
        if (p.life <= 0) {
          smokeParticles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" 
      ref={containerRef}
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90 mix-blend-multiply" />
      
      {/* Noise overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
