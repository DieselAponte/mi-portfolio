"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IBMPCMonitor from "../IBMPCMonitor";
import PortalPanel from "../PortalPanel";
import type { EducationPublication } from "../../types";

export default function College({ data }: { data: EducationPublication }) {
	const [screenIndex, setScreenIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

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
					status="COMPLETED"
				/>
			</div>

			<div className="space-y-8">
				<div className="space-y-4">
					<p className="font-mono text-xs uppercase tracking-[0.45em] text-aperture-blue">
						<span className="md:hidden">Level 01 // </span>
						Division // College
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

					{/* Always visible: topics + technologies */}
					<div className="flex flex-wrap gap-2">
						{(data.topics ?? []).map((topic) => (
							<span
								key={topic.id}
								className="rounded-full border border-aperture-gray/70 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-aperture-yellow"
							>
								{topic.name}
							</span>
						))}
						{(data.technologies ?? []).map((tech) => (
							<span
								key={tech.id}
								className="rounded-full border border-aperture-blue/50 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-aperture-blue"
							>
								{tech.name}
							</span>
						))}
					</div>
				</div>

				<IBMPCMonitor
					screenClassName="h-[260px]"
					currentScreen={screenIndex}
					totalScreens={2}
					onScreenChange={setScreenIndex}
					onMouseEnter={() => setIsPaused(true)}
					onMouseLeave={() => setIsPaused(false)}
				>
					<div className="relative h-[260px] w-full overflow-hidden rounded-[8px] bg-[#0a0a0c]">
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(86,204,242,0.12),transparent_65%)]" />
						<div className="absolute inset-0 border border-white/10" />

						<AnimatePresence mode="wait">
							{screenIndex === 0 ? (
								<motion.div
									key="screen1"
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
									<p className="font-mono text-[11px] uppercase tracking-[0.35em] text-aperture-blue">
										Transcript // {data.details?.institution ?? "Core Systems"}
									</p>
									<p className="mt-2 text-[10px] text-zinc-400">
										{data.details?.obtained_date ?? ""}
									</p>
									<div className="mt-4 space-y-2 text-xs text-zinc-200">
										{(data.details?.skills_learned ?? []).map((line, index) => (
											<div key={`${line}-${index}`} className="flex items-center gap-3">
												<span className="h-[1px] w-6 bg-aperture-blue/50" />
												<span className="font-mono tracking-[0.2em]">{line}</span>
											</div>
										))}
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
											<p className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
												No image available
											</p>
										</div>
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</IBMPCMonitor>
			</div>
		</section>
	);
}
