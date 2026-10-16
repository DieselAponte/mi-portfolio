"use client";

import type { ReactNode } from "react";

interface IBMPCMonitorProps {
	children: ReactNode;
	className?: string;
	screenClassName?: string;
	label?: string;
	currentScreen?: number;
	totalScreens?: number;
	onScreenChange?: (index: number) => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

const joinClassNames = (...classes: Array<string | undefined>) =>
	classes.filter(Boolean).join(" ");

export default function IBMPCMonitor({
	children,
	className,
	screenClassName,
	label = "IBM PC MONITOR",
	currentScreen,
	totalScreens = 2,
	onScreenChange,
	onMouseEnter,
	onMouseLeave,
}: IBMPCMonitorProps) {
	return (
		<div
			className={joinClassNames("relative", className)}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<div className="relative rounded-[18px] border border-white/10 bg-[#1a1a1a] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
				<div className="relative rounded-[14px] border border-white/10 bg-[#0f0f0f] p-3 shadow-[inset_0_0_40px_rgba(0,0,0,0.85)]">
					<div
						className={joinClassNames(
							"relative overflow-hidden rounded-[10px] bg-black",
							screenClassName,
						)}
						style={{ animation: "monitorFlicker 6s ease-in-out infinite" }}
					>
						<div className="relative z-10 h-full">{children}</div>

						<div
							className="absolute inset-0 pointer-events-none"
							style={{
								background:
									"radial-gradient(circle, rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 100%)",
							}}
						/>

						<div className="absolute inset-0 pointer-events-none opacity-[0.12] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0.12)_2%,transparent_4%,transparent_50%,rgba(0,0,0,0.18)_51%,transparent_52%)] bg-[length:100%_4px]" />

						<div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

						<div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.65)]" />
					</div>

					<div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#f0f0f0]/60">
						<span>{label}</span>

						{/* Viñetas manuales para pivotear entre ambas pantallas */}
						{typeof currentScreen === "number" && totalScreens > 1 && onScreenChange && (
							<div className="flex items-center gap-2">
								{Array.from({ length: totalScreens }).map((_, idx) => (
									<button
										key={idx}
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											onScreenChange(idx);
										}}
										title={idx === 0 ? "Información de sistema" : "Captura visual"}
										aria-label={`Ver pantalla ${idx + 1}`}
										className={joinClassNames(
											"h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer",
											currentScreen === idx
												? "w-6 bg-aperture-yellow shadow-[0_0_10px_rgba(242,201,76,0.7)]"
												: "w-2 bg-white/25 hover:bg-white/60",
										)}
									/>
								))}
							</div>
						)}

						<span>CRT ACTIVE</span>
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes monitorFlicker {
					0%,
					100% {
						filter: brightness(1);
					}
					24% {
						filter: brightness(1.05);
					}
					26% {
						filter: brightness(0.95);
					}
					40% {
						filter: brightness(1.08);
					}
					78% {
						filter: brightness(0.98);
					}
				}
			`}</style>
		</div>
	);
}
