import { Link } from "react-router-dom";
import { C, DOWNLOAD_URL, STUDIO_URL } from "../tokens";
import {
  Nebula, FloatingOrbs, ScrollReveal, GridBg,
} from "../components/Visuals";

// ============================================================================
// PLATFORM PAGE — /platform
// ============================================================================
// "How Zinara works" — the full business model, three sides of the ecosystem.
// Sits separate from /architecture (which is technical pipeline) so each page
// does one job well. Architecture for ML/dev nerds; Platform for anyone asking
// "but what's the actual offer here?"
//
// Three-sided story:
//   1. PLAYERS   — generate character, download app, play games with body
//   2. CREATORS  — characters they generate work in any Zinara-built game
//   3. DEVELOPERS — build on Godot fork, fine-tune foundation model, earn 92%
//
// Honest split between what's LIVE and what's ROADMAP so trust doesn't break.
// ============================================================================

export default function Platform() {
  return (
    <main style={{
      paddingTop: "120px", paddingBottom: "80px",
      minHeight: "100vh", position: "relative", overflow: "hidden",
    }}>
      <GridBg />
      <Nebula color={C.purple} size={700} top="15%" left="80%" opacity={0.08} />
      <Nebula color={C.teal} size={600} top="60%" left="10%" opacity={0.06} />
      <FloatingOrbs count={8} color={C.purple} />

      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "0 40px", position: "relative", zIndex: 1,
      }}>
        <ScrollReveal>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px", color: C.teal,
            letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px",
          }}>// HOW ZINARA WORKS</div>

          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800, color: C.white,
            margin: "0 0 32px 0", lineHeight: 1.05,
          }}>
            THREE SIDES,<br />
            <span style={{
              background: C.gradPurpleTeal,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>ONE PLATFORM.</span>
          </h1>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "15px", color: C.muted,
            maxWidth: "720px", lineHeight: 1.75,
            marginBottom: "72px",
          }}>
            Zinara is a game engine for motion-controlled games and the platform that
            ships them. Players generate a character once, then play games built by
            developers on the Zinara engine — using their body as the controller.
            Developers earn 92% of every sale.
          </p>
        </ScrollReveal>

        {/* ─── THE THREE SIDES ──────────────────────────────────────────── */}

        <ThreeSides />

        {/* ─── THE LOOP (how value flows) ───────────────────────────────── */}

        <TheLoop />

        {/* ─── DEVELOPER DEEP DIVE ──────────────────────────────────────── */}

        <DeveloperSection />

        {/* ─── ECONOMICS ─────────────────────────────────────────────────── */}

        <Economics />

        {/* ─── LIVE VS ROADMAP ──────────────────────────────────────────── */}

        <LiveVsRoadmap />

        {/* ─── CALLS TO ACTION ──────────────────────────────────────────── */}

        <PlatformCTA />
      </div>
    </main>
  );
}


// ─── THE THREE SIDES OF THE ECOSYSTEM ──────────────────────────────────────

