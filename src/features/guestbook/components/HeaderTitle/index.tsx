"use client";

import { useEffect, useRef, useState } from "react";
import { ApertureAsciiLogo } from "../ApertureAsciiLogo";
import { ApertureTurretAscii } from "../ApertureTurretAscii";
import { BackgroundTransmissions } from "../BackgroundTransmissions";

const DRAFT_PHRASE_1 = "Hola, me preguntaba ...";
const DRAFT_PHRASE_2 = "Lo que hiciste fue ...";
const FINAL_TITLE_TEXT = "NO LO PIENSES TANTO,";
const SECONDARY_LINE_TEXT = "Solo Exprésate";
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
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return FINAL_TITLE_TEXT;
    }
    return "";
  });

  const [expresateText, setExpresateText] = useState(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return SECONDARY_LINE_TEXT;
    }
    return "";
  });

  const [subtitleText, setSubtitleText] = useState(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return SUBTITLE_TEXT;
    }
    return "";
  });

  const [step, setStep] = useState<StateMachineStep>(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
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
        }, 100);
        break;
      }

      // STATE 1: First Attempt "Hola, me preguntaba ..."
      // Accelerated typing +30%: 7ms/char
      case "FIRST_TYPING": {
        if (displayText.length < DRAFT_PHRASE_1.length) {
          timerRef.current = setTimeout(() => {
            setDisplayText(DRAFT_PHRASE_1.slice(0, displayText.length + 1));
          }, 7);
        } else {
          timerRef.current = setTimeout(() => {
            setStep("FIRST_HOLD");
          }, 220);
        }
        break;
      }

      case "FIRST_HOLD": {
        timerRef.current = setTimeout(() => {
          setStep("FIRST_DELETING");
        }, 220);
        break;
      }

      // Fast deletion +30%: 5ms/char
      case "FIRST_DELETING": {
        if (displayText.length > 0) {
          timerRef.current = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1));
          }, 5);
        } else {
          timerRef.current = setTimeout(() => {
            setStep("FIRST_PAUSE");
          }, 200);
        }
        break;
      }

      case "FIRST_PAUSE": {
        timerRef.current = setTimeout(() => {
          setStep("SECOND_TYPING");
        }, 60);
        break;
      }

      // STATE 2: Second Attempt "Lo que hiciste me pareció.."
      // Accelerated typing +30%: 7ms/char
      case "SECOND_TYPING": {
        if (displayText.length < DRAFT_PHRASE_2.length) {
          timerRef.current = setTimeout(() => {
            setDisplayText(DRAFT_PHRASE_2.slice(0, displayText.length + 1));
          }, 7);
        } else {
          timerRef.current = setTimeout(() => {
            setStep("SECOND_HOLD");
          }, 220);
        }
        break;
      }

      case "SECOND_HOLD": {
        timerRef.current = setTimeout(() => {
          setStep("SECOND_DELETING");
        }, 220);
        break;
      }

      // Fast deletion +30%: 5ms/char
      case "SECOND_DELETING": {
        if (displayText.length > 0) {
          timerRef.current = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1));
          }, 5);
        } else {
          timerRef.current = setTimeout(() => {
            setStep("SECOND_PAUSE");
          }, 200);
        }
        break;
      }

      case "SECOND_PAUSE": {
        timerRef.current = setTimeout(() => {
          setStep("FINAL_TYPING");
        }, 80);
        break;
      }

      // STATE 3: Final Decision "NO LO PIENSES TANTO,"
      // Normal typing speed: 32ms/char
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

      // SECONDARY LINE: "Solo Exprésate"
      // Typing speed: 40ms/char
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

      // Reading Paragraph Typing
      case "SUBTITLE_TYPING": {
        if (subtitleText.length < SUBTITLE_TEXT.length) {
          timerRef.current = setTimeout(() => {
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

      {/* Main Composition: Symmetrically bounded between left and right borders */}
      <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-6 xl:gap-8 px-1 sm:px-2 md:px-4">
        {/* COLUMN 1: Main Typographic Narrative & Reading Copy */}
        <div className="min-w-0 flex-1 w-full max-w-full xl:max-w-[760px] 2xl:max-w-[860px] pr-0 xl:pr-4">
          {/* Title & "Solo Exprésate" Grouped (Vertical spacing reduced significantly, no overlap) */}
          <div className="flex flex-col gap-0">
            {/* Main Title: Occupies nearly all horizontal width on mobile portrait while preserving desktop size */}
            <h1
              className="text-[clamp(32px,10vw,44px)] sm:text-[48px] md:text-[56px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px] font-bold tracking-tight text-amber-400 break-words leading-[0.96] flex flex-wrap items-baseline min-h-[1.12em]"
              style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
            >
              <span>{displayText}</span>
              {isTitleTyping && (
                <span className="inline-block animate-pulse text-amber-400 font-normal ml-1">
                  _
                </span>
              )}
            </h1>

            {/* Secondary Typographic Line: "Solo Exprésate" (Scaled proportionally on mobile to maintain ratio) */}
            <div className="min-h-[1.15em] -mt-1 sm:-mt-1.5 md:-mt-2 lg:-mt-2.5 xl:-mt-3">
              {(expresateText.length > 0 ||
                step === "EXPRESATE_TYPING" ||
                step === "EXPRESATE_DONE" ||
                step === "SUBTITLE_TYPING" ||
                step === "COMPLETE") && (
                <div
                  className="font-serif italic font-normal tracking-wide text-amber-400 drop-shadow-[0_0_16px_rgba(245,158,11,0.55)] ml-0 text-[clamp(27px,8.6vw,38px)] sm:text-[44px] md:text-[50px] lg:text-[56px] xl:text-[64px] leading-[1.04] flex items-baseline select-none break-words"
                  aria-label="Solo Exprésate"
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
          </div>

          {/* Reading Typography (Preserved explanatory paragraph with Raleway) */}
          <p
            className="mt-4 sm:mt-5 max-w-[58ch] text-sm font-normal leading-[1.65] text-amber-500/90 sm:text-base md:text-[1.02rem] min-h-[3.8em]"
            style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif" }}
          >
            <span>{subtitleText}</span>
            {isSubtitleTyping && (
              <span className="inline-block animate-pulse text-amber-400 font-bold ml-1">
                █
              </span>
            )}
          </p>

          {/* Metadata Pill */}
          <div className="mt-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-500/70">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>CALIBRATION PROTOCOL // EXP_REF: #04b8</span>
          </div>
        </div>

        {/* COLUMN 2 (Desktop): Unified ASCII Enclosure with +25% larger dashes and connected vertical divider */}
        {/* Right margin aligns symmetrically to left padding with zero overflow */}
        <div className="hidden xl:flex items-center justify-end flex-shrink-0 ml-auto mr-0">
          <div className="relative bg-black/50 backdrop-blur-[2px] shadow-[0_0_20px_rgba(245,158,11,0.06)] flex items-stretch justify-center">
            {/* Outer border with 25% larger dashes (dash 10, gap 6) */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                fill="none"
                strokeWidth="1.5"
                strokeDasharray="10 6"
                className="stroke-amber-500/60"
              />
            </svg>

            {/* Left Box: Sentry Turret */}
            <div className="flex items-center justify-center p-2 sm:p-3 pr-2.5 sm:pr-3.5">
              <ApertureTurretAscii />
            </div>

            {/* Connected Vertical Dashed Divider (touches top and bottom of container seamlessly) */}
            <div className="relative w-[1.5px] self-stretch flex-shrink-0 my-0">
              <svg
                className="absolute inset-0 h-full w-full overflow-visible"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="0.75"
                  y1="0"
                  x2="0.75"
                  y2="100%"
                  strokeWidth="1.5"
                  strokeDasharray="10 6"
                  className="stroke-amber-500/60"
                />
              </svg>
            </div>

            {/* Right Box: Aperture Logo (Strictly Untouched) */}
            <div className="flex items-center justify-center p-2 sm:p-3 pl-2.5 sm:pl-3.5">
              <ApertureAsciiLogo />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET COMPOSITION: Unified ASCII Enclosure with Connected Vertical Dashed Line */}
      <div className="relative z-10 mt-8 flex xl:hidden items-center justify-center w-full px-2">
        <div className="relative bg-black/50 backdrop-blur-[2px] shadow-[0_0_20px_rgba(245,158,11,0.06)] flex items-stretch justify-center w-fit max-w-full">
          {/* Outer border with 25% larger dashes */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              fill="none"
              strokeWidth="1.5"
              strokeDasharray="10 6"
              className="stroke-amber-500/60"
            />
          </svg>

          {/* Left Box: Sentry Turret */}
          <div className="flex items-center justify-center p-1.5 sm:p-2.5 pr-2 sm:pr-3">
            <ApertureTurretAscii />
          </div>

          {/* Connected Vertical Dashed Divider (touches top and bottom) */}
          <div className="relative w-[1.5px] self-stretch flex-shrink-0 my-0">
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0.75"
                y1="0"
                x2="0.75"
                y2="100%"
                strokeWidth="1.5"
                strokeDasharray="10 6"
                className="stroke-amber-500/60"
              />
            </svg>
          </div>

          {/* Right Box: Aperture Logo (Strictly Untouched) */}
          <div className="flex items-center justify-center p-1.5 sm:p-2.5 pl-2 sm:pl-3">
            <ApertureAsciiLogo />
          </div>
        </div>
      </div>
    </header>
  );
};
