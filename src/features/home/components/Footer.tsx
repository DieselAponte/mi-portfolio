import Link from "next/link";
import Image from "next/image";

interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

const footerLinkGroups: Record<string, FooterLinkItem[]> = {
  Navegación: [
    { label: "Home", href: "/" },
    { label: "Experience", href: "/experience" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Guestbook", href: "/guestbook" },
  ],
  Secciones: [
    { label: "What I Do", href: "/#what-i-do" },
    { label: "Cases of Study", href: "/#cases" },
    { label: "About Me", href: "/#about" },
    { label: "Book a Call", href: "/book-a-call" },
  ],
  Contacto: [
    { label: "Agendar Llamada", href: "/book-a-call" },
    { label: "Mensaje Directo", href: "/#contact" },
    { label: "GitHub", href: "https://github.com/apontedev", external: true },
  ],
};

export interface FooterProps {
  className?: string;
}

export const Footer = ({ className = "" }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`relative z-10 border-t border-aperture-gray/60 bg-[#0a0a0c] ${className}`.trim()}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-aperture-blue/30 bg-[#101014] p-3 shadow-[0_0_25px_rgba(86,204,242,0.15)] transition-all duration-300 hover:border-aperture-blue/60 hover:shadow-[0_0_35px_rgba(86,204,242,0.3)]">
              <Image
                src="/icons/Aperture-Science-Emblem.png"
                alt="Aperture Science Emblem"
                width={56}
                height={56}
                className="object-contain filter drop-shadow-[0_0_8px_rgba(86,204,242,0.5)]"
              />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold tracking-tight text-white">Diesel Aponte</p>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-aperture-blue">
                Aperture Division
              </p>
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                Full-Stack Developer
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {Object.entries(footerLinkGroups).map(([title, links]) => (
              <div key={title} className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-aperture-yellow">
                  {title}
                </p>
                <div className="flex flex-col gap-2 text-sm text-zinc-400">
                  {links.map((link) =>
                    link.external ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-aperture-orange"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="transition hover:text-aperture-orange"
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-aperture-gray/40 pt-6 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
            © {currentYear} Diesel Aponte. All rights reserved
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">
            Aperture Science Portfolio Stack
          </p>
        </div>
      </div>
    </footer>
  );
};