function ThreeSides() {
  return (
    <ScrollReveal>
      <div style={{ marginBottom: "100px" }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px", color: C.purple,
          letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px",
        }}>// THE ECOSYSTEM</div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}>
          {[
            {
              num: "01",
              kicker: "PLAYERS",
              title: "BECOME A CHARACTER",
              desc: "Upload one photo. Get a fully rigged 3D character in three minutes. Download the Mac app. Use your body as the controller. Play any game built on Zinara.",
              ctaText: "Generate your character →",
              ctaHref: STUDIO_URL,
              ctaExternal: true,
              accent: C.tealLight,
            },
            {
              num: "02",
              kicker: "CREATORS",
              title: "YOUR CHARACTER, EVERY GAME",
              desc: "Every character generated in the Studio ships with our motion foundation model baked in. That character moves correctly in every game on Zinara — no rigging, no manual setup, no per-game work.",
              ctaText: "How rigging works →",
              ctaHref: "/architecture",
              ctaExternal: false,
              accent: C.purpleLight,
            },
            {
              num: "03",
              kicker: "DEVELOPERS",
              title: "BUILD. SHIP. EARN 92%.",
              desc: "Fork the Zinara engine. Build motion-controlled games on a Godot-based stack with the foundation model wired in. Fine-tune the model with your own animations. Publish to the Zinara app and keep 92% of every sale.",
              ctaText: "Developer details below ↓",
              ctaHref: "#developers",
              ctaExternal: false,
              accent: C.tealLight,
            },
          ].map(({ num, kicker, title, desc, ctaText, ctaHref, ctaExternal, accent }, i) => (
            <ScrollReveal key={num} delay={i * 0.1}>
              <div style={{
                background: C.bgCard,
                border: `1px solid ${C.glass}`,
                borderRadius: "16px",
                padding: "36px 28px",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                backdropFilter: "blur(8px)",
                transition: "all 0.3s",
                display: "flex", flexDirection: "column",
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = accent === C.tealLight ? C.teal : C.purple;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 20px 60px ${accent}20`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = C.glass;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <div style={{
                  position: "absolute", top: "-16px", right: "-4px",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "100px", fontWeight: 900,
                  color: C.glass, lineHeight: 1,
                }}>{num}</div>

                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px", color: accent,
                  letterSpacing: "3px", textTransform: "uppercase",
                  marginBottom: "12px", position: "relative", zIndex: 1,
                }}>{kicker}</div>

                <h3 style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "20px", fontWeight: 800,
                  color: C.white, letterSpacing: "1px",
                  marginBottom: "16px", position: "relative", zIndex: 1,
                  lineHeight: 1.2,
                }}>{title}</h3>

                <p style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "13px", color: C.muted,
                  lineHeight: 1.75, position: "relative", zIndex: 1,
                  flex: 1, marginBottom: "20px",
                }}>{desc}</p>

                {ctaExternal ? (
                  <a href={ctaHref} target="_blank" rel="noopener noreferrer"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "12px", color: accent,
                      textDecoration: "none", letterSpacing: "1px",
                      position: "relative", zIndex: 1,
                    }}
                  >{ctaText}</a>
                ) : (
                  <Link to={ctaHref} style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "12px", color: accent,
                    textDecoration: "none", letterSpacing: "1px",
                    position: "relative", zIndex: 1,
                  }}>{ctaText}</Link>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}


// ─── THE LOOP — how value flows between the three sides ───────────────────

function TheLoop() {
  return (
    <ScrollReveal>
      <div style={{ marginBottom: "100px" }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px", color: C.teal,
          letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px",
        }}>// THE LOOP</div>

        <h2 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 800, color: C.white,
          margin: "0 0 40px 0", lineHeight: 1.1,
        }}>
          HOW VALUE FLOWS
        </h2>

        <div style={{
          background: C.bgCard,
          border: `1px solid ${C.glass}`,
          borderRadius: "16px",
          padding: "40px 32px",
          backdropFilter: "blur(8px)",
        }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "14px", color: C.white,
            lineHeight: 1.9,
          }}>
            <LoopStep
              num="1"
              text={<>A <span style={{ color: C.tealLight }}>player</span> generates a character from a photo (one-time, $0.50 at launch). Character is theirs forever.</>}
            />
            <LoopStep
              num="2"
              text={<>That character ships pre-rigged with the Zinara foundation model — it can move in <strong style={{ color: C.white }}>any</strong> Zinara-built game out of the box.</>}
            />
            <LoopStep
              num="3"
              text={<>A <span style={{ color: C.purpleLight }}>developer</span> builds a game on the Zinara engine (forked Godot, foundation model wired in). They fine-tune the model with their own animations to nail the style of their game.</>}
            />
            <LoopStep
              num="4"
              text={<>Developer publishes to the Zinara app. Players browse the library. They click a game and play it as their character — <span style={{ color: C.tealLight }}>using their body as the controller</span>.</>}
            />
            <LoopStep
              num="5"
              text={<>Players buy games or in-game items with ZCoin (purchased separately). Developers receive <strong style={{ color: C.tealLight }}>92%</strong> of every sale.</>}
            />
            <LoopStep
              num="6"
              text={<>More players → more reasons for devs to ship → more games → more reasons for players to download. The platform compounds.</>}
              last
            />
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

function LoopStep({ num, text, last }) {
  return (
    <div style={{
      display: "flex", gap: "16px",
      paddingBottom: last ? 0 : "16px",
      marginBottom: last ? 0 : "16px",
      borderBottom: last ? "none" : `1px solid ${C.glass}`,
      alignItems: "flex-start",
    }}>
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "18px", fontWeight: 800,
        color: C.tealLight,
        flexShrink: 0,
        minWidth: "24px",
        lineHeight: 1.4,
      }}>{num}</div>
      <div style={{ color: C.white }}>{text}</div>
    </div>
  );
}


// ─── DEVELOPER DEEP DIVE ──────────────────────────────────────────────────

function DeveloperSection() {
  return (
    <ScrollReveal>
      <div id="developers" style={{ marginBottom: "100px" }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px", color: C.purple,
          letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px",
        }}>// FOR DEVELOPERS</div>

        <h2 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 800, color: C.white,
          margin: "0 0 16px 0", lineHeight: 1.1,
        }}>
          BUILD ON THE ENGINE.<br />
          <span style={{ color: C.tealLight }}>KEEP 92%.</span>
        </h2>

        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "14px", color: C.muted,
          maxWidth: "700px", lineHeight: 1.75,
          marginBottom: "48px",
        }}>
          The Zinara engine is a fork of Godot with our motion foundation model
          integrated at the engine level. If you know GDScript, you can build
          games where the player's body is the controller — without writing any
          ML code.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}>
          {[
            {
              kicker: "ENGINE",
              title: "FORK OF GODOT",
              desc: "Open-source foundation. GDScript and C# supported. Use the editor you already know, with our motion runtime baked in.",
            },
            {
              kicker: "FOUNDATION MODEL",
              title: "MOTION OUT OF THE BOX",
              desc: "Every character moves correctly day one. 4.27° average rotational error. 60 FPS, local inference, no cloud calls.",
            },
            {
              kicker: "FINE-TUNING",
              title: "TUNE TO YOUR STYLE",
              desc: "Provide your own animation set — fighting moves, dance routines, parkour — and fine-tune the foundation model so characters move the way your game needs them to.",
            },
            {
              kicker: "DISTRIBUTION",
              title: "PUBLISH TO ZINARA",
              desc: "Ship your game inside the Zinara app. Players already have characters. You don't need to acquire users — they're here for the platform.",
            },
            {
              kicker: "ECONOMICS",
              title: "92% TO YOU",
              desc: "Sell your game outright or charge ZCoin for in-game items. Zinara takes 8%. We're the platform — your work is the value.",
            },
            {
              kicker: "INTEGRATION",
              title: "ANY CHARACTER, ANY GAME",
              desc: "Players bring the characters they've already generated. You build the gameplay. Zinara handles the rigging, the tracking, the runtime.",
            },
          ].map(({ kicker, title, desc }, i) => (
            <ScrollReveal key={kicker} delay={i * 0.05}>
              <div style={{
                background: C.bgCard,
                border: `1px solid ${C.glass}`,
                borderRadius: "12px",
                padding: "24px",
                height: "100%",
                backdropFilter: "blur(6px)",
                transition: "all 0.3s",
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = C.purple;
                e.currentTarget.style.boxShadow = `0 10px 40px ${C.purple}15`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = C.glass;
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px", color: C.purple,
                  letterSpacing: "3px", textTransform: "uppercase",
                  marginBottom: "8px",
                }}>{kicker}</div>
                <h4 style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "15px", fontWeight: 800,
                  color: C.white, letterSpacing: "1px",
                  marginBottom: "12px",
                }}>{title}</h4>
                <p style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "12px", color: C.muted,
                  lineHeight: 1.7,
                }}>{desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}


// ─── ECONOMICS ────────────────────────────────────────────────────────────

function Economics() {
  return (
    <ScrollReveal>
      <div style={{ marginBottom: "100px" }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px", color: C.teal,
          letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px",
        }}>// ECONOMICS</div>

        <h2 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 800, color: C.white,
          margin: "0 0 40px 0", lineHeight: 1.1,
        }}>
          HOW MONEY MOVES
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}>
          {[
            { label: "CHARACTER GEN", value: "$0.50", sub: "Per character at launch ($1 after Kickstarter)" },
            { label: "DEV SHARE",     value: "92%",   sub: "Of every game / in-game sale" },
            { label: "PLATFORM",      value: "8%",    sub: "Zinara's cut to run the platform" },
            { label: "ZCOIN PACKS",   value: "$5+",   sub: "100 / 250 / 700 coin bundles" },
          ].map(({ label, value, sub }, i) => (
            <ScrollReveal key={label} delay={i * 0.08}>
              <div style={{
                background: C.bgCard,
                border: `1px solid ${C.glass}`,
                borderRadius: "12px",
                padding: "24px 20px",
                textAlign: "center",
                backdropFilter: "blur(6px)",
                transition: "all 0.3s",
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = C.teal;
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = C.glass;
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
                  fontSize: "32px", fontWeight: 800,
                  background: C.gradPurpleTeal,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "6px",
                }}>{value}</div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px", color: C.muted,
                  lineHeight: 1.5,
                }}>{sub}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ZCoinPacks />
      </div>
    </ScrollReveal>
  );
}


function ZCoinPacks() {
  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.glass}`,
      borderRadius: "12px",
      padding: "28px",
      backdropFilter: "blur(6px)",
    }}>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "11px", color: C.purpleLight,
        letterSpacing: "3px", textTransform: "uppercase",
        marginBottom: "16px",
      }}>// ZCOIN — IN-PLATFORM CURRENCY</div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px",
      }}>
        {[
          { price: "$5",  coins: "100",  bonus: null,        label: "STARTER" },
          { price: "$10", coins: "250",  bonus: "+25 bonus", label: "STANDARD" },
          { price: "$25", coins: "700",  bonus: "+200 bonus", label: "BEST VALUE" },
        ].map(({ price, coins, bonus, label }) => (
          <div key={price} style={{
            padding: "20px 16px",
            background: "rgba(10,10,20,0.6)",
            border: `1px solid ${C.glass}`,
            borderRadius: "8px",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px", color: C.muted,
              letterSpacing: "2px", marginBottom: "8px",
            }}>{label}</div>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "24px", fontWeight: 800,
              color: C.white, marginBottom: "4px",
            }}>{price}</div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "14px", color: C.tealLight,
            }}>{coins} ZC</div>
            {bonus && (
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px", color: C.purpleLight,
                marginTop: "6px",
              }}>{bonus}</div>
            )}
          </div>
        ))}
      </div>

      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "11px", color: C.muted,
        marginTop: "16px", lineHeight: 1.6,
      }}>
        ZCoin is the in-platform currency for buying games, in-game items,
        cosmetics, and developer-published content. Developers earn ZCoin from
        sales and can convert it to USD at standard payout intervals.
      </p>
    </div>
  );
}


