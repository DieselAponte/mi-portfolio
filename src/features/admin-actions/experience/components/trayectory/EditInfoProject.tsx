"use client";

import { Plus, Minus, ArrowRight } from "lucide-react";

interface EditInfoProjectProps {
    data: { titulo: string; descripcion: string; whyIBuiltThis: string; howItWorks: string; whatILearned: string[]; urlRepository: string };
    onChange: (data: EditInfoProjectProps["data"]) => void;
    onContinue: () => void;
    onDelete: () => void;
    error: string;
}

export const EditInfoProject = ({ data, onChange, onContinue, onDelete, error }: EditInfoProjectProps) => {
    const updateLearning = (index: number, value: string) => { const u = [...data.whatILearned]; u[index] = value; onChange({ ...data, whatILearned: u }); };
    return (
        <div className="space-y-5">
            <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">Titulo:</label>
                <input type="text" value={data.titulo} onChange={(e) => onChange({ ...data, titulo: e.target.value })}
                    className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-aperture-blue/60" />
            </div>
            <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">Descripción:</label>
                <textarea value={data.descripcion} onChange={(e) => onChange({ ...data, descripcion: e.target.value })} rows={3}
                    className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-aperture-blue/60 resize-none" />
            </div>
            <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">¿Cuál fue la motivación y qué es lo que logras?</label>
                <textarea value={data.whyIBuiltThis} onChange={(e) => onChange({ ...data, whyIBuiltThis: e.target.value })} rows={3}
                    className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-aperture-blue/60 resize-none" />
            </div>
            <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">¿Cómo lo conseguiste?</label>
                <textarea value={data.howItWorks} onChange={(e) => onChange({ ...data, howItWorks: e.target.value })} rows={3}
                    className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-aperture-blue/60 resize-none" />
            </div>
            <div>
                <div className="mb-2 flex items-center gap-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">¿Qué aprendiste? ({data.whatILearned.length}/6)</label>
                    {data.whatILearned.length < 6 && (
                        <button type="button" onClick={() => onChange({ ...data, whatILearned: [...data.whatILearned, ""] })}
                            className="flex h-5 w-5 items-center justify-center rounded border border-aperture-blue/40 bg-aperture-blue/10 text-aperture-blue"><Plus className="h-2.5 w-2.5" /></button>
                    )}
                </div>
                <div className="space-y-2">
                    {data.whatILearned.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input type="text" value={item} onChange={(e) => updateLearning(i, e.target.value)}
                                className="flex-1 rounded-lg border border-aperture-gray bg-aperture-dark/80 px-3 py-2 text-xs text-white outline-none focus:border-aperture-blue/60" />
                            {data.whatILearned.length > 3 && (
                                <button type="button" onClick={() => onChange({ ...data, whatILearned: data.whatILearned.filter((_, j) => j !== i) })}
                                    className="flex h-6 w-6 items-center justify-center rounded border border-red-500/30 bg-red-500/10 text-red-400"><Minus className="h-2.5 w-2.5" /></button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">URL del proyecto en Github:</label>
                <input type="url" value={data.urlRepository} onChange={(e) => onChange({ ...data, urlRepository: e.target.value })}
                    className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-aperture-blue/60" />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onDelete} className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-red-400 transition hover:bg-red-500/20">Eliminar</button>
                <div className="flex-1" />
                <button type="button" onClick={onContinue} className="flex items-center gap-2 rounded-lg border border-aperture-blue/50 bg-aperture-blue/10 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/20 hover:text-white">
                    <span>Siguiente: Imagen y Tecnologías</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
};
