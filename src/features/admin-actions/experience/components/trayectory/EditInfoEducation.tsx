"use client";

import { ArrowRight } from "lucide-react";

interface EditInfoEducationProps {
    data: { titulo: string; descripcion: string; institution: string; obtainedDate: string };
    onChange: (data: EditInfoEducationProps["data"]) => void;
    onContinue: () => void;
    onDelete: () => void;
    error: string;
}

export const EditInfoEducation = ({ data, onChange, onContinue, onDelete, error }: EditInfoEducationProps) => {
    return (
        <div className="space-y-5">
            <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">Titulo:</label>
                <input type="text" value={data.titulo} onChange={(e) => onChange({ ...data, titulo: e.target.value })}
                    className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-aperture-blue/60" />
            </div>
            <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">Descripción:</label>
                <textarea value={data.descripcion} onChange={(e) => onChange({ ...data, descripcion: e.target.value })} rows={4}
                    className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-aperture-blue/60 resize-none" />
            </div>
            <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">Institución:</label>
                <input type="text" value={data.institution} onChange={(e) => onChange({ ...data, institution: e.target.value })}
                    className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-aperture-blue/60" />
            </div>
            <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">Fecha de Obtención:</label>
                <input type="date" value={data.obtainedDate} onChange={(e) => onChange({ ...data, obtainedDate: e.target.value })}
                    className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-aperture-blue/60" />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onDelete}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-red-400 transition hover:bg-red-500/20">
                    Eliminar
                </button>
                <div className="flex-1" />
                <button type="button" onClick={onContinue}
                    className="flex items-center gap-2 rounded-lg border border-aperture-blue/50 bg-aperture-blue/10 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/20 hover:text-white">
                    <span>Siguiente: Imagen y Tecnologías</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
};
