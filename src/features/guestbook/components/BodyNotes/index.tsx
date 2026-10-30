"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { GuestbookNote } from "../../types";
import { NoteCard } from "../NoteCard";

type BodyNotesProps = {
  notes: GuestbookNote[];
  isLoading: boolean;
};

const SkeletonCard = ({ index }: { index: number }) => (
  <div
    className="animate-pulse border-2 border-dashed border-amber-500/40 bg-black/60 p-6 min-h-[260px] flex flex-col justify-between"
    style={{ animationDelay: `${index * 0.15}s` }}
  >
    <div className="space-y-3">
      <div className="h-4 w-32 bg-amber-500/20" />
      <div className="h-3 w-48 bg-amber-500/15" />
    </div>
    <div className="space-y-2 my-6">
      <div className="h-3 w-full bg-amber-500/15" />
      <div className="h-3 w-5/6 bg-amber-500/10" />
      <div className="h-3 w-2/3 bg-amber-500/10" />
    </div>
    <div className="h-4 w-28 bg-amber-500/20" />
  </div>
);

export const BodyNotes = ({ notes, isLoading }: BodyNotesProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} index={index} />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="border-2 border-dashed border-amber-500/60 bg-black/80 px-6 py-16 text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-amber-400">
          [ REGISTRO // VACÍO ]
        </p>
        <p className="mt-3 font-mono text-xs text-amber-500/80">
          No hay mensajes registrados aún en el sistema. Sé el primero en iniciar una transmisión.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {notes.map((note, index) => (
          <NoteCard key={note.id} note={note} index={index} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
