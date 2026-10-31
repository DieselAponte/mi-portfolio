"use client";

export const ALL_TRANSMISSIONS = [
  // 10 Original Phrases
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
  // Exactly 5 New Multilingual Additions
  "Las ideas también comienzan con una pregunta.",
  "Every message opens a new experiment.",
  "La curiosité fait naître les découvertes.",
  "Ogni conversazione lascia una traccia.",
  "Manchmal beginnt alles mit einem Gedanken.",
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
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      {/* Row 1 — TOP HORIZON (Moving Left, ethereal upper area) */}
      {/* Opacity: 0.32 * 1.10 = 0.352 (~0.35) */}
      <div
        className="absolute top-[2.5%] left-0 flex w-max whitespace-nowrap animate-stream-left text-amber-500/70"
        style={{
          animationDuration: "46s",
          animationPlayState: isPaused ? "paused" : "running",
          opacity: 0.35,
        }}
      >
        <div className="flex items-center gap-14 px-6 font-mono text-xs sm:text-sm tracking-[0.22em]">
          <span>&quot;{ALL_TRANSMISSIONS[0]}&quot;</span>
          <span className="text-amber-400/40">{"///"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[6]}&quot;</span>
          <span className="text-amber-400/40">{"///"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[1]}&quot;</span>
          <span className="text-amber-400/40">{"///"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[5]}&quot;</span>
        </div>
        <div className="flex items-center gap-14 px-6 font-mono text-xs sm:text-sm tracking-[0.22em]">
          <span>&quot;{ALL_TRANSMISSIONS[0]}&quot;</span>
          <span className="text-amber-400/40">{"///"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[6]}&quot;</span>
          <span className="text-amber-400/40">{"///"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[1]}&quot;</span>
          <span className="text-amber-400/40">{"///"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[5]}&quot;</span>
        </div>
      </div>

      {/* Row 2 — UPPER MIDDLE (Moving Right, new intermediate row) */}
      {/* Opacity: 0.385 (~0.38) */}
      <div
        className="absolute top-[21%] left-0 flex w-max whitespace-nowrap animate-stream-right text-amber-400/80"
        style={{
          animationDuration: "42s",
          animationPlayState: isPaused ? "paused" : "running",
          opacity: 0.38,
        }}
      >
        <div className="flex items-center gap-16 px-6 font-mono text-[13px] sm:text-[14px] tracking-[0.24em]">
          <span className="drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
            &quot;{ALL_TRANSMISSIONS[10]}&quot;
          </span>
          <span className="text-amber-500/50">{">>>"}</span>
          <span className="drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
            &quot;{ALL_TRANSMISSIONS[3]}&quot;
          </span>
          <span className="text-amber-500/50">{">>>"}</span>
          <span className="drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
            &quot;{ALL_TRANSMISSIONS[11]}&quot;
          </span>
          <span className="text-amber-500/50">{">>>"}</span>
          <span className="drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
            &quot;{ALL_TRANSMISSIONS[7]}&quot;
          </span>
        </div>
        <div className="flex items-center gap-16 px-6 font-mono text-[13px] sm:text-[14px] tracking-[0.24em]">
          <span className="drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
            &quot;{ALL_TRANSMISSIONS[10]}&quot;
          </span>
          <span className="text-amber-500/50">{">>>"}</span>
          <span className="drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
            &quot;{ALL_TRANSMISSIONS[3]}&quot;
          </span>
          <span className="text-amber-500/50">{">>>"}</span>
          <span className="drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
            &quot;{ALL_TRANSMISSIONS[11]}&quot;
          </span>
          <span className="text-amber-500/50">{">>>"}</span>
          <span className="drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
            &quot;{ALL_TRANSMISSIONS[7]}&quot;
          </span>
        </div>
      </div>

      {/* Row 3 — CENTRAL MIDDLE (Moving Left, subtle intentional overlap with Row 2) */}
      {/* Opacity: 0.33, smaller font text-[11px] creates depth */}
      <div
        className="absolute top-[37%] left-0 flex w-max whitespace-nowrap animate-stream-left text-amber-500/60"
        style={{
          animationDuration: "55s",
          animationPlayState: isPaused ? "paused" : "running",
          opacity: 0.33,
        }}
      >
        <div className="flex items-center gap-16 px-6 font-mono text-[11px] sm:text-xs tracking-[0.26em]">
          <span>&quot;{ALL_TRANSMISSIONS[12]}&quot;</span>
          <span className="text-amber-400/30">{"//"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[4]}&quot;</span>
          <span className="text-amber-400/30">{"//"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[13]}&quot;</span>
          <span className="text-amber-400/30">{"//"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[8]}&quot;</span>
        </div>
        <div className="flex items-center gap-16 px-6 font-mono text-[11px] sm:text-xs tracking-[0.26em]">
          <span>&quot;{ALL_TRANSMISSIONS[12]}&quot;</span>
          <span className="text-amber-400/30">{"//"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[4]}&quot;</span>
          <span className="text-amber-400/30">{"//"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[13]}&quot;</span>
          <span className="text-amber-400/30">{"//"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[8]}&quot;</span>
        </div>
      </div>

      {/* Row 4 — LOWER MIDDLE (Moving Right, independent trajectory with sufficient separation) */}
      {/* Opacity: 0.35 * 1.10 = 0.385 (~0.38) */}
      <div
        className="absolute top-[61%] left-0 flex w-max whitespace-nowrap animate-stream-right text-amber-400/70"
        style={{
          animationDuration: "48s",
          animationPlayState: isPaused ? "paused" : "running",
          opacity: 0.38,
        }}
      >
        <div className="flex items-center gap-16 px-6 font-mono text-xs sm:text-[13px] tracking-[0.23em]">
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.35)]">
            &quot;{ALL_TRANSMISSIONS[14]}&quot;
          </span>
          <span className="text-amber-500/50">{">>>>"}</span>
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.35)]">
            &quot;{ALL_TRANSMISSIONS[9]}&quot;
          </span>
          <span className="text-amber-500/50">{">>>>"}</span>
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.35)]">
            &quot;{ALL_TRANSMISSIONS[2]}&quot;
          </span>
          <span className="text-amber-500/50">{">>>>"}</span>
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.35)]">
            &quot;{ALL_TRANSMISSIONS[11]}&quot;
          </span>
        </div>
        <div className="flex items-center gap-16 px-6 font-mono text-xs sm:text-[13px] tracking-[0.23em]">
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.35)]">
            &quot;{ALL_TRANSMISSIONS[14]}&quot;
          </span>
          <span className="text-amber-500/50">{">>>>"}</span>
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.35)]">
            &quot;{ALL_TRANSMISSIONS[9]}&quot;
          </span>
          <span className="text-amber-500/50">{">>>>"}</span>
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.35)]">
            &quot;{ALL_TRANSMISSIONS[2]}&quot;
          </span>
          <span className="text-amber-500/50">{">>>>"}</span>
          <span className="drop-shadow-[0_0_6px_rgba(245,158,11,0.35)]">
            &quot;{ALL_TRANSMISSIONS[11]}&quot;
          </span>
        </div>
      </div>

      {/* Row 5 — BASELINE DRIFT (Moving Left, bottom horizon) */}
      {/* Opacity: 0.28 * 1.10 = 0.308 (~0.31) */}
      <div
        className="absolute bottom-[2%] left-0 flex w-max whitespace-nowrap animate-stream-left-slow text-amber-500/50"
        style={{
          animationDuration: "64s",
          animationPlayState: isPaused ? "paused" : "running",
          opacity: 0.31,
        }}
      >
        <div className="flex items-center gap-16 px-6 font-mono text-[10px] sm:text-[11px] tracking-[0.2em]">
          <span>&quot;{ALL_TRANSMISSIONS[8]}&quot;</span>
          <span className="text-amber-400/30">{"--"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[1]}&quot;</span>
          <span className="text-amber-400/30">{"--"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[12]}&quot;</span>
          <span className="text-amber-400/30">{"--"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[5]}&quot;</span>
        </div>
        <div className="flex items-center gap-16 px-6 font-mono text-[10px] sm:text-[11px] tracking-[0.2em]">
          <span>&quot;{ALL_TRANSMISSIONS[8]}&quot;</span>
          <span className="text-amber-400/30">{"--"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[1]}&quot;</span>
          <span className="text-amber-400/30">{"--"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[12]}&quot;</span>
          <span className="text-amber-400/30">{"--"}</span>
          <span>&quot;{ALL_TRANSMISSIONS[5]}&quot;</span>
        </div>
      </div>
    </div>
  );
};
