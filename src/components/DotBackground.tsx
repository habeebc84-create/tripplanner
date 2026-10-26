import { useEffect, useRef } from 'react';

type Dot = {
  bx: number;
  by: number;
  r: number;
  depth: number;
  phase: number;
  speed: number;
  angle: number;
  hue: string;
};

// Warm tones matching the site's orange accent.
const COLORS = ['249,115,22', '245,158,11', '234,88,12', '251,146,60'];

/**
 * Small dots floating over the page background. Dots near the cursor slowly
 * rotate around it, so moving the mouse makes the dots swirl along with it.
 * On touch screens (no cursor) the dots just drift gently on their own.
 * Pointer events pass straight through, and the layer sits below the dock,
 * buttons and detail popups. Respects prefers-reduced-motion: dots are
 * drawn once, statically.
 */
export default function DotBackground({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const darkRef = useRef(dark);
  darkRef.current = dark;
  const cursorRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let swirl = 0;
    let dots: Dot[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const seed = () => {
      const count = Math.max(45, Math.min(110, Math.floor((w * h) / 16000)));
      dots = Array.from({ length: count }, (_, i) => ({
        bx: Math.random() * w,
        by: Math.random() * h,
        r: 1.5 + Math.random() * 1.8,
        depth: 0.15 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.012 + Math.random() * 0.022,
        angle: Math.random() * Math.PI * 2,
        hue: COLORS[i % COLORS.length],
      }));
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw(0);
    };

    const onMove = (x: number, y: number) => {
      cursorRef.current = { x, y, active: true };
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    };
    const onLeave = () => {
      cursorRef.current.active = false;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const c = cursorRef.current;
      // Ease the swirl in/out so dots never snap when the cursor arrives/leaves.
      swirl += ((c.active ? 1 : 0) - swirl) * 0.12;
      const alpha = darkRef.current ? 0.7 : 0.55;
      for (const d of dots) {
        d.angle += d.speed;
        const driftX = Math.sin(t * 0.0002 + d.phase) * 8;
        const driftY = Math.cos(t * 0.00016 + d.phase) * 8;
        let x = d.bx + driftX;
        let y = d.by + driftY;
        if (swirl > 0.01 && c.active) {
          // Gentle parallax with the cursor.
          x += (c.x - w / 2) * 0.02 * d.depth;
          y += (c.y - h / 2) * 0.02 * d.depth;
          // Dots near the cursor rotate around it; the closer, the stronger.
          const dx = x - c.x;
          const dy = y - c.y;
          const dist = Math.hypot(dx, dy);
          const R = 200;
          if (dist < R) {
            const weight = (1 - dist / R) * swirl;
            const rot = d.angle * weight;
            const cos = Math.cos(rot);
            const sin = Math.sin(rot);
            const rx = dx * cos - dy * sin;
            const ry = dx * sin + dy * cos;
            x = c.x + rx;
            y = c.y + ry;
          }
        }
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.hue},${alpha})`;
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    // NOTE: window 'mouseout' must not be used here — it bubbles from every
    // element the cursor crosses, which kept killing the swirl. 'mouseleave'
    // on the root element only fires when the cursor truly leaves the page.
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('touchend', onLeave);
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('touchend', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
