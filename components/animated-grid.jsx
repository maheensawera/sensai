"use client";
import { useEffect, useRef } from "react";

const CELL = 50;

const THEMES = {
  light: {
    beam: [37, 99, 235],   // blue-600
  },
  dark: {
    beam: [96, 165, 250],  // blue-400 — soft dark pe clearly visible
  },
};

function spawnBeam(w, h) {
  const horiz = Math.random() > 0.45;
  const cols = Math.ceil(w / CELL);
  const rows = Math.ceil(h / CELL);
  return {
    horiz,
    lineIdx: horiz
      ? Math.floor(Math.random() * rows)
      : Math.floor(Math.random() * cols),
    progress: 0,
    speed: 0.003 + Math.random() * 0.003,
    opacity: 0,
    maxOp: 0.75 + Math.random() * 0.25,
    phase: "in",
    tailLen: 0.18 + Math.random() * 0.12,
  };
}

export default function AnimatedGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let beams = [];

    const isDark = () =>
      document.documentElement.classList.contains("dark");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // respawn beams on resize so lineIdx stays valid
      beams = Array.from({ length: 6 }, () => {
        const b = spawnBeam(canvas.width, canvas.height);
        b.progress = Math.random() * 0.8;
        b.opacity = b.maxOp;
        b.phase = "run";
        return b;
      });
    }

    function drawGrid(t) {
      const w = canvas.width, h = canvas.height;
      ctx.strokeStyle = t.line;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      for (let x = 0; x <= w; x += CELL) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y <= h; y += CELL) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    }

    function drawBeam(b, t) {
      const w = canvas.width, h = canvas.height;
      const [r, g, bl] = t.beam;
      const a = b.opacity;
      if (a < 0.01) return;

      if (b.horiz) {
        const y = b.lineIdx * CELL;
        const total = w;
        const head = b.progress * total;
        const tail = head - b.tailLen * total;

        const grad = ctx.createLinearGradient(Math.max(tail, 0), 0, head, 0);
        grad.addColorStop(0, `rgba(${r},${g},${bl},0)`);
        grad.addColorStop(0.5, `rgba(${r},${g},${bl},${a * 0.4})`);
        grad.addColorStop(1, `rgba(${r},${g},${bl},${a})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(Math.max(tail, 0), y);
        ctx.lineTo(head, y);
        ctx.stroke();

        // glowing dot at head
        ctx.beginPath();
        ctx.arc(head, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${bl},${a})`;
        ctx.fill();

      } else {
        const x = b.lineIdx * CELL;
        const total = h;
        const head = b.progress * total;
        const tail = head - b.tailLen * total;

        const grad = ctx.createLinearGradient(0, Math.max(tail, 0), 0, head);
        grad.addColorStop(0, `rgba(${r},${g},${bl},0)`);
        grad.addColorStop(0.5, `rgba(${r},${g},${bl},${a * 0.4})`);
        grad.addColorStop(1, `rgba(${r},${g},${bl},${a})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, Math.max(tail, 0));
        ctx.lineTo(x, head);
        ctx.stroke();

        // glowing dot at head
        ctx.beginPath();
        ctx.arc(x, head, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${bl},${a})`;
        ctx.fill();
      }
    }

    function loop() {
      const t = THEMES[isDark() ? "dark" : "light"];
      const w = canvas.width, h = canvas.height;

      // CSS .grid-background already draws grid lines — canvas sirf beams draw karega
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < beams.length; i++) {
        const b = beams[i];
        b.progress += b.speed;

        if (b.phase === "in") {
          b.opacity = Math.min(b.opacity + 0.04, b.maxOp);
          if (b.opacity >= b.maxOp) b.phase = "run";
        }
        if (b.phase === "run" && b.progress > 0.9) b.phase = "out";
        if (b.phase === "out") {
          b.opacity = Math.max(b.opacity - 0.035, 0);
          if (b.opacity <= 0) {
            beams[i] = spawnBeam(w, h);
          }
        }

        drawBeam(b, t);
      }

      raf = requestAnimationFrame(loop);
    }

    resize();
    loop();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
