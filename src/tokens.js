// ─── BRAND TOKENS ───
// Single source of truth for colors. Imported by everything.
export const C = {
  bg: "#0a0a0f",
  bgCard: "rgba(255,255,255,0.03)",
  purple: "#9333ea",
  purpleLight: "#c084fc",
  teal: "#14b8a6",
  tealLight: "#5eead4",
  white: "#f8fafc",
  muted: "#94a3b8",
  glass: "rgba(255,255,255,0.06)",
  gradPurpleTeal: "linear-gradient(135deg, #9333ea 0%, #14b8a6 100%)",
  gradDark: "linear-gradient(180deg, #0a0a0f 0%, #0f0a1a 50%, #0a0f14 100%)",
};

// ─── CONFIG ───
export const DOWNLOAD_URL = "https://downloads.zinara.gg/Zinara.dmg";
export const STUDIO_URL = "https://app.zinara.gg";      // web character creator
export const DEMO_VIDEO_URL = "https://www.youtube.com/embed/REPLACE_WITH_VIDEO_ID";
export const CONTACT_EMAIL = "jonathan.cruz@zinara.gg";

// ─── BUILD INFO ───
export const APP_VERSION = "1.0.0";
export const APP_SIZE_MB = 504;
export const MIN_MACOS = "13 Ventura";

// ─── STAGE FLAGS ───
// Drives the BetaBanner + status copy across the site. Flip to false
// when you're ready to drop the "in development" framing.
export const IS_BETA = true;
export const BETA_MESSAGE = "Zinara is a platform in active development. Built solo, shipping in public.";
