import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMoveNet } from "../useMoveNet";
import { C, DOWNLOAD_URL, STUDIO_URL, MIN_MACOS, IS_PREVIEW } from "../tokens";
import {
  GridBg, GlitchText, ScrollReveal,
  Nebula, FloatingOrbs,
} from "./Visuals";
import SkeletonScene from "./SkeletonScene";

// ─── HERO ─────────────────────────────────────────────────────────────
// Reframed to lead with the platform thesis. Primary CTA → Studio (web,
// zero install). MIRROR ME restored as a tertiary in-page proof. Mac
// download demoted to "preview" so the page doesn't oversell.
// ──────────────────────────────────────────────────────────────────────
export function Hero() {
  const [visible, setVisible] = useState(false);
  const { state: mnState, error: mnError, start: startMirror, stop: stopMirror, poseRef } = useMoveNet();

  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const mirrorLabel =
    mnState === "loading" ? "▸ LOADING MODEL…" :
    mnState === "active"  ? "■ STOP MIRROR"    :
    mnState === "error"   ? "▸ TRY MIRROR AGAIN" :
                            "▸ OR MIRROR ME IN THIS BROWSER";

  const onMirrorClick = () => {
    if (mnState === "active") stopMirror();
    else startMirror();
  };

  return (
    <section style={{
      minHeight: "100vh", position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", background: C.gradDark,
    }}>
      <GridBg />
      <SkeletonScene poseRef={poseRef} />

      {/* Gradient overlay at bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "200px",
        background: `linear-gradient(transparent, ${C.bg})`,
        zIndex: 2,
      }} />

      <div style={{
        position: "relative", zIndex: 3, textAlign: "center",
        maxWidth: "900px", padding: "0 20px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>

        {/* Testing-release badge — honest about where we are */}
        {IS_PREVIEW && (
          <div style={{
            display: "inline-block",
            background: `${C.purple}18`,
            border: `1px solid ${C.purple}50`,
            borderRadius: "999px",
            padding: "6px 14px",
            marginBottom: "20px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            color: C.purpleLight,
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}>
            ▸ Testing Release · Building in Public
          </div>
        )}

        {/* PLATFORM-THESIS EYEBROW (was: "THE FUTURE OF GAMING IS YOU") */}
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "13px", color: C.teal,
          letterSpacing: "6px", textTransform: "uppercase",
          marginBottom: "24px",
        }}>
          ▸ Motion Is The Next Computer Input ◂
        </div>

        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(48px, 8vw, 96px)",
          fontWeight: 900, lineHeight: 1,
          color: C.white,
          margin: "0 0 16px 0",
        }}>
          <GlitchText>YOU ARE</GlitchText>
          <br />
          <span style={{
            background: C.gradPurpleTeal,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>THE INPUT</span>
        </h1>

        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "16px", color: C.muted,
          maxWidth: "640px", margin: "24px auto 8px",
          lineHeight: 1.7, letterSpacing: "0.3px",
        }}>
          Zinara is a platform for motion as a primary computer input.
          We're starting with games — but the foundation model under the
          hood is the same one that will run animation, accessibility, and
          spatial computing.
        </p>

        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "14px", color: C.tealLight,
          maxWidth: "560px", margin: "0 auto 32px",
          lineHeight: 1.6,
        }}>
          Upload a photo → get an animatable 3D character → move and watch it
          mirror you. Free, in your browser, no install.
        </p>

        {/* PRIMARY CTA: STUDIO (web, frictionless, magic moment) */}
        <div style={{ marginBottom: "16px" }}>
          <a
            href={STUDIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
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
              display: "inline-flex", alignItems: "center", gap: "12px",
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = `0 0 70px ${C.purple}90`;
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = `0 0 50px ${C.purple}70`;
            }}
          >
            Try Studio <span style={{ fontSize: "16px" }}>→</span>
          </a>

          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px", color: C.muted,
            marginTop: "12px", letterSpacing: "1px",
          }}>
            Photo → Animatable Character · Free · No Install · app.zinara.gg
          </div>
        </div>

        {/* SECONDARY: WATCH DEMO + MAC PREVIEW */}
        <div style={{
          marginTop: "20px",
          display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap",
        }}>
          <Link to="/demo" style={ghostBtnStyle()}
            onMouseOver={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.tealLight; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = C.glass; e.currentTarget.style.color = C.white; }}
          >Watch Demo</Link>

          <a href={DOWNLOAD_URL} style={ghostBtnStyle()}
            onMouseOver={e => { e.currentTarget.style.borderColor = C.purpleLight; e.currentTarget.style.color = C.purpleLight; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = C.glass; e.currentTarget.style.color = C.white; }}
          >Download Preview (Mac)</a>
        </div>

        {/* TERTIARY: MIRROR ME (in-page proof of the thesis — your camera, our model, no install) */}
        <div style={{ marginTop: "28px" }}>
          <button
            onClick={onMirrorClick}
            disabled={mnState === "loading"}
            style={{
              background: "transparent",
              border: "none",
              color: mnState === "active" ? C.tealLight : C.muted,
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px", letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: mnState === "loading" ? "wait" : "pointer",
              padding: "8px 16px",
              transition: "color 0.2s",
            }}
            onMouseOver={e => { if (mnState !== "active") e.currentTarget.style.color = C.tealLight; }}
            onMouseOut={e => { if (mnState !== "active") e.currentTarget.style.color = C.muted; }}
          >
            {mirrorLabel}
          </button>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px", color: C.muted,
            marginTop: "4px", letterSpacing: "1px",
          }}>
            {mnState === "active"
              ? "You're driving the skeleton — step back so your full body is in frame"
              : mnState === "error"
                ? (mnError || "Camera blocked — check permissions")
                : "Uses your webcam · nothing leaves your browser"}
          </div>
        </div>

        {/* STATS */}
        <div style={{
          marginTop: "60px",
          display: "flex", justifyContent: "center", gap: "48px",
          flexWrap: "wrap",
        }}>
          {[
            { val: "3 MIN",  label: "Photo → Character" },
            { val: "4.27°",  label: "Motion Model Error" },
            { val: "60 FPS", label: "Real-Time Mirror" },
          ].map(({ val, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "24px", fontWeight: 700, color: C.tealLight,
              }}>{val}</div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px", color: C.muted,
                letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px",
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Local helper to keep the ghost-button JSX readable
function ghostBtnStyle() {
  return {
    background: "transparent",
    border: `1px solid ${C.glass}`,
    borderRadius: "8px",
    padding: "14px 32px", color: C.white,
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "13px", fontWeight: 700,
    letterSpacing: "3px", cursor: "pointer",
    textTransform: "uppercase",
    backdropFilter: "blur(10px)",
    transition: "all 0.2s",
    textDecoration: "none",
    display: "inline-flex", alignItems: "center",
  };
}


// ─── THESIS SECTION (NEW) ─────────────────────────────────────────────
// This is the missing piece. Spells out the platform roadmap so people
// stop reading the rest of the page as "just a motion game."
// ──────────────────────────────────────────────────────────────────────
export function Thesis() {
  const cards = [
    {
      tag: "01 · TODAY",
      title: "GAMES",
      kicker: "The wedge",
      body: "Fighting, dance, fitness, party. Motion controls with instant feedback are the fastest way to prove the model works in the wild — and pay for the rest of the roadmap.",
      icon: "◉",
      accent: C.teal,
    },
    {
      tag: "02 · NEXT",
      title: "CREATION",
      kicker: "Same model, new surface",
      body: "Animation, virtual production, motion capture for solo creators. The same foundation model that lets you fight in real-time rigs a character from a photo in three minutes.",
      icon: "⟁",
      accent: C.purpleLight,
    },
    {
      tag: "03 · AHEAD",
      title: "COMPUTING",
      kicker: "The long arc",
      body: "Mouse and keyboard for desktop. Touch for mobile. Motion for what's next — accessibility, spatial UIs, AR. We're building the input layer one application at a time.",
      icon: "◈",
      accent: C.tealLight,
    },
  ];

  return (
    <section id="platform" style={{
      padding: "120px 40px", background: "transparent",
      position: "relative", overflow: "hidden",
    }}>
      <Nebula color={C.purple} size={700} top="20%" left="20%" opacity={0.07} />
      <Nebula color={C.teal} size={500} top="70%" left="80%" opacity={0.06} />
      <FloatingOrbs count={6} color={C.purple} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <ScrollReveal>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px", color: C.teal,
            letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
          }}>// the thesis</div>

          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800, color: C.white,
            margin: "0 0 16px 0", lineHeight: 1.1,
          }}>
            GAMING IS<br />
            <span style={{ color: C.purpleLight }}>THE WEDGE.</span>
          </h2>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "15px", color: C.muted,
            maxWidth: "680px", lineHeight: 1.8, marginBottom: "60px",
          }}>
            Every new input modality starts where the demand is loudest. Touch
            started in phones. Voice started in speakers. Motion starts here —
            with fighting games, dance, fitness — and grows into everything
            else software is going to need it for.
          </p>
        </ScrollReveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}>
          {cards.map(({ tag, title, kicker, body, icon, accent }, i) => (
            <ScrollReveal key={tag} delay={i * 0.12}>
              <div style={{
                background: C.bgCard,
                border: `1px solid ${C.glass}`,
                borderRadius: "16px",
                padding: "36px 28px",
                position: "relative", overflow: "hidden",
                backdropFilter: "blur(8px)",
                transition: "all 0.3s ease",
                height: "100%",
                display: "flex", flexDirection: "column",
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = accent;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 20px 60px ${accent}25`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = C.glass;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px", color: accent,
                  letterSpacing: "3px", textTransform: "uppercase",
                  marginBottom: "12px",
                }}>{tag}</div>

                <div style={{
                  fontSize: "28px", marginBottom: "16px",
                  filter: `drop-shadow(0 0 8px ${accent})`,
                  color: accent,
                }}>{icon}</div>

                <h3 style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "22px", fontWeight: 800,
                  color: C.white, letterSpacing: "2px",
                  marginBottom: "6px",
                }}>{title}</h3>

                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "12px", color: accent,
                  letterSpacing: "1px",
                  marginBottom: "16px", fontStyle: "italic",
                }}>{kicker}</div>

                <p style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "13px", color: C.muted,
                  lineHeight: 1.75,
                }}>{body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div style={{
            textAlign: "center", marginTop: "60px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "13px", color: C.muted,
            letterSpacing: "2px",
          }}>
            Same foundation model. Different surfaces.
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}


// ─── VISION SECTION ───────────────────────────────────────────────────
// Kept structure, added a Studio CTA at the end so the Kael card doesn't
// dead-end — instead it routes curiosity straight into app.zinara.gg.
// ──────────────────────────────────────────────────────────────────────
export function Vision() {
  return (
    <section id="vision" style={{
      padding: "120px 40px", background: "transparent",
      position: "relative", overflow: "hidden",
    }}>
      <Nebula color={C.purple} size={700} top="30%" left="80%" opacity={0.08} />
      <Nebula color={C.teal} size={500} top="70%" left="10%" opacity={0.06} />
      <FloatingOrbs count={8} color={C.teal} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <ScrollReveal>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px", color: C.purple,
            letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
          }}>// how it works</div>

          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800, color: C.white,
            margin: "0 0 60px 0", lineHeight: 1.1,
          }}>
            YOUR PHOTO.<br />
            <span style={{ color: C.teal }}>YOUR CHARACTER.</span>
          </h2>
        </ScrollReveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}>
          {[
            {
              num: "01",
              title: "UPLOAD A PHOTO",
              desc: "Drop in a selfie or any character image. The pipeline turns it into a fully-rigged 3D mesh in about three minutes — commercial-grade topology, Mixamo-compatible bones.",
              icon: "◉",
            },
            {
              num: "02",
              title: "CAMERA SEES YOU",
              desc: "Just a webcam. Our motion foundation model — trained on synthetic data, generalizes to real humans without fine-tuning — maps your body to 22 bone rotations in real time.",
              icon: "⟁",
            },
          ].map(({ num, title, desc, icon }, i) => (
            <ScrollReveal key={num} delay={i * 0.15} direction={i === 0 ? "left" : "right"}>
              <div style={{
                background: C.bgCard,
                border: `1px solid ${C.glass}`,
                borderRadius: "16px",
                padding: "40px 32px",
                transition: "all 0.3s ease",
                cursor: "default",
                position: "relative", overflow: "hidden",
                backdropFilter: "blur(8px)",
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = C.purple;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 20px 60px ${C.purple}25, inset 0 0 30px ${C.purple}08`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = C.glass;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <div style={{
                  position: "absolute", top: "-20px", right: "-10px",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "100px", fontWeight: 900,
                  color: C.glass, lineHeight: 1,
                }}>{num}</div>
                <div style={{
                  fontSize: "32px", marginBottom: "20px",
                  filter: `drop-shadow(0 0 10px ${C.teal})`,
                }}>{icon}</div>
                <h3 style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "16px", fontWeight: 700,
                  color: C.white, letterSpacing: "2px",
                  marginBottom: "12px",
                }}>{title}</h3>
                <p style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "13px", color: C.muted,
                  lineHeight: 1.7,
                }}>{desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Featured Kael card */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center",
          marginTop: "40px",
        }}>
          <ScrollReveal direction="left" delay={0.1}>
            <div style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <div style={{
                position: "absolute",
                width: "320px", height: "320px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${C.purple}30 0%, ${C.teal}10 50%, transparent 70%)`,
                filter: "blur(40px)",
                pointerEvents: "none",
              }} />
              <img
                src="/Kael_fighting_stance.png"
                alt="Kael — a character built in Zinara Studio"
                style={{
                  position: "relative",
                  maxHeight: "480px",
                  width: "auto",
                  objectFit: "contain",
                  filter: `drop-shadow(0 0 30px ${C.purple}60) drop-shadow(0 0 60px ${C.teal}30)`,
                }}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.25}>
            <div style={{
              background: C.bgCard,
              border: `1px solid ${C.glass}`,
              borderRadius: "16px",
              padding: "48px 40px",
              transition: "all 0.3s ease",
              cursor: "default",
              position: "relative", overflow: "hidden",
              backdropFilter: "blur(8px)",
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = C.purple;
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 20px 60px ${C.purple}25, inset 0 0 30px ${C.purple}08`;
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = C.glass;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              <div style={{
                position: "absolute", top: "-20px", right: "-10px",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "100px", fontWeight: 900,
                color: C.glass, lineHeight: 1,
              }}>03</div>
              <div style={{
                fontSize: "32px", marginBottom: "20px",
                filter: `drop-shadow(0 0 10px ${C.teal})`,
              }}>◈</div>
              <h3 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "20px", fontWeight: 700,
                color: C.white, letterSpacing: "2px",
                marginBottom: "16px",
              }}>MAKE YOUR OWN</h3>
              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "14px", color: C.muted,
                lineHeight: 1.8, marginBottom: "28px",
              }}>
                Kael was built in Zinara Studio. So was every other character
                you'll see in the game. The pipeline is the same one you can
                run right now in your browser — no install, no signup wall.
              </p>

              <a
                href={STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: C.gradPurpleTeal,
                  border: "none", borderRadius: "8px",
                  padding: "14px 28px", color: "#fff",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "13px", fontWeight: 700,
                  letterSpacing: "2px", cursor: "pointer",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: `0 0 30px ${C.purple}50`,
                  display: "inline-flex", alignItems: "center", gap: "10px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = `0 0 50px ${C.purple}70`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = `0 0 30px ${C.purple}50`;
                }}
              >
                Open Studio <span style={{ fontSize: "14px" }}>→</span>
              </a>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px", color: C.muted,
                marginTop: "10px", letterSpacing: "1px",
              }}>
                app.zinara.gg · runs in any modern browser
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}


// ─── TECH SPECS (preserved) ───────────────────────────────────────────
// These are still the platform's credibility receipts — kept intact.
// ──────────────────────────────────────────────────────────────────────
export function TechSpecs() {
  return (
    <section id="tech" style={{
      padding: "120px 40px",
      background: "transparent",
      position: "relative", overflow: "hidden",
    }}>
      <Nebula color={C.teal} size={800} top="50%" left="50%" opacity={0.06} />
      <Nebula color={C.purple} size={400} top="20%" left="20%" opacity={0.1} />
      <FloatingOrbs count={6} color={C.purple} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <ScrollReveal>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px", color: C.teal,
            letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
          }}>// the receipts</div>

          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 800, color: C.white,
            margin: "0 0 16px 0",
          }}>WE TRAINED THE MODEL<br /><span style={{ color: C.purpleLight }}>SO YOU DON'T HAVE TO.</span></h2>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "14px", color: C.muted,
            maxWidth: "640px", lineHeight: 1.7, marginBottom: "48px",
          }}>
            A motion foundation model built from scratch on 220k synthetic
            samples. Generalizes to real humans without fine-tuning. Runs
            anywhere with a webcam.
          </p>
        </ScrollReveal>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}>
          {[
            { label: "MOTION MODEL", value: "4.27°",  sub: "Avg rotational error" },
            { label: "PIPELINE",     value: "3 min",  sub: "Photo → rigged character" },
            { label: "FRAMERATE",    value: "60 FPS", sub: "Real-time mirror mode" },
            { label: "BONES",        value: "22",     sub: "Mixamo-compatible rig" },
            { label: "TRAINING",     value: "220k",   sub: "Synthetic motion samples" },
            { label: "GENERATION",   value: "$0.38",  sub: "Per character (compute)" },
            { label: "MESH SIZE",    value: "200k",   sub: "Tris (commercial-grade)" },
            { label: "BACKEND",      value: "Self-hosted", sub: "Hetzner + R2 + Docker" },
          ].map(({ label, value, sub }, i) => (
            <ScrollReveal key={label} delay={i * 0.08}>
              <div style={{
                background: C.bgCard,
                border: `1px solid ${C.glass}`,
                borderRadius: "12px",
                padding: "28px 24px",
                textAlign: "center",
                transition: "all 0.3s",
                backdropFilter: "blur(6px)",
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = C.teal;
                e.currentTarget.style.boxShadow = `0 0 30px ${C.teal}15, inset 0 0 20px ${C.teal}05`;
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = C.glass;
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "scale(1)";
              }}
              >
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px", color: C.muted,
                  letterSpacing: "3px", textTransform: "uppercase",
                  marginBottom: "8px",
                }}>{label}</div>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "28px", fontWeight: 800,
                  background: C.gradPurpleTeal,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>{value}</div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px", color: C.muted,
                  marginTop: "4px",
                }}>{sub}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── DEVELOPER SECTION ────────────────────────────────────────────────
// Reframed: "we're opening this up" instead of "buy in our marketplace."
// The platform thesis means motion devs are partners, not just customers.
// ──────────────────────────────────────────────────────────────────────
export function DevSection() {
  return (
    <section id="develop" style={{
      padding: "120px 40px", background: "transparent",
      position: "relative", overflow: "hidden",
    }}>
      <Nebula color={C.purple} size={600} top="40%" left="70%" opacity={0.1} />
      <Nebula color={C.teal} size={400} top="60%" left="30%" opacity={0.07} />
      <FloatingOrbs count={5} color={C.teal} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px",
          alignItems: "center",
        }}>
          <ScrollReveal direction="left">
            <div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "12px", color: C.purple,
                letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
              }}>// for builders</div>

              <h2 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800, color: C.white,
                margin: "0 0 24px 0", lineHeight: 1.1,
              }}>WE'RE OPENING<br /><span style={{ color: C.tealLight }}>THIS UP.</span></h2>

              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "14px", color: C.muted,
                lineHeight: 1.8, marginBottom: "32px",
              }}>
                The motion foundation model, the photo-to-character rigging
                pipeline, the real-time runtime — these are the same pieces
                we're using to build the games. If you want to build with
                motion as input, we want you here. Games today, more tomorrow.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  "Foundation model trained on 220k motion samples",
                  "Godot-based SDK (open source) — start in 5 minutes",
                  "Photo → animatable character pipeline as a service",
                  "ZCoin economy + revenue share when the marketplace ships",
                ].map((text, i) => (
                  <ScrollReveal key={text} delay={0.3 + i * 0.1} direction="left">
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{
                        color: C.teal, fontSize: "16px",
                        filter: `drop-shadow(0 0 6px ${C.teal})`,
                      }}>▹</span>
                      <span style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "13px", color: C.white,
                      }}>{text}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <div style={{
              background: "rgba(10,10,20,0.8)",
              border: `1px solid ${C.glass}`,
              borderRadius: "16px",
              padding: "32px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "13px",
              lineHeight: 2,
              overflow: "hidden",
              backdropFilter: "blur(10px)",
              boxShadow: `0 0 60px ${C.purple}08`,
            }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
              </div>
              <div>
                <span style={{ color: C.purple }}>func</span>
                <span style={{ color: C.white }}> _on_motion</span>
                <span style={{ color: C.muted }}>(skeleton):</span>
              </div>
              <div style={{ paddingLeft: "20px" }}>
                <span style={{ color: C.muted }}>{"  # Your body → any input you want"}</span>
              </div>
              <div style={{ paddingLeft: "20px" }}>
                <span style={{ color: C.purple }}>var</span>
                <span style={{ color: C.white }}> punch </span>
                <span style={{ color: C.muted }}>= skeleton.</span>
                <span style={{ color: C.teal }}>detect_punch</span>
                <span style={{ color: C.muted }}>()</span>
              </div>
              <div style={{ paddingLeft: "20px" }}>
                <span style={{ color: C.purple }}>var</span>
                <span style={{ color: C.white }}> gesture </span>
                <span style={{ color: C.muted }}>= skeleton.</span>
                <span style={{ color: C.teal }}>classify_pose</span>
                <span style={{ color: C.muted }}>()</span>
              </div>
              <div style={{ paddingLeft: "20px", marginTop: "8px" }}>
                <span style={{ color: C.purple }}>if</span>
                <span style={{ color: C.white }}> punch</span>
                <span style={{ color: C.muted }}>:</span>
              </div>
              <div style={{ paddingLeft: "40px" }}>
                <span style={{ color: C.white }}>player.</span>
                <span style={{ color: C.teal }}>attack</span>
                <span style={{ color: C.muted }}>(punch.</span>
                <span style={{ color: C.purpleLight }}>force</span>
                <span style={{ color: C.muted }}>)</span>
              </div>
              <div style={{ paddingLeft: "20px", marginTop: "8px" }}>
                <span style={{ color: C.muted }}>{"  # Game today. UI tomorrow."}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}


// ─── FINAL CTA ────────────────────────────────────────────────────────
// Two-path close: Studio primary (the magic moment people should leave
// the page with), Mac preview secondary (for the believers who want the
// full desktop experience).
// ──────────────────────────────────────────────────────────────────────
export function CTA() {
  return (
    <section id="community" style={{
      padding: "120px 40px",
      background: "transparent",
      position: "relative", overflow: "hidden",
    }}>
      <Nebula color={C.purple} size={800} top="50%" left="50%" opacity={0.12} />
      <Nebula color={C.teal} size={500} top="30%" left="30%" opacity={0.08} />
      <Nebula color={C.purple} size={400} top="70%" left="70%" opacity={0.06} />
      <FloatingOrbs count={10} color={C.purple} />
      <FloatingOrbs count={5} color={C.teal} />

      <ScrollReveal>
        <div style={{
          maxWidth: "700px", margin: "0 auto",
          textAlign: "center", position: "relative", zIndex: 1,
        }}>
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 900, color: C.white,
            margin: "0 0 20px 0", lineHeight: 1.1,
          }}>
            PICK A DOOR.<br />
            <span style={{
              background: C.gradPurpleTeal,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>STEP IN.</span>
          </h2>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "14px", color: C.muted,
            lineHeight: 1.7, marginBottom: "40px",
          }}>
            The fastest way to feel what this is: open Studio, upload a photo,
            move. If you want the full preview, grab the Mac build below — it
            ships every couple of weeks.
          </p>

          <div style={{
            display: "flex", gap: "16px", justifyContent: "center",
            flexWrap: "wrap", marginBottom: "20px",
          }}>
            <a
              href={STUDIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: C.gradPurpleTeal,
                border: "none", borderRadius: "8px",
                padding: "18px 40px", color: "#fff",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "14px", fontWeight: 700,
                letterSpacing: "3px", cursor: "pointer",
                textTransform: "uppercase",
                boxShadow: `0 0 40px ${C.purple}60`,
                transition: "transform 0.2s, box-shadow 0.2s",
                textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "12px",
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = `0 0 60px ${C.purple}80`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = `0 0 40px ${C.purple}60`;
              }}
            >Try Studio <span>→</span></a>

            <a
              href={DOWNLOAD_URL}
              style={{
                background: "transparent",
                border: `1px solid ${C.glass}`,
                borderRadius: "8px",
                padding: "18px 40px", color: C.white,
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "14px", fontWeight: 700,
                letterSpacing: "3px", cursor: "pointer",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "12px",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.purpleLight; e.currentTarget.style.color = C.purpleLight; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.glass; e.currentTarget.style.color = C.white; }}
            ><span>⬇</span> Download Mac Preview</a>
          </div>

          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px", color: C.muted,
            letterSpacing: "1px",
          }}>
            macOS {MIN_MACOS}+ · Apple Silicon · Webcam required
          </div>

          <div style={{
            marginTop: "60px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px", color: C.muted,
            letterSpacing: "1px",
          }}>
            Built solo · Bronx, NY · 2026
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}