"use client";

import { useEffect, useRef } from "react";

export default function ShivaBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("❌ Canvas not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("❌ Canvas context not found");
      return;
    }

    console.log("✅ Canvas initialized", { width: window.innerWidth, height: window.innerHeight });

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let animationId: number;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
    }));

    let frame = 0;
    let trishulLoaded = false;
    let trishulLoadError = false;
    const trishulImg = new Image();
    trishulImg.crossOrigin = "anonymous";
    trishulImg.src = "/trishul.svg";
    trishulImg.onload = () => {
      trishulLoaded = true;
      console.log("✅ Trishul loaded successfully");
    };
    trishulImg.onerror = () => {
      trishulLoadError = true;
      console.error("❌ Trishul failed to load");
    };

    const drawTrishul = (x: number, y: number, glow: number) => {
      ctx.save();

      const haloRadius = 220;
      const halo = ctx.createRadialGradient(x, y, 16, x, y, haloRadius);
      halo.addColorStop(0, `rgba(0,255,255,${0.45 + glow * 0.3})`);
      halo.addColorStop(0.25, `rgba(0,180,255,${0.2 + glow * 0.18})`);
      halo.addColorStop(0.7, `rgba(0,100,255,${0.08 + glow * 0.12})`);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw glow/shadow effect
      ctx.shadowColor = "rgba(0,255,255,0.9)";
      ctx.shadowBlur = 32 + glow * 40;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw trishul SVG image with invert filter
      if (trishulLoaded && !trishulLoadError) {
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.85 + glow * 0.15;
        ctx.filter = "invert(1) brightness(1.2)";
        const size = 220;
        ctx.drawImage(trishulImg, x - size / 2, y - size / 2, size, size);
        ctx.filter = "none";
      }

      ctx.shadowBlur = 0;
      ctx.restore();
    };

    const drawOm = (x: number, y: number, size: number) => {
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "cyan";
      ctx.font = `${size}px serif`;
      ctx.fillText("ॐ", x, y);
      ctx.restore();
    };

    const animate = () => {
      frame++;

      // Clear canvas with proper composite operation
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#02040a";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const glow = 0.28 + Math.sin(frame * 0.08) * 0.08;

      // Draw concentric rings first
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 4; i++) {
        const radius = (frame * 0.8 + i * 120) % 500;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,255,255,${0.12 - i * 0.03})`;
        ctx.lineWidth = 1.5;
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw particles
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.fillStyle = "rgba(0,255,255,0.5)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw trishul with glow (must be after particles to layer correctly)
      drawTrishul(cx, cy, glow);

      // Draw occasional Om symbols
      if (frame % 60 === 0) {
        ctx.globalCompositeOperation = "source-over";
        drawOm(Math.random() * w, Math.random() * h, 22);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
        background: "#000",
      }}
    />
  );
}