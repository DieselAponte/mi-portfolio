"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGuestbookAuth } from "../../features/guestbook/hooks/useGuestbookAuth";
import { LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Book a Call", href: "/book-a-call" },
  { label: "Guestbook", href: "/guestbook" },
];

const joinClassNames = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

const isActivePath = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
};

export default function CentralNavBar() {
  const pathname = usePathname();
  const { user, isLoading, signOut } = useGuestbookAuth();

  // Dynamic Priority+ Navigation state
  const [visibleCount, setVisibleCount] = useState<number>(ALL_NAV_ITEMS.length);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const measureContainerRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const itemWidthsRef = useRef<number[]>([]);
  const moreWidthRef = useRef<number>(75);

  // Responsive measurement algorithm for Priority+ Navbar
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current || !measureContainerRef.current) return;

      // 1. Measure widths from the offscreen measurement strip
      const hiddenChildren = measureContainerRef.current.children;
      for (let i = 0; i < ALL_NAV_ITEMS.length; i++) {
        const child = hiddenChildren[i] as HTMLElement | undefined;
        if (child) {
          itemWidthsRef.current[i] = child.offsetWidth;
        }
      }
      const moreChild = hiddenChildren[ALL_NAV_ITEMS.length] as HTMLElement | undefined;
      if (moreChild) {
        moreWidthRef.current = moreChild.offsetWidth;
      }

      // 2. Compute available space
      const totalNavWidth = containerRef.current.clientWidth;
      const profileWidth = profileRef.current?.offsetWidth || 0;

      // Determine gap between items (gap-4 is 16px, sm:gap-6 is 24px)
      const gap = window.innerWidth >= 640 ? 24 : 16;
      // Reserve space for padding, profile section, and separator line
      const reservedPadding = 56 + profileWidth;
      const availableSpace = Math.max(0, totalNavWidth - reservedPadding);

      // 3. Check if all items fit without needing "More"
      let totalAllWidth = 0;
      for (let i = 0; i < ALL_NAV_ITEMS.length; i++) {
        totalAllWidth += (itemWidthsRef.current[i] || 90) + (i > 0 ? gap : 0);
      }

      if (totalAllWidth <= availableSpace) {
        setVisibleCount(ALL_NAV_ITEMS.length);
        return;
      }

      // 4. Not all items fit: calculate how many items fit alongside "More"
      const moreBtnWidth = (moreWidthRef.current || 75) + gap;
      const spaceForItems = availableSpace - moreBtnWidth;

      let accumulated = 0;
      let count = 0;
      for (let i = 0; i < ALL_NAV_ITEMS.length; i++) {
        const itemWidth = itemWidthsRef.current[i] || 90;
        const required = (count === 0 ? itemWidth : itemWidth + gap);
        if (accumulated + required <= spaceForItems) {
          accumulated += required;
          count++;
        } else {
          break;
        }
      }

      // Keep at least 1 item visible (e.g. Home)
      setVisibleCount(Math.max(1, count));
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    if (isMoreOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMoreOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  const visibleItems = useMemo(
    () => ALL_NAV_ITEMS.slice(0, visibleCount),
    [visibleCount]
  );

  const overflowItems = useMemo(
    () => ALL_NAV_ITEMS.slice(visibleCount),
    [visibleCount]
  );

  const hasMoreActive = overflowItems.some((item) =>
    isActivePath(pathname, item.href)
  );

  return (
    <nav className="fixed left-1/2 top-6 z-50 w-[min(92vw,1000px)] -translate-x-1/2">
      {/* Offscreen measurement container for Priority+ layout calculation */}
      <div
        ref={measureContainerRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 -z-50 flex items-center gap-4 sm:gap-6 whitespace-nowrap opacity-0"
        style={{ visibility: "hidden" }}
      >
        {ALL_NAV_ITEMS.map((item) => (
          <span
            key={item.href}
            className="px-3 py-2 text-[11px] font-mono uppercase tracking-[0.35em]"
          >
            {item.label}
          </span>
        ))}
        <span className="px-3 py-2 text-[11px] font-mono uppercase tracking-[0.35em]">
          More
        </span>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-visible rounded-[999px] border border-white/10 bg-black/70 px-4 py-3 backdrop-blur flex items-center justify-between"
      >
        <div className="absolute inset-0 opacity-[0.1] bg-[linear-gradient(to_bottom,transparent_0%,transparent_50%,black_51%,transparent_52%)] bg-[length:100%_4px] rounded-[999px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(86,204,242,0.2),transparent_60%)] rounded-[999px]" />

        {/* Priority+ Dynamic Items Bar */}
        <div className="relative flex items-center gap-4 sm:gap-6 flex-nowrap whitespace-nowrap min-w-0">
          {visibleItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={joinClassNames(
                  "relative px-3 py-2 text-[11px] font-mono uppercase tracking-[0.35em] text-zinc-300 transition shrink-0",
                  "after:absolute after:-bottom-1 after:left-1/2 after:h-[2px] after:w-8 after:-translate-x-1/2 after:bg-aperture-blue after:content-[''] after:transition after:duration-300 after:scale-x-0",
                  active
                    ? "text-aperture-blue after:scale-x-100"
                    : "hover:text-aperture-blue",
                )}
              >
                {item.label}
              </Link>
            );
          })}

          {/* "More" dropdown only appears when items overflow */}
          {overflowItems.length > 0 && (
            <div ref={moreDropdownRef} className="group relative shrink-0">
              <button
                type="button"
                onClick={() => setIsMoreOpen((prev) => !prev)}
                className={joinClassNames(
                  "relative flex items-center gap-1.5 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.35em] text-zinc-300 transition",
                  "after:absolute after:-bottom-1 after:left-1/2 after:h-[2px] after:w-8 after:-translate-x-1/2 after:bg-aperture-blue after:content-[''] after:transition after:duration-300 after:scale-x-0",
                  hasMoreActive
                    ? "text-aperture-blue after:scale-x-100"
                    : "hover:text-aperture-blue",
                )}
              >
                <span>More</span>
                <ChevronDown
                  className={joinClassNames(
                    "h-3 w-3 transition-transform duration-200",
                    isMoreOpen ? "rotate-180 text-aperture-blue" : "text-zinc-500 group-hover:text-zinc-300"
                  )}
                />
              </button>

              <div
                className={joinClassNames(
                  "absolute left-1/2 top-full z-50 mt-3 w-48 -translate-x-1/2 transition-all duration-200",
                  isMoreOpen
                    ? "translate-y-0 opacity-100 visible"
                    : "translate-y-2 opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible"
                )}
              >
                <div className="rounded-xl border border-white/10 bg-black/95 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
                  <div className="px-2 py-1 mb-1 border-b border-white/10">
                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500">
                      Navegación Adicional
                    </p>
                  </div>
                  {overflowItems.map((item) => {
                    const active = isActivePath(pathname, item.href);

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMoreOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={joinClassNames(
                          "flex items-center justify-between rounded-lg px-3 py-2 text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-300 transition",
                          active
                            ? "bg-aperture-blue/20 text-aperture-blue font-semibold"
                            : "hover:bg-white/5 hover:text-aperture-blue",
                        )}
                      >
                        {item.label}
                        <span className="text-xs text-zinc-500">{"//"}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile / Guestbook Auth */}
        <div
          ref={profileRef}
          className="relative flex items-center pl-4 border-l border-white/10 ml-2 shrink-0"
        >
          {isLoading ? (
            <div className="h-6 w-24 bg-white/10 animate-pulse rounded-full" />
          ) : user ? (
            <div className="group relative flex items-center gap-2">
              <div className="flex items-center gap-2 cursor-pointer">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={24}
                    height={24}
                    className="rounded-full border border-white/20"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-aperture-blue/20 border border-aperture-blue/50 flex items-center justify-center text-aperture-blue">
                    <UserIcon className="h-3 w-3" />
                  </div>
                )}
                <span className="text-[10px] font-mono text-zinc-300 hidden md:block">
                  {user.name?.split(" ")[0] || user?.email?.split("@")[0]}
                </span>
              </div>

              <div className="absolute right-0 top-full mt-4 w-52 opacity-0 invisible transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 pt-2">
                <div className="rounded-xl border border-white/10 bg-black/95 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.4)] backdrop-blur-md">
                  <div className="px-3 py-2 border-b border-white/10 mb-2">
                    <p className="text-xs text-white truncate">
                      {user.name || user?.email?.split("@")[0]}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                  </div>

                  <Link
                    href="/book-a-call"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-zinc-300 transition hover:bg-white/5 hover:text-aperture-blue"
                  >
                    Contactar al desarrollador
                  </Link>

                  {user.role === "admin" && (
                    <>
                      <Link
                        href="/admin/actions"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-aperture-yellow transition hover:bg-white/5"
                      >
                        Ir a panel de acciones
                      </Link>
                      <Link
                        href="/admin/users"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-aperture-orange transition hover:bg-white/5"
                      >
                        Ver usuarios
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => void signOut()}
                    className="w-full mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-red-400 transition hover:bg-red-400/10"
                  >
                    <LogOut className="h-3 w-3" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/guestbook"
              className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
