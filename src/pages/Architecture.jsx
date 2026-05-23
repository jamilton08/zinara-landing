import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { C, DOWNLOAD_URL, STUDIO_URL } from "../tokens";
import { Nebula, FloatingOrbs, ScrollReveal } from "../components/Visuals";

// ─── STAGE METADATA ────────────────────────────────────────────────────────
// Each stage in the pipeline. Clicking a node in the diagram shows the
// matching panel below. Keep stats real — these numbers go in the pitch.
const STAGES = {
  photo: {
    track: "CHARACTER CREATION",
    title: "PHOTO INPUT",
    desc: "User uploads a photo from the web Studio or the Mac app. PNG, JPG, or WEBP under 10 MB. Selfie, full-body, or portrait — the pipeline handles all of them.",
    stats: [
      { label: "Formats", value: "PNG · JPG · WEBP" },
      { label: "Max size", value: "10 MB" },
      { label: "Hosted at", value: "app.zinara.gg" },
    ],
  },
  hunyuan: {
    track: "CHARACTER CREATION",
    title: "HUNYUAN3D V3",
    desc: "Image-to-3D foundation model converts the photo into a textured mesh with PBR materials. Runs on WaveSpeed's GPU cluster — typical generation 90 seconds.",
    stats: [
      { label: "Compute", value: "$0.38 / character" },
      { label: "Mesh", value: "~200k triangles" },
      { label: "Materials", value: "PBR (metallic/rough)" },
      { label: "Latency", value: "~90 seconds" },
    ],
  },
  rig: {
    track: "CHARACTER CREATION",
    title: "MIA AUTO-RIG",
    desc: "Custom rigging service (FastAPI on a Mac Mini) infers joint positions and blend weights, then welds a Mixamo-compatible skeleton onto the mesh. Output is a rigged GLB ready for animation.",
    stats: [
      { label: "Skeleton", value: "Mixamo (22 bones)" },
      { label: "Rest pose", value: "T-pose" },
      { label: "Output", value: "GLB" },
      { label: "Time", value: "~45 seconds" },
    ],
  },
  library: {
    track: "CHARACTER CREATION",
    title: "CHARACTER LIBRARY",
    desc: "Rigged GLBs uploaded to Cloudflare R2, served via presigned URLs. Cached locally in the Mac app on first use — afterward the character is fully offline.",
    stats: [
      { label: "Storage", value: "Cloudflare R2" },
      { label: "Cache", value: "Local (offline-capable)" },
      { label: "Bundled", value: "Kael (free starter)" },
    ],
  },
  webcam: {
    track: "MOTION CAPTURE",
    title: "WEBCAM",
    desc: "Any laptop or USB webcam at 30–120 FPS. No depth sensor, no Kinect, no special hardware. The whole pipeline is built to work with what you already have.",
    stats: [
      { label: "Frame rate", value: "30 – 120 FPS" },
      { label: "Resolution", value: "Any (640×480 fine)" },
      { label: "Hardware", value: "Webcam only" },
    ],
  },
  blazepose: {
    track: "MOTION CAPTURE",
    title: "BLAZEPOSE",
    desc: "MediaPipe BlazePose extracts 33 body landmarks per frame in 2D normalized coordinates. Pre-trained on millions of human poses. Runs locally on CPU — no cloud roundtrip, no privacy leak.",
    stats: [
      { label: "Landmarks", value: "33 per frame" },
      { label: "Speed", value: "~10 ms / frame" },
      { label: "Runs on", value: "Local CPU" },
    ],
  },
  model: {
    track: "MOTION CAPTURE",
    title: "MOTION MODEL",
    desc: "Custom foundation model trained from scratch. Takes BlazePose's 33 landmarks and predicts 22 bone rotation deltas as quaternions. Generalizes from synthetic data to real humans — 4.27° average rotational error.",
    stats: [
      { label: "Avg error", value: "4.27° per bone" },
      { label: "Training", value: "220k synthetic samples" },
      { label: "Inference", value: "ONNX runtime (CPU)" },
      { label: "Bundled in", value: "Mac app" },
    ],
  },
  bones: {
    track: "MOTION CAPTURE",
    title: "BONE DELTAS",
    desc: "22 quaternion rotations streamed via UDP localhost from the Python bridge to the Godot game engine. ~150 bytes per packet at 60 Hz. Decoded into Skeleton3D bone poses.",
    stats: [
      { label: "Format", value: "Quaternion × 22 bones" },
      { label: "Transport", value: "UDP (127.0.0.1:5555)" },
      { label: "Rate", value: "60 Hz" },
    ],
  },
  character: {
    track: "CONVERGENCE",
    title: "REAL-TIME MIRROR",
    desc: "The rigged character (from creation pipeline) animated by the bone deltas (from motion pipeline). End-to-end latency under 50ms — fast enough that the character feels like an extension of your body.",
    stats: [
      { label: "Latency", value: "< 50 ms end-to-end" },
      { label: "Renderer", value: "Godot 4 (custom fork)" },
      { label: "Output", value: "Native macOS app" },
    ],
  },
};

