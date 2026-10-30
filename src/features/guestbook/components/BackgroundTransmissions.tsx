"use client";

import { useEffect, useState } from "react";

const ALL_TRANSMISSIONS = [
  "¡Me encantó tu trabajo! Deberíamos conectar.",
  "Estoy trabajando en algo parecido, ¡me inspiraste!",
  "¡Qué genial encontrar a alguien que también disfruta experimentar!",
  "Te comparto mi portfolio, creo que tenemos intereses similares.",
  "Tengo un proyecto similar, te gustaría colaborar?",
  "Hi! I'm also exploring creative web experiences.",
  "デザインが本当に素晴らしいです！",
  "Deine Website ist etwas Besonderes.",
  "Ciao! Il tuo portfolio è fantastico!",
  "Seu site tem muita personalidad.",
];

interface TypewriterLineProps {
  phrases: string[];
  initialIndex?: number;
  prefix?: string;
  speed?: number;
  pauseMs?: number;
}

const TypewriterLine = ({
  phrases,
  initialIndex = 0,
  prefix = "> TRANSMISIÓN //",
  speed = 50,
  pauseMs = 2200,
}: TypewriterLineProps) => {
  const [phraseIndex, setPhraseIndex] = useState(initialIndex);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetPhrase = phrases[phraseIndex % phrases.length];
    let timeoutId: NodeJS.Timeout;

    if (!isDeleting) {
      if (currentText.length < targetPhrase.length) {
        timeoutId = setTimeout(() => {
          setCurrentText(targetPhrase.slice(0, currentText.length + 1));
        }, speed);
      } else {
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, pauseMs);
      }
    } else {
      if (currentText.length > 0) {
        timeoutId = setTimeout(() => {
          setCurrentText(targetPhrase.slice(0, currentText.length - 1));
        }, speed / 2);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [currentText, isDeleting, phraseIndex, phrases, speed, pauseMs]);

  return (
    <div className="inline-flex items-center gap-3 whitespace-nowrap font-mono text-sm sm:text-base md:text-lg tracking-[0.2em] text-amber-500 select-none">
      <span className="text-amber-400 font-bold drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]">{prefix}</span>
      <span className="text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] font-medium">
        &quot;{currentText}&quot;
      </span>
      <span className="inline-block animate-pulse font-mono text-amber-400 font-bold">
        █
      </span>
    </div>
  );
};

export const BackgroundTransmissions = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 flex flex-col justify-around overflow-hidden select-none opacity-[0.45]"
    >
      {/* Stream Lane 1 - Moving Left */}
      <div className="flex w-max whitespace-nowrap animate-stream-left py-2">
        <div className="flex items-center gap-16 px-8">
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={0}
            prefix="[PORTAL_COMM // 01] >"
            speed={45}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={6}
            prefix="[GLOBAL_TELEMETRY // 02] >"
            speed={55}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={1}
            prefix="[APERTURE_FEED // 03] >"
            speed={48}
          />
        </div>
        {/* Repeat for seamless infinite scrolling */}
        <div className="flex items-center gap-16 px-8">
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={0}
            prefix="[PORTAL_COMM // 01] >"
            speed={45}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={6}
            prefix="[GLOBAL_TELEMETRY // 02] >"
            speed={55}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={1}
            prefix="[APERTURE_FEED // 03] >"
            speed={48}
          />
        </div>
      </div>

      {/* Stream Lane 2 - Moving Right */}
      <div className="flex w-max whitespace-nowrap animate-stream-right py-2">
        <div className="flex items-center gap-16 px-8">
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={3}
            prefix="[INCOMING_TX // 04] >"
            speed={50}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={7}
            prefix="[REMOTE_SIGNAL // 05] >"
            speed={40}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={4}
            prefix="[COLLAB_REQ // 06] >"
            speed={52}
          />
        </div>
        {/* Repeat for seamless infinite scrolling */}
        <div className="flex items-center gap-16 px-8">
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={3}
            prefix="[INCOMING_TX // 04] >"
            speed={50}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={7}
            prefix="[REMOTE_SIGNAL // 05] >"
            speed={40}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={4}
            prefix="[COLLAB_REQ // 06] >"
            speed={52}
          />
        </div>
      </div>

      {/* Stream Lane 3 - Moving Left (Slow) */}
      <div className="hidden sm:flex w-max whitespace-nowrap animate-stream-left-slow py-2">
        <div className="flex items-center gap-16 px-8">
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={5}
            prefix="[GLOBAL_COMM // 07] >"
            speed={55}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={8}
            prefix="[TRANSMISSION // 08] >"
            speed={48}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={9}
            prefix="[APERTURE_NET // 09] >"
            speed={42}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={2}
            prefix="[INSPIRATION_PULSE // 10] >"
            speed={46}
          />
        </div>
        {/* Repeat for seamless infinite scrolling */}
        <div className="flex items-center gap-16 px-8">
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={5}
            prefix="[GLOBAL_COMM // 07] >"
            speed={55}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={8}
            prefix="[TRANSMISSION // 08] >"
            speed={48}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={9}
            prefix="[APERTURE_NET // 09] >"
            speed={42}
          />
          <TypewriterLine
            phrases={ALL_TRANSMISSIONS}
            initialIndex={2}
            prefix="[INSPIRATION_PULSE // 10] >"
            speed={46}
          />
        </div>
      </div>
    </div>
  );
};
