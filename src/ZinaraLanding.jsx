import { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { useMoveNet } from "./useMoveNet";

// ─── BRAND TOKENS ───
const C = {
  bg: "#0a0a0f",
  bgCard: "rgba(255,255,255,0.03)",
  purple: "#9333ea",
  purpleLight: "#c084fc",
  teal: "#14b8a6",
  tealLight: "#5eead4",
  white: "#f8fafc",
  muted: "#94a3b8",
  glass: "rgba(255,255,255,0.06)",
  gradPurpleTeal: "linear-gradient(135deg, #9333ea 0%, #14b8a6 100%)",
  gradDark: "linear-gradient(180deg, #0a0a0f 0%, #0f0a1a 50%, #0a0f14 100%)",
};

// ─── 3D SCENE: FLOATING SKELETON (with optional MoveNet mirror) ───
function SkeletonScene({ poseRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0.5, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x9333ea, 0.4);
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0x14b8a6, 2, 20);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0x9333ea, 2, 20);
    pointLight2.position.set(-3, -1, 2);
    scene.add(pointLight2);

    // Materials
    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      emissive: 0x14b8a6,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
    });
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 0.3,
      metalness: 0.5,
      roughness: 0.3,
    });

    const skeleton = new THREE.Group();
    const joints = [];
    const bones = [];

    function addJoint(x, y, z, size = 0.1) {
      const geo = new THREE.SphereGeometry(size, 16, 16);
      const mesh = new THREE.Mesh(geo, jointMat);
      mesh.position.set(x, y, z);
      skeleton.add(mesh);
      joints.push(mesh);
      return mesh;
    }

    function addBone(from, to) {
      const geo = new THREE.CylinderGeometry(0.025, 0.025, 1, 8);
      const mesh = new THREE.Mesh(geo, boneMat);
      skeleton.add(mesh);
      bones.push({ mesh, from, to });
      return mesh;
    }

    function updateBones() {
      const up = new THREE.Vector3(0, 1, 0);
      for (const { mesh, from, to } of bones) {
        const dir = new THREE.Vector3().subVectors(to.position, from.position);
        const len = dir.length();
        mesh.scale.set(1, len, 1);
        const mid = new THREE.Vector3().addVectors(from.position, to.position).multiplyScalar(0.5);
        mesh.position.copy(mid);
        const axis = new THREE.Vector3().crossVectors(up, dir.clone().normalize()).normalize();
        const angle = Math.acos(Math.min(1, Math.max(-1, up.dot(dir.clone().normalize()))));
        if (axis.length() > 0.001) {
          mesh.quaternion.setFromAxisAngle(axis, angle);
        } else {
          mesh.quaternion.identity();
          if (dir.y < 0) mesh.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
        }
      }
    }

    // Body joints
    const head = addJoint(0, 2.2, 0, 0.15);
    const neck = addJoint(0, 1.8, 0, 0.07);
    const lShoulder = addJoint(-0.5, 1.7, 0);
    const rShoulder = addJoint(0.5, 1.7, 0);
    const lElbow = addJoint(-0.9, 1.2, 0);
    const rElbow = addJoint(0.9, 1.2, 0);
    const lHand = addJoint(-1.2, 0.8, 0, 0.08);
    const rHand = addJoint(1.3, 1.5, 0.1, 0.08);
    const spine = addJoint(0, 1.2, 0, 0.07);
    const hip = addJoint(0, 0.8, 0, 0.08);
    const lHip = addJoint(-0.25, 0.7, 0);
    const rHip = addJoint(0.25, 0.7, 0);
    const lKnee = addJoint(-0.3, 0.1, 0.1);
    const rKnee = addJoint(0.3, 0.1, 0.1);
    const lFoot = addJoint(-0.35, -0.5, 0, 0.07);
    const rFoot = addJoint(0.35, -0.5, 0, 0.07);

    // Bones
    addBone(head, neck);
    addBone(neck, lShoulder);
    addBone(neck, rShoulder);
    addBone(lShoulder, lElbow);
    addBone(rShoulder, rElbow);
    addBone(lElbow, lHand);
    addBone(rElbow, rHand);
    addBone(neck, spine);
    addBone(spine, hip);
    addBone(hip, lHip);
    addBone(hip, rHip);
    addBone(lHip, lKnee);
    addBone(rHip, rKnee);
    addBone(lKnee, lFoot);
    addBone(rKnee, rFoot);

    // Glow rings
    const ringGeo = new THREE.TorusGeometry(2.2, 0.01, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x9333ea, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat2);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.3;
    scene.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.008, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0.2 })
    );
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 0.3;
    scene.add(ring2);

    // Orbiting nexus orbs
    const orbiterCount = 6;
    const orbiters = [];
    const orbiterMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6, emissive: 0x14b8a6, emissiveIntensity: 0.8,
      metalness: 0.9, roughness: 0.1,
    });
    for (let i = 0; i < orbiterCount; i++) {
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), orbiterMat);
      scene.add(orb);
      orbiters.push({
        mesh: orb,
        radius: 1.6 + Math.random() * 1.0,
        speed: 0.4 + Math.random() * 0.6,
        phase: (i / orbiterCount) * Math.PI * 2,
        yOffset: (Math.random() - 0.5) * 1.5,
        tilt: Math.random() * 0.5,
      });
    }

    // Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 6;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x14b8a6,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    skeleton.position.y = -0.5;
    scene.add(skeleton);

    // Smoothing helper for MoveNet mode
    const SMOOTH = 0.25; // higher = snappier, lower = smoother
    const lerpTo = (joint, target) => {
      if (!target) return;
      joint.position.x += (target.x - joint.position.x) * SMOOTH;
      joint.position.y += (target.y - joint.position.y) * SMOOTH;
      joint.position.z += (target.z - joint.position.z) * SMOOTH;
    };

    let animId;
    const walkSpeed = 0.8;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      const pose = poseRef?.current;

      if (pose) {
        // ─── MIRROR MODE: drive joints from MoveNet ───
        lerpTo(lShoulder, pose.lShoulder);
        lerpTo(rShoulder, pose.rShoulder);
        lerpTo(lElbow,    pose.lElbow);
        lerpTo(rElbow,    pose.rElbow);
        lerpTo(lHand,     pose.lWrist);
        lerpTo(rHand,     pose.rWrist);
        lerpTo(lHip,      pose.lHip);
        lerpTo(rHip,      pose.rHip);
        lerpTo(lKnee,     pose.lKnee);
        lerpTo(rKnee,     pose.rKnee);
        lerpTo(lFoot,     pose.lAnkle);
        lerpTo(rFoot,     pose.rAnkle);

        // Derived joints (neck, head, hip center, spine)
        if (pose.lShoulder && pose.rShoulder) {
          lerpTo(neck, {
            x: (pose.lShoulder.x + pose.rShoulder.x) / 2,
            y: (pose.lShoulder.y + pose.rShoulder.y) / 2 + 0.1,
            z: 0,
          });
          if (pose.nose) {
            lerpTo(head, { x: pose.nose.x, y: pose.nose.y + 0.1, z: 0 });
          }
        }
        if (pose.lHip && pose.rHip) {
          const hipMid = {
            x: (pose.lHip.x + pose.rHip.x) / 2,
            y: (pose.lHip.y + pose.rHip.y) / 2,
            z: 0,
          };
          lerpTo(hip, hipMid);
          if (pose.lShoulder && pose.rShoulder) {
            lerpTo(spine, {
              x: hipMid.x,
              y: (hipMid.y + (pose.lShoulder.y + pose.rShoulder.y) / 2) / 2,
              z: 0,
            });
          }
        }

        // Stop walking motion, center the skeleton
        skeleton.position.x += (0 - skeleton.position.x) * 0.1;
        skeleton.rotation.y += (0 - skeleton.rotation.y) * 0.1;
      } else {
        // ─── PROCEDURAL MODE: original walk-cycle animation ───
        const walkX = Math.sin(t * walkSpeed * 0.3) * 2.0;
        skeleton.position.x = walkX;
        const walkDir = Math.cos(t * walkSpeed * 0.3);
        skeleton.rotation.y = walkDir > 0 ? 0.15 : -0.15;

        const stride = Math.sin(t * walkSpeed * 2.5);
        const strideHalf = Math.cos(t * walkSpeed * 2.5);

        lHip.position.z = stride * 0.15;
        rHip.position.z = -stride * 0.15;

        lKnee.position.z = 0.1 + stride * 0.2;
        lKnee.position.y = 0.1 - Math.abs(stride) * 0.08;
        rKnee.position.z = 0.1 - stride * 0.2;
        rKnee.position.y = 0.1 - Math.abs(strideHalf) * 0.08;

        lFoot.position.z = stride * 0.25;
        lFoot.position.y = -0.5 + Math.max(0, stride) * 0.12;
        rFoot.position.z = -stride * 0.25;
        rFoot.position.y = -0.5 + Math.max(0, -stride) * 0.12;

        lElbow.position.z = -stride * 0.12;
        rElbow.position.z = stride * 0.12;

        hip.position.y = 0.8 + Math.abs(Math.sin(t * walkSpeed * 5)) * 0.03;
        spine.position.y = 1.2 + Math.abs(Math.sin(t * walkSpeed * 5)) * 0.03;

        rHand.position.x = 1.3 + Math.sin(t * 2) * 0.15;
        rHand.position.y = 1.5 + Math.cos(t * 3) * 0.1;
        rElbow.position.x = 0.9 + Math.sin(t * 2) * 0.05;
        lHand.position.y = 0.8 + Math.sin(t * 1.5) * 0.05;
      }

      updateBones();

      // Rings — follow the skeleton
      ring.rotation.z = t * 0.3;
      ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.4) * 0.2;
      ring.position.x = skeleton.position.x;
      ring2.rotation.z = -t * 0.2;
      ring2.rotation.x = Math.PI / 2 + Math.cos(t * 0.3) * 0.15;
      ring2.position.x = skeleton.position.x;

      for (const orb of orbiters) {
        const a = t * orb.speed + orb.phase;
        orb.mesh.position.x = skeleton.position.x + Math.cos(a) * orb.radius;
        orb.mesh.position.z = Math.sin(a) * orb.radius * 0.6;
        orb.mesh.position.y = 0.3 + orb.yOffset + Math.sin(a * 1.5 + orb.phase) * 0.3;
      }

      particles.rotation.y = t * 0.05;
      pointLight1.position.x = Math.sin(t * 0.7) * 4;
      pointLight2.position.x = Math.cos(t * 0.5) * 3;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // poseRef is a ref — stable identity, safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }} />;
}


