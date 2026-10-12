"use client";

import { useRef } from "react";
import { Upload, Plus, Minus } from "lucide-react";
import type { Technology, Topic } from "../../../../experience/types";
import { TechTopicSelector } from "./TechTopicSelector";

interface EditPicsAdditionalInfoEducationProps {
    imagePreview: string | null;
    imageDescription: string;
    skillsLearned: string[];
    selectedTopicIds: (string | number)[];
    selectedTechIds: (string | number)[];
    technologies: Technology[];
    topics: Topic[];
    onImageChange: (file: File | null, preview: string | null) => void;
    onImageDescriptionChange: (desc: string) => void;
    onSkillsChange: (skills: string[]) => void;
    onTopicToggle: (id: string | number) => void;
    onTechToggle: (id: string | number) => void;
    onAddTechnology: (name: string) => Promise<void>;
    onDeleteTechnology: (id: string | number) => Promise<void>;
    onAddTopic: (name: string) => Promise<void>;
    onDeleteTopic: (id: string | number) => Promise<void>;
    onBack: () => void;
    onSave: () => void;
    isSaving: boolean;
    submitStatus?: "idle" | "optimizing" | "uploading" | "saving";
    error: string;
}

export const EditPicsAdditionalInfoEducation = (props: EditPicsAdditionalInfoEducationProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/tiff", "image/svg+xml"];
        if (!validTypes.includes(file.type)) return;
        const reader = new FileReader();
        reader.onload = (ev) => props.onImageChange(file, ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">Imagen</label>
                <input ref={fileInputRef} type="file" accept=".png,.jpeg,.jpg,.tiff,.svg" onChange={handleFileChange} className="hidden" />
                {props.imagePreview ? (
                    <div className="relative overflow-hidden rounded-xl border border-aperture-gray/50">
                        <img src={props.imagePreview} alt="Preview" className="h-40 w-full object-cover" />
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white transition hover:bg-black/80">
                            <Upload className="mr-1 inline h-3 w-3" /> Cambiar
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-aperture-gray/50 bg-aperture-dark/40 py-10 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition hover:border-aperture-blue/40 hover:text-aperture-blue">
                        <Upload className="h-4 w-4" /> Seleccionar imagen
                    </button>
                )}
            </div>

            <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">Descripción de la imagen:</label>
                <input type="text" value={props.imageDescription} onChange={(e) => props.onImageDescriptionChange(e.target.value)}
                    className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-aperture-blue/60" />
            </div>

            <div>
                <div className="mb-2 flex items-center gap-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">Skills ({props.skillsLearned.length}/6)</label>
                    {props.skillsLearned.length < 6 && (
                        <button type="button" onClick={() => props.onSkillsChange([...props.skillsLearned, ""])}
                            className="flex h-5 w-5 items-center justify-center rounded border border-aperture-blue/40 bg-aperture-blue/10 text-aperture-blue"><Plus className="h-2.5 w-2.5" /></button>
                    )}
                </div>
                <div className="space-y-2">
                    {props.skillsLearned.map((skill, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input type="text" value={skill}
                                onChange={(e) => { const u = [...props.skillsLearned]; u[i] = e.target.value; props.onSkillsChange(u); }}
                                className="flex-1 rounded-lg border border-aperture-gray bg-aperture-dark/80 px-3 py-2 text-xs text-white outline-none focus:border-aperture-blue/60" />
                            {props.skillsLearned.length > 3 && (
                                <button type="button" onClick={() => props.onSkillsChange(props.skillsLearned.filter((_, j) => j !== i))}
                                    className="flex h-6 w-6 items-center justify-center rounded border border-red-500/30 bg-red-500/10 text-red-400"><Minus className="h-2.5 w-2.5" /></button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <TechTopicSelector label="Topics" items={props.topics} selectedIds={props.selectedTopicIds} onToggle={props.onTopicToggle}
                onAdd={props.onAddTopic} onDelete={props.onDeleteTopic} type="topic" />
            <TechTopicSelector label="Technologies (Opcional)" items={props.technologies} selectedIds={props.selectedTechIds} onToggle={props.onTechToggle}
                onAdd={props.onAddTechnology} onDelete={props.onDeleteTechnology} type="technology" />

            {props.error && <p className="text-xs text-red-400">{props.error}</p>}

            <div className="flex gap-3 pt-2">
                <button type="button" onClick={props.onBack}
                    className="rounded-lg border border-aperture-gray px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-zinc-300 transition hover:border-white/30 hover:text-white">
                    Volver
                </button>
                <div className="flex-1" />
                <button type="button" onClick={props.onSave} disabled={props.isSaving}
                    className="rounded-lg border border-aperture-blue/50 bg-aperture-blue/10 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/20 hover:text-white disabled:opacity-50">
                    {props.isSaving ? (
                        <span className="flex items-center gap-2">
                            <span className="h-3 w-3 animate-spin rounded-full border border-aperture-blue border-t-transparent" />
                            {props.submitStatus === "optimizing" && "Optimizando..."}
                            {props.submitStatus === "uploading" && "Subiendo..."}
                            {props.submitStatus === "saving" && "Guardando..."}
                            {props.submitStatus === "idle" && "Guardando..."}
                        </span>
                    ) : "Guardar Cambios"}
                </button>
            </div>
        </div>
    );
};
