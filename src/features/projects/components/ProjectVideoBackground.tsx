"use client";

import { useEffect, useRef } from "react";

interface ProjectVideoBackgroundProps {
  videoSrc?: string;
  overlayOpacity?: string;
  blurStrength?: string;
}

export const ProjectVideoBackground = ({
  videoSrc = "/videos/laboratory-background.mp4",
  overlayOpacity = "bg-[#0a0a0c]/65",
  blurStrength = "blur-[2.5px]",
}: ProjectVideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.playbackRate = 0.85;
      void videoRef.current.play().catch(() => {
        // En caso de que el navegador suspenda autoplay
      });
    }
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Video Loop Adaptativo de Laboratorio con blur y opacidad traslúcida */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover scale-105 filter ${blurStrength} opacity-60`}
      />

      {/* Capa Traslúcida con Color de Fondo Base */}
      <div className={`absolute inset-0 ${overlayOpacity}`} />

      {/* Cuadrícula Tecnológica Aperture Science */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(86,204,242,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(86,204,242,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />

      {/* Iluminación Ambiental Radial y Gradiente de Profundidad */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(86,204,242,0.14),transparent_65%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0c]/20 to-[#0a0a0c]/85" />
    </div>
  );
};
