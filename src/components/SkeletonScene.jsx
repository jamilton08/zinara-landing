import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── 3D SCENE: FLOATING SKELETON (with optional MoveNet mirror) ───
// Preserved byte-for-byte from the original ZinaraLanding.jsx.
// poseRef is optional — if undefined, runs procedural walk-cycle.
export default function SkeletonScene({ poseRef }) {
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
    const SMOOTH = 0.25;
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

        skeleton.position.x += (0 - skeleton.position.x) * 0.1;
        skeleton.rotation.y += (0 - skeleton.rotation.y) * 0.1;
      } else {
        // ─── PROCEDURAL MODE: walk-cycle ───
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }} />;
}
