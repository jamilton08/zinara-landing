import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMoveNet } from "../useMoveNet";
import { C, DOWNLOAD_URL, MIN_MACOS } from "../tokens";
import {
  GridBg, GlitchText, ScrollReveal,
  Nebula, FloatingOrbs,
} from "./Visuals";
import SkeletonScene from "./SkeletonScene";

// ─── HERO (replaces MIRROR ME with DOWNLOAD CTA) ───
export function Hero() {
  const [visible, setVisible] = useState(false);
  const { poseRef } = useMoveNet();  // kept for future use; not currently triggered

  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

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
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "13px", color: C.teal,
          letterSpacing: "6px", textTransform: "uppercase",
          marginBottom: "24px",
        }}>
          ▸ THE FUTURE OF GAMING IS YOU ◂
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
          }}>THE GAME</span>
        </h1>

        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "16px", color: C.muted,
          maxWidth: "560px", margin: "24px auto 32px",
          lineHeight: 1.7, letterSpacing: "0.5px",
        }}>
          No controllers. No buttons. Your body is the input.
          <br />
          Upload a photo. Move. Become a 3D character that mirrors you in real-time.
        </p>

        {/* PRIMARY: DOWNLOAD FOR MAC (replaces the in-browser MIRROR ME button) */}
        <div style={{ marginBottom: "16px" }}>
          <a
            href={DOWNLOAD_URL}
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
            <span style={{ fontSize: "16px" }}>⬇</span> Download for Mac
          </a>

          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px", color: C.muted,
            marginTop: "12px", letterSpacing: "1px",
          }}>
            macOS {MIN_MACOS}+ · APPLE SILICON · WEBCAM REQUIRED
          </div>
        </div>

        <div style={{
          marginTop: "20px",
          display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap",
        }}>
          <Link to="/demo" style={{
            background: "transparent",
            border: `1px solid ${C.glass}`,
            borderRadius: "8px",
            padding: "14px 36px", color: C.white,
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "13px", fontWeight: 700,
            letterSpacing: "3px", cursor: "pointer",
            textTransform: "uppercase",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s",
            textDecoration: "none",
            display: "inline-flex", alignItems: "center",
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = C.teal;
            e.currentTarget.style.color = C.tealLight;
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = C.glass;
            e.currentTarget.style.color = C.white;
          }}
          >Watch Demo</Link>

          <Link to="/about" style={{
            background: "transparent",
            border: `1px solid ${C.glass}`,
            borderRadius: "8px",
            padding: "14px 36px", color: C.white,
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "13px", fontWeight: 700,
            letterSpacing: "3px", cursor: "pointer",
            textTransform: "uppercase",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s",
            textDecoration: "none",
            display: "inline-flex", alignItems: "center",
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = C.purpleLight;
            e.currentTarget.style.color = C.purpleLight;
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = C.glass;
            e.currentTarget.style.color = C.white;
          }}
          >About</Link>
        </div>

        <div style={{
          marginTop: "60px",
          display: "flex", justifyContent: "center", gap: "48px",
          flexWrap: "wrap",
        }}>
          {[
            { val: "3 MIN", label: "Photo → Character" },
            { val: "4.27°", label: "Motion Model Error" },
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


// ─── VISION SECTION (preserved byte-for-byte) ───
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
          }}>// HOW IT WORKS</div>

          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800, color: C.white,
            margin: "0 0 60px 0", lineHeight: 1.1,
          }}>
            YOUR BODY.<br />
            <span style={{ color: C.teal }}>YOUR RULES.</span>
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
              title: "CAMERA SEES YOU",
              desc: "The Zinara camera tracks your body in real-time using AI pose estimation. No special hardware — just your webcam.",
              icon: "◉",
            },
            {
              num: "02",
              title: "AI READS MOVEMENT",
              desc: "Every punch, kick, dodge, and jump is translated into game input at 60fps. Trained on synthetic data, works on real humans.",
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
                alt="Kael — Zinara fighter character"
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
              }}>YOU BECOME THE GAME</h3>
              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "14px", color: C.muted,
                lineHeight: 1.8,
              }}>Your avatar mirrors your exact movements. Fight friends across the internet using your actual body as the controller.</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}


// ─── TECH SPECS (preserved byte-for-byte) ───
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
          }}>// UNDER THE HOOD</div>

          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 800, color: C.white,
            margin: "0 0 60px 0",
          }}>BUILT TO <span style={{ color: C.purpleLight }}>MOVE</span></h2>
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


// ─── DEVELOPER SECTION (preserved byte-for-byte) ───
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
              }}>// FOR DEVELOPERS</div>

              <h2 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800, color: C.white,
                margin: "0 0 24px 0", lineHeight: 1.1,
              }}>BUILD. SELL.<br /><span style={{ color: C.tealLight }}>EARN.</span></h2>

              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "14px", color: C.muted,
                lineHeight: 1.8, marginBottom: "32px",
              }}>
                Zinara runs on Godot — the open-source game engine. Build motion-controlled games, sell them on our marketplace, and earn from every download.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  "Open-source SDK powered by Godot",
                  "Marketplace for games & assets",
                  "ZCoin economy for in-app purchases",
                  "Revenue share on every sale",
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
                <span style={{ color: C.muted }}>{"  # Your body → game input"}</span>
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
                <span style={{ color: C.white }}> kick </span>
                <span style={{ color: C.muted }}>= skeleton.</span>
                <span style={{ color: C.teal }}>detect_kick</span>
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
                <span style={{ color: C.muted }}>{"  # Ship it. Earn from it."}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}


// ─── CTA SECTION (preserved byte-for-byte, with download link instead of waitlist) ───
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
            STEP INTO<br />
            <span style={{
              background: C.gradPurpleTeal,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>THE ARENA</span>
          </h2>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "14px", color: C.muted,
            lineHeight: 1.7, marginBottom: "40px",
          }}>
            Download Zinara. Generate your first character. Become the controller.
          </p>

          <a href={DOWNLOAD_URL} style={{
            background: C.gradPurpleTeal,
            border: "none", borderRadius: "8px",
            padding: "18px 48px", color: "#fff",
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
          ><span>⬇</span> Download for Mac</a>

          <div style={{
            marginTop: "60px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px", color: C.muted,
            letterSpacing: "1px",
          }}>
            BUILT SOLO · BRONX, NY · 2026
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
