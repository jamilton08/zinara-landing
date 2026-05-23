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
      background: C.gradPurpleTeal,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 16px",
      fontFamily: "'Space Mono', monospace",
      fontSize: "11px", letterSpacing: "1.5px",
      color: "#fff",
      textAlign: "center",
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
        onMouseOver={e => e.currentTarget.style.background = "rgba(0,0,0,0.35)"}
        onMouseOut={e => e.currentTarget.style.background = "rgba(0,0,0,0.2)"}
      >✕</button>
    </div>
  );
}
