"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IBMPCMonitor from "../IBMPCMonitor";
import PortalPanel from "../PortalPanel";
import type { EducationPublication } from "../../types";
import { generateBubblePositions } from "../../utils/bubblePositions";

export default function College({ data }: { data: EducationPublication }) {
	const [screenIndex, setScreenIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const bubbleItems = useMemo(
		() => [
			...(data.topics ?? []).map((t) => ({ id: `topic-${t.id}`, name: t.name, isTopic: true })),
			...(data.technologies ?? []).map((tech) => ({ id: `tech-${tech.id}`, name: tech.name, isTopic: false })),
		],
		[data.topics, data.technologies]
	);
	const bubblePositions = useMemo(() => generateBubblePositions(bubbleItems.length), [bubbleItems.length]);

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

					{/* Mobile visible: topics + technologies */}
					{bubbleItems.length > 0 && (
						<div className="flex flex-wrap gap-2 md:hidden">
							{bubbleItems.map((item) => (
								<span
									key={item.id}
									className={
										item.isTopic
											? "rounded-full border border-aperture-gray/70 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-aperture-yellow"
											: "rounded-full border border-aperture-blue/50 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-aperture-blue"
									}
								>
									{item.name}
								</span>
							))}
						</div>
					)}
				</div>

				<div className="relative">
					<IBMPCMonitor
						screenClassName="h-[325px]"
						currentScreen={screenIndex}
						totalScreens={2}
						onScreenChange={setScreenIndex}
						onMouseEnter={() => setIsPaused(true)}
						onMouseLeave={() => setIsPaused(false)}
					>
						<div className="relative h-[325px] w-full overflow-hidden rounded-[8px] bg-[#0a0a0c]">
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
											<div className="relative h-full w-full overflow-hidden">
												<img
													src={data.image_path}
													alt={data.image_description || data.title}
													className="h-full w-full object-cover"
												/>
												{data.image_description && (
													<div className="pointer-events-none absolute inset-x-2 bottom-2 z-20">
														<div className="w-full rounded-xl bg-black/80 px-4 py-2.5 backdrop-blur-md border border-white/10 shadow-lg">
															<p className="font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.16em] text-white text-left uppercase">
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

					{/* Topics and technologies as floating bubbles */}
					<div className="pointer-events-none absolute inset-0 hidden md:block">
						{bubbleItems.map((item, i) => {
							const pos = bubblePositions[i];
							if (!pos) return null;
							return (
								<div
									key={item.id}
									className={`absolute rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] ${
										item.isTopic
											? "border border-aperture-yellow/70 bg-aperture-yellow/20 text-aperture-yellow shadow-[0_0_20px_rgba(242,201,76,0.25)]"
											: "border border-aperture-blue/70 bg-aperture-blue/20 text-aperture-blue shadow-[0_0_20px_rgba(86,204,242,0.25)]"
									}`}
									style={{
										top: pos.top,
										right: pos.right,
										animation: `bubbleFloat ${3 + i * 0.5}s ease-in-out infinite`,
										animationDelay: `${i * 0.4}s`,
									}}
								>
									{item.name}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
