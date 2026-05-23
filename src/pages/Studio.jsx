import { Link } from "react-router-dom";
import { C, STUDIO_URL, DOWNLOAD_URL } from "../tokens";
import { Nebula, FloatingOrbs, ScrollReveal } from "../components/Visuals";

// /studio — explainer page. Web-based character generation lives at
// app.zinara.gg (separate Django + React app). This page sells the flow
// and sends users there. Keeps marketing site focused on marketing.
export default function Studio() {
  return (
    <div style={{ paddingTop: "100px", paddingBottom: "60px", minHeight: "100vh" }}>
      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "60px 40px 40px", position: "relative" }}>
        <Nebula color={C.teal} size={700} top="30%" left="80%" opacity={0.10} />
        <Nebula color={C.purple} size={500} top="70%" left="10%" opacity={0.08} />
        <FloatingOrbs count={6} color={C.purple} />

        <div style={{
          maxWidth: "880px", margin: "0 auto", textAlign: "center",
          position: "relative", zIndex: 1,
        }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px", color: C.teal,
            letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
          }}>▸ ZINARA STUDIO · BETA ◂</div>

          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 900, color: C.white,
            margin: "0 0 24px 0", lineHeight: 1,
          }}>
            TURN A PHOTO INTO<br />
            <span style={{
              background: C.gradPurpleTeal,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>A 3D CHARACTER</span>
          </h1>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "15px", color: C.muted,
            lineHeight: 1.8, maxWidth: "620px", margin: "0 auto 40px",
          }}>
            Upload a photo. Get a fully rigged 3D character in about 3 minutes. Then download the Mac app and step into it — your body becomes the controller.
          </p>

          <a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: "12px",
            background: C.gradPurpleTeal,
            border: "none", borderRadius: "8px",
            padding: "18px 44px", color: "#fff",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "15px", fontWeight: 700,
            letterSpacing: "3px", cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: `0 0 50px ${C.purple}70`,
            transition: "transform 0.2s, box-shadow 0.2s",
            textDecoration: "none",
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = `0 0 70px ${C.purple}90`;
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0 0 50px ${C.purple}70`;
          }}>
            Open Zinara Studio →
          </a>

          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px", color: C.muted,
            marginTop: "12px", letterSpacing: "1px",
          }}>
            app.zinara.gg · FREE ACCOUNT · BROWSER-BASED
          </div>
        </div>
      </section>

      {/* ─── HOW THE FLOW WORKS ─────────────────────────────────────────── */}
      <section style={{ padding: "60px 40px", position: "relative" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px", color: C.purple,
              letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
            }}>// THE FLOW</div>

            <h2 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800, color: C.white,
              margin: "0 0 48px 0", lineHeight: 1.1,
            }}>FROM SELFIE TO <span style={{ color: C.tealLight }}>AVATAR</span></h2>
          </ScrollReveal>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}>
            {[
              { step: "01", title: "SIGN UP", body: "Create a free account at app.zinara.gg. No credit card." },
              { step: "02", title: "UPLOAD", body: "Drop in a photo — selfie, portrait, full-body. PNG / JPG / WEBP." },
              { step: "03", title: "WAIT 3 MIN", body: "We generate a 3D mesh and rig it with a Mixamo-compatible skeleton." },
              { step: "04", title: "DOWNLOAD APP", body: "Install Zinara for Mac. Sign in. Your character is already in your library." },
              { step: "05", title: "STEP INTO IT", body: "Enter Mirror mode. Your webcam tracks your body — the character mirrors you in real-time." },
            ].map(({ step, title, body }, i) => (
              <ScrollReveal key={step} delay={i * 0.1}>
                <div style={{
                  background: C.bgCard,
                  border: `1px solid ${C.glass}`,
                  borderRadius: "14px",
                  padding: "28px 24px",
                  height: "100%",
                  transition: "all 0.3s",
                  position: "relative", overflow: "hidden",
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = C.teal;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = C.glass;
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                  <div style={{
                    position: "absolute", top: "-10px", right: "-4px",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "64px", fontWeight: 900,
                    color: C.glass, lineHeight: 1,
                  }}>{step}</div>
                  <h3 style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "13px", fontWeight: 800,
                    color: C.tealLight, letterSpacing: "3px",
                    marginBottom: "12px", position: "relative", zIndex: 1,
                  }}>{title}</h3>
                  <p style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "12px", color: C.muted,
                    lineHeight: 1.7, position: "relative", zIndex: 1,
                  }}>{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BUILT-IN STUDIO NOTE ───────────────────────────────────────── */}
      <section style={{ padding: "40px 40px 60px", position: "relative" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{
              background: "rgba(20, 184, 166, 0.06)",
              border: `1px solid ${C.teal}30`,
              borderRadius: "16px",
              padding: "32px 36px",
              backdropFilter: "blur(8px)",
              display: "flex", gap: "24px", alignItems: "center",
              flexWrap: "wrap",
            }}>
              <div style={{
                fontSize: "40px",
                filter: `drop-shadow(0 0 14px ${C.teal})`,
              }}>◈</div>
              <div style={{ flex: 1, minWidth: "240px" }}>
                <h3 style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "14px", fontWeight: 800,
                  color: C.tealLight, letterSpacing: "3px",
                  marginBottom: "10px",
                }}>OR — SKIP THE BROWSER</h3>
                <p style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "13px", color: C.muted,
                  lineHeight: 1.7,
                }}>
                  Studio is built directly into the Mac app too. Download Zinara, click "Create Character" inside the app, generate from there. Same backend, same 3-minute pipeline, no browser tab.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── BETA DISCLAIMER ────────────────────────────────────────────── */}
      <section style={{ padding: "40px 40px 80px" }}>
        <div style={{
          maxWidth: "780px", margin: "0 auto",
          background: "rgba(147, 51, 234, 0.05)",
          border: `1px dashed ${C.purple}60`,
          borderRadius: "12px",
          padding: "24px 28px",
        }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px", color: C.purpleLight,
            letterSpacing: "3px", textTransform: "uppercase",
            marginBottom: "10px",
          }}>⚠ HEADS UP — BETA</div>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "13px", color: C.muted,
            lineHeight: 1.8,
          }}>
            Zinara is in active development. Generation can be slow during peak hours. Occasional rigs come out a little weird. We're shipping in public — every week things get better. If something breaks, email us and we'll usually fix it that day.
          </p>
        </div>
      </section>

      {/* ─── BOTTOM CTA ────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 40px 60px", textAlign: "center" }}>
        <Link to="/architecture" style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "12px", color: C.tealLight,
          textDecoration: "none", letterSpacing: "2px", textTransform: "uppercase",
          borderBottom: `1px solid ${C.teal}50`,
          paddingBottom: "2px",
        }}>↳ See the full architecture</Link>
      </section>
    </div>
  );
}
