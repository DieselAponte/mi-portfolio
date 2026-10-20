"use client";

import { useEffect, useRef } from "react";

interface ProjectVideoBackgroundProps {
  videoSrc?: string;
  overlayOpacity?: string;
  blurStrength?: string;
}

export const ProjectVideoBackground = ({
  videoSrc = "/videos/laboratory-background.mp4",
  overlayOpacity = "bg-[#0a0a0c]/80",
  blurStrength = "backdrop-blur-[6px]",
}: ProjectVideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85; // Sutil cadencia cinematográfica
    }
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Video Loop Adaptativo de Laboratorio */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover scale-105"
      />

      {/* Capa Traslúcida con Color de Fondo Actual y Blur */}
      <div className={`absolute inset-0 ${overlayOpacity} ${blurStrength}`} />

      {/* Cuadrícula Tecnológica Aperture Science */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(86,204,242,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(86,204,242,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-60" />

      {/* Iluminación Ambiental Radial y Gradiente Vertical */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(86,204,242,0.12),transparent_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/30 via-transparent to-[#0a0a0c]/90" />
    </div>
  );
};