// ─── PIPELINE LAYOUT ───────────────────────────────────────────────────────
// Coordinates for nodes in the SVG. Two lanes converging into one final node.
// SVG viewBox is 1000×420 — we scale via CSS to fit the container.
const NODE_W = 140;
const NODE_H = 64;

const NODES = [
  // Track A: photo → character (top lane)
  { id: "photo",     label: "PHOTO",        sub: "user upload",      x: 30,  y: 70,  track: "A" },
  { id: "hunyuan",   label: "HUNYUAN3D",    sub: "image → 3D",       x: 220, y: 70,  track: "A" },
  { id: "rig",       label: "AUTO-RIG",     sub: "skeleton + weights", x: 410, y: 70,  track: "A" },
  { id: "library",   label: "LIBRARY",      sub: "R2 + local cache", x: 600, y: 70,  track: "A" },
  // Track B: webcam → bones (bottom lane)
  { id: "webcam",    label: "WEBCAM",       sub: "any camera",       x: 30,  y: 240, track: "B" },
  { id: "blazepose", label: "BLAZEPOSE",    sub: "33 landmarks",     x: 220, y: 240, track: "B" },
  { id: "model",     label: "MOTION MODEL", sub: "foundation model", x: 410, y: 240, track: "B" },
  { id: "bones",     label: "BONE DELTAS",  sub: "22 quaternions",   x: 600, y: 240, track: "B" },
  // Convergence
  { id: "character", label: "REAL-TIME",    sub: "YOU as character", x: 820, y: 155, track: "C" },
];

const EDGES = [
  // Top lane forward
  { from: "photo", to: "hunyuan", track: "A" },
  { from: "hunyuan", to: "rig", track: "A" },
  { from: "rig", to: "library", track: "A" },
  // Bottom lane forward
  { from: "webcam", to: "blazepose", track: "B" },
  { from: "blazepose", to: "model", track: "B" },
  { from: "model", to: "bones", track: "B" },
  // Converging into final node
  { from: "library", to: "character", track: "C" },
  { from: "bones", to: "character", track: "C" },
];

function nodeCenter(id) {
  const n = NODES.find(n => n.id === id);
  return { x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 };
}


