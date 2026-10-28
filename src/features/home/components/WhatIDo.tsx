import type { HomeService } from "../types";

type WhatIDoProps = {
  services: HomeService[];
};

export const WhatIDo = ({ services }: WhatIDoProps) => {
  const sortedServices = [...services].sort((a, b) => {
    const numA = Number(a.id);
    const numB = Number(b.id);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return String(a.id).localeCompare(String(b.id));
  });

  return (
    <div className="mx-auto w-full max-w-[77.76rem]">
      <div className="flex flex-col gap-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.5em] text-aperture-blue">
          Division // Capabilities
        </p>
        <h2 className="text-4xl font-black text-white sm:text-5xl">WHAT I DO</h2>
      </div>

      {sortedServices.length === 0 ? (
        <div className="glass-panel mx-auto mt-12 max-w-2xl rounded-2xl px-6 py-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-aperture-yellow">
            Capabilities // Status: Offline
          </p>
          <p className="mt-3 text-sm text-zinc-300">
            Actualmente no hay servicios o capacidades registradas en esta sección.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {sortedServices.map((service) => (
            <div
              key={service.id}
              className="glass-panel flex h-full flex-col gap-6 rounded-2xl px-6 py-8 text-white transition-all duration-300 hover:border-aperture-blue/40 hover:shadow-[0_0_30px_rgba(86,204,242,0.12)]"
            >
              <div className="flex items-start">
                <span className="font-mono text-sm font-semibold text-aperture-yellow">
                  ({service.id})
                </span>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">{service.title}</h3>
                <p className="text-sm leading-6 text-zinc-300">
                  {service.description}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                {service.highlights.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-aperture-gray/70 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-aperture-blue"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
