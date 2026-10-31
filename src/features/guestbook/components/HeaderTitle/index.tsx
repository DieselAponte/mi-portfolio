"use client";

import { useEffect, useRef, useState } from "react";
import { ApertureAsciiLogo } from "../ApertureAsciiLogo";
import { ApertureTurretAscii } from "../ApertureTurretAscii";
import { BackgroundTransmissions } from "../BackgroundTransmissions";

const DRAFT_PHRASE_1 = "Hola, me preguntaba ...";
const DRAFT_PHRASE_2 = "Me pareció algo nuev...";
const FINAL_TITLE_TEXT = "Deja un mensaje";
const SECONDARY_LINE_TEXT = "Exprésate";
const SUBTITLE_TEXT =
  "Si algo de todo esto te hace algo de sentido o si simplemente te parecio interesante, dejame conocer lo que piensas. Toda transmisión queda registrada en el registro de calibración de Aperture Science para continuar optimizando la arquitectura y compartiendo nuevos experimentos.";

type StateMachineStep =
  | "INIT"
  | "FIRST_TYPING"
  | "FIRST_HOLD"
  | "FIRST_DELETING"
  | "FIRST_PAUSE"
  | "SECOND_TYPING"
  | "SECOND_HOLD"
  | "SECOND_DELETING"
  | "SECOND_PAUSE"
  | "FINAL_TYPING"
  | "FINAL_DONE"
  | "EXPRESATE_TYPING"
  | "EXPRESATE_DONE"
  | "SUBTITLE_TYPING"
  | "COMPLETE";