// ─── ARCHITECTURE PAGE ─────────────────────────────────────────────────────
export default function Architecture() {
  const [selected, setSelected] = useState("model");  // most interesting default
  const stage = STAGES[selected];

  return (
    <div style={{ paddingTop: "100px", paddingBottom: "60px", minHeight: "100vh" }}>
      {/* ─── HEADER ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "60px 40px 40px", position: "relative" }}>
        <Nebula color={C.purple} size={700} top="20%" left="80%" opacity={0.10} />
        <Nebula color={C.teal} size={500} top="60%" left="10%" opacity={0.08} />
        <FloatingOrbs count={6} color={C.teal} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px", color: C.purple,
            letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
          }}>// TECHNICAL ARCHITECTURE</div>

          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 900, color: C.white,
            margin: "0 0 24px 0", lineHeight: 1,
          }}>
            HOW <span style={{
              background: C.gradPurpleTeal,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>ZINARA</span><br />WORKS
          </h1>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "15px", color: C.muted,
            lineHeight: 1.7, maxWidth: "640px",
          }}>
            Two pipelines running in parallel. One builds your character from a photo. The other captures your body motion and drives that character in real-time. Click any node below to see what happens at that stage.
          </p>
        </div>
      </section>

      {/* ─── INTERACTIVE PIPELINE DIAGRAM ────────────────────────────────── */}
      <section style={{ padding: "20px 40px 40px", position: "relative" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            background: "rgba(10,10,20,0.7)",
            border: `1px solid ${C.glass}`,
            borderRadius: "20px",
            padding: "32px 24px",
            backdropFilter: "blur(10px)",
            boxShadow: `0 0 80px ${C.purple}10`,
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Lane labels */}
            <div style={{
              position: "absolute", top: 20, left: 24,
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px", color: C.tealLight,
              letterSpacing: "3px", textTransform: "uppercase",
            }}>▸ Track A · Character Creation</div>
            <div style={{
              position: "absolute", top: 232, left: 24,
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px", color: C.tealLight,
              letterSpacing: "3px", textTransform: "uppercase",
            }}>▸ Track B · Motion Capture</div>

            <svg viewBox="0 0 1000 420" style={{
              width: "100%", height: "auto",
              maxHeight: "520px",
              display: "block",
              fontFamily: "'Space Mono', monospace",
            }}>
              {/* Edge paths — drawn first so they sit under the nodes */}
              {EDGES.map((e, i) => {
                const a = nodeCenter(e.from);
                const b = nodeCenter(e.to);
                const edgeColor = e.track === "A" ? C.tealLight
                               : e.track === "B" ? C.purpleLight
                               : C.white;
                // For convergence edges, draw a curved path so the two lanes
                // visibly merge into the final node
                const isConverge = e.track === "C";
                const ax = a.x + NODE_W / 2;
                const bx = b.x - NODE_W / 2;
                const path = isConverge
                  ? `M ${ax} ${a.y} C ${(ax + bx) / 2} ${a.y}, ${(ax + bx) / 2} ${b.y}, ${bx} ${b.y}`
                  : `M ${ax} ${a.y} L ${bx} ${b.y}`;
                const id = `path-${e.from}-${e.to}`;
                return (
                  <g key={id}>
                    <path id={id} d={path} stroke={edgeColor} strokeWidth="1.5"
                          fill="none" opacity="0.4" />
                    {/* Animated dot using SMIL <animateMotion> — works in all
                        modern browsers, no JS animation loop needed */}
                    <circle r="4" fill={edgeColor}
                            style={{ filter: `drop-shadow(0 0 6px ${edgeColor})` }}>
                      <animateMotion
                        dur={isConverge ? "2.5s" : "2s"}
                        repeatCount="indefinite"
                        begin={`${i * 0.35}s`}
                      >
                        <mpath href={`#${id}`} />
                      </animateMotion>
                    </circle>
                  </g>
                );
              })}

              {/* Node rectangles */}
              {NODES.map(n => {
                const isSel = n.id === selected;
                const trackColor = n.track === "A" ? C.tealLight
                                : n.track === "B" ? C.purpleLight
                                : C.gradPurpleTeal;
                const stroke = isSel ? (n.track === "A" ? C.teal : C.purple)
                                     : "rgba(255,255,255,0.15)";
                return (
                  <g key={n.id}
                     onClick={() => setSelected(n.id)}
                     style={{ cursor: "pointer" }}>
                    <rect
                      x={n.x} y={n.y}
                      width={NODE_W} height={NODE_H}
                      rx="10"
                      fill={isSel ? "rgba(147, 51, 234, 0.18)" : "rgba(10,10,20,0.85)"}
                      stroke={stroke}
                      strokeWidth={isSel ? 2 : 1}
                      style={{
                        transition: "all 0.2s",
                        filter: isSel ? `drop-shadow(0 0 12px ${n.track === "A" ? C.teal : C.purple})` : "none",
                      }}
                    />
                    <text
                      x={n.x + NODE_W / 2} y={n.y + 26}
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="700"
                      fill={C.white}
                      style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "1.5px" }}
                    >{n.label}</text>
                    <text
                      x={n.x + NODE_W / 2} y={n.y + 46}
                      textAnchor="middle"
                      fontSize="10"
                      fill={n.track === "A" ? C.tealLight : n.track === "B" ? C.purpleLight : C.tealLight}
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >{n.sub}</text>
                  </g>
                );
              })}
            </svg>

            <div style={{
              textAlign: "center",
              marginTop: "16px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              color: C.muted,
              letterSpacing: "1px",
            }}>
              Click any stage to explore it ↑
            </div>
          </div>
        </div>
      </section>

      {/* ─── DETAILS PANEL ─────────────────────────────────────────────── */}
      <section style={{ padding: "40px 40px 80px", position: "relative" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{
              background: C.bgCard,
              border: `1px solid ${C.glass}`,
              borderRadius: "20px",
              padding: "48px 40px",
              backdropFilter: "blur(8px)",
              minHeight: "240px",
              transition: "all 0.3s ease",
            }}>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px", color: C.tealLight,
                letterSpacing: "4px", textTransform: "uppercase",
                marginBottom: "16px",
              }}>▸ {stage.track}</div>

              <h2 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 800, color: C.white,
                margin: "0 0 24px 0",
                background: C.gradPurpleTeal,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>{stage.title}</h2>

              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "15px", color: C.muted,
                lineHeight: 1.8, marginBottom: "32px",
                maxWidth: "780px",
              }}>{stage.desc}</p>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
              }}>
                {stage.stats.map(({ label, value }) => (
                  <div key={label} style={{
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.glass}`,
                    borderRadius: "10px",
                    padding: "16px 20px",
                  }}>
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "10px", color: C.muted,
                      letterSpacing: "2px", textTransform: "uppercase",
                      marginBottom: "6px",
                    }}>{label}</div>
                    <div style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "16px", fontWeight: 700,
                      color: C.tealLight,
                    }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── KEY PRINCIPLES ─────────────────────────────────────────────── */}
      <section style={{ padding: "60px 40px", position: "relative" }}>
        <Nebula color={C.purple} size={500} top="40%" left="20%" opacity={0.06} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <ScrollReveal>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px", color: C.teal,
              letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
            }}>// WHY IT'S BUILT THIS WAY</div>

            <h2 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800, color: C.white,
              margin: "0 0 48px 0", lineHeight: 1.1,
            }}>DEFENSIBLE BY <span style={{ color: C.tealLight }}>DESIGN</span></h2>
          </ScrollReveal>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}>
            {[
              { title: "LOCAL-FIRST", body: "Once installed, mirror mode runs entirely on your Mac. No streaming, no roundtrip, no privacy leak. Webcam never leaves your device." },
              { title: "FOUNDATION MODEL", body: "We trained the motion model from scratch on synthetic data — 220k samples generated in Godot from Mixamo animations. Generalizes to real humans with 4.27° error." },
              { title: "WORKS WITH WHAT YOU HAVE", body: "No depth sensor. No Kinect. No special hardware. The whole pipeline targets the laptop webcam every user already owns." },
              { title: "MOTION AS INPUT", body: "Gaming is the wedge. The same pipeline can drive presentations, design tools, accessibility apps, fitness coaching. We started where the data flywheel spins fastest." },
            ].map(({ title, body }, i) => (
              <ScrollReveal key={title} delay={i * 0.1}>
                <div style={{
                  background: C.bgCard,
                  border: `1px solid ${C.glass}`,
                  borderRadius: "14px",
                  padding: "28px",
                  height: "100%",
                  transition: "all 0.3s",
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = C.purple;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = C.glass;
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                  <h3 style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "14px", fontWeight: 800,
                    color: C.tealLight, letterSpacing: "3px",
                    marginBottom: "12px",
                  }}>{title}</h3>
                  <p style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "13px", color: C.muted,
                    lineHeight: 1.7,
                  }}>{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTAs ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px 40px", textAlign: "center" }}>
        <ScrollReveal>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <h2 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800, color: C.white,
              marginBottom: "20px",
            }}>READY TO TRY IT?</h2>

            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "13px", color: C.muted,
              marginBottom: "32px", lineHeight: 1.7,
            }}>
              Generate a character in the browser, or download the Mac app to make it move with your body.
            </p>

            <div style={{
              display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap",
            }}>
              <a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" style={{
                background: "transparent",
                border: `1px solid ${C.teal}`,
                borderRadius: "8px",
                padding: "14px 32px", color: C.tealLight,
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "13px", fontWeight: 700,
                letterSpacing: "2px", textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseOver={e => {
                e.target.style.background = `${C.teal}20`;
              }}
              onMouseOut={e => {
                e.target.style.background = "transparent";
              }}>Try Studio →</a>

              <a href={DOWNLOAD_URL} style={{
                background: C.gradPurpleTeal,
                border: "none",
                borderRadius: "8px",
                padding: "14px 32px", color: "#fff",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "13px", fontWeight: 700,
                letterSpacing: "2px", textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: `0 0 30px ${C.purple}60`,
                transition: "transform 0.2s",
              }}
              onMouseOver={e => e.target.style.transform = "scale(1.04)"}
              onMouseOut={e => e.target.style.transform = "scale(1)"}>⬇ Download Mac</a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
