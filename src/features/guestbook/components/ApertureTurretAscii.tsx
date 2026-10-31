"use client";

const ASCII_SENTRY_TURRET = `             |
             |
         .:::!:::.
        :X#######X:
      .::XX#####XX::.
      :XXXX##|##XXXX:
     :XXXXX##|##XXXXX:
    .:XX####X|X####XX:.
   /  ###X###|###X###  \\
  | [=  XX##(@)##XX  =] |
  | [=  XX###|###XX  =] |
  |     XXXX#|#XXXX     |
   \\  .::XXX#|#XXX::.  /
    '-' :XXXX|XXXX: '-'
         :XXX|XXX:
          :XX|XX:
           \\ | /
          .-'|'-.
         / / | \\ \\
        / /  |  \\ \\
       / /   |   \\ \\
      / /    |    \\ \\
     /_/     |     \\_\\
    /        |        \\
   /'        |        '\\`;

interface ApertureTurretAsciiProps {
  className?: string;
}

export const ApertureTurretAscii = ({ className = "" }: ApertureTurretAsciiProps) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-2 select-none ${className}`.trim()}
    >
      <pre
        className="font-mono text-[7px] min-[380px]:text-[8px] sm:text-[10px] md:text-[11px] lg:text-[12px] leading-[7px] min-[380px]:leading-[8px] sm:leading-[10px] md:leading-[11px] lg:leading-[12px] tracking-tight text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] whitespace-pre font-bold"
        aria-label="Aperture Science Sentry Turret ASCII Illustration"
      >
        {ASCII_SENTRY_TURRET}
      </pre>
      <div className="mt-2.5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.28em] text-amber-500/80">
        <span>[ SENTRY // TURRET_V2 ]</span>
      </div>
    </div>
  );
};
