"use client";

import { motion } from "framer-motion";
import type { ExperienceCertification, ExperienceCarouselItem } from "../types";

interface HeroSectionProps {
	certifications: ExperienceCertification[];
	carouselItems: ExperienceCarouselItem[];
}

const AutoCarousel = ({ items }: { items: ExperienceCarouselItem[] }) => {
	const trackItems = [...items, ...items];

	return (
		<div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-aperture-yellow/20 bg-[#10100b] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:p-5">
			<div className="absolute inset-0 pointer-events-none opacity-[0.12] bg-[linear-gradient(to_bottom,transparent_0%,transparent_50%,black_51%,transparent_52%)] bg-[length:100%_4px]" />
			<div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-[radial-gradient(circle_at_top,rgba(242,201,76,0.2),transparent_60%)]" />
			<div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

			<motion.div
				className="flex gap-4 sm:gap-6"
				animate={{ x: ["0%", "-50%"] }}
				transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
				style={{ width: "max-content" }}
			>
				{trackItems.map((item, index) => (
					<div
						key={`${item.id}-${index}`}
						className="relative h-[240px] w-[180px] overflow-hidden rounded-xl border border-white/10 bg-black sm:h-[280px] sm:w-[210px] lg:h-[320px] lg:w-[240px]"
					>
						{item.image_path ? (
							<img
								src={item.image_path}
								alt={item.title}
								className="h-full w-full object-cover opacity-80"
							/>
						) : (
							<div className="h-full w-full bg-[linear-gradient(135deg,rgba(242,201,76,0.25),rgba(10,10,12,0.9))]" />
						)}
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
						<div className="absolute bottom-4 left-4 right-4 space-y-1">
							<p className="text-[10px] font-mono uppercase tracking-[0.35em] text-aperture-yellow">
								Log {String(item.id).padStart(2, "0")}
							</p>
							<p className="text-sm font-semibold text-[#f0f0f0]">
								{item.title}
							</p>
							<p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">
								{item.subtitle}
							</p>
						</div>
					</div>
				))}
			</motion.div>
		</div>
	);
};

export default function HeroSection({ certifications, carouselItems }: HeroSectionProps) {
	return (
		<section className="relative min-h-screen w-full overflow-hidden px-6 pb-24 pt-28 sm:pt-32 lg:pt-36">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(242,201,76,0.12),transparent_55%)]" />
			<div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_bottom,transparent_0%,transparent_50%,black_51%,transparent_52%)] bg-[length:100%_4px]" />

			<div className="relative mx-auto w-full max-w-7xl">
				<div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
					<div className="min-w-0 space-y-6">
						<p className="font-mono text-xs uppercase tracking-[0.35em] text-aperture-yellow sm:tracking-[0.6em]">
							Terminal // Experience
						</p>
						<div className="space-y-3">
							<p className="text-xs font-mono uppercase tracking-[0.2em] text-aperture-yellow sm:text-sm sm:tracking-[0.35em]">
								The path i&apos;m building
							</p>
							<h1
								className="break-words text-4xl font-black leading-[1.05] text-aperture-yellow sm:text-5xl lg:text-6xl xl:text-7xl"
								style={{ fontFamily: "DIN, Helvetica, Arial, sans-serif" }}
							>
								Experience,
								<br />
								learning &amp; growth
							</h1>
						</div>
						<p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
							A living log of the systems, interfaces, and research I am
							assembling. Each experiment carries its own telemetry and
							establishes the next waypoint.
						</p>

						<div className="rounded-2xl border border-aperture-yellow/20 bg-[#0b0b08]/80 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:p-7">
							<div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.4em] text-aperture-yellow">
								<span>Active terminal</span>
								<span>ONLINE</span>
							</div>
							<div className="mt-4 space-y-2 text-xs text-zinc-200">
								<div className="flex items-center gap-3">
									<span className="h-[1px] w-6 bg-aperture-yellow/60" />
									<span className="font-mono tracking-[0.2em]">
										Calibrating experience stack
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="h-[1px] w-6 bg-aperture-yellow/60" />
									<span className="font-mono tracking-[0.2em]">
										Scanning narrative checkpoints
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="h-[1px] w-6 bg-aperture-yellow/60" />
									<span className="font-mono tracking-[0.2em]">
										Verifying system readiness
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="min-w-0 space-y-6">
						<div className="flex items-center justify-between">
							<p className="font-mono text-xs uppercase tracking-[0.45em] text-aperture-yellow">
								Visual carousel
							</p>
							<span className="text-[10px] font-mono uppercase tracking-[0.35em] text-zinc-500">
								Looping
							</span>
						</div>
						<div className="w-full min-w-0 overflow-hidden">
							<AutoCarousel items={carouselItems} />
						</div>
					</div>
				</div>

				<div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-6">
					{certifications.map((badge) => (
						<div
							key={badge.id}
							className="group relative rounded-full border border-aperture-yellow/40 bg-aperture-yellow/10 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.35em] text-aperture-yellow transition hover:bg-aperture-yellow hover:text-black"
						>
							{badge.url ? (
								<a href={badge.url} target="_blank" rel="noopener noreferrer">
									{badge.title}
								</a>
							) : (
								badge.title
							)}
							<div className="pointer-events-none absolute -top-12 left-1/2 w-max -translate-x-1/2 rounded-md border border-white/10 bg-black/80 px-3 py-1 text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-200 opacity-0 transition group-hover:opacity-100">
								{badge.meta}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
