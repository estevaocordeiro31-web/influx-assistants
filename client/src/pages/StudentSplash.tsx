/**
 * StudentSplash — ImAInd splash screen with MP4 video background
 * Plays the splash video (8s, 1280x720 H.264) then auto-navigates.
 * Dark video is used by default; light version stored for future theme support.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import "@/styles/tutor-theme.css";

const SPLASH_DARK_SRC = "/videos/splash-dark.mp4";
const FADE_DURATION_MS = 1000;
const VIDEO_DURATION_MS = 8000;

export default function StudentSplash() {
  const [, navigate] = useLocation();
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const navTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const navigateToNext = useCallback(() => {
    const onboarded = localStorage.getItem("imaind_student_onboarded");
    navigate(onboarded ? "/student/home" : "/student/onboarding");
  }, [navigate]);

  const startFadeAndNavigate = useCallback(() => {
    setFading(true);
    navTimerRef.current = setTimeout(() => {
      navigateToNext();
    }, FADE_DURATION_MS);
  }, [navigateToNext]);

  useEffect(() => {
    fadeTimerRef.current = setTimeout(() => {
      startFadeAndNavigate();
    }, VIDEO_DURATION_MS - FADE_DURATION_MS);

    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, [startFadeAndNavigate]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || fading) return;
    if (video.duration - video.currentTime <= 1) {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      startFadeAndNavigate();
    }
  }, [fading, startFadeAndNavigate]);

  const handleEnded = useCallback(() => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    navigateToNext();
  }, [navigateToNext]);

  return (
    <div
      className="tutor-app"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0c1222",
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_DURATION_MS}ms ease-out`,
      }}
    >
      <video
        ref={videoRef}
        src={SPLASH_DARK_SRC}
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
          transform: "translate(-50%, -50%)",
          objectFit: "cover",
        }}
      />

      {/* Logo overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          zIndex: 10,
          opacity: fading ? 0 : 1,
          transition: `opacity ${FADE_DURATION_MS}ms ease-out`,
        }}
      >
        <img
          src="/influx-logo.png"
          alt="inFlux"
          style={{ height: 36, objectFit: "contain", opacity: 0.7 }}
        />
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.1em",
          }}
        >
          powered by Im<span style={{ color: "var(--imaind-blue-light, #4da8ff)" }}>AI</span>nd
        </span>
      </div>
    </div>
  );
}
