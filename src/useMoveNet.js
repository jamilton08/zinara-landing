// src/useMoveNet.js
// Lazy-loads TF.js + MoveNet on user gesture, streams normalized keypoints
// via a ref so consumers can read them inside requestAnimationFrame loops
// without re-rendering React on every frame.

import { useCallback, useEffect, useRef, useState } from "react";

export function useMoveNet() {
  // state: 'idle' | 'loading' | 'active' | 'error'
  const [state, setState] = useState("idle");
  const [error, setError] = useState(null);

  const poseRef = useRef(null);        // latest normalized keypoints (or null)
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const runningRef = useRef(false);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (detectorRef.current?.dispose) {
      try { detectorRef.current.dispose(); } catch {}
    }
    detectorRef.current = null;
    poseRef.current = null;
    setState("idle");
  }, []);

  const start = useCallback(async () => {
    if (state === "loading" || state === "active") return;
    setState("loading");
    setError(null);

    try {
      // 1. Camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;

      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      videoRef.current = video;

      await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve();
      });
      await video.play();

      // 2. Model (dynamic import so it's not in the initial bundle)
      const tf = await import("@tensorflow/tfjs-core");
      await import("@tensorflow/tfjs-backend-webgl");
      const poseDetection = await import("@tensorflow-models/pose-detection");
      await tf.ready();

      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType:
            poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING, // fastest
        }
      );
      detectorRef.current = detector;

      runningRef.current = true;
      setState("active");

      // 3. Detection loop
      const loop = async () => {
        if (!runningRef.current) return;
        try {
          const poses = await detector.estimatePoses(video, {
            flipHorizontal: true, // mirror, feels natural
          });
          if (poses.length > 0) {
            const normalized = normalizeKeypoints(
              poses[0].keypoints,
              video.videoWidth,
              video.videoHeight
            );
            if (normalized) poseRef.current = normalized;
          }
        } catch {
          // swallow single-frame errors
        }
        requestAnimationFrame(loop);
      };
      loop();
    } catch (e) {
      setError(e?.message || "Could not start camera");
      setState("error");
      stop();
    }
  }, [state, stop]);

  useEffect(() => {
    return () => {
      runningRef.current = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (detectorRef.current?.dispose) {
        try { detectorRef.current.dispose(); } catch {}
      }
    };
  }, []);

  return { state, error, start, stop, poseRef };
}

// MoveNet returns 17 keypoints in pixel coordinates. We center on the hip
// midpoint and scale by torso height, so the resulting coords live in the
// same ~1-unit-per-torso space as the existing procedural skeleton.
// MoveNet index order:
//   0 nose, 1 leftEye, 2 rightEye, 3 leftEar, 4 rightEar,
//   5 leftShoulder, 6 rightShoulder, 7 leftElbow, 8 rightElbow,
//   9 leftWrist, 10 rightWrist, 11 leftHip, 12 rightHip,
//   13 leftKnee, 14 rightKnee, 15 leftAnkle, 16 rightAnkle
function normalizeKeypoints(kp) {
  const lHip = kp[11], rHip = kp[12];
  const lSh = kp[5], rSh = kp[6];
  if (!lHip || !rHip || !lSh || !rSh) return null;
  if ((lHip.score ?? 0) < 0.3 || (rHip.score ?? 0) < 0.3) return null;

  const hipCx = (lHip.x + rHip.x) / 2;
  const hipCy = (lHip.y + rHip.y) / 2;
  const shCy = (lSh.y + rSh.y) / 2;
  const torsoPx = Math.max(60, Math.abs(shCy - hipCy));
  const s = 1.0 / torsoPx; // 1 torso ≈ 1 world unit

  // Shift so hip midpoint sits at (0, 0.8, 0) — same as the original skeleton.
  const to3D = (k) => {
    if (!k || (k.score ?? 0) < 0.2) return null;
    return {
      x: (k.x - hipCx) * s,
      y: -(k.y - hipCy) * s + 0.8,
      z: 0,
    };
  };

  return {
    nose:      to3D(kp[0]),
    lShoulder: to3D(kp[5]),
    rShoulder: to3D(kp[6]),
    lElbow:    to3D(kp[7]),
    rElbow:    to3D(kp[8]),
    lWrist:    to3D(kp[9]),
    rWrist:    to3D(kp[10]),
    lHip:      to3D(kp[11]),
    rHip:      to3D(kp[12]),
    lKnee:     to3D(kp[13]),
    rKnee:     to3D(kp[14]),
    lAnkle:    to3D(kp[15]),
    rAnkle:    to3D(kp[16]),
  };
}
