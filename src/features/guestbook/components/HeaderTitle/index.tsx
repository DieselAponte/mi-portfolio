"use client";

import { useEffect, useState } from "react";
import { ApertureAsciiLogo } from "../ApertureAsciiLogo";

const TELEMETRY_TEXT = ">> TERMINAL // GUESTBOOK TRANSMISSION";
const TITLE_TEXT = "Deja un mensaje";
const SUBTITLE_TEXT =
  "Si algo de todo esto te hace algo de sentido o si simplemente te parecio interesante, dejame conocer lo que piensas. Toda transmisión queda registrada en el registro de calibración de Aperture Science para continuar optimizando la arquitectura y compartiendo nuevos experimentos.";

export const HeaderTitle = () => {
  const [telemetry, setTelemetry] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [stage, setStage] = useState<"telemetry" | "title" | "subtitle" | "done">("telemetry");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (stage === "telemetry") {
      if (telemetry.length < TELEMETRY_TEXT.length) {
        timeoutId = setTimeout(() => {
          setTelemetry(TELEMETRY_TEXT.slice(0, telemetry.length + 1));
        }, 18);
      } else {
        timeoutId = setTimeout(() => setStage("title"), 150);
      }
    } else if (stage === "title") {
      if (title.length < TITLE_TEXT.length) {
        timeoutId = setTimeout(() => {
          setTitle(TITLE_TEXT.slice(0, title.length + 1));
        }, 35);
      } else {
        timeoutId = setTimeout(() => setStage("subtitle"), 200);
      }
    } else if (stage === "subtitle") {
      if (subtitle.length < SUBTITLE_TEXT.length) {
        timeoutId = setTimeout(() => {
          setSubtitle(SUBTITLE_TEXT.slice(0, subtitle.length + 1));
        }, 12);
      } else {
        setStage("done");
      }
    }

    return () => clearTimeout(timeoutId);
  }, [stage, telemetry, title, subtitle]);

  return (
    <header className="grid items-start gap-8 lg:grid-cols-[1fr_auto]">
      <div className="space-y-5">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-amber-500/80 min-h-[16px]">
          <span>{telemetry}</span>
          {stage === "telemetry" && (
            <span className="inline-block animate-pulse text-amber-400 font-bold">█</span>
          )}
        </div>

        <h1
          className="text-4xl font-black tracking-tight text-amber-400 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl flex items-baseline min-h-[1.15em]"
          style={{ fontFamily: "DIN, var(--font-geist-sans), sans-serif" }}
        >
          <span>{title}</span>
          {stage === "title" && (
            <span className="inline-block animate-pulse text-amber-400 font-normal ml-1">_</span>
          )}
        </h1>

        <p className="max-w-5xl text-lg font-medium leading-relaxed text-amber-500/90 sm:text-xl md:text-2xl lg:text-[1.75rem] min-h-[4em]">
          <span>{subtitle}</span>
          {stage === "subtitle" && (
            <span className="inline-block animate-pulse text-amber-400 font-bold ml-1">█</span>
          )}
        </p>
      </div>

      <div className="flex justify-center lg:justify-end">
        <ApertureAsciiLogo />
      </div>
    </header>
  );
};
