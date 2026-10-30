"use client";

import { useEffect, useState } from "react";
import { ApertureAsciiLogo } from "../ApertureAsciiLogo";
import { BackgroundTransmissions } from "../BackgroundTransmissions";

const TELEMETRY_TEXT = ">> TERMINAL // GUESTBOOK TRANSMISSION";
const TITLE_TEXT = "Deja un mensaje";
const SUBTITLE_TEXT =
  "Si algo de todo esto te hace algo de sentido o si simplemente te parecio interesante, dejame conocer lo que piensas. Toda transmisión queda registrada en el registro de calibración de Aperture Science para continuar optimizando la arquitectura y compartiendo nuevos experimentos.";

export const HeaderTitle = () => {
  const [telemetry, setTelemetry] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [stage, setStage] = useState<"telemetry" | "title" | "subtitle" | "done">("telemetry");
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);

  // WCAG: Listen to user's OS prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsAnimationPaused(true);
      }
      const listener = (e: MediaQueryListEvent) => {
        setIsAnimationPaused(e.matches);
      };
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Sequential terminal boot typewriter animation
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (stage === "telemetry") {
      if (telemetry.length < TELEMETRY_TEXT.length) {
        timeoutId = setTimeout(() => {
          setTelemetry(TELEMETRY_TEXT.slice(0, telemetry.length + 1));
        }, 16);
      } else {
        timeoutId = setTimeout(() => setStage("title"), 120);
      }
    } else if (stage === "title") {
      if (title.length < TITLE_TEXT.length) {
        timeoutId = setTimeout(() => {
          setTitle(TITLE_TEXT.slice(0, title.length + 1));
        }, 32);
      } else {
        timeoutId = setTimeout(() => setStage("subtitle"), 150);
      }
    } else if (stage === "subtitle") {
      if (subtitle.length < SUBTITLE_TEXT.length) {
        timeoutId = setTimeout(() => {
          setSubtitle(SUBTITLE_TEXT.slice(0, subtitle.length + 1));
        }, 8);
      } else {
        setStage("done");
      }
    }

    return () => clearTimeout(timeoutId);
  }, [stage, telemetry, title, subtitle]);

  return (
    <header className="relative w-full overflow-hidden border-b border-dashed border-amber-500/30 pb-8 sm:pb-10">
      {/* Floating Multilingual Atmospheric Layer (Scoped strictly to HeroSection) */}
      <BackgroundTransmissions isPaused={isAnimationPaused} />

      {/* Top Metadata Row with System Identifiers & WCAG 2.2.2 Motion Control */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-500/80">
        <div className="flex items-center gap-2 min-h-[18px]">
          <span>{telemetry}</span>
          {stage === "telemetry" && (
            <span className="inline-block animate-pulse text-amber-400 font-bold">█</span>
          )}
        </div>

        {/* Discreet terminal text control (WCAG 2.2.2 Compliant) */}
        <button
          type="button"
          onClick={() => setIsAnimationPaused((prev) => !prev)}
          className="cursor-pointer border border-dashed border-amber-500/50 bg-black/60 px-3 py-1 font-mono text-[10px] text-amber-400 transition hover:border-amber-400 hover:bg-amber-500/10 hover:text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
          title="Alternar animación atmosférica de fondo (WCAG 2.2.2)"
          aria-label={isAnimationPaused ? "Reanudar animación de fondo" : "Pausar animación de fondo"}
        >
          <span>[ FX ATMOSFERA: {isAnimationPaused ? "PAUSADO ||" : "ACTIVO >"} ]</span>
        </button>
      </div>

      {/* Main Grid: Display Heading + Reading Copy vs Untouched ASCII Logo */}
      <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          {/* Role 1: Display Typography (Main Heading) */}
          <h1
            className="text-4xl font-black tracking-tight text-amber-400 sm:text-5xl md:text-6xl lg:text-7xl flex items-baseline min-h-[1.15em]"
            style={{ fontFamily: "var(--font-geist-sans), Inter, sans-serif" }}
          >
            <span>{title}</span>
            {stage === "title" && (
              <span className="inline-block animate-pulse text-amber-400 font-normal ml-1">_</span>
            )}
          </h1>

          {/* Role 2: Reading Typography (Strict 55-65 character line length for optimal readability) */}
          <p className="max-w-[58ch] text-sm font-normal leading-[1.65] text-amber-500/90 sm:text-base md:text-[1.02rem] min-h-[4em]">
            <span>{subtitle}</span>
            {stage === "subtitle" && (
              <span className="inline-block animate-pulse text-amber-400 font-bold ml-1">█</span>
            )}
          </p>

          {/* Role 3: Terminal Typography (Metadata pill) */}
          <div className="pt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-500/70">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>CALIBRATION PROTOCOL // EXP_REF: #04b8</span>
          </div>
        </div>

        {/* Protected Aperture Science ASCII Logo (Strictly Untouched) */}
        <div className="flex justify-center lg:justify-end">
          <ApertureAsciiLogo />
        </div>
      </div>
    </header>
  );
};
