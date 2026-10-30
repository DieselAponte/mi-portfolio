"use client";

const TRANSMISSIONS_ROW_1 = [
  "¡Me encantó tu trabajo! Deberíamos conectar.",
  "デザインが本当に素晴らしいです！",
  "Tengo un proyecto similar, te gustaría colaborar?",
  "Deine Website ist etwas Besonderes.",
  "¡Qué genial encontrar a alguien que también disfruta experimentar!",
];

const TRANSMISSIONS_ROW_2 = [
  "Hi! I'm also exploring creative web experiences.",
  "Estoy trabajando en algo parecido, ¡me inspiraste!",
  "Ciao! Il tuo portfolio è fantastico!",
  "Te comparto mi portfolio, creo que tenemos intereses similares.",
  "Seu site tem muita personalidade.",
];

const TRANSMISSIONS_ROW_3 = [
  "Seu site tem muita personalidade.",
  "¡Me encantó tu trabajo! Deberíamos conectar.",
  "Hi! I'm also exploring creative web experiences.",
  "デザインが本当に素晴らしいです！",
  "Estoy trabajando en algo parecido, ¡me inspiraste!",
  "Deine Website ist etwas Besonderes.",
];

export const BackgroundTransmissions = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 flex flex-col justify-around overflow-hidden select-none opacity-[0.06]"
    >
      {/* Row 1 - Left to Right */}
      <div className="flex w-max whitespace-nowrap font-mono text-sm tracking-[0.25em] text-amber-500 animate-stream-left">
        {[...TRANSMISSIONS_ROW_1, ...TRANSMISSIONS_ROW_1, ...TRANSMISSIONS_ROW_1].map(
          (text, idx) => (
            <span key={`r1-${idx}`} className="mx-8 flex items-center gap-4">
              <span className="text-amber-400/50">&gt;&gt;</span>
              <span>{text}</span>
              <span className="text-amber-400/30">//</span>
            </span>
          )
        )}
      </div>

      {/* Row 2 - Right to Left */}
      <div className="flex w-max whitespace-nowrap font-mono text-xs tracking-[0.3em] text-amber-400 animate-stream-right">
        {[...TRANSMISSIONS_ROW_2, ...TRANSMISSIONS_ROW_2, ...TRANSMISSIONS_ROW_2].map(
          (text, idx) => (
            <span key={`r2-${idx}`} className="mx-10 flex items-center gap-4">
              <span className="text-amber-500/50">[TX]</span>
              <span>{text}</span>
              <span className="text-amber-500/30">:::</span>
            </span>
          )
        )}
      </div>

      {/* Row 3 - Left to Right Slow */}
      <div className="hidden sm:flex w-max whitespace-nowrap font-mono text-xs tracking-[0.35em] text-amber-500 animate-stream-left-slow">
        {[...TRANSMISSIONS_ROW_3, ...TRANSMISSIONS_ROW_3, ...TRANSMISSIONS_ROW_3].map(
          (text, idx) => (
            <span key={`r3-${idx}`} className="mx-8 flex items-center gap-4">
              <span className="text-amber-400/40">~&gt;</span>
              <span>{text}</span>
              <span className="text-amber-400/30">||</span>
            </span>
          )
        )}
      </div>
    </div>
  );
};

