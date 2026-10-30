"use client";

import { useId } from "react";

export const ALL_TRANSMISSIONS = [
  "¡Me encantó tu trabajo! Deberíamos conectar.",
  "Estoy trabajando en algo parecido, ¡me inspiraste!",
  "¡Qué genial encontrar a alguien que también disfruta experimentar!",
  "Te comparto mi portfolio, creo que tenemos intereses similares.",
  "Tengo un proyecto similar, te gustaría colaborar?",
  "Hi! I'm also exploring creative web experiences.",
  "デザインが本当に素晴らしいです！",
  "Deine Website ist etwas Besonderes.",
  "Ciao! Il tuo portfolio è fantastico!",
  "Seu site tem muita personalidade.",
];

interface BackgroundTransmissionsProps {
  isPaused?: boolean;
}

export const BackgroundTransmissions = ({
  isPaused = false,
}: BackgroundTransmissionsProps) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden select-none"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      {/* Track 1: Upper Atmospheric Drift (Moving Left, ethereal upper horizon) */}
      <div
        className="absolute top-[4%] left-0 flex w-max whitespace-nowrap animate-stream-left text-amber-500/60"
        style={{
          animationPlayState: isPaused ? "paused" : "running",
          opacity: 0.32,
        }}
      >
        <div className="flex items-center gap-16 px-6 font-mono text-xs sm:text-sm tracking-[0.22em]">
          <span>[TX_01] &quot;{ALL_TRANSMISSIONS[0]}&quot;</span>
          <span className="text-amber-400/40">///</span>
          <span>[TX_07] &quot;{ALL_TRANSMISSIONS[6]}&quot;</span>
          <span className="text-amber-400/40">///</span>
          <span>[TX_02] &quot;{ALL_TRANSMISSIONS[1]}&quot;</span>
          <span className="text-amber-400/40">///</span>
          <span>[TX_06] &quot;{ALL_TRANSMISSIONS[5]}&quot;</span>
        </div>
        <div className="flex items-center gap-16 px-6 font-mono text-xs sm:text-sm tracking-[0.22em]">
          <span>[TX_01] &quot;{ALL_TRANSMISSIONS[0]}&quot;</span>
          <span className="text-amber-400/40">///</span>
          <span>[TX_07] &quot;{ALL_TRANSMISSIONS[6]}&quot;</span>
          <span className="text-amber-400/40">///</span>
          <span>[TX_02] &quot;{ALL_TRANSMISSIONS[1]}&quot;</span>
          <span className="text-amber-400/40">///</span>
          <span>[TX_06] &quot;{ALL_TRANSMISSIONS[5]}&quot;</span>
        </div>
      </div>

      {/* Track 2: Mid-Lower Atmospheric Drift (Moving Right, positioned below reading copy) */}
      <div
        className="absolute bottom-[22%] left-0 flex w-max whitespace-nowrap animate-stream-right text-amber-400/70"
        style={{
          animationPlayState: isPaused ? "paused" : "running",
          opacity: 0.35,
        }}
      >
        <div className="flex items-center gap-16 px-6 font-mono text-xs sm:text-sm tracking-[0.24em]">
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]">
            [TX_04] &quot;{ALL_TRANSMISSIONS[3]}&quot;
          </span>
          <span className="text-amber-500/50">&gt;&gt;</span>
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]">
            [TX_08] &quot;{ALL_TRANSMISSIONS[7]}&quot;
          </span>
          <span className="text-amber-500/50">&gt;&gt;</span>
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]">
            [TX_05] &quot;{ALL_TRANSMISSIONS[4]}&quot;
          </span>
          <span className="text-amber-500/50">&gt;&gt;</span>
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]">
            [TX_09] &quot;{ALL_TRANSMISSIONS[8]}&quot;
          </span>
        </div>
        <div className="flex items-center gap-16 px-6 font-mono text-xs sm:text-sm tracking-[0.24em]">
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]">
            [TX_04] &quot;{ALL_TRANSMISSIONS[3]}&quot;
          </span>
          <span className="text-amber-500/50">&gt;&gt;</span>
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]">
            [TX_08] &quot;{ALL_TRANSMISSIONS[7]}&quot;
          </span>
          <span className="text-amber-500/50">&gt;&gt;</span>
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]">
            [TX_05] &quot;{ALL_TRANSMISSIONS[4]}&quot;
          </span>
          <span className="text-amber-500/50">&gt;&gt;</span>
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]">
            [TX_09] &quot;{ALL_TRANSMISSIONS[8]}&quot;
          </span>
        </div>
      </div>

      {/* Track 3: Baseline Drift (Moving Left - Slow, base horizon) */}
      <div
        className="absolute bottom-[3%] left-0 hidden sm:flex w-max whitespace-nowrap animate-stream-left-slow text-amber-500/50"
        style={{
          animationPlayState: isPaused ? "paused" : "running",
          opacity: 0.28,
        }}
      >
        <div className="flex items-center gap-16 px-6 font-mono text-[11px] sm:text-xs tracking-[0.2em]">
          <span>[TX_10] &quot;{ALL_TRANSMISSIONS[9]}&quot;</span>
          <span className="text-amber-400/30">--</span>
          <span>[TX_03] &quot;{ALL_TRANSMISSIONS[2]}&quot;</span>
          <span className="text-amber-400/30">--</span>
          <span>[TX_06] &quot;{ALL_TRANSMISSIONS[5]}&quot;</span>
        </div>
        <div className="flex items-center gap-16 px-6 font-mono text-[11px] sm:text-xs tracking-[0.2em]">
          <span>[TX_10] &quot;{ALL_TRANSMISSIONS[9]}&quot;</span>
          <span className="text-amber-400/30">--</span>
          <span>[TX_03] &quot;{ALL_TRANSMISSIONS[2]}&quot;</span>
          <span className="text-amber-400/30">--</span>
          <span>[TX_06] &quot;{ALL_TRANSMISSIONS[5]}&quot;</span>
        </div>
      </div>
    </div>
  );
};