export const HeaderTitle = () => {
  const [isAnimationPaused, setIsAnimationPaused] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  const [displayText, setDisplayText] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return FINAL_TITLE_TEXT;
    }
    return "";
  });

  const [expresateText, setExpresateText] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return SECONDARY_LINE_TEXT;
    }
    return "";
  });

  const [subtitleText, setSubtitleText] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return SUBTITLE_TEXT;
    }
    return "";
  });

  const [step, setStep] = useState<StateMachineStep>(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return "COMPLETE";
    }
    return "INIT";
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check prefers-reduced-motion media query changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const listener = (e: MediaQueryListEvent) => {
      setIsAnimationPaused(e.matches);
      if (e.matches) {
        setDisplayText(FINAL_TITLE_TEXT);
        setExpresateText(SECONDARY_LINE_TEXT);
        setSubtitleText(SUBTITLE_TEXT);
        setStep("COMPLETE");
      }
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Narrative Typewriter State Machine
  useEffect(() => {
    if (isAnimationPaused || step === "COMPLETE") return;

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    clearTimer();

    switch (step) {
      case "INIT": {
        timerRef.current = setTimeout(() => {
          setStep("FIRST_TYPING");
        }, 120);
        break;
      }

      // STATE 1: First Attempt "Hola, me preguntaba ..."
      // Accelerated typing: ~10ms/char (3.2x faster than 32ms normal)
      case "FIRST_TYPING": {
        if (displayText.length < DRAFT_PHRASE_1.length) {
          timerRef.current = setTimeout(() => {
            setDisplayText(DRAFT_PHRASE_1.slice(0, displayText.length + 1));
          }, 10);
        } else {
          // Phrase complete: brief hesitation hold
          timerRef.current = setTimeout(() => {
            setStep("FIRST_HOLD");
          }, 320);
        }
        break;
      }

      case "FIRST_HOLD": {
        timerRef.current = setTimeout(() => {
          setStep("FIRST_DELETING");
        }, 320);
        break;
      }

      // Fast deletion: ~7ms/char (4.5x faster than normal typing)
      case "FIRST_DELETING": {
        if (displayText.length > 0) {
          timerRef.current = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1));
          }, 7);
        } else {
          // Pause between attempts (250-400ms range)
          timerRef.current = setTimeout(() => {
            setStep("FIRST_PAUSE");
          }, 300);
        }
        break;
      }

      case "FIRST_PAUSE": {
        timerRef.current = setTimeout(() => {
          setStep("SECOND_TYPING");
        }, 80);
        break;
      }

      // STATE 2: Second Attempt "Me pareció algo nuev..."
      // Accelerated typing: ~10ms/char
      case "SECOND_TYPING": {
        if (displayText.length < DRAFT_PHRASE_2.length) {
          timerRef.current = setTimeout(() => {
            setDisplayText(DRAFT_PHRASE_2.slice(0, displayText.length + 1));
          }, 10);
        } else {
          timerRef.current = setTimeout(() => {
            setStep("SECOND_HOLD");
          }, 320);
        }
        break;
      }

      case "SECOND_HOLD": {
        timerRef.current = setTimeout(() => {
          setStep("SECOND_DELETING");
        }, 320);
        break;
      }

      // Fast deletion: ~7ms/char
      case "SECOND_DELETING": {
        if (displayText.length > 0) {
          timerRef.current = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1));
          }, 7);
        } else {
          timerRef.current = setTimeout(() => {
            setStep("SECOND_PAUSE");
          }, 300);
        }
        break;
      }

      case "SECOND_PAUSE": {
        timerRef.current = setTimeout(() => {
          setStep("FINAL_TYPING");
        }, 100);
        break;
      }

      // STATE 3: Final Decision "Deja un mensaje"
      // Baseline normal typing speed: 32ms/char
      case "FINAL_TYPING": {
        if (displayText.length < FINAL_TITLE_TEXT.length) {
          timerRef.current = setTimeout(() => {
            setDisplayText(FINAL_TITLE_TEXT.slice(0, displayText.length + 1));
          }, 32);
        } else {
          timerRef.current = setTimeout(() => {
            setStep("FINAL_DONE");
          }, 160);
        }
        break;
      }

      case "FINAL_DONE": {
        timerRef.current = setTimeout(() => {
          setStep("EXPRESATE_TYPING");
        }, 160);
        break;
      }

      // FEATURE B: "Exprésate"
      // Speed: 20% slower than normal (40ms per char)
      case "EXPRESATE_TYPING": {
        if (expresateText.length < SECONDARY_LINE_TEXT.length) {
          timerRef.current = setTimeout(() => {
            setExpresateText(
              SECONDARY_LINE_TEXT.slice(0, expresateText.length + 1)
            );
          }, 40);
        } else {
          timerRef.current = setTimeout(() => {
            setStep("EXPRESATE_DONE");
          }, 180);
        }
        break;
      }

      case "EXPRESATE_DONE": {
        timerRef.current = setTimeout(() => {
          setStep("SUBTITLE_TYPING");
        }, 120);
        break;
      }

      // Reading Paragraph Typing (Smooth, fast pacing to settle in ~1s)
      case "SUBTITLE_TYPING": {
        if (subtitleText.length < SUBTITLE_TEXT.length) {
          timerRef.current = setTimeout(() => {
            // Step in increments of 3 characters per 12ms tick for crisp fluid reading progression
            const nextLength = Math.min(
              subtitleText.length + 3,
              SUBTITLE_TEXT.length
            );
            setSubtitleText(SUBTITLE_TEXT.slice(0, nextLength));
          }, 12);
        } else {
          timerRef.current = setTimeout(() => {
            setStep("COMPLETE");
          }, 32);
        }
        break;
      }

      default:
        break;
    }

    return clearTimer;
  }, [step, displayText, expresateText, subtitleText, isAnimationPaused]);

  const isTitleTyping =
    step === "FIRST_TYPING" ||
    step === "FIRST_HOLD" ||
    step === "SECOND_TYPING" ||
    step === "SECOND_HOLD" ||
    step === "FINAL_TYPING";

  const isExpresateTyping = step === "EXPRESATE_TYPING";
  const isSubtitleTyping = step === "SUBTITLE_TYPING";

  return (
    <header className="relative w-full overflow-hidden border-b border-dashed border-amber-500/30 pt-2 sm:pt-3 pb-8 sm:pb-10">
      {/* Floating Multilingual Atmospheric Layer (5 Rows, Continuous Motion) */}
      <BackgroundTransmissions isPaused={isAnimationPaused} />

      {/* Main Composition: 3-column Grid on Desktop (Matching Image 3), Dual-ASCII on Mobile */}
      <div className="relative z-10 grid items-center gap-6 lg:grid-cols-[minmax(0,1.2fr)_1fr_auto] xl:grid-cols-[minmax(0,1.3fr)_1fr_auto] xl:gap-8">
        {/* COLUMN 1: Main Typographic Narrative & Reading Copy */}
        <div className="space-y-4 max-w-full lg:max-w-[640px] xl:max-w-[720px]">
          {/* Main Title ("Deja un mensaje" with narrative sequence) */}
          <h1
            className="text-4xl font-black tracking-tight text-amber-400 sm:text-5xl md:text-5xl lg:text-5xl min-[1300px]:whitespace-nowrap min-[1440px]:text-6xl xl:text-7xl flex items-baseline min-h-[1.18em]"
            style={{ fontFamily: "var(--font-geist-sans), Inter, sans-serif" }}
          >
            <span>{displayText}</span>
            {isTitleTyping && (
              <span className="inline-block animate-pulse text-amber-400 font-normal ml-1">
                _
              </span>
            )}
          </h1>

          {/* Secondary Typographic Line: "Exprésate" */}
          {/* Indented staircase alignment, 120% font size, editorial italic serif */}
          <div className="min-h-[1.2em] -mt-1 sm:-mt-2">
            {(expresateText.length > 0 ||
              step === "EXPRESATE_TYPING" ||
              step === "EXPRESATE_DONE" ||
              step === "SUBTITLE_TYPING" ||
              step === "COMPLETE") && (
              <div
                className="font-serif italic font-normal tracking-wide text-amber-400 drop-shadow-[0_0_16px_rgba(245,158,11,0.55)] ml-7 sm:ml-12 md:ml-14 lg:ml-16 xl:ml-20 text-[44px] min-[400px]:text-[50px] sm:text-[58px] md:text-[58px] lg:text-[62px] min-[1440px]:text-[76px] xl:text-[88px] leading-[1.05] flex items-baseline select-none"
                aria-label="Exprésate"
              >
                <span>{expresateText}</span>
                {isExpresateTyping && (
                  <span className="inline-block animate-pulse text-amber-400 font-normal ml-1 text-[0.8em] not-italic">
                    _
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Reading Typography (Preserved explanatory paragraph) */}
          <p className="max-w-[58ch] text-sm font-normal leading-[1.65] text-amber-500/90 sm:text-base md:text-[1.02rem] min-h-[3.8em] pt-1">
            <span>{subtitleText}</span>
            {isSubtitleTyping && (
              <span className="inline-block animate-pulse text-amber-400 font-bold ml-1">
                █
              </span>
            )}
          </p>

          {/* Metadata Pill */}
          <div className="pt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-500/70">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>CALIBRATION PROTOCOL // EXP_REF: #04b8</span>
          </div>
        </div>

        {/* COLUMN 2 (Desktop): ASCII Sentry Turret Centered in Assigned Middle Zone */}
        <div className="hidden lg:flex items-center justify-center px-4">
          <ApertureTurretAscii />
        </div>

        {/* COLUMN 3 (Desktop): Strictly Protected Aperture Science ASCII Logo Centered in Assigned Zone */}
        <div className="hidden lg:flex items-center justify-center lg:justify-end">
          <ApertureAsciiLogo />
        </div>
      </div>

      {/* MOBILE / TABLET COMPOSITION: Turret and Aperture Logo Side by Side */}
      <div className="relative z-10 mt-6 flex lg:hidden items-center justify-center gap-2 sm:gap-6 w-full border-t border-dashed border-amber-500/20 pt-6">
        <ApertureTurretAscii />
        <ApertureAsciiLogo />
      </div>
    </header>
  );
};
