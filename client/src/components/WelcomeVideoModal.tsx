import { useEffect, useRef, useState } from "react";

const ELIE_WELCOME_VIDEO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/elie_welcome_mobile_2d5e9f8a.mp4";

const STORAGE_KEY = "influx_welcome_video_seen";

interface WelcomeVideoModalProps {
  onClose: () => void;
}

export function WelcomeVideoModal({ onClose }: WelcomeVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSkip, setShowSkip] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Mostrar botão pular após 2 segundos
    const timer = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setFadeOut(true);
    setTimeout(onClose, 600);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleEnded = () => {
    handleClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-600 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ transition: "opacity 0.6s ease" }}
    >
      {/* Fundo escuro com brilho sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a1a] to-black" />

      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-400 opacity-20"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Container do vídeo — 9:16 centrado */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm mx-auto px-4">
        {/* Logo inFlux no topo */}
        <div
          className="mb-4 opacity-0 animate-fade-in-down"
          style={{ animation: "fadeInDown 0.8s ease forwards" }}
        >
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/influx-logo-new_17347370.png"
            alt="inFlux"
            className="h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* Vídeo */}
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{
            aspectRatio: "9/16",
            maxHeight: "70vh",
            boxShadow: "0 0 60px rgba(99, 179, 237, 0.3), 0 0 120px rgba(99, 179, 237, 0.1)",
            animation: "scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        >
          {/* Skeleton loader */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-blue-300 text-sm font-medium">Loading...</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            src={ELIE_WELCOME_VIDEO_URL}
            autoPlay
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onLoadedData={() => setIsLoaded(true)}
            className="w-full h-full object-cover"
            style={{ display: isLoaded ? "block" : "none" }}
          />

          {/* Barra de progresso */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Botão Pular */}
        <div
          className="mt-4 h-10 flex items-center justify-center"
          style={{
            opacity: showSkip ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          {showSkip && (
            <button
              onClick={handleClose}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white/80 border border-white/20 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              Pular
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

/** Verifica se o vídeo de boas-vindas já foi exibido */
export function hasSeenWelcomeVideo(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

/** Reseta o flag (útil para testes) */
export function resetWelcomeVideoFlag(): void {
  localStorage.removeItem(STORAGE_KEY);
}
