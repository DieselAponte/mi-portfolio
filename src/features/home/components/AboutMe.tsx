"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface AboutMeProps {
  imageUrl?: string | null;
}

export const AboutMe = ({ imageUrl }: AboutMeProps) => {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <motion.div
        className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className="relative">
          <div className="glass-panel relative h-[320px] w-full overflow-hidden rounded-2xl">
            {imageUrl ? (
              <div className="relative h-full w-full">
                <Image
                  src={imageUrl}
                  alt="Diesel Aponte"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 450px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-3 rounded-xl border border-aperture-blue/30" />
              </div>
            ) : (
              <>
                <div className="absolute inset-4 rounded-2xl border border-aperture-gray/70" />
                <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-aperture-blue/20 blur-2xl" />
                <div className="absolute bottom-8 right-8 h-28 w-28 rounded-full bg-aperture-orange/20 blur-3xl" />
              </>
            )}
          </div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.4em] text-aperture-blue">
            (About me)
          </p>
        </div>

        <div className="space-y-6 text-white">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            I am a software engineer driven by a passion for turning ideas into
            clean, intuitive digital experiences.
          </h2>
          <p className="text-sm leading-7 text-zinc-300 sm:text-base">
            I specialize in building full-stack experiences with a focus on
            strong information architecture, animation systems, and reliable
            backend services. My work blends technical precision with
            human-centered design, ensuring every interaction feels deliberate
            and every build stays scalable.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-aperture-gray/70 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.3em] text-aperture-yellow">
              System Design
            </span>
            <span className="rounded-full border border-aperture-gray/70 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.3em] text-aperture-blue">
              Motion Direction
            </span>
            <span className="rounded-full border border-aperture-gray/70 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.3em] text-aperture-orange">
              Product Strategy
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
