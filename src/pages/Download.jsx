import { C, DOWNLOAD_URL, APP_VERSION, APP_SIZE_MB, MIN_MACOS } from "../tokens";
import { Nebula, FloatingOrbs, ScrollReveal } from "../components/Visuals";

const REQUIREMENTS = [
  {
    label: "macOS",
    value: `${MIN_MACOS} or later`,
    note: "Sonoma, Sequoia, and newer are supported.",
  },
  {
    label: "Processor",
    value: "Apple Silicon",
    note: "M1, M2, M3 chips. Intel Macs work but are slower.",
  },
  {
    label: "Memory",
    value: "8 GB RAM minimum",
    note: "16 GB recommended for smoothest experience.",
  },
  {
    label: "Disk Space",
    value: "1 GB free",
    note: `Zinara.app is about ${APP_SIZE_MB} MB plus character cache.`,
  },
  {
    label: "Camera",
    value: "Built-in or USB webcam",
    note: "Used only for motion tracking. Nothing is sent to the cloud.",
  },
  {
    label: "Internet",
    value: "Required for character generation",
    note: "Motion tracking and playback work fully offline once a character is loaded.",
  },
  {
    label: "Account",
    value: "Free Zinara account",
    note: "Created in-app on first launch. No credit card required.",
  },
];

const INSTALL_STEPS = [
  "Download Zinara.dmg below.",
  "Open the .dmg and drag Zinara into your Applications folder.",
  "Launch Zinara from Applications. macOS will ask for camera permission — say yes.",
  "Create your free account, or sign in if you already have one.",
  "Upload a photo. Generate your first character. Step into mirror mode.",
];

export default function Download() {
  return (
    <main style={{
      paddingTop: "120px", paddingBottom: "80px",
      minHeight: "100vh", position: "relative", overflow: "hidden",
    }}>
      <Nebula color={C.purple} size={700} top="20%" left="80%" opacity={0.08} />
      <Nebula color={C.teal} size={600} top="70%" left="15%" opacity={0.07} />
      <FloatingOrbs count={6} color={C.teal} />

      <div style={{
        maxWidth: "1000px", margin: "0 auto",
        padding: "0 40px", position: "relative", zIndex: 1,
      }}>
        {/* Header + big download CTA */}
        <ScrollReveal>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px", color: C.teal,
            letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
          }}>// DOWNLOAD</div>

          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800, color: C.white,
            margin: "0 0 24px 0", lineHeight: 1.1,
          }}>
            GET ZINARA<br />
            <span style={{
              background: C.gradPurpleTeal,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>FOR MAC.</span>
          </h1>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "15px", color: C.muted,
            maxWidth: "640px", marginBottom: "40px",
            lineHeight: 1.7,
          }}>
            Native macOS app. Signed and notarized by Apple. First character is free —
            generate it from any photo, then step into mirror mode and become it.
          </p>

          <div style={{
            background: C.bgCard,
            border: `1px solid ${C.glass}`,
            borderRadius: "16px",
            padding: "32px",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center", justifyContent: "space-between",
            gap: "24px", flexWrap: "wrap",
            marginBottom: "60px",
          }}>
            <div>
              <div style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "20px", fontWeight: 700, color: C.white,
                letterSpacing: "2px", marginBottom: "6px",
              }}>Zinara {APP_VERSION}</div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "12px", color: C.muted,
              }}>
                macOS · Universal · {APP_SIZE_MB} MB · Signed & Notarized
              </div>
            </div>

            <a href={DOWNLOAD_URL} style={{
              background: C.gradPurpleTeal,
              border: "none", borderRadius: "10px",
              padding: "18px 36px", color: "#fff",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "14px", fontWeight: 700,
              letterSpacing: "3px", cursor: "pointer",
              textTransform: "uppercase",
              boxShadow: `0 0 40px ${C.purple}70`,
              transition: "transform 0.2s, box-shadow 0.2s",
              textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: "12px",
              whiteSpace: "nowrap",
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = `0 0 60px ${C.purple}90`;
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = `0 0 40px ${C.purple}70`;
            }}
            ><span>⬇</span> Download .dmg</a>
          </div>
        </ScrollReveal>

        {/* What you need */}
        <ScrollReveal delay={0.15}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px", color: C.purple,
            letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
          }}>// WHAT YOU NEED</div>

          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800, color: C.white,
            margin: "0 0 32px 0", lineHeight: 1.1,
          }}>
            System Requirements
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
            marginBottom: "60px",
          }}>
            {REQUIREMENTS.map(({ label, value, note }) => (
              <div key={label} style={{
                background: C.bgCard,
                border: `1px solid ${C.glass}`,
                borderRadius: "12px",
                padding: "24px",
                backdropFilter: "blur(6px)",
                transition: "border-color 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.teal; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.glass; }}
              >
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px", color: C.muted,
                  letterSpacing: "3px", textTransform: "uppercase",
                  marginBottom: "8px",
                }}>{label}</div>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "18px", fontWeight: 700,
                  color: C.tealLight,
                  marginBottom: "8px",
                }}>{value}</div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "12px", color: C.muted,
                  lineHeight: 1.6,
                }}>{note}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Installation steps */}
        <ScrollReveal delay={0.25}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px", color: C.teal,
            letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
          }}>// FIRST RUN</div>

          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800, color: C.white,
            margin: "0 0 32px 0", lineHeight: 1.1,
          }}>
            How to Install
          </h2>

          <div style={{
            background: C.bgCard,
            border: `1px solid ${C.glass}`,
            borderRadius: "16px",
            padding: "32px",
            backdropFilter: "blur(8px)",
            marginBottom: "40px",
          }}>
            <ol style={{
              listStyle: "none",
              padding: 0, margin: 0,
              display: "flex", flexDirection: "column", gap: "16px",
            }}>
              {INSTALL_STEPS.map((step, i) => (
                <li key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: "16px",
                }}>
                  <div style={{
                    minWidth: "32px", height: "32px",
                    borderRadius: "50%",
                    background: C.gradPurpleTeal,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "13px", fontWeight: 700, color: "#fff",
                    flexShrink: 0,
                  }}>{i + 1}</div>
                  <div style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "14px", color: C.white,
                    lineHeight: 1.7, paddingTop: "5px",
                  }}>{step}</div>
                </li>
              ))}
            </ol>
          </div>
        </ScrollReveal>

        {/* Trouble strip */}
        <ScrollReveal delay={0.35}>
          <div style={{
            padding: "20px 24px",
            background: C.bgCard,
            border: `1px solid ${C.glass}`,
            borderRadius: "10px",
            textAlign: "center",
          }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px", color: C.muted,
              letterSpacing: "1px",
            }}>
              Trouble? macOS may show a Gatekeeper warning on first launch. Right-click the app and choose "Open" to bypass.
            </span>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
