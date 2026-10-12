"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Kitni der naye rockets chhootein (ms) */
  duration?: number;
  onDone?: () => void;
};

type Rocket = { x: number; y: number; vy: number; targetY: number; hue: number };
type Spark = {
  x: number; y: number; vx: number; vy: number;
  life: number; decay: number; hue: number; size: number;
};

// Gold / cream / blush palette (splash ke colours se match)
const HUES = [43, 48, 38, 52, 20, 340];

export default function WeddingFireworks({ duration = 7000, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reduced-motion walon ke liye skip
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDoneRef.current?.();
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];
    const start = performance.now();
    let lastLaunch = 0;
    let raf = 0;

    const launch = () => {
      rockets.push({
        x: w * (0.15 + Math.random() * 0.7),
        y: h,
        vy: -(h * 0.011 + Math.random() * 3),
        targetY: h * (0.15 + Math.random() * 0.3),
        hue: HUES[Math.floor(Math.random() * HUES.length)],
      });
    };

    const explode = (x: number, y: number, hue: number) => {
      const count = w < 500 ? 55 : 80;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
        const speed = 1.5 + Math.random() * 3.2;
        sparks.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.012 + Math.random() * 0.012,
          hue: hue + (Math.random() * 16 - 8),
          size: 1.2 + Math.random() * 1.4,
        });
      }
    };

    const frame = (now: number) => {
      const elapsed = now - start;

      // Purane frame ko halka sa mitao => trails banenge
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // Naye rockets
      if (elapsed < duration && now - lastLaunch > 650 + Math.random() * 500) {
        launch();
        if (Math.random() > 0.6) launch();
        lastLaunch = now;
      }

      // Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy *= 0.985;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${r.hue} 90% 75%)`;
        ctx.fill();
        if (r.y <= r.targetY || Math.abs(r.vy) < 1.2) {
          explode(r.x, r.y, r.hue);
          rockets.splice(i, 1);
        }
      }

      // Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.vx *= 0.985;
        s.vy = s.vy * 0.985 + 0.035; // gravity
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${s.hue} 95% ${55 + s.life * 20}% / ${s.life})`;
        ctx.fill();
      }

      if (elapsed >= duration && rockets.length === 0 && sparks.length === 0) {
        onDoneRef.current?.();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90]"
    />
  );
}