// ─── ANIMATED GRID BG ───
function GridBg() {
  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden", opacity: 0.08, pointerEvents: "none",
    }}>
      <div style={{
        width: "200%", height: "200%",
        backgroundImage: `
          linear-gradient(${C.purple}40 1px, transparent 1px),
          linear-gradient(90deg, ${C.purple}40 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        transform: "perspective(500px) rotateX(60deg) translateY(-50%)",
        transformOrigin: "center center",
        animation: "gridMove 8s linear infinite",
      }} />
      <style>{`
        @keyframes gridMove {
          0% { transform: perspective(500px) rotateX(60deg) translateY(-50%); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(-42%); }
        }
      `}</style>
    </div>
  );
}

// ─── GLITCH TEXT ───
function GlitchText({ children, style }) {
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      <span style={{
        position: "absolute", top: 0, left: "2px", color: C.teal,
        opacity: 0.7, clipPath: "inset(0 0 50% 0)",
        animation: "glitch1 3s infinite",
      }}>{children}</span>
      <span style={{
        position: "absolute", top: 0, left: "-2px", color: C.purple,
        opacity: 0.7, clipPath: "inset(50% 0 0 0)",
        animation: "glitch2 3s infinite",
      }}>{children}</span>
      <style>{`
        @keyframes glitch1 {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(3px, -1px); }
          94% { transform: translate(-3px, 1px); }
        }
        @keyframes glitch2 {
          0%, 88%, 100% { transform: translate(0); }
          90% { transform: translate(-2px, 2px); }
          93% { transform: translate(2px, -1px); }
        }
      `}</style>
    </span>
  );
}

// ─── SCROLL REVEAL ───
function ScrollReveal({ children, delay = 0, direction = "up", style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const offsets = { up: "translateY(60px)", down: "translateY(-60px)", left: "translateX(-60px)", right: "translateX(60px)" };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translate(0)" : offsets[direction],
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── PERSISTENT STAR CANVAS ───
function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const stars = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
      if (stars.length === 0) {
        for (let i = 0; i < 300; i++) {
          stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.3,
            speed: Math.random() * 0.3 + 0.05,
            brightness: Math.random(),
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };
    resize();

    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;

      for (const s of stars) {
        const twinkle = 0.4 + 0.6 * Math.sin(t * s.speed * 2 + s.phase);
        const isTeal = s.brightness > 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = isTeal
          ? `rgba(20,184,166,${twinkle * 0.8})`
          : `rgba(147,51,234,${twinkle * 0.5})`;
        ctx.fill();

        // Glow on bright stars
        if (s.size > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
          g.addColorStop(0, isTeal ? `rgba(20,184,166,${twinkle * 0.15})` : `rgba(147,51,234,${twinkle * 0.12})`);
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.fill();
        }
      }
    };
    draw();

    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}

// ─── NEBULA GLOW ───
function Nebula({ color = C.purple, size = 500, top = "50%", left = "50%", opacity = 0.12 }) {
  return (
    <div style={{
      position: "absolute", top, left,
      transform: "translate(-50%, -50%)",
      width: `${size}px`, height: `${size}px`,
      background: `radial-gradient(circle, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
      pointerEvents: "none", zIndex: 0,
      animation: "nebulaPulse 6s ease-in-out infinite alternate",
    }} />
  );
}

