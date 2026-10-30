"use client";

import { useMemo, useState } from "react";
import { Footer } from "../../home/components/Footer";
import { useGuestbook } from "../hooks/useGuestbook";
import { useGuestbookAuth } from "../hooks/useGuestbookAuth";
import type { GuestbookNoteInsert } from "../types";
import { AuthGuard } from "./AuthGuard";
import { BodyNotes } from "./BodyNotes";
import { HeaderTitle } from "./HeaderTitle";
import { PopupCreateNote } from "./PopupCreateNote";
import { BackgroundTransmissions } from "./BackgroundTransmissions";

export default function GuestbookContainer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useGuestbookAuth();
  const { notes, isLoading, isSubmitting, error, addNote } = useGuestbook({
    limit: 12,
  });

  const statusMessage = useMemo(() => {
    if (!error) return null;
    return (
      <div className="border border-dashed border-amber-500/60 bg-amber-950/20 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-amber-400">
        [ AVISO: FEED EN MODO OFFLINE // DESPLEGANDO REGISTROS EN CACHÉ ]
      </div>
    );
  }, [error]);

  const handleSubmit = async (note: GuestbookNoteInsert) => {
    await addNote(note);
    setIsDialogOpen(false);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#040405] text-white">
      {/* Background Animated Transmissions Stream */}
      <BackgroundTransmissions />

      {/* Subtle CRT Terminal Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.06),transparent_65%)]" />

      <section className="relative min-h-screen px-4 pb-20 pt-24 sm:px-6 md:px-8">
        {/* Main Terminal Frame with Amber Dashed Border */}
        <div className="mx-auto w-full max-w-7xl border-2 border-dashed border-amber-500/80 bg-black/95 p-6 shadow-[0_0_50px_rgba(245,158,11,0.12)] sm:p-10 md:p-12">
          {/* Top Title & ASCII Logo Header */}
          <HeaderTitle />

          {/* Action / Auth Control Bar */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-dashed border-amber-500/40 py-4">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-amber-500/80">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>
                [ TERMINAL ONLINE // REGISTROS: {notes.length} ]
              </span>
            </div>

            <AuthGuard>
              <button
                type="button"
                onClick={() => setIsDialogOpen(true)}
                className="inline-flex items-center gap-2 border border-dashed border-amber-400 bg-amber-400/20 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-amber-300 transition-all duration-200 hover:bg-amber-400 hover:text-black hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              >
                <span>[ + DEJAR UN MENSAJE ]</span>
              </button>
            </AuthGuard>
          </div>

          {!user && !isLoading && (
            <div className="mt-6 border border-dashed border-amber-500/40 bg-amber-950/15 px-4 py-2.5 text-center font-mono text-xs uppercase tracking-[0.2em] text-amber-500/90">
              [ ACCESO IDENTIFICADO REQUERIDO PARA TRANSMITIR UN MENSAJE // INICIA SESIÓN CON GITHUB O GOOGLE ARRIBA ]
            </div>
          )}

          {statusMessage && <div className="mt-6">{statusMessage}</div>}

          {/* Messages Feed Grid (3 Columns Dashed Boxes) */}
          <div className="mt-8">
            <BodyNotes notes={notes} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* Creation Modal */}
      <PopupCreateNote
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        initialName={
          typeof user?.name === "string" ? user.name : user?.email ?? ""
        }
        initialEmail={user?.email ?? ""}
      />

      <Footer />
    </main>
  );
}
