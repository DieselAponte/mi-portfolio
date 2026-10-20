"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IBMPCMonitor from "../IBMPCMonitor";
import PortalPanel from "../PortalPanel";
import type { ExperiencePublication } from "../../types";
import { generateBubblePositions } from "../../utils/bubblePositions";

export default function Experience({ data }: { data: ExperiencePublication[] }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [screenIndex, setScreenIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const activePub = data[activeIndex];
	const techs = activePub?.technologies ?? [];
	const bubblePositions = useMemo(() => generateBubblePositions(techs.length), [techs.length]);

	// Cycle through publications every 8 seconds (pause on hover)
	useEffect(() => {
		if (data.length <= 1 || isPaused) return;
		const interval = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % data.length);
			setScreenIndex(0); // Reset to screen 1 when switching publications
		}, 8000);
		return () => clearInterval(interval);
	}, [data.length, isPaused]);

	// Dual-screen carousel: alternate every 10 seconds, pause on hover
	useEffect(() => {
		if (isPaused) return;
		const interval = setInterval(() => {
			setScreenIndex((prev) => (prev + 1) % 2);
		}, 10000);
		return () => clearInterval(interval);
	}, [isPaused]);

	if (!activePub) return null;

	return (
		<section className="grid gap-10 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
			<div className="self-start hidden md:block md:sticky md:top-24">
				<PortalPanel
					id={String(activePub.id).padStart(2, "0")}
					status="ACTIVE"
				/>
			</div>

			<div className="space-y-8">
				<div className="space-y-4">
					<p className="font-mono text-xs uppercase tracking-[0.45em] text-aperture-blue">
						<span className="md:hidden">Level 03 // </span>
						Division // Professional
					</p>
					<h3
						className="text-3xl font-black text-white sm:text-4xl"
						style={{ fontFamily: "DIN, Helvetica, Arial, sans-serif" }}
					>
						{activePub.title}
					</h3>
					<p className="text-sm leading-7 text-zinc-300">
						{activePub.description}
					</p>

					{/* Mobile visible: technologies */}
					{techs.length > 0 && (
						<div className="flex flex-wrap gap-2 md:hidden">
							{techs.map((tech) => (
								<span
									key={tech.id}
									className="rounded-full border border-aperture-blue/50 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-aperture-blue"
								>
									{tech.name}
								</span>
							))}
						</div>
					)}
				</div>

				<div className="relative">
					<IBMPCMonitor
						screenClassName="h-[375px]"
						currentScreen={screenIndex}
						totalScreens={2}
						onScreenChange={setScreenIndex}
						onMouseEnter={() => setIsPaused(true)}
						onMouseLeave={() => setIsPaused(false)}
					>
						<div className="relative h-[375px] w-full overflow-hidden rounded-[8px] bg-[#0a0a0c]">
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(86,204,242,0.12),transparent_65%)]" />
							<div className="absolute inset-0 border border-white/10" />

							<AnimatePresence mode="wait">
								{screenIndex === 0 ? (
									<motion.div
										key={`${activePub.id}-screen1`}
										className="relative z-10 h-full overflow-y-auto p-6 pr-3 text-[#f0f0f0]"
										style={{
											scrollbarWidth: "thin",
											scrollbarColor: "rgba(86, 204, 242, 0.4) transparent",
										}}
										initial={{ opacity: 0, y: 12 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -12 }}
										transition={{ duration: 0.5 }}
									>
										<div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.35em] text-aperture-blue">
											<span>Log {String(activeIndex + 1).padStart(2, "0")}</span>
											<span>{activePub.details?.company}</span>
										</div>
										<div className="mt-4 space-y-2">
											<h4 className="text-lg font-semibold text-white">{activePub.title}</h4>
											<p className="text-xs uppercase tracking-[0.3em] text-aperture-yellow">
												{activePub.details?.company}
											</p>
										</div>
										{/* Responsibilities */}
										{activePub.responsibilities && activePub.responsibilities.length > 0 && (
											<div className="mt-3 space-y-1.5">
												{activePub.responsibilities.map((r, i) => (
													<div key={r.id || i} className="flex items-center gap-3 text-xs text-zinc-200">
														<span className="h-[1px] w-5 bg-aperture-blue/50" />
														<span className="font-mono tracking-[0.2em]">{r.content}</span>
													</div>
												))}
											</div>
										)}
										{/* Achievements */}
										{activePub.achievements && activePub.achievements.length > 0 && (
											<div className="mt-3 space-y-1.5">
												{activePub.achievements.map((a, i) => (
													<div key={a.id || i} className="flex items-center gap-3 text-xs text-green-300">
														<span className="h-[1px] w-5 bg-green-400/50" />
														<span className="font-mono tracking-[0.2em]">{a.content}</span>
													</div>
												))}
											</div>
										)}
									</motion.div>
								) : (
									<motion.div
										key={`${activePub.id}-screen2`}
										className="relative z-10 h-full w-full"
										initial={{ opacity: 0, y: 12 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -12 }}
										transition={{ duration: 0.5 }}
									>
										{activePub.image_path ? (
											<div className="relative h-full w-full overflow-hidden">
												<img
													src={activePub.image_path}
													alt={activePub.image_description || activePub.title}
													className="h-full w-full object-cover"
												/>
												{activePub.image_description && (
													<div className="pointer-events-none absolute inset-x-2 bottom-2 z-20">
														<div className="w-full rounded-xl bg-black/80 px-4 py-2.5 backdrop-blur-md border border-white/10 shadow-lg">
															<p className="font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.16em] text-white text-left uppercase">
																{activePub.image_description}
															</p>
														</div>
													</div>
												)}
											</div>
										) : (
											<div className="flex h-full items-center justify-center">
												<p className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.2em]">No image available</p>
											</div>
										)}
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</IBMPCMonitor>

					{/* Technologies as floating bubbles */}
					<div className="pointer-events-none absolute inset-0 hidden md:block">
						{techs.map((tech, i) => {
							const pos = bubblePositions[i];
							if (!pos) return null;
							return (
								<div
									key={tech.id}
									className="absolute rounded-full border border-aperture-blue/70 bg-aperture-blue/20 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-aperture-blue shadow-[0_0_20px_rgba(86,204,242,0.25)]"
									style={{
										top: pos.top,
										right: pos.right,
										animation: `bubbleFloat ${3 + i * 0.5}s ease-in-out infinite`,
										animationDelay: `${i * 0.4}s`,
									}}
								>
									{tech.name}
								</div>
							);
						})}
					</div>
				</div>

				{/* Publication indicator dots */}
				{data.length > 1 && (
					<div className="flex justify-center gap-2">
						{data.map((_, i) => (
							<button
								key={i}
								type="button"
								onClick={() => { setActiveIndex(i); setScreenIndex(0); }}
								className={`h-1.5 w-6 rounded-full transition ${i === activeIndex ? "bg-aperture-blue" : "bg-zinc-700 hover:bg-zinc-500"}`}
							/>
						))}
					</div>
				)}

			</div>
		</section>
	);
}
