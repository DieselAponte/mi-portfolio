"use client";

interface DashedFrameProps {
  dash?: number;
  gap?: number;
  strokeWidth?: number;
  className?: string;
}

export const DashedFrame = ({
  dash = 15,
  gap = 11,
  strokeWidth = 2,
  className = "stroke-amber-500/80",
}: DashedFrameProps) => {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={`calc(100% - ${strokeWidth}px)`}
        height={`calc(100% - ${strokeWidth}px)`}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${gap}`}
        className={`transition-colors duration-300 ${className}`}
      />
    </svg>
  );
};

