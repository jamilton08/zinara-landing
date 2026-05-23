import { useState, useEffect } from "react";
import { C, IS_BETA, BETA_MESSAGE } from "../tokens";

// Slim banner that sits at the very top of every page, above the fixed Nav.
// Dismissible (state persists per-session via sessionStorage). When dismissed,
// it shrinks the layout so Nav slides up flush against the top.
//
// Exports `BANNER_HEIGHT` so other components (Nav, page padding) can
// compensate when the banner is visible.
export const BANNER_HEIGHT = 38;

export default function BetaBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // sessionStorage so users only see it once per browser session.
    // Switch to localStorage if you want the dismissal to persist longer.
    try {
      if (sessionStorage.getItem("zinara_beta_banner_dismissed") === "1") {
        setDismissed(true);
      }
    } catch (_) { /* private mode etc — banner just stays visible */ }
  }, []);

  if (!IS_BETA || dismissed) return null;

  const onDismiss = () => {
    try { sessionStorage.setItem("zinara_beta_banner_dismissed", "1"); } catch (_) {}
    setDismissed(true);
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      height: `${BANNER_HEIGHT}px`,
      // ── Tempered glass effect ──────────────────────────────────────────
      // Three layers stacked for that "Apple Vision OS" depth:
      //   1. Diagonal gradient tint (purple → teal, low alpha)
      //   2. Subtle vertical highlight (lighter at top → darker at bottom)
      //      gives the illusion of curved glass catching light
      //   3. Backdrop saturate + blur — boosts colors behind, then blurs
      //      them. Saturation is the trick that makes it feel like real
      //      glass rather than just frosted plastic.
      background: `
        linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%),
        linear-gradient(135deg, rgba(147, 51, 234, 0.18) 0%, rgba(20, 184, 166, 0.18) 100%)
      `,
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      // Top edge: bright hairline (the "polished edge" of tempered glass)
      // Bottom edge: subtle dark line + soft shadow for depth
      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
      boxShadow: `
        inset 0 1px 0 0 rgba(255, 255, 255, 0.12),
        0 1px 12px 0 rgba(0, 0, 0, 0.25)
      `,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 16px",
      fontFamily: "'Space Mono', monospace",
      fontSize: "11px", letterSpacing: "1.5px",
      color: "#fff",
      textAlign: "center",
      // Subtle text shadow so copy stays readable on any background
      textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
    }}>
      <span style={{ marginRight: "12px", fontSize: "14px" }}>⚡</span>
      <span style={{
        textTransform: "uppercase",
        opacity: 0.95,
        marginRight: "16px",
      }}>{BETA_MESSAGE}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss banner"
        style={{
          background: "rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "4px",
          color: "#fff",
          padding: "3px 8px",
          fontSize: "11px",
          fontFamily: "'Space Mono', monospace",
          cursor: "pointer",
          letterSpacing: "1px",
          transition: "background 0.15s",
        }}
        onMouseOver={e => e.currentTarget.style.background = "rgba(0,0,0,0.25)"}
        onMouseOut={e => e.currentTarget.style.background = "rgba(0,0,0,0.1)"}
      >✕</button>
    </div>
  );
}