// ─── LIVE VS ROADMAP ──────────────────────────────────────────────────────

function LiveVsRoadmap() {
  const live = [
    "Web Studio — photo → 3D character generation",
    "Mac app with mirror mode (real-time body tracking)",
    "Motion foundation model (4.27° avg error)",
    "Auto-rigging service (MIA → 22-bone Mixamo skeleton)",
    "Self-hosted backend (Hetzner + R2 + Docker)",
    "Free public Mac beta download",
  ];

  const roadmap = [
    "Custom Godot fork — public dev access",
    "Game library inside the Mac app",
    "Developer SDK + publishing flow",
    "ZCoin economy + payouts",
    "Vora — first-party flagship fighting game",
    "Foundation model fine-tuning for developers",
    "Windows support",
    "Multiplayer infrastructure",
  ];

  return (
    <ScrollReveal>
      <div style={{ marginBottom: "100px" }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px", color: C.purple,
          letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px",
        }}>// HONEST STATUS</div>

        <h2 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 800, color: C.white,
          margin: "0 0 40px 0", lineHeight: 1.1,
        }}>
          WHAT'S LIVE.<br />
          <span style={{ color: C.tealLight }}>WHAT'S COMING.</span>
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}>
          <StatusColumn
            kicker="LIVE TODAY"
            kickerColor={C.tealLight}
            borderAccent={C.teal}
            items={live}
            checkIcon="✓"
          />
          <StatusColumn
            kicker="ROADMAP"
            kickerColor={C.purpleLight}
            borderAccent={C.purple}
            items={roadmap}
            checkIcon="○"
          />
        </div>

        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "12px", color: C.muted,
          marginTop: "24px", lineHeight: 1.7,
          fontStyle: "italic",
        }}>
          Built solo. Roadmap moves in order of leverage — most of the live
          features were built alongside the foundation model, so what ships next
          builds on the same foundation.
        </p>
      </div>
    </ScrollReveal>
  );
}


