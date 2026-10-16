"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import type { TrajectoryStatus } from "../types";

interface PortalPanelProps {
  id?: string;
  title?: string;
  subtitle?: string;
  status?: TrajectoryStatus;
  className?: string;
}

const joinClassNames = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(" ");

const BARCODE_HEIGHT = 28;
const BARCODE_COUNT = 44;

const createBarcode = () =>
  Array.from({ length: BARCODE_COUNT }).map(() => ({
    height: BARCODE_HEIGHT,
  }));

const CHAMBER_ICONS = [
  "/icons/Chamber_icon_blades_hazard_on.png",
  "/icons/Chamber_icon_bridge_shield_on.png",
  "/icons/Chamber_icon_cake_on.png",
  "/icons/Chamber_icon_crusher_hazard_on.png",
  "/icons/Chamber_icon_cube_button_on.png",
  "/icons/Chamber_icon_cube_dispenser_on.png",
  "/icons/Chamber_icon_cube_hazard_on.png",
  "/icons/Chamber_icon_excursion_funnel_on.png",
  "/icons/Chamber_icon_excursion_switch_on.png",
  "/icons/Chamber_icon_faith_plate_on.png",
  "/icons/Chamber_icon_fling_enter_on.png",
  "/icons/Chamber_icon_fling_exit_on.png",
  "/icons/Chamber_icon_laser_field_on.png",
  "/icons/Chamber_icon_laser_hazard_on.png",
  "/icons/Chamber_icon_laser_redirection_on.png",
  "/icons/Chamber_icon_laser_sensor_on.png",
  "/icons/Chamber_icon_light_bridge_on.png",
  "/icons/Chamber_icon_pass_cube_on.png",
  "/icons/Chamber_icon_pellet_catcher_on.png",
  "/icons/Chamber_icon_pellet_hazard_on.png",
  "/icons/Chamber_icon_turret_hazard_on.png",
  "/icons/Chamber_icon_water_hazard_on.png",
];

interface ChamberIconState {
  src: string;
  isOn: boolean;
}

function generateChamberIcons(panelId: string): ChamberIconState[] {
  // Deterministic seeded pseudorandom to ensure SSR/client consistency without hydration issues
  let seed = 0;
  for (let i = 0; i < panelId.length; i++) {
    seed = (seed * 37 + panelId.charCodeAt(i) * 17) >>> 0;
  }
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  // Total icons: min 4, max 8 per panel
  const total = 4 + Math.floor(random() * 5); // 4, 5, 6, 7, 8

  // Max 2 off, min 2 on (can be 0 off, so offCount is 0, 1, or 2)
  const maxOff = Math.min(2, total - 2);
  const offCount = Math.floor(random() * (maxOff + 1)); // 0, 1, or 2

  // Pick unique icons
  const available = [...CHAMBER_ICONS];
  const chosen: string[] = [];
  for (let i = 0; i < total; i++) {
    const idx = Math.floor(random() * available.length);
    chosen.push(available.splice(idx, 1)[0]);
  }

  // Pick random indices to turn off
  const offIndices = new Set<number>();
  while (offIndices.size < offCount) {
    offIndices.add(Math.floor(random() * total));
  }

  return chosen.map((src, index) => ({
    src,
    isOn: !offIndices.has(index),
  }));
}

