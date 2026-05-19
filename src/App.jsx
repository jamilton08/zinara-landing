import { Routes, Route } from "react-router-dom";
import { C } from "./tokens";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { StarCanvas } from "./components/Visuals";
import Landing from "./pages/Landing";
import Demo from "./pages/Demo";
import About from "./pages/About";
import Download from "./pages/Download";

export default function App() {
  return (
    <div style={{
      background: C.gradDark,
      color: C.white,
      minHeight: "100vh",
      position: "relative",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 80px; }
        body { overflow-x: hidden; }
        ::selection { background: ${C.purple}; color: white; }
        input::placeholder { color: ${C.muted}60; }
        @keyframes nebulaPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
        @keyframes floatOrb {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-40px) translateX(20px); opacity: 0.3; }
        }
      `}</style>

      <StarCanvas />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/about" element={<About />} />
          <Route path="/download" element={<Download />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}
