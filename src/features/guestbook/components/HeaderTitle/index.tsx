import { ApertureAsciiLogo } from "../ApertureAsciiLogo";

export const HeaderTitle = () => {
  return (
    <header className="grid items-start gap-8 lg:grid-cols-[1fr_auto]">
      <div className="space-y-5">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-amber-500/80">
          <span>&gt;&gt;</span>
          <span>TERMINAL // GUESTBOOK TRANSMISSION</span>
        </div>

        <h1
          className="text-4xl font-black tracking-tight text-amber-400 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          style={{ fontFamily: "DIN, Helvetica, Arial, sans-serif" }}
        >
          Deja un mensaje
        </h1>

        <p className="max-w-4xl text-lg font-semibold leading-relaxed text-amber-500 sm:text-xl md:text-2xl lg:text-[1.7rem]">
          Si algo de todo esto te hace algo de sentido o si simplemente te
          parecio interesante, dejame conocer lo que piensas. Toda transmisión
          queda registrada en el registro de calibración de Aperture Science para
          continuar optimizando la arquitectura y compartiendo nuevos experimentos.
        </p>
      </div>

      <div className="flex justify-center lg:justify-end">
        <ApertureAsciiLogo />
      </div>
    </header>
  );
};
