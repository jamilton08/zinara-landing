import { Link } from "react-router-dom";
import { C, DOWNLOAD_URL, STUDIO_URL, CONTACT_EMAIL, APP_VERSION } from "../tokens";

export default function Footer() {
  return (
    <footer style={{
      background: C.bg,
      borderTop: `1px solid ${C.glass}`,
      padding: "60px 40px 32px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.4fr repeat(3, 1fr)",
          gap: "40px",
          marginBottom: "48px",
          alignItems: "flex-start",
        }}>
          <div>
            <Link to="/" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              marginBottom: "16px", textDecoration: "none",
            }}>
              <img
                src="/zinara-icon.png"
                alt="Zinara"
                style={{
                  width: 36, height: 36, borderRadius: "8px",
                  objectFit: "cover",
                  display: "block",
                  boxShadow: `0 0 14px ${C.purple}30`,
                }}
              />
              <span style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "20px", fontWeight: 700,
                background: C.gradPurpleTeal,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "3px",
              }}>ZINARA</span>
            </Link>
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px", color: C.muted,
              lineHeight: 1.7, maxWidth: "280px",
            }}>
              Motion as the next standard computer input. Starting with gaming. Built solo, in the Bronx.
            </p>
          </div>

          <FooterColumn title="PRODUCT" links={[
            { label: "Try Studio",   to: STUDIO_URL,   external: true },
            { label: "Download Mac", to: DOWNLOAD_URL, external: true },
            { label: "How It Works", to: "/architecture" },
            { label: "Watch Demo",   to: "/demo" },
          ]} />

          <FooterColumn title="COMPANY" links={[
            { label: "About",   to: "/about" },
            { label: "Contact", to: `mailto:${CONTACT_EMAIL}`, external: true },
          ]} />

          <FooterColumn title="CONNECT" links={[
            { label: CONTACT_EMAIL, to: `mailto:${CONTACT_EMAIL}`, external: true },
            { label: "Twitter / X", to: "https://twitter.com/zinaragg",       external: true },
            { label: "GitHub",      to: "https://github.com/zinara",          external: true },
          ]} />
        </div>

        <div style={{
          paddingTop: "24px",
          borderTop: `1px solid ${C.glass}`,
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "12px",
        }}>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px", color: C.muted,
          }}>© 2026 Zinara. Built by Jonathan Cruz in the Bronx, NY.</span>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px", color: C.muted,
            letterSpacing: "1px",
          }}>v{APP_VERSION} · MOTION IS THE INPUT</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "11px", color: C.tealLight,
        letterSpacing: "3px", marginBottom: "16px",
      }}>{title}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {links.map(({ label, to, external }) => (
          <li key={label} style={{ marginBottom: "10px" }}>
            {external ? (
              <a href={to} style={linkStyle}
                 target={to.startsWith("http") ? "_blank" : undefined}
                 rel={to.startsWith("http") ? "noopener noreferrer" : undefined}
                 onMouseOver={e => e.target.style.color = C.tealLight}
                 onMouseOut={e => e.target.style.color = C.muted}>
                {label}
              </a>
            ) : (
              <Link to={to} style={linkStyle}
                 onMouseOver={e => e.target.style.color = C.tealLight}
                 onMouseOut={e => e.target.style.color = C.muted}>
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const linkStyle = {
  fontFamily: "'Space Mono', monospace",
  fontSize: "12px", color: C.muted,
  textDecoration: "none",
  transition: "color 0.2s",
};