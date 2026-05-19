import { Link } from "react-router-dom";
import { C, DOWNLOAD_URL, DEMO_VIDEO_URL } from "../tokens";
import {
  Nebula, FloatingOrbs, ScrollReveal,
} from "../components/Visuals";

export default function Demo() {
  return (
    <main style={{
      paddingTop: "120px", paddingBottom: "80px",
      minHeight: "100vh", position: "relative", overflow: "hidden",
    }}>
      <Nebula color={C.purple} size={700} top="20%" left="80%" opacity={0.08} />
      <Nebula color={C.teal} size={600} top="70%" left="15%" opacity={0.07} />
      <FloatingOrbs count={8} color={C.teal} />

      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "0 40px", position: "relative", zIndex: 1,
      }}>
        <ScrollReveal>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px", color: C.teal,
            letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
          }}>// SEE IT IN ACTION</div>

          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800, color: C.white,
            margin: "0 0 24px 0", lineHeight: 1.1,
          }}>
            FROM SELFIE TO<br />
            <span style={{
              background: C.gradPurpleTeal,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>3D YOU.</span>
          </h1>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "15px", color: C.muted,
            maxWidth: "640px", marginBottom: "48px",
            lineHeight: 1.7,
          }}>
            Upload one photo. Three minutes later, you're controlling a fully-rigged
            3D character with your own body — in real-time, on a Mac, with nothing
            but a webcam. No rigging knowledge. No 3D software. Just the app.
          </p>
        </ScrollReveal>

        {/* Video player */}
        <ScrollReveal delay={0.15}>
          <div style={{
            position: "relative",
            borderRadius: "16px",
            overflow: "hidden",
            border: `1px solid ${C.glass}`,
            boxShadow: `0 30px 80px ${C.purple}25, 0 0 60px ${C.teal}15`,
            background: "#000",
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              paddingBottom: "56.25%",  // 16:9
            }}>
              <iframe
                src={DEMO_VIDEO_URL}
                title="Zinara demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: "100%", height: "100%",
                  border: "none",
                }}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Stat tiles */}
        <ScrollReveal delay={0.25}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginTop: "40px",
          }}>
            {[
              { label: "Generation time",  value: "3 min" },
              { label: "Cost per character", value: "$0.38" },
              { label: "Polygon count",      value: "200k tris" },
              { label: "Skeleton bones",     value: "22 Mixamo" },
            ].map(({ label, value }) => (
              <div key={label} style={{
                padding: "20px 16px",
                background: C.bgCard,
                border: `1px solid ${C.glass}`,
                borderRadius: "10px",
                textAlign: "center",
                backdropFilter: "blur(8px)",
              }}>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "22px", fontWeight: 700, color: C.tealLight,
                }}>{value}</div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px", color: C.muted,
                  letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px",
                }}>{label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA strip */}
        <ScrollReveal delay={0.4}>
          <div style={{
            marginTop: "60px",
            padding: "40px",
            background: C.bgCard,
            border: `1px solid ${C.glass}`,
            borderRadius: "16px",
            backdropFilter: "blur(8px)",
            textAlign: "center",
          }}>
            <h3 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "22px", fontWeight: 700,
              color: C.white, letterSpacing: "2px",
              marginBottom: "12px",
            }}>READY TO TRY IT?</h3>
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "13px", color: C.muted,
              marginBottom: "24px",
            }}>
              Download Zinara for Mac. First character is on us.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href={DOWNLOAD_URL} style={{
                background: C.gradPurpleTeal,
                border: "none", borderRadius: "8px",
                padding: "14px 32px", color: "#fff",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "13px", fontWeight: 700,
                letterSpacing: "2px", cursor: "pointer",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "8px",
                boxShadow: `0 0 30px ${C.purple}50`,
              }}><span>⬇</span> Download Mac</a>
              <Link to="/download" style={{
                background: "transparent",
                border: `1px solid ${C.glass}`, borderRadius: "8px",
                padding: "14px 32px", color: C.white,
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "13px", fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                textDecoration: "none",
              }}>What you need</Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
