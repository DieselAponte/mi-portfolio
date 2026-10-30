"use client";

const ASCII_APERTURE_LOGO = `                  .---::.                  
            .:+sEMMMMMMMM#/.++:.           
         ./X+ +MEMMMMMMM#=.-%XMMMEX/,      
       -+EMM: $MEMMMMMH+..;%XMMMMMMMM+-    
     :EMMEM- %MEX:.-+xxxxXHHMEMMEMMM#/.    
    .%MEMMMH .@%-         .:XMMMMMMMM%:    
    -%MEMMM@                 -%HXS$%%%+;   
  --./MEMMS                   .:MMMEMMS    
  X# /-$MM/                     +MMMEMMS   
  ;EMEH: :@:                     -=XMMME-  
  ;@EEMXX,                       /H- :EMEM- 
  .HEEEEME+,                      %%%+..+%$:
  /MMMMMMMH/.                     %MEMH: ;= 
   /+4%XHH@%-                    .HEEEEEEMX,
     ;                       -%H..EEEEEMX, 
      %MMMEEHHXXXS$$%+- :$MMX -MEMMM+.     
       =%MMMEMMMMMH;.-+HXMEM+ /MMMMXX=     
         =%MEMMM%--%EEMEEM; %MH-           
           :+%+-./HMMMMMM% -               `;

interface ApertureAsciiLogoProps {
  className?: string;
}

export const ApertureAsciiLogo = ({ className = "" }: ApertureAsciiLogoProps) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-3 select-none ${className}`.trim()}
    >
      <pre
        className="font-mono text-[7px] sm:text-[9px] md:text-[10px] lg:text-[11px] leading-[8px] sm:leading-[10px] md:leading-[11.5px] lg:leading-[12.5px] tracking-tight text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] whitespace-pre font-bold"
        aria-label="Aperture Science ASCII Logo"
      >
        {ASCII_APERTURE_LOGO}
      </pre>
      <div className="mt-2.5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-amber-500/80">
        <span>[ APERTURE // SYS_01 ]</span>
      </div>
    </div>
  );
};