// ─── FLOATING ORBS ───
function FloatingOrbs({ count = 5, color = C.teal }) {
  const orbs = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 4 + Math.random() * 8,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * -10,
    })), [count]);

  return (
    <>
      {orbs.map(o => (
        <div key={o.id} style={{
          position: "absolute",
          left: `${o.x}%`, top: `${o.y}%`,
          width: `${o.size}px`, height: `${o.size}px`,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 ${o.size * 2}px ${color}, 0 0 ${o.size * 4}px ${color}40`,
          animation: `floatOrb ${o.duration}s ease-in-out ${o.delay}s infinite alternate`,
          pointerEvents: "none", zIndex: 0, opacity: 0.6,
        }} />
      ))}
    </>
  );
}

// ─── SECTION DIVIDER (energy line) ───
function SectionDivider({ color = C.purple }) {
  return (
    <div style={{
      position: "relative", height: "2px", overflow: "visible",
      background: `linear-gradient(90deg, transparent 0%, ${color}60 50%, transparent 100%)`,
    }}>
      <div style={{
        position: "absolute", top: "-20px", left: 0, right: 0, height: "40px",
        background: `linear-gradient(180deg, transparent, ${color}08, transparent)`,
        pointerEvents: "none",
      }} />
    </div>
  );
}
// ─── NAV ───
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "16px 40px",
      background: scrolled ? "rgba(10,10,15,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.glass}` : "none",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "8px",
          background: C.gradPurpleTeal,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", fontWeight: 900, color: "#fff",
          fontFamily: "'Orbitron', sans-serif",
        }}>Z</div>
        <span style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "20px", fontWeight: 700,
          background: C.gradPurpleTeal,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "3px",
        }}>ZINARA</span>
      </div>
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {["Vision", "Tech", "Develop", "Community"].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} style={{
            color: C.muted, textDecoration: "none",
            fontFamily: "'Space Mono', monospace",
            fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase",
            transition: "color 0.2s",
          }}
          onMouseOver={e => e.target.style.color = C.tealLight}
          onMouseOut={e => e.target.style.color = C.muted}
          >{item}</a>
        ))}
        <button style={{
          background: C.gradPurpleTeal,
          border: "none", borderRadius: "6px",
          padding: "10px 24px", color: "#fff",
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "12px", fontWeight: 700,
          letterSpacing: "2px", cursor: "pointer",
          textTransform: "uppercase",
        }}>Join Waitlist</button>
      </div>
    </nav>
  );
}