export default function PortalPanel({
  id = "01",
  status = "COMPLETED",
  className,
}: PortalPanelProps) {
  const panelControls = useAnimation();
  const numberControls = useAnimation();
  const [isBooting, setIsBooting] = useState(true);
  const [idleFlicker, setIdleFlicker] = useState(false);
  const barcodeBars = useMemo(() => createBarcode(), []);
  const chamberIcons = useMemo(() => generateChamberIcons(id), [id]);

  useEffect(() => {
    let isActive = true;

    const runSequence = async () => {
      await panelControls.set({ opacity: 0, filter: "brightness(0.2)" });
      await numberControls.set({
        opacity: 0,
        clipPath: "inset(100% 0% 0% 0%)",
      });

      await new Promise((resolve) => setTimeout(resolve, 200));
      if (!isActive) return;

      await panelControls.start({
        opacity: [0, 1, 0.2, 1, 0.3, 1],
        filter: [
          "brightness(0.2)",
          "brightness(1.3)",
          "brightness(0.4)",
          "brightness(1.1)",
          "brightness(0.6)",
          "brightness(1)",
        ],
        transition: {
          duration: 0.9,
          times: [0, 0.2, 0.35, 0.55, 0.75, 1],
        },
      });

      if (!isActive) return;

      await panelControls.start({
        filter: [
          "brightness(0.9)",
          "brightness(1.2)",
          "brightness(0.85)",
          "brightness(1.05)",
          "brightness(1)",
        ],
        transition: { duration: 1.2, ease: "easeInOut" },
      });

      if (!isActive) return;

      await numberControls.start({
        opacity: 1,
        clipPath: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
        transition: { duration: 1.1, ease: "easeOut" },
      });

      if (!isActive) return;

      await panelControls.start({ opacity: 1, filter: "brightness(1)" });
      if (isActive) setIsBooting(false);
    };

    runSequence();

    return () => {
      isActive = false;
    };
  }, [panelControls, numberControls]);

  useEffect(() => {
    let flickerTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleFlicker = () => {
      const delay = 3000 + Math.random() * 3200;
      flickerTimer = setTimeout(() => {
        setIdleFlicker(true);
        setTimeout(() => setIdleFlicker(false), 120);
        scheduleFlicker();
      }, delay);
    };

    const startTimer = setTimeout(scheduleFlicker, 2000);

    return () => {
      if (flickerTimer) clearTimeout(flickerTimer);
      if (startTimer) clearTimeout(startTimer);
    };
  }, []);

  return (
    <motion.div
      className={joinClassNames(
        "relative group h-[520px] w-[260px] overflow-hidden rounded-[8px] border-2 border-black/25 bg-[#f4f4f4] text-black shadow-[0_0_30px_rgba(0,0,0,0.3)] md:h-[560px] md:w-[280px] lg:h-[620px] lg:w-[320px]",
        className,
      )}
      animate={panelControls}
    >
      {/* Background gradients and authentic textures */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_0%,#ffffff_0%,#f2f2f2_45%,#e4e4e4_100%)]" />

      <div
        className={joinClassNames(
          "absolute inset-0 pointer-events-none transition-opacity duration-200",
          isBooting || idleFlicker ? "opacity-70" : "opacity-30",
        )}
      >
        <div className="absolute inset-0 bg-[#56ccf2] blur-3xl opacity-15" />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-[linear-gradient(to_bottom,transparent_0%,transparent_50%,black_51%,transparent_52%)] bg-[length:100%_4px]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_35px_rgba(0,0,0,0.2)]" />

      {/* Main Chamber Large Numbers */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <motion.h1
          className="text-[11.5rem] md:text-[12.5rem] lg:text-[14rem] font-black leading-none tracking-[-8px] text-black select-none"
          style={{ fontFamily: "DIN, Helvetica, Arial, sans-serif" }}
          animate={numberControls}
        >
          {id}
        </motion.h1>
      </div>

      {/* Barcode section: Aligned towards the right edge with a small margin */}
      <div className="absolute top-[315px] left-6 right-5 z-10">
        <div className="mb-1 text-xs font-mono font-bold tracking-wider text-black/80">
          {id}/03
        </div>
        <div className="w-full border-t-[1.5px] border-black/80 mb-0.5" />
        <div className="flex h-7 items-end justify-between gap-[2px]">
          {barcodeBars.map((bar, index) => (
            <div
              key={`${index}-${bar.height}`}
              className="bg-black flex-1"
              style={{ maxWidth: "4px", minWidth: "2px", height: `${bar.height}px` }}
            />
          ))}
        </div>
      </div>

      {/* Horizontal divider line above pictograms */}
      <div className="absolute top-[375px] left-6 right-5 z-10 h-[1.5px] bg-black/70" />

      {/* Pictograms / Danger Sign Grid */}
      <div className="absolute bottom-20 left-6 right-6 z-20">
        <div className="grid grid-cols-4 gap-2">
          {chamberIcons.map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              className="flex aspect-square items-center justify-center border border-black/30 bg-white p-1 shadow-sm"
            >
              <img
                src={item.src}
                alt="Chamber Hazard Icon"
                className={joinClassNames(
                  "h-full w-full object-contain select-none transition-opacity duration-300",
                  item.isOn ? "opacity-100" : "opacity-50",
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Iconic Aperture logo on left, Status badge on right */}
      <div className="absolute bottom-7 left-6 right-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/icons/Aperture-Science-Emblem.png"
            alt="Aperture Laboratories"
            className="h-5 w-5 object-contain select-none"
          />
          <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-black/85 select-none">
            APERTURE <span className="font-light tracking-[0.15em] text-[8px] hidden sm:inline">LABORATORIES</span>
          </p>
        </div>

        {/* Status Badge with Neon Blue for ACTIVE */}
        <div
          className={joinClassNames(
            "px-2.5 py-1 text-xs font-mono font-bold tracking-widest border transition-all",
            status === "COMPLETED"
              ? "border-emerald-600 bg-emerald-500/10 text-emerald-700"
              : status === "ACTIVE"
              ? "border-[#00c8ff] bg-[#00c8ff]/15 text-[#007ba7] shadow-[0_0_14px_rgba(0,200,255,0.45)]"
              : "border-orange-500 bg-orange-500/10 text-orange-600",
          )}
        >
          {status}
        </div>
      </div>

      {/* Hover illumination */}
      <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-10 bg-gradient-to-r from-[#56ccf2]/10 via-white/10 to-[#56ccf2]/5 blur-3xl" />
      </div>
    </motion.div>
  );
}
