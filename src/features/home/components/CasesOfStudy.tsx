import type { HomeCaseOfStudy } from "../types";

type CasesOfStudyProps = {
  cases: HomeCaseOfStudy[];
};

export const CasesOfStudy = ({ cases }: CasesOfStudyProps) => {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.5em] text-aperture-blue">
          Timeline // Cases
        </p>
        <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">
          CASES OF STUDY
        </h2>
      </div>

      <div className="relative mt-12">
        <div className="absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 bg-aperture-gray/60 lg:block" />

        <div className="space-y-12">
          {cases.map((item, index) => {
            const isLeft = index % 2 === 0;
            const card = (
              <div className="glass-panel flex flex-col gap-6 rounded-2xl px-6 py-7">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-aperture-yellow">
                    ({String(item.id).padStart(2, "0")})
                  </span>
                  <span className="h-8 w-8 rounded-full border border-aperture-gray/60" />
                </div>
                {item.image_url ? (
                  <div className="relative h-40 w-full overflow-hidden rounded-xl border border-aperture-gray/70 bg-[#0a0a0c]">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-xl border border-aperture-gray/70 bg-aperture-dark/70 text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-400">
                    App Demo Image
                  </div>
                )}
                <div className="space-y-3 text-white">
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="text-sm leading-6 text-zinc-300">
                    {item.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-aperture-gray/70 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-aperture-blue"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );

            return (
              <div key={item.id}>
                <div className="lg:hidden">{card}</div>

                <div className="hidden items-start gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                  <div>{isLeft ? card : null}</div>
                  <div className="flex justify-center">
                    <span className="mt-10 h-4 w-4 rounded-full border-2 border-aperture-gray bg-aperture-dark" />
                  </div>
                  <div>{isLeft ? null : card}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
