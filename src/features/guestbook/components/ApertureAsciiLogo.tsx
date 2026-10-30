"use client";

const ASCII_APERTURE_LOGO = `                 -                 
          ::::#X:::X#::::          
       ::M%MX#X:::X#XX#HHE::       
     ::MM%MM%XX::X#XX#HHEHHE::     
    :%::%MM%MX::X#XX#XHE:::::E:    
   :%M:::M%MM:::#XX#:::::EHHEHH:   
  :%MM%::%MM%::.....:EHHEHHEHHEH:  
 ::EE%MM::M%..       ..:HHEHHEMM:: 
 :EE$EE$:::..         ..::::%MM%M: 
 :E$EE$EE:..           ..M::::::M: 
|::::$EE$E..           ..M%MM%::::|
 :E::::::E..           ..:MM%MM%M: 
 :E$EE$::::..         ..:::%MM%MM: 
 ::EEXHHXHH:..       ..XE::EEXMM:: 
  :HXHHXHHXHHX:.....::XEEX::XEEX:  
   :HHXHHX:::::#MM#:::EEXE:::EX:   
    :X:::::XHM#MM#M::MEXEEX::X:    
     ::XHHXHH#MM#M::MMXEEXEE::     
       ::XHH#MM#M:::M#MEXE::       
          ::::#M:::M#::::          
                 -                 `;

interface ApertureAsciiLogoProps {
  className?: string;
}

export const ApertureAsciiLogo = ({ className = "" }: ApertureAsciiLogoProps) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-3 select-none ${className}`.trim()}
    >
      <pre
        className="font-mono text-[8px] sm:text-[10px] md:text-[11px] lg:text-[12px] leading-[8px] sm:leading-[10px] md:leading-[11px] lg:leading-[12px] tracking-tight text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] whitespace-pre font-bold"
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
