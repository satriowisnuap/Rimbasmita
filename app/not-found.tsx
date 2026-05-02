"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawScene();
    };

    // Firefly particles
    const fireflies: {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      dAlpha: number;
      phase: number;
    }[] = Array.from({ length: 38 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.75,
      r: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.22,
      alpha: Math.random(),
      dAlpha: (Math.random() * 0.012 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
      phase: Math.random() * Math.PI * 2,
    }));

    function drawScene() {
      if (!ctx || !canvas) return;
      const W = canvas.width;
      const H = canvas.height;

      // Sky gradient — deep forest night
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#03160a");
      sky.addColorStop(0.45, "#061f0e");
      sky.addColorStop(0.75, "#0a2e14");
      sky.addColorStop(1, "#112e12");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Stars
      ctx.save();
      for (let i = 0; i < 160; i++) {
        const sx = ((i * 137.508) % 1) * W;
        const sy = ((i * 97.33) % 0.55) * H;
        const sr = Math.random() * 0.8 + 0.2;
        ctx.globalAlpha = Math.random() * 0.5 + 0.15;
        ctx.fillStyle = "#d4f5e0";
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Mist layer
      const mist = ctx.createLinearGradient(0, H * 0.55, 0, H * 0.72);
      mist.addColorStop(0, "rgba(180,230,195,0)");
      mist.addColorStop(0.5, "rgba(180,230,195,0.07)");
      mist.addColorStop(1, "rgba(180,230,195,0)");
      ctx.fillStyle = mist;
      ctx.fillRect(0, H * 0.55, W, H * 0.17);

      // Mountain layers
      const mountains = [
        { y: 0.62, h: 0.25, color: "#0c2210", peaks: 3 },
        { y: 0.68, h: 0.2, color: "#112917", peaks: 4 },
        { y: 0.74, h: 0.16, color: "#163319", peaks: 5 },
      ];

      mountains.forEach(({ y, h, color, peaks }) => {
        ctx.beginPath();
        ctx.moveTo(0, H);
        const baseY = H * y;
        const mH = H * h;
        const segW = W / peaks;
        ctx.lineTo(0, baseY + mH * 0.3);
        for (let p = 0; p < peaks; p++) {
          const px = segW * p + segW * 0.5;
          const variation = Math.sin(p * 2.4 + y * 10) * 0.15 + 0.85;
          ctx.quadraticCurveTo(
            px - segW * 0.25,
            baseY + mH * 0.5,
            px,
            baseY - mH * variation,
          );
          ctx.quadraticCurveTo(
            px + segW * 0.25,
            baseY + mH * 0.4,
            segW * (p + 1),
            baseY + mH * 0.2,
          );
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      });

      // Ground / forest floor
      const ground = ctx.createLinearGradient(0, H * 0.82, 0, H);
      ground.addColorStop(0, "#0e2410");
      ground.addColorStop(1, "#060f07");
      ctx.fillStyle = ground;
      ctx.fillRect(0, H * 0.82, W, H);

      // Dense treeline silhouette
      function drawTree(
        x: number,
        baseY: number,
        height: number,
        spread: number,
      ) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.lineTo(x - spread * 0.15, baseY - height * 0.35);
        ctx.lineTo(x - spread * 0.45, baseY - height * 0.3);
        ctx.lineTo(x - spread * 0.28, baseY - height * 0.55);
        ctx.lineTo(x - spread * 0.55, baseY - height * 0.52);
        ctx.lineTo(x - spread * 0.18, baseY - height * 0.75);
        ctx.lineTo(x - spread * 0.38, baseY - height * 0.72);
        ctx.lineTo(x, baseY - height);
        ctx.lineTo(x + spread * 0.38, baseY - height * 0.72);
        ctx.lineTo(x + spread * 0.18, baseY - height * 0.75);
        ctx.lineTo(x + spread * 0.55, baseY - height * 0.52);
        ctx.lineTo(x + spread * 0.28, baseY - height * 0.55);
        ctx.lineTo(x + spread * 0.45, baseY - height * 0.3);
        ctx.lineTo(x + spread * 0.15, baseY - height * 0.35);
        ctx.closePath();
        ctx.fillStyle = "#071409";
        ctx.fill();
      }

      const treeBaseY = H * 0.86;
      const treeCount = Math.floor(W / 38);
      for (let i = 0; i < treeCount; i++) {
        const tx = (i / treeCount) * W + (((i * 73.1) % 1) * 30 - 15);
        const th = (((i * 53.7) % 1) * 0.12 + 0.09) * H;
        const ts = th * 0.55;
        drawTree(tx, treeBaseY, th, ts);
      }
    }

    let raf: number;
    function animate(t: number) {
      if (!ctx || !canvas) return;
      drawScene();
      // Fireflies
      fireflies.forEach((f) => {
        f.alpha += f.dAlpha;
        if (f.alpha > 1 || f.alpha < 0) f.dAlpha *= -1;
        f.x += f.vx + Math.sin(t * 0.0005 + f.phase) * 0.3;
        f.y += f.vy + Math.cos(t * 0.0004 + f.phase) * 0.2;
        if (f.x < 0) f.x = canvas.width;
        if (f.x > canvas.width) f.x = 0;
        if (f.y < 0) f.y = canvas.height * 0.75;
        if (f.y > canvas.height * 0.8) f.y = 10;

        const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6);
        grd.addColorStop(0, `rgba(152,255,180,${f.alpha * 0.9})`);
        grd.addColorStop(0.4, `rgba(80,200,120,${f.alpha * 0.3})`);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(220,255,230,${f.alpha})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [mounted]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#03160a] font-sans">
      {/* Animated forest canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Batik-inspired SVG overlay texture */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="batik"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="30"
              cy="30"
              r="12"
              fill="none"
              stroke="#7fff9a"
              strokeWidth="0.8"
            />
            <circle
              cx="30"
              cy="30"
              r="6"
              fill="none"
              stroke="#7fff9a"
              strokeWidth="0.5"
            />
            <circle cx="30" cy="30" r="2" fill="#7fff9a" />
            <line
              x1="30"
              y1="18"
              x2="30"
              y2="0"
              stroke="#7fff9a"
              strokeWidth="0.4"
            />
            <line
              x1="30"
              y1="42"
              x2="30"
              y2="60"
              stroke="#7fff9a"
              strokeWidth="0.4"
            />
            <line
              x1="18"
              y1="30"
              x2="0"
              y2="30"
              stroke="#7fff9a"
              strokeWidth="0.4"
            />
            <line
              x1="42"
              y1="30"
              x2="60"
              y2="30"
              stroke="#7fff9a"
              strokeWidth="0.4"
            />
            <line
              x1="21.5"
              y1="21.5"
              x2="8"
              y2="8"
              stroke="#7fff9a"
              strokeWidth="0.3"
            />
            <line
              x1="38.5"
              y1="38.5"
              x2="52"
              y2="52"
              stroke="#7fff9a"
              strokeWidth="0.3"
            />
            <line
              x1="38.5"
              y1="21.5"
              x2="52"
              y2="8"
              stroke="#7fff9a"
              strokeWidth="0.3"
            />
            <line
              x1="21.5"
              y1="38.5"
              x2="8"
              y2="52"
              stroke="#7fff9a"
              strokeWidth="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#batik)" />
      </svg>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(3,22,10,0.65) 100%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center select-none">
        {/* Decorative leaf SVG above 404 */}
        <div
          className="mb-6 opacity-0 animate-[fadeSlideDown_0.9s_ease_0.1s_forwards]"
          style={{ animationFillMode: "forwards" }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M32 4 C18 4 6 18 6 32 C6 46 18 56 32 60 C46 56 58 46 58 32 C58 18 46 4 32 4Z"
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
            <path
              d="M32 10 C22 14 14 22 14 34 C14 44 22 52 32 56 C42 52 50 44 50 34 C50 22 42 14 32 10Z"
              fill="rgba(74,222,128,0.10)"
              stroke="#4ade80"
              strokeWidth="0.8"
            />
            <path
              d="M32 56 L32 10"
              stroke="#4ade80"
              strokeWidth="0.7"
              strokeDasharray="3 3"
            />
            <path
              d="M32 28 C28 24 22 22 18 24"
              stroke="#4ade80"
              strokeWidth="0.6"
              fill="none"
            />
            <path
              d="M32 36 C36 32 42 30 46 32"
              stroke="#4ade80"
              strokeWidth="0.6"
              fill="none"
            />
          </svg>
        </div>

        {/* 404 number */}
        <div
          className="relative opacity-0"
          style={{
            animation: "fadeSlideDown 1s ease 0.25s forwards",
          }}
        >
          <span
            className="block font-black tracking-tighter leading-none text-transparent bg-clip-text select-none"
            style={{
              fontSize: "clamp(7rem, 22vw, 16rem)",
              fontFamily: "'Playfair Display', Georgia, serif",
              backgroundImage:
                "linear-gradient(160deg, #f0fff4 0%, #86efac 35%, #4ade80 60%, #166534 100%)",
              filter: "drop-shadow(0 0 60px rgba(74,222,128,0.15))",
            }}
          >
            404
          </span>
          {/* Subtle glow behind number */}
          <span
            className="absolute inset-0 -z-10 block font-black tracking-tighter leading-none text-transparent select-none blur-3xl opacity-20"
            style={{
              fontSize: "clamp(7rem, 22vw, 16rem)",
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#4ade80",
              WebkitTextFillColor: "#4ade80",
            }}
            aria-hidden="true"
          >
            404
          </span>
        </div>

        {/* Divider */}
        <div
          className="flex items-center gap-3 my-5 opacity-0"
          style={{ animation: "fadeSlideDown 0.9s ease 0.45s forwards" }}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-green-500/60" />
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 1 C5 3 2 6 2 9.5 C2 13 5 16 9 17 C13 16 16 13 16 9.5 C16 6 13 3 9 1Z"
              fill="rgba(74,222,128,0.15)"
              stroke="#4ade80"
              strokeWidth="0.9"
            />
            <line
              x1="9"
              y1="1"
              x2="9"
              y2="17"
              stroke="#4ade80"
              strokeWidth="0.7"
              strokeDasharray="2 2"
            />
          </svg>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-green-500/60" />
        </div>

        {/* Headline */}
        <h1
          className="text-white font-semibold opacity-0 leading-snug"
          style={{
            fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
            fontFamily: "'Playfair Display', Georgia, serif",
            letterSpacing: "0.01em",
            animation: "fadeSlideDown 0.9s ease 0.55s forwards",
          }}
        >
          Sepertinya Kamu Hilang Arah
        </h1>

        {/* Sub text */}
        <p
          className="mt-3 text-white/60 max-w-sm leading-relaxed opacity-0"
          style={{
            fontSize: "clamp(0.8rem, 1.8vw, 0.95rem)",
            fontFamily: "'DM Sans', sans-serif",
            animation: "fadeSlideDown 0.9s ease 0.7s forwards",
          }}
        >
          Halaman yang kamu cari telah tersesat di antara rimba raya Nusantara.
          Kembali ke jalur utama dan lanjutkan petualanganmu.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 mt-10 opacity-0"
          style={{ animation: "fadeSlideDown 0.9s ease 0.9s forwards" }}
        >
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm overflow-hidden transition-all duration-300"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              color: "#f0fff4",
              boxShadow:
                "0 0 24px rgba(74,222,128,0.2), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="M6 3L1 8L6 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="1"
                y1="8"
                x2="15"
                y2="8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Kembali ke Beranda
          </Link>

          <Link
            href="/jelajah"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all duration-300 border"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              borderColor: "rgba(74,222,128,0.3)",
              color: "#86efac",
              background: "rgba(74,222,128,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(74,222,128,0.12)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(74,222,128,0.55)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(74,222,128,0.06)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(74,222,128,0.3)";
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="8"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M8 5v3l2 2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            Mulai Jelajah
          </Link>
        </div>

        {/* Footer brand */}
        <div
          className="absolute bottom-6 flex items-center gap-2 opacity-0"
          style={{ animation: "fadeSlideDown 0.9s ease 1.1s forwards" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7 1 L13 4.5 L13 9.5 L7 13 L1 9.5 L1 4.5 Z"
              fill="rgba(74,222,128,0.12)"
              stroke="#4ade80"
              strokeWidth="0.8"
            />
            <path
              d="M7 1 L7 13"
              stroke="#4ade80"
              strokeWidth="0.5"
              strokeDasharray="2 1.5"
            />
          </svg>
          <span
            className="text-green-200/30 tracking-widest uppercase"
            style={{
              fontSize: "0.6rem",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.2em",
            }}
          >
            Rimbasmita · Pecinta Alam Nusantara
          </span>
        </div>
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
