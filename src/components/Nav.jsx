import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { C, DOWNLOAD_URL, STUDIO_URL, IS_BETA } from "../tokens";
import { BANNER_HEIGHT } from "./BetaBanner";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [bannerOffset, setBannerOffset] = useState(IS_BETA ? BANNER_HEIGHT : 0);
  const { pathname } = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Watch for banner dismissal (it sits in sessionStorage).
  // Poll-light approach: check once per second; cheap and avoids needing
  // a cross-component event bus for a single banner.
  useEffect(() => {
    if (!IS_BETA) return;
    const tick = setInterval(() => {
      try {
        const dismissed = sessionStorage.getItem("zinara_beta_banner_dismissed") === "1";
        setBannerOffset(dismissed ? 0 : BANNER_HEIGHT);
      } catch (_) {}
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const links = [
    { label: "Home",         to: "/" },
    { label: "How It Works", to: "/architecture" },
    { label: "Studio",       to: "/studio" },
    { label: "Demo",         to: "/demo" },
    { label: "About",        to: "/about" },
  ];

  return (
    <nav style={{
      position: "fixed",
      top: `${bannerOffset}px`,
      left: 0, right: 0,
      zIndex: 100,
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
        <div style={{
          width: 36, height: 36, borderRadius: "8px",
          background: C.gradPurpleTeal,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", fontWeight: 900, color: "#fff",
          fontFamily: "'Orbitron', sans-serif",
        }}>Z</div>
        <span style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "20px", fontWeight: 700,
          background: C.gradPurpleTeal,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "3px",
        }}>ZINARA</span>
      </Link>

      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        {links.map(({ label, to }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} style={{
              color: active ? C.tealLight : C.muted,
              textDecoration: "none",
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase",
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

        <a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" style={{
          background: "transparent",
          border: `1px solid ${C.glass}`,
          borderRadius: "6px",
          padding: "9px 16px", color: C.tealLight,
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "11px", fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          textDecoration: "none",
          transition: "all 0.2s",
        }}
        onMouseOver={e => {
          e.target.style.borderColor = C.teal;
          e.target.style.background = `${C.teal}15`;
        }}
        onMouseOut={e => {
          e.target.style.borderColor = C.glass;
          e.target.style.background = "transparent";
        }}
        >Try Studio</a>

        <a href={DOWNLOAD_URL} style={{
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
        >Download Mac</a>
      </div>
    </nav>
  );
}
