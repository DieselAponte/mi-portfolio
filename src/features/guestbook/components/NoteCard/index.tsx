"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GitBranch, Globe, Mail } from "lucide-react";
import type { GuestbookNote } from "../../types";

type NoteCardProps = {
  note: GuestbookNote;
  index: number;
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString("es-ES", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const NoteCard = ({ note, index }: NoteCardProps) => {
  const contacts = [
    note.email
      ? {
          id: "email",
          label: note.email,
          url: `mailto:${note.email}`,
          icon: Mail,
          type: "MAIL",
        }
      : null,
    note.site_url
      ? {
          id: "site",
          label: note.site_url.replace(/^https?:\/\//, ""),
          url: note.site_url,
          icon: Globe,
          type: "WEB",
        }
      : null,
    note.github_url
      ? {
          id: "github",
          label: "GitHub",
          url: note.github_url,
          icon: GitBranch,
          type: "REPO",
        }
      : null,
  ].filter(
    (item): item is {
      id: string;
      label: string;
      url: string;
      icon: typeof Mail;
      type: string;
    } => Boolean(item)
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.2) }}
      className="group relative flex h-full min-h-[300px] flex-col justify-between border-2 border-dashed border-amber-500/70 bg-[#08080a] p-5 text-white transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]"
    >
      <div>
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-500/90">
          <span className="flex items-center gap-1.5 font-bold text-amber-400">
            <span>[#LOG_{String(index + 1).padStart(2, "0")}]</span>
          </span>
          <span className="text-[10px] text-amber-500/60">
            // {formatDate(note.created_at)}
          </span>
        </div>

        {/* User Info */}
        <div className="mt-4 flex items-center gap-3">
          <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden border border-amber-500/50 bg-black">
            {note.avatar_url ? (
              <Image
                src={note.avatar_url}
                alt={note.author}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-xs uppercase text-amber-400">
                {note.author.slice(0, 2)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              &gt; {note.author}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-500/60">
              VERIFICADO // OK
            </p>
          </div>
        </div>

        {/* Message body */}
        <div className="mt-4 border-l-2 border-amber-500/40 pl-3">
          <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-200">
            {note.message}
          </p>
        </div>
      </div>

      {/* Terminal Footer Contacts */}
      <div className="mt-6 border-t border-amber-500/20 pt-3">
        {contacts.length > 0 ? (
          <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-[0.2em]">
            {contacts.map((contact) => (
              <Link
                key={contact.id}
                href={contact.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border border-amber-500/40 bg-black/50 px-2 py-1 text-amber-500 transition hover:border-amber-400 hover:bg-amber-500 hover:text-black"
              >
                <contact.icon className="h-3 w-3" />
                <span className="truncate max-w-[120px]">{contact.label}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            [ SIN CONTACTO REGISTRADO ]
          </p>
        )}
      </div>
    </motion.article>
  );
};
