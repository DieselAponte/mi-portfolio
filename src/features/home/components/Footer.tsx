const footerLinks = {
  General: [
    { label: "Home", href: "#hero" },
    { label: "What I Do", href: "#what-i-do" },
    { label: "Cases", href: "#cases" },
    { label: "About", href: "#about" },
  ],
  Specifics: [
    { label: "Contact me", href: "#contact" },
    { label: "Book a call", href: "#contact" },
  ],
  More: [
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
  ],
};

export interface FooterProps {
  className?: string;
}

export const Footer = ({ className = "" }: FooterProps) => {
  return (
    <footer className={`relative z-10 border-t border-aperture-gray/60 bg-[#0a0a0c] ${className}`.trim()}>
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full border border-aperture-gray/70 bg-aperture-gray/30" />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-white">Diesel Aponte</p>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400">
                Aperture Division
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-3">
                <p className="text-sm font-semibold text-white">{title}</p>
                <div className="flex flex-col gap-2 text-sm text-zinc-400">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="transition hover:text-aperture-orange"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">
          © Diesel Aponte. All rights reserved
        </p>
      </div>
    </footer>
  );
};
