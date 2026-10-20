"use client";

import Image from "next/image";

interface BlogImageBackgroundProps {
  imageSrc?: string;
  overlayOpacity?: string;
  blurStrength?: string;
}

export const BlogImageBackground = ({
  imageSrc = "/images/cave-jhonson-office.png",
  overlayOpacity = "bg-[#0a0a0c]/70",
  blurStrength = "blur-[2.5px]",
}: BlogImageBackgroundProps) => {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Background Image: Cave Johnson's Executive Office */}
      <Image
        src={imageSrc}
        alt="Cave Johnson Office Background"
        fill
        priority
        quality={80}
        sizes="100vw"
        className={`object-cover scale-105 filter ${blurStrength} opacity-50`}
      />

      {/* Capa Traslúcida con Color de Fondo Base #0a0a0c */}
      <div className={`absolute inset-0 ${overlayOpacity}`} />

      {/* Cuadrícula Tecnológica Aperture Science */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(86,204,242,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(86,204,242,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />

      {/* Iluminación Ambiental Radial Retro y Gradiente de Profundidad */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(242,201,76,0.12),transparent_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0c]/25 to-[#0a0a0c]/90" />

      {/* Crédito sutil al modelador 3D del entorno */}
      <div className="pointer-events-auto absolute bottom-3 right-5 z-20 hidden sm:flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600/70 transition-colors hover:text-zinc-400">
        <span className="opacity-60">3D Environment //</span>
        <a
          href="https://www.reddit.com/user/tobyrubble"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-aperture-yellow transition-colors underline decoration-zinc-700/60 underline-offset-2"
          title="Oficina modelada en 3D por tobykingsley3d (u/tobyrubble)"
        >
          tobykingsley3d (u/tobyrubble)
        </a>
      </div>
    </div>
  );
};
