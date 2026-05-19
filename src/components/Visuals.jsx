import { useState, useEffect, useRef, useMemo } from "react";
import { C } from "../tokens";

// ─── GRID BACKGROUND ───
export function GridBg() {
  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden", opacity: 0.08, pointerEvents: "none",
    }}>
      <div style={{
        width: "200%", height: "200%",
        backgroundImage: `
          linear-gradient(${C.purple}40 1px, transparent 1px),
          linear-gradient(90deg, ${C.purple}40 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        transform: "perspective(500px) rotateX(60deg) translateY(-50%)",
        transformOrigin: "center center",
        animation: "gridMove 8s linear infinite",
      }} />
      <style>{`
        @keyframes gridMove {
          0% { transform: perspective(500px) rotateX(60deg) translateY(-50%); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(-42%); }
        }
      `}</style>
    </div>
  );
}

// ─── GLITCH TEXT ───
export function GlitchText({ children, style }) {
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      <span style={{
        position: "absolute", top: 0, left: "2px", color: C.teal,
        opacity: 0.7, clipPath: "inset(0 0 50% 0)",
        animation: "glitch1 3s infinite",
      }}>{children}</span>
      <span style={{
        position: "absolute", top: 0, left: "-2px", color: C.purple,
        opacity: 0.7, clipPath: "inset(50% 0 0 0)",
        animation: "glitch2 3s infinite",
      }}>{children}</span>
      <style>{`
        @keyframes glitch1 {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(3px, -1px); }
          94% { transform: translate(-3px, 1px); }
        }
        @keyframes glitch2 {
          0%, 88%, 100% { transform: translate(0); }
          90% { transform: translate(-2px, 2px); }
          93% { transform: translate(2px, -1px); }
        }
      `}</style>
    </span>
  );
}

// ─── SCROLL REVEAL ───
export function ScrollReveal({ children, delay = 0, direction = "up", style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const offsets = {
    up: "translateY(60px)", down: "translateY(-60px)",
    left: "translateX(-60px)", right: "translateX(60px)",
  };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translate(0)" : offsets[direction],
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── PERSISTENT STAR CANVAS ───
export function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const stars = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
      if (stars.length === 0) {
        for (let i = 0; i < 300; i++) {
          stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.3,
            speed: Math.random() * 0.3 + 0.05,
            brightness: Math.random(),
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };
    resize();

    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;

      for (const s of stars) {
        const twinkle = 0.4 + 0.6 * Math.sin(t * s.speed * 2 + s.phase);
        const isTeal = s.brightness > 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = isTeal
          ? `rgba(20,184,166,${twinkle * 0.8})`
          : `rgba(147,51,234,${twinkle * 0.5})`;
        ctx.fill();

        if (s.size > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
          g.addColorStop(0, isTeal ? `rgba(20,184,166,${twinkle * 0.15})` : `rgba(147,51,234,${twinkle * 0.12})`);
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.fill();
        }
      }
    };
    draw();

    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}

// ─── NEBULA GLOW ───
export function Nebula({ color = C.purple, size = 500, top = "50%", left = "50%", opacity = 0.12 }) {
  return (
    <div style={{
      position: "absolute", top, left,
      transform: "translate(-50%, -50%)",
      width: `${size}px`, height: `${size}px`,
      background: `radial-gradient(circle, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
      pointerEvents: "none", zIndex: 0,
      animation: "nebulaPulse 6s ease-in-out infinite alternate",
    }} />
  );
}

// ─── FLOATING ORBS ───
export function FloatingOrbs({ count = 5, color = C.teal }) {
  const orbs = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 4 + Math.random() * 8,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * -10,
    })), [count]);

  return (
    <>
      {orbs.map(o => (
        <div key={o.id} style={{
          position: "absolute",
          left: `${o.x}%`, top: `${o.y}%`,
          width: `${o.size}px`, height: `${o.size}px`,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 ${o.size * 2}px ${color}, 0 0 ${o.size * 4}px ${color}40`,
          animation: `floatOrb ${o.duration}s ease-in-out ${o.delay}s infinite alternate`,
          pointerEvents: "none", zIndex: 0, opacity: 0.6,
        }} />
      ))}
    </>
  );
}

// ─── SECTION DIVIDER ───
export function SectionDivider({ color = C.purple }) {
  return (
    <div style={{
      position: "relative", height: "2px", overflow: "visible",
      background: `linear-gradient(90deg, transparent 0%, ${color}60 50%, transparent 100%)`,
    }}>
      <div style={{
        position: "absolute", top: "-20px", left: 0, right: 0, height: "40px",
        background: `linear-gradient(180deg, transparent, ${color}08, transparent)`,
        pointerEvents: "none",
      }} />
    </div>
  );
}
