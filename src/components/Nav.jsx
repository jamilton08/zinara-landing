import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { C, STUDIO_URL } from "../tokens";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Internal route links
  const links = [
    { label: "Platform", to: "/" },
    { label: "Demo",     to: "/demo" },
    { label: "About",    to: "/about" },
    { label: "Download", to: "/download" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "16px 40px",
      background: scrolled ? "rgba(10,10,15,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.glass}` : "none",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      transition: "all 0.3s ease",
    }}>
      <Link to="/" style={{
        display: "flex", alignItems: "center", gap: "10px",
        textDecoration: "none",
      }}>
        <img
          src="/zinara-icon.png"
          alt="Zinara"
          style={{
            width: 36, height: 36, borderRadius: "8px",
            objectFit: "cover",
            display: "block",
            boxShadow: `0 0 14px ${C.purple}30`,
          }}
        />
        <span style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "20px", fontWeight: 700,
          background: C.gradPurpleTeal,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "3px",
        }}>ZINARA</span>
      </Link>

      <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        {links.map(({ label, to }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} style={{
              color: active ? C.tealLight : C.muted,
              textDecoration: "none",
              fontFamily: "'Space Mono', monospace",
              fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase",
              transition: "color 0.2s",
              position: "relative",
            }}
            onMouseOver={e => { if (!active) e.target.style.color = C.tealLight; }}
            onMouseOut={e => { if (!active) e.target.style.color = C.muted; }}
            >
              {label}
            </Link>
          );
        })}

        {/* External Studio link — this is the frictionless web entry point */}
        <a
          href={STUDIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: C.tealLight,
            textDecoration: "none",
            fontFamily: "'Space Mono', monospace",
            fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase",
            display: "inline-flex", alignItems: "center", gap: "4px",
            transition: "color 0.2s",
          }}
          onMouseOver={e => e.currentTarget.style.color = C.white}
          onMouseOut={e => e.currentTarget.style.color = C.tealLight}
        >
          Studio <span style={{ fontSize: "10px" }}>↗</span>
        </a>

        {/* Primary CTA — push to Studio, not download */}
        <a href={STUDIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: C.gradPurpleTeal,
            border: "none", borderRadius: "6px",
            padding: "10px 20px", color: "#fff",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "12px", fontWeight: 700,
            letterSpacing: "2px", cursor: "pointer",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "transform 0.2s",
            boxShadow: `0 0 24px ${C.purple}50`,
          }}
          onMouseOver={e => e.target.style.transform = "scale(1.04)"}
          onMouseOut={e => e.target.style.transform = "scale(1)"}
        >Try Studio</a>
      </div>
    </nav>
  );
}