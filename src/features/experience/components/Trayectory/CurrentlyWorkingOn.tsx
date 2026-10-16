"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IBMPCMonitor from "../IBMPCMonitor";
import PortalPanel from "../PortalPanel";
import { type ProjectPublication, mapProjectStatusToTrajectory } from "../../types";

// Generate floating bubble positions from technologies
const generateBubblePositions = (count: number) => {
	const positions = [
		{ top: "5%", right: "-12%" },
		{ top: "25%", right: "-18%" },
		{ top: "50%", right: "-14%" },
		{ top: "70%", right: "-10%" },
		{ top: "15%", right: "-8%" },
		{ top: "40%", right: "-20%" },
		{ top: "60%", right: "-6%" },
		{ top: "85%", right: "-16%" },
	];
	return positions.slice(0, count);
};

export default function CurrentlyWorkingOn({ data }: { data: ProjectPublication }) {
	const [screenIndex, setScreenIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const techs = data.technologies ?? [];
	const bubblePositions = useMemo(() => generateBubblePositions(techs.length), [techs.length]);

	// Dual-screen carousel: alternate every 10 seconds, pause on hover
	useEffect(() => {
		if (isPaused) return;
		const interval = setInterval(() => {
			setScreenIndex((prev) => (prev + 1) % 2);
		}, 10000);
		return () => clearInterval(interval);
	}, [isPaused]);

	return (
		<section className="grid gap-10 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
			<div className="self-start hidden md:block md:sticky md:top-24">
				<PortalPanel
					id={String(data.id).padStart(2, "0")}
					status={mapProjectStatusToTrajectory(data.details?.status)}
				/>
			</div>

			<div className="space-y-8">
				<div className="space-y-4">
					<p className="font-mono text-xs uppercase tracking-[0.45em] text-aperture-blue">
						<span className="md:hidden">Level 02 // </span>
						Division // Active Development
					</p>
					<h3
						className="text-3xl font-black text-white sm:text-4xl"
						style={{ fontFamily: "DIN, Helvetica, Arial, sans-serif" }}
					>
						{data.title}
					</h3>
					<p className="text-sm leading-7 text-zinc-300">
						{data.description}
					</p>
				</div>

				<div className="relative">
					<IBMPCMonitor
						screenClassName="h-[280px]"
						currentScreen={screenIndex}
						totalScreens={2}
						onScreenChange={setScreenIndex}
						onMouseEnter={() => setIsPaused(true)}
						onMouseLeave={() => setIsPaused(false)}
					>
						<div className="relative h-[280px] w-full overflow-hidden rounded-[8px] bg-[#0b0b10]">
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(242,201,76,0.12),transparent_70%)]" />
							<div className="absolute inset-0 border border-white/10" />

							<AnimatePresence mode="wait">
								{screenIndex === 0 ? (
									<motion.div
										key="screen1"
										className="relative z-10 h-full overflow-y-auto p-6 pr-3 text-[#f0f0f0]"
										style={{
											scrollbarWidth: "thin",
											scrollbarColor: "rgba(242, 201, 76, 0.4) transparent",
										}}
										initial={{ opacity: 0, y: 12 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -12 }}
										transition={{ duration: 0.5 }}
									>
										<p className="font-mono text-[11px] uppercase tracking-[0.35em] text-aperture-yellow">
											Live Console
										</p>
										<div className="mt-3 space-y-2.5 text-xs text-zinc-200">
											<div>
												<span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Motivación</span>
												<p className="mt-1 text-xs leading-5 text-zinc-300">{data.details?.why_i_built_this}</p>
											</div>
											<div>
												<span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Proceso</span>
												<p className="mt-1 text-xs leading-5 text-zinc-300">{data.details?.how_it_works}</p>
											</div>
											{(data.details?.what_i_learned ?? []).length > 0 && (
												<div className="mt-2 space-y-1.5">
													{data.details.what_i_learned.map((line, i) => (
														<div key={`${line}-${i}`} className="flex items-center gap-3">
															<span className="h-[1px] w-5 bg-aperture-yellow/50" />
															<span className="font-mono tracking-[0.2em]">{line}</span>
														</div>
													))}
												</div>
											)}
											{data.details?.url_repository && (
												<p className="mt-2 font-mono text-[9px] text-aperture-blue truncate">
													→ {data.details.url_repository}
												</p>
											)}
										</div>
									</motion.div>
								) : (
									<motion.div
										key="screen2"
										className="relative z-10 h-full w-full"
										initial={{ opacity: 0, y: 12 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -12 }}
										transition={{ duration: 0.5 }}
									>
										{data.image_path ? (
											<div className="relative flex h-full w-full items-center justify-center bg-black/60">
												<img
													src={data.image_path}
													alt={data.image_description || data.title}
													className="h-full w-full object-contain"
												/>
												{data.image_description && (
													<div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center justify-end pb-3">
														{/* Sombra difuminada triangular */}
														<div
															className="absolute bottom-0 h-28 w-full max-w-lg"
															style={{
																background:
																	"radial-gradient(ellipse at bottom, rgba(0, 0, 0, 0.96) 20%, rgba(0, 0, 0, 0.85) 60%, rgba(0, 0, 0, 0) 100%)",
																clipPath: "polygon(0% 100%, 100% 100%, 82% 0%, 18% 0%)",
																filter: "blur(6px)",
															}}
														/>
														<div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent" />

														<div className="relative z-10 max-w-xl px-6 text-center">
															<p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] sm:text-[11px]">
																{data.image_description}
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
									className="absolute rounded-full border border-aperture-yellow/70 bg-aperture-yellow/20 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-aperture-yellow shadow-[0_0_20px_rgba(242,201,76,0.25)]"
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
			</div>
		</section>
	);
}