function StatusColumn({ kicker, kickerColor, borderAccent, items, checkIcon }) {
  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.glass}`,
      borderRadius: "12px",
      padding: "28px 24px",
      backdropFilter: "blur(6px)",
    }}>
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "13px", fontWeight: 800,
        color: kickerColor, letterSpacing: "3px",
        marginBottom: "20px",
        paddingBottom: "12px",
        borderBottom: `1px solid ${borderAccent}40`,
      }}>{kicker}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {items.map((item) => (
          <div key={item} style={{
            display: "flex", gap: "12px", alignItems: "flex-start",
          }}>
            <span style={{
              color: borderAccent, fontSize: "14px",
              flexShrink: 0,
              filter: `drop-shadow(0 0 4px ${borderAccent})`,
              minWidth: "16px",
            }}>{checkIcon}</span>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "13px", color: C.white,
              lineHeight: 1.6,
            }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── PLATFORM CTA ─────────────────────────────────────────────────────────

function PlatformCTA() {
  return (
    <ScrollReveal>
      <div style={{
        background: C.bgCard,
        border: `1px solid ${C.glass}`,
        borderRadius: "16px",
        padding: "48px 40px",
        backdropFilter: "blur(8px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <Nebula color={C.purple} size={400} top="50%" left="50%" opacity={0.06} />

        <h3 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(24px, 3.5vw, 36px)",
          fontWeight: 800, color: C.white,
          marginBottom: "16px", lineHeight: 1.2,
          position: "relative", zIndex: 1,
        }}>
          PLAY IT. <span style={{ color: C.purpleLight }}>OR BUILD ON IT.</span>
        </h3>

        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "14px", color: C.muted,
          marginBottom: "32px", lineHeight: 1.7,
          maxWidth: "560px", margin: "0 auto 32px",
          position: "relative", zIndex: 1,
        }}>
          Generate your character in the browser. Download the Mac app to play.
          Building a motion game? Reach out — early developers get the engine
          access first.
        </p>

        <div style={{
          display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap",
          position: "relative", zIndex: 1,
        }}>
          <a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" style={{
            background: "transparent",
            border: `2px solid ${C.teal}`,
            borderRadius: "8px",
            padding: "14px 28px", color: C.tealLight,
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "12px", fontWeight: 700,
            letterSpacing: "2px", textDecoration: "none",
            textTransform: "uppercase",
            transition: "all 0.2s",
          }}
          onMouseOver={e => { e.currentTarget.style.background = `${C.teal}20`; }}
          onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
          >✦ Try Studio</a>

          <a href={DOWNLOAD_URL} style={{
            background: C.gradPurpleTeal,
            border: "none", borderRadius: "8px",
            padding: "14px 32px", color: "#fff",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "12px", fontWeight: 700,
            letterSpacing: "2px", textDecoration: "none",
            textTransform: "uppercase",
            boxShadow: `0 0 30px ${C.purple}50`,
            transition: "all 0.2s",
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.boxShadow = `0 0 50px ${C.purple}70`;
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0 0 30px ${C.purple}50`;
          }}
          >⬇ Download Mac</a>

          <a href="mailto:jonathan.cruz@zinara.gg?subject=Zinara%20Developer%20Access" style={{
            background: "transparent",
            border: `2px solid ${C.purple}`,
            borderRadius: "8px",
            padding: "14px 28px", color: C.purpleLight,
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "12px", fontWeight: 700,
            letterSpacing: "2px", textDecoration: "none",
            textTransform: "uppercase",
            transition: "all 0.2s",
          }}
          onMouseOver={e => { e.currentTarget.style.background = `${C.purple}20`; }}
          onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
          >✎ Dev Access</a>
        </div>
      </div>
    </ScrollReveal>
  );
}