// ─── HERO (with MIRROR ME button) ───
function Hero() {
  const [visible, setVisible] = useState(false);
  const { state: mnState, error: mnError, start: startMirror, stop: stopMirror, poseRef } = useMoveNet();

  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const mirrorLabel =
    mnState === "loading" ? "LOADING MODEL…" :
    mnState === "active"  ? "■ STOP MIRROR"  :
    mnState === "error"   ? "▸ TRY AGAIN"    :
                            "▸ MIRROR ME";

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

      {/* Gradient overlays */}
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
          maxWidth: "560px", margin: "24px auto 28px",
          lineHeight: 1.7, letterSpacing: "0.5px",
        }}>
          No controllers. No buttons. Your body is the input.
          <br />
          AI-powered motion capture meets gaming at <span style={{ color: C.tealLight }}>$180</span>.
        </p>

        {/* MIRROR ME — live in-browser demo */}
        <div style={{ marginBottom: "32px" }}>
          <button
            onClick={onMirrorClick}
            disabled={mnState === "loading"}
            style={{
              background: mnState === "active" ? "transparent" : C.gradPurpleTeal,
              border: mnState === "active" ? `1px solid ${C.teal}` : "none",
              borderRadius: "8px",
              padding: "14px 36px",
              color: mnState === "active" ? C.tealLight : "#fff",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "13px", fontWeight: 700,
              letterSpacing: "3px",
              cursor: mnState === "loading" ? "wait" : "pointer",
              textTransform: "uppercase",
              boxShadow: mnState === "active" ? "none" : `0 0 40px ${C.teal}60`,
              transition: "all 0.2s",
              opacity: mnState === "loading" ? 0.7 : 1,
            }}
          >
            {mirrorLabel}
          </button>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px", color: C.muted,
            marginTop: "10px", letterSpacing: "1px",
          }}>
            {mnState === "active"
              ? "YOU ARE THE SKELETON — STEP BACK SO YOUR FULL BODY IS IN FRAME"
              : mnState === "error"
                ? (mnError || "Camera blocked — check permissions")
                : "USES YOUR WEBCAM • NOTHING LEAVES YOUR BROWSER"}
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            background: C.gradPurpleTeal,
            border: "none", borderRadius: "8px",
            padding: "16px 40px", color: "#fff",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "14px", fontWeight: 700,
            letterSpacing: "3px", cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: `0 0 40px ${C.purple}60`,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseOver={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = `0 0 60px ${C.purple}80`; }}
          onMouseOut={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = `0 0 40px ${C.purple}60`; }}
          >Pre-Order Now</button>

          <button style={{
            background: "transparent",
            border: `1px solid ${C.glass}`,
            borderRadius: "8px",
            padding: "16px 40px", color: C.white,
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "14px", fontWeight: 700,
            letterSpacing: "3px", cursor: "pointer",
            textTransform: "uppercase",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s",
          }}
          onMouseOver={e => { e.target.style.borderColor = C.teal; e.target.style.color = C.tealLight; }}
          onMouseOut={e => { e.target.style.borderColor = C.glass; e.target.style.color = C.white; }}
          >Watch Demo</button>
        </div>

        <div style={{
          marginTop: "60px",
          display: "flex", justifyContent: "center", gap: "48px",
        }}>
          {[
            { val: "$180", label: "Console Price" },
            { val: "6 TOPS", label: "AI Power" },
            { val: "30fps", label: "Motion Capture" },
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


// ─── VISION SECTION ───
function Vision() {
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

        {/* Cards 01 & 02 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}>
          {[
            {
              num: "01",
              title: "CAMERA SEES YOU",
              desc: "The Zinara camera tracks your body in real-time using AI pose estimation powered by a 6 TOPS neural processing unit.",
              icon: "◉",
            },
            {
              num: "02",
              title: "AI READS MOVEMENT",
              desc: "Every punch, kick, dodge, and jump is translated into game input at 30fps. No latency. No lag. Pure motion.",
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

        {/* Card 03 — featured with Kael character */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center",
          marginTop: "40px",
        }}>
          {/* Character image */}
          <ScrollReveal direction="left" delay={0.1}>
            <div style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
              {/* Glow behind character */}
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

          {/* Card 03 */}
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

// ─── TECH SPECS ───
function TechSpecs() {
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
            { label: "PROCESSOR", value: "RK3576", sub: "Octa-core 2.2GHz" },
            { label: "AI ENGINE", value: "6 TOPS", sub: "Neural Processing Unit" },
            { label: "GPU", value: "Mali-G52", sub: "Vulkan 1.1 / OpenGL ES 3.2" },
            { label: "MEMORY", value: "8GB", sub: "LPDDR5" },
            { label: "OUTPUT", value: "4K 120Hz", sub: "HDMI 2.1" },
            { label: "CAMERA", value: "AI Vision", sub: "MIPI-CSI 4-lane" },
            { label: "WIRELESS", value: "WiFi 6", sub: "Bluetooth 5.4" },
            { label: "PRICE", value: "$180", sub: "Console + Camera" },
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

// ─── DEVELOPER/MARKETPLACE SECTION ───
function DevSection() {
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
                Zinara runs on Godot — the open-source game engine. Build motion-controlled games, sell them on our marketplace, and earn from every download. Physical accessories welcome too.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  "Open-source SDK powered by Godot",
                  "Marketplace for games & physical accessories",
                  "Camera detects custom hardware props",
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

          {/* Code block visual */}
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

// ─── CTA / WAITLIST ───
function CTA() {
  const [email, setEmail] = useState("");

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
            Be the first to play. Join the waitlist for early access to the Zinata console and SDK.
          </p>

          <div style={{
            display: "flex", gap: "12px",
            maxWidth: "500px", margin: "0 auto",
          }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                flex: 1, padding: "16px 20px",
                background: C.bgCard,
                border: `1px solid ${C.glass}`,
                borderRadius: "8px",
                color: C.white,
                fontFamily: "'Space Mono', monospace",
                fontSize: "14px",
                outline: "none",
                backdropFilter: "blur(10px)",
              }}
            />
            <button style={{
              background: C.gradPurpleTeal,
              border: "none", borderRadius: "8px",
              padding: "16px 32px", color: "#fff",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "12px", fontWeight: 700,
              letterSpacing: "2px", cursor: "pointer",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              boxShadow: `0 0 30px ${C.purple}40`,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = `0 0 50px ${C.purple}60`; }}
            onMouseOut={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = `0 0 30px ${C.purple}40`; }}
            >JOIN</button>
          </div>

          <div style={{
            marginTop: "60px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px", color: C.muted,
            letterSpacing: "1px",
          }}>
            LAUNCHING 2026 — NYC BORN — PLAY DIFFERENT
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

// ─── FOOTER ───
function Footer() {
  return (
    <footer style={{
      padding: "40px", background: C.bg,
      borderTop: `1px solid ${C.glass}`,
      display: "flex", justifyContent: "space-between",
      alignItems: "center",
    }}>
      <span style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "14px",
        background: C.gradPurpleTeal,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontWeight: 700, letterSpacing: "3px",
      }}>ZINArA</span>
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "11px", color: C.muted,
      }}>© 2026 Zinara Gaming Inc. All rights reserved.</span>
    </footer>
  );
}

// ─── MAIN APP ───
export default function ZinaraLanding() {
  return (
    <div style={{ background: C.gradDark, color: C.white, minHeight: "100vh", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
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
        <Hero />
        <SectionDivider color={C.purple} />
        <Vision />
        <SectionDivider color={C.teal} />
        <TechSpecs />
        <SectionDivider color={C.purple} />
        <DevSection />
        <SectionDivider color={C.teal} />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}