"use client";

const ASCII_APERTURE_LOGO = `                .---::.
          .:+sEMMMMMMH/.++:.
       ./X+ +MEMMMM#=.-%XMMMEX/,
     -+EMM: $MEMMH+..;%XMMMMMMMM+-
   :EMMEM- %MEX:.-+xxxxXHHMEMMEM#/.
  .%MEMMMH .@%-                    :
  -%MEMMM@                         -%HXS$%%%+;
--./MEMMS                          .:MMMEMMS
X# /-$MM/                            +MMMEMMS
;EMEH: :@:                             -=XMMME-
;@EEMXX,                               /H- :EMEM-
.HEEEEME+,                              %%%+..+%$:
/MMMMMMMH/.                             %MEMH: ;=
 /+4%XHH@%-                             .HEEEEEEMX,
   ;                                -%H..EEEEEMX,
    %MMMEEHHXXXS$$%+- :$MMX -MEMMM+.
     =%MMMEMMMMMH;.-+HXMEM+ /MMMMXX=
       =%MEMMM%--%EEMEEM; %MH-
         :+%+-./HMMMMMM% -`;

interface ApertureAsciiLogoProps {
  className?: string;
}

export const ApertureAsciiLogo = ({ className = "" }: ApertureAsciiLogoProps) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-3 select-none ${className}`.trim()}
    >
      <pre
        className="font-mono text-[7px] sm:text-[9px] md:text-[10.5px] leading-[8px] sm:leading-[10px] md:leading-[12px] tracking-tight text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)] whitespace-pre font-bold"
        aria-label="Aperture Science ASCII Logo"
      >
        {ASCII_APERTURE_LOGO}
      </pre>
      <div className="mt-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-amber-500/70">
        <span>[ APERTURE // SYS_01 ]</span>
      </div>
    </div>
  );
};

