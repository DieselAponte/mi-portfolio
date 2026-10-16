"use client";

import { useRef } from "react";
import { Upload, X, Plus, Minus } from "lucide-react";
import type { Technology, Topic } from "../../../../experience/types";
import { TechTopicSelector } from "./TechTopicSelector";

interface AddPicsAdditionalInfoEducationProps {
    imagePreview: string | null;
    imageFile: File | null;
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
    onAddTechnology: (name: string) => Promise<Technology | void>;
    onDeleteTechnology: (id: string | number) => Promise<void>;
    onAddTopic: (name: string) => Promise<Topic | void>;
    onDeleteTopic: (id: string | number) => Promise<void>;
    onSubmit: () => void;
    isSubmitting: boolean;
    submitStatus?: "idle" | "optimizing" | "uploading" | "saving";
    error: string;
}

export const AddPicsAdditionalInfoEducation = ({
    imagePreview,
    imageDescription,
    skillsLearned,
    selectedTopicIds,
    selectedTechIds,
    technologies,
    topics,
    onImageChange,
    onImageDescriptionChange,
    onSkillsChange,
    onTopicToggle,
    onTechToggle,
    onAddTechnology,
    onDeleteTechnology,
    onAddTopic,
    onDeleteTopic,
    onSubmit,
    isSubmitting,
    submitStatus = "idle",
    error,
}: AddPicsAdditionalInfoEducationProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/tiff", "image/svg+xml"];
        if (!validTypes.includes(file.type)) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => onImageChange(file, ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const addSkill = () => {
        if (skillsLearned.length < 6) {
            onSkillsChange([...skillsLearned, ""]);
        }
    };

    const removeSkill = (index: number) => {
        if (skillsLearned.length > 3) {
            onSkillsChange(skillsLearned.filter((_, i) => i !== index));
        }
    };

    const updateSkill = (index: number, value: string) => {
        const updated = [...skillsLearned];
        updated[index] = value;
        onSkillsChange(updated);
    };

    return (
        <div className="space-y-6">
            {/* Image Upload */}
            <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                    Imagen
                </label>
                <input ref={fileInputRef} type="file" accept=".png,.jpeg,.jpg,.tiff,.svg" onChange={handleFileChange} className="hidden" />
                {imagePreview ? (
                    <div className="relative overflow-hidden rounded-xl border border-aperture-gray/50">
                        <img src={imagePreview} alt="Preview" className="h-40 w-full object-cover" />
                        <button type="button" onClick={() => { onImageChange(null, null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-aperture-gray/50 bg-aperture-dark/40 py-10 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition hover:border-aperture-blue/40 hover:text-aperture-blue">
                        <Upload className="h-4 w-4" /> Seleccionar imagen (PNG, JPEG, TIFF, SVG)
                    </button>
                )}
            </div>

            {/* Image Description */}
            <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                    Descripción de la imagen:
                </label>
                <input type="text" value={imageDescription} onChange={(e) => onImageDescriptionChange(e.target.value)}
                    placeholder="Describe brevemente la imagen..."
                    className="w-full rounded-lg border border-aperture-gray bg-aperture-dark/80 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue/60" />
            </div>

            {/* Skills Learned (dynamic inputs 3-6) */}
            <div>
                <div className="mb-2 flex items-center gap-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                        Skills aprendidos ({skillsLearned.length}/6)
                    </label>
                    {skillsLearned.length < 6 && (
                        <button type="button" onClick={addSkill}
                            className="flex h-5 w-5 items-center justify-center rounded border border-aperture-blue/40 bg-aperture-blue/10 text-aperture-blue transition hover:bg-aperture-blue/20">
                            <Plus className="h-2.5 w-2.5" />
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    {skillsLearned.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input type="text" value={skill} onChange={(e) => updateSkill(index, e.target.value)}
                                placeholder={`Skill ${index + 1}`}
                                className="flex-1 rounded-lg border border-aperture-gray bg-aperture-dark/80 px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue/60" />
                            {skillsLearned.length > 3 && (
                                <button type="button" onClick={() => removeSkill(index)}
                                    className="flex h-6 w-6 items-center justify-center rounded border border-red-500/30 bg-red-500/10 text-red-400 transition hover:bg-red-500/20">
                                    <Minus className="h-2.5 w-2.5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Topics Selector */}
            <TechTopicSelector
                label="Topics"
                items={topics}
                selectedIds={selectedTopicIds}
                onToggle={onTopicToggle}
                onAdd={onAddTopic}
                onDelete={onDeleteTopic}
                type="topic"
            />

            {/* Technologies Selector */}
            <TechTopicSelector
                label="Technologies (Opcional)"
                items={technologies}
                selectedIds={selectedTechIds}
                onToggle={onTechToggle}
                onAdd={onAddTechnology}
                onDelete={onDeleteTechnology}
                type="technology"
            />

            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex justify-end pt-2">
                <button type="button" onClick={onSubmit} disabled={isSubmitting}
                    className="rounded-lg border border-aperture-blue/50 bg-aperture-blue/10 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/20 hover:text-white disabled:opacity-50">
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <span className="h-3 w-3 animate-spin rounded-full border border-aperture-blue border-t-transparent" />
                            {submitStatus === "optimizing" && "Optimizando..."}
                            {submitStatus === "uploading" && "Subiendo..."}
                            {submitStatus === "saving" && "Guardando..."}
                            {submitStatus === "idle" && "Añadiendo..."}
                        </span>
                    ) : "Añadir Publicación"}
                </button>
            </div>
        </div>
    );
};
