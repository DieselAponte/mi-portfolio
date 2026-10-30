"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Terminal } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import type { GuestbookNoteInsert } from "../../types";
import { DashedFrame } from "../DashedFrame";

const formSchema = z.object({
  author: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  message: z
    .string()
    .trim()
    .min(8, "El mensaje debe tener al menos 8 caracteres")
    .max(500, "El mensaje no debe exceder 500 caracteres"),
  email: z
    .string()
    .trim()
    .email("Ingresa un correo electrónico válido")
    .optional()
    .or(z.literal("")),
  site_url: z
    .string()
    .trim()
    .url("Ingresa una URL válida (ej. https://tudominio.com)")
    .optional()
    .or(z.literal("")),
  github_url: z
    .string()
    .trim()
    .url("Ingresa una URL de GitHub válida")
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

type PopupCreateNoteProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: GuestbookNoteInsert) => Promise<void> | void;
  isSubmitting: boolean;
  initialName?: string;
  initialEmail?: string;
};

const defaultValues: FormValues = {
  author: "",
  message: "",
  email: "",
  site_url: "",
  github_url: "",
};

export const PopupCreateNote = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialName,
  initialEmail,
}: PopupCreateNoteProps) => {
  const [values, setValues] = useState<FormValues>(() => ({
    ...defaultValues,
    author: initialName ?? "",
    email: initialEmail ?? "",
  }));

  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpen) {
      timeoutId = setTimeout(() => {
        setValues({
          ...defaultValues,
          author: initialName ?? "",
          email: initialEmail ?? "",
        });
        setErrors({});
        setSubmitError(null);
      }, 0);
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen, initialName, initialEmail]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((prev: FormValues) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const validationResult = formSchema.safeParse(values);
    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0] as keyof FormValues;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await onSubmit({
        author: validationResult.data.author,
        message: validationResult.data.message,
        email: validationResult.data.email || undefined,
        site_url: validationResult.data.site_url || undefined,
        github_url: validationResult.data.github_url || undefined,
      });
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al transmitir el mensaje"
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="guestbook-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-xl bg-[#0a0a0c] p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] sm:p-8"
          >
            <DashedFrame dash={15} gap={11} strokeWidth={2} className="stroke-amber-500" />

            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-amber-500/40 pb-4">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-amber-400">
                <Terminal className="h-4 w-4" />
                <span id="guestbook-dialog-title">
                  [ + TRANSMISIÓN // NUEVO REGISTRO ]
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center border border-amber-500/40 text-amber-500 transition hover:border-amber-400 hover:bg-amber-500 hover:text-black"
                aria-label="Cerrar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitError && (
              <div className="mt-4 border border-dashed border-red-500/60 bg-red-950/30 px-4 py-2 font-mono text-xs text-red-400">
                [ ERROR: {submitError} ]
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Author */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.2em] text-amber-500">
                  &gt; Operador / Nombre:
                </label>
                <input
                  type="text"
                  value={values.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                  placeholder="Tu nombre o alias"
                  className="mt-1 w-full border border-dashed border-amber-500/60 bg-black/80 px-3.5 py-2 font-mono text-xs text-amber-300 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
                {errors.author && (
                  <p className="mt-1 font-mono text-[10px] text-red-400">
                    [ ! ] {errors.author}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.2em] text-amber-500">
                  &gt; Mensaje (Min. 8 caracteres):
                </label>
                <textarea
                  rows={4}
                  value={values.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Escribe tu mensaje, feedback o saludo..."
                  className="mt-1 w-full resize-none border border-dashed border-amber-500/60 bg-black/80 px-3.5 py-2 font-mono text-xs text-amber-300 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
                <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                  <span>{errors.message ? `[ ! ] ${errors.message}` : ""}</span>
                  <span>{values.message.length}/500</span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.2em] text-amber-500">
                  &gt; Correo (Opcional):
                </label>
                <input
                  type="email"
                  value={values.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="mt-1 w-full border border-dashed border-amber-500/60 bg-black/80 px-3.5 py-2 font-mono text-xs text-amber-300 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                {errors.email && (
                  <p className="mt-1 font-mono text-[10px] text-red-400">
                    [ ! ] {errors.email}
                  </p>
                )}
              </div>

              {/* Site URL & GitHub URL */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-[0.2em] text-amber-500">
                    &gt; Sitio Web (Opcional):
                  </label>
                  <input
                    type="url"
                    value={values.site_url}
                    onChange={(e) => handleChange("site_url", e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full border border-dashed border-amber-500/60 bg-black/80 px-3.5 py-2 font-mono text-xs text-amber-300 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  {errors.site_url && (
                    <p className="mt-1 font-mono text-[10px] text-red-400">
                      [ ! ] {errors.site_url}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-[0.2em] text-amber-500">
                    &gt; GitHub URL (Opcional):
                  </label>
                  <input
                    type="url"
                    value={values.github_url}
                    onChange={(e) => handleChange("github_url", e.target.value)}
                    placeholder="https://github.com/..."
                    className="mt-1 w-full border border-dashed border-amber-500/60 bg-black/80 px-3.5 py-2 font-mono text-xs text-amber-300 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  {errors.github_url && (
                    <p className="mt-1 font-mono text-[10px] text-red-400">
                      [ ! ] {errors.github_url}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="border border-dashed border-amber-500/50 bg-black/70 px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 transition hover:border-amber-400 hover:text-white disabled:opacity-50"
                >
                  [ ABORTAR ]
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 border border-dashed border-amber-500 bg-amber-500/20 px-6 py-2 font-mono text-xs uppercase tracking-[0.2em] text-amber-400 transition hover:bg-amber-500 hover:text-black hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>
                    {isSubmitting ? "[ TRANSMITIENDO... ]" : "[ TRANSMITIR ]"}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
