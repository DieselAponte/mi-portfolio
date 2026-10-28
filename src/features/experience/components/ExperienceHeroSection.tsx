"use client";

import { motion } from "framer-motion";
import type { ExperienceCertification, ExperienceCarouselItem } from "../types";

interface HeroSectionProps {
	certifications: ExperienceCertification[];
	carouselItems: ExperienceCarouselItem[];
}

const AutoCarousel = ({ items }: { items: ExperienceCarouselItem[] }) => {
	if (items.length === 0) {
		return (
			<div className="flex h-[240px] w-full items-center justify-center rounded-2xl border border-aperture-yellow/20 bg-[#10100b] p-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
				<p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
					Sin capturas o logs visuales en el carrusel
				</p>
			</div>
		);
	}

	const trackItems = [...items, ...items];

	return (
		<div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-aperture-yellow/20 bg-[#10100b]/80 backdrop-blur-sm p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:p-5">
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
			{/* Background Video */}
			<div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
				<video
					autoPlay
					loop
					muted
					playsInline
					preload="auto"
					src="/videos/experience-wheatley-floating-background.mp4"
					className="h-full w-full object-cover opacity-65"
				/>
			</div>
			<div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/45 to-[#0a0a0c]" />

			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(242,201,76,0.12),transparent_55%)]" />
			<div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_bottom,transparent_0%,transparent_50%,black_51%,transparent_52%)] bg-[length:100%_4px]" />

			<div className="relative mx-auto w-full max-w-7xl">
				<div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
					<div className="min-w-0 space-y-6">
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

				{certifications.length > 0 ? (
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
				) : (
					<div className="mt-12 border-t border-white/10 pt-6">
						<p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
							Sin certificaciones registradas actualmente
						</p>
					</div>
				)}
			</div>
		</section>
	);
}
