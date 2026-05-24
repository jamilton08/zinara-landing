import { C, CONTACT_EMAIL } from "../tokens";
import { Nebula, FloatingOrbs, ScrollReveal } from "../components/Visuals";

export default function About() {
  return (
    <main style={{
      paddingTop: "120px", paddingBottom: "80px",
      minHeight: "100vh", position: "relative", overflow: "hidden",
    }}>
      <Nebula color={C.teal} size={650} top="30%" left="80%" opacity={0.07} />
      <Nebula color={C.purple} size={500} top="70%" left="15%" opacity={0.08} />
      <FloatingOrbs count={6} color={C.purple} />

      <div style={{
        maxWidth: "880px", margin: "0 auto",
        padding: "0 40px", position: "relative", zIndex: 1,
      }}>
        <ScrollReveal>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px", color: C.purple,
            letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
          }}>// WHO BUILT THIS</div>

          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800, color: C.white,
            margin: "0 0 40px 0", lineHeight: 1.1,
          }}>
            ONE BUILDER.<br />
            <span style={{ color: C.tealLight }}>BRONX, NY.</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div style={{
            background: C.bgCard,
            border: `1px solid ${C.glass}`,
            borderRadius: "16px",
            padding: "48px 40px",
            backdropFilter: "blur(8px)",
            position: "relative",
            overflow: "hidden",
            marginBottom: "32px",
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "15px", color: C.white,
              lineHeight: 1.85, letterSpacing: "0.2px",
            }}>
              <p style={{ marginBottom: "20px" }}>
                Hi, I'm <span style={{ color: C.tealLight, fontWeight: 700 }}>Jonathan Cruz</span>.
                I'm a data scientist with an MS in Data Science, previously a software
                developer in industry. Today I teach computer science at a public high
                school in the Bronx — and on nights and weekends, between grading exams
                and helping my students write their first lines of code, I built Zinara.
              </p>

              <p style={{ marginBottom: "20px" }}>
                It started with one question: what if your body was the controller?
                Not VR. Not a Kinect. Just a webcam, a motion foundation model, and a
                3D character that moves the way you do.
              </p>

              <p style={{ marginBottom: "20px" }}>
                I trained the motion foundation model from scratch on 220k synthetic
                samples —{" "}
                <span style={{ color: C.purpleLight }}>4.27° average rotational error</span>,{" "}
                generalizes from synthetic training data to real humans without
                fine-tuning. I forked Godot to integrate the model natively into the
                engine. I built the character generation pipeline — photo to fully-rigged
                3D character in three minutes, for about thirty cents in compute. I built
                the native Mac app, the backend on Hetzner, the website you're reading
                right now.
              </p>

              <p style={{ marginBottom: "20px", fontStyle: "italic", color: C.tealLight }}>
                All solo. All while teaching full-time.
              </p>

              <p style={{ marginBottom: "20px" }}>
                Zinara is a{" "}
                <span style={{ color: C.tealLight }}>game engine for motion-controlled games</span>,{" "}
                built on Godot with a motion foundation model wired in at the engine
                level. Developers will build games where the player's body is the
                controller. Long-term, the same foundation extends beyond gaming —
                motion is the fourth primary input for computers, after keyboard, touch,
                and voice. Gaming is the wedge.
              </p>

              <p style={{ color: C.muted, fontSize: "14px" }}>
                If that resonates: download the Mac app and play. If you're a developer
                who wants to build on the engine, an investor, or someone who wants to
                collaborate — reach out directly. I read every email.
              </p>
            </div>

            <div style={{
              marginTop: "32px", paddingTop: "24px",
              borderTop: `1px solid ${C.glass}`,
              display: "flex", alignItems: "center",
              gap: "16px", flexWrap: "wrap",
            }}>
              <a href={`mailto:${CONTACT_EMAIL}`} style={{
                background: C.gradPurpleTeal,
                border: "none", borderRadius: "8px",
                padding: "12px 24px", color: "#fff",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "12px", fontWeight: 700,
                letterSpacing: "2px", textDecoration: "none",
                textTransform: "uppercase",
                display: "inline-flex", alignItems: "center", gap: "8px",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: `0 0 30px ${C.purple}50`,
              }}
              onMouseOver={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <span>✉</span> Reach out
              </a>
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "13px", color: C.muted,
              }}>{CONTACT_EMAIL}</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats strip — quick credibility */}
        <ScrollReveal delay={0.3}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
          }}>
            {[
              { label: "Built",          value: "Solo" },
              { label: "Background",     value: "MS Data Sci" },
              { label: "Model Error",    value: "4.27°" },
              { label: "Stack",          value: "Full" },
            ].map(({ label, value }) => (
              <div key={label} style={{
                padding: "16px",
                background: C.bgCard,
                border: `1px solid ${C.glass}`,
                borderRadius: "10px",
                textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "18px", fontWeight: 700, color: C.tealLight,
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
      </div>
    </main>
  );
}
