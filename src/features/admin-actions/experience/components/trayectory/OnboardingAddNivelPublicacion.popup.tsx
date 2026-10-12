"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { PublicationType, ProjectStatus } from "../../../../experience/types";
import type { Technology, Topic } from "../../../../experience/types";
import { SelectTypeNivelPublicacion } from "./SelectTypeNivelPublicacion";
import { AddInfoEducation } from "./AddInfoEducation";
import { AddPicsAdditionalInfoEducation } from "./AddPics_AdditionalInfoEducation";
import { AddInfoProject } from "./AddInfoProject";
import { AddPicsAdditionalInfoProject } from "./AddPics_AdditionalInfoProject";
import { AddInfoExperience } from "./AddInfoExperience";
import { AddPicsAdditionalInfoExperience } from "./AddPics_AdditionalInfoExperience";

type Step = "selectType" | "step1" | "step2";

interface OnboardingAddProps {
    technologies: Technology[];
    topics: Topic[];
    currentCount: number;
    onSubmit: (
        type: PublicationType,
        baseData: Record<string, unknown>,
        details: Record<string, unknown>,
        techIds: (string | number)[],
        topicIds: (string | number)[],
        imageFile: File | null,
        responsibilities?: string[],
        achievements?: string[],
        onProgress?: (status: "optimizing" | "uploading" | "saving") => void
    ) => Promise<void>;
    onAddTechnology: (name: string) => Promise<void>;
    onDeleteTechnology: (id: string | number) => Promise<void>;
    onAddTopic: (name: string) => Promise<void>;
    onDeleteTopic: (id: string | number) => Promise<void>;
    onCancel: () => void;
}

export const OnboardingAddNivelPublicacion = ({
    technologies,
    topics,
    currentCount,
    onSubmit,
    onAddTechnology,
    onDeleteTechnology,
    onAddTopic,
    onDeleteTopic,
    onCancel,
}: OnboardingAddProps) => {
    const [step, setStep] = useState<Step>("selectType");
    const [selectedType, setSelectedType] = useState<PublicationType | null>(null);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "optimizing" | "uploading" | "saving">("idle");

    // Shared state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageDescription, setImageDescription] = useState("");
    const [selectedTechIds, setSelectedTechIds] = useState<(string | number)[]>([]);
    const [selectedTopicIds, setSelectedTopicIds] = useState<(string | number)[]>([]);

    // Education state
    const [eduData, setEduData] = useState({ titulo: "", descripcion: "", institution: "", obtainedDate: "" });
    const [skillsLearned, setSkillsLearned] = useState(["", "", ""]);

    // Project state
    const [projData, setProjData] = useState({ titulo: "", descripcion: "", whyIBuiltThis: "", howItWorks: "", whatILearned: ["", "", ""], urlRepository: "" });
    const [projStatus, setProjStatus] = useState<ProjectStatus>(ProjectStatus.DESIGN);

    // Experience state
    const [expData, setExpData] = useState({ titulo: "", descripcion: "", company: "" });
    const [responsibilities, setResponsibilities] = useState(["", "", ""]);
    const [achievements, setAchievements] = useState(["", "", ""]);

    const toggleTech = (id: string | number) => {
        setSelectedTechIds((prev) => prev.some((t) => String(t) === String(id)) ? prev.filter((t) => String(t) !== String(id)) : [...prev, id]);
    };
    const toggleTopic = (id: string | number) => {
        setSelectedTopicIds((prev) => prev.some((t) => String(t) === String(id)) ? prev.filter((t) => String(t) !== String(id)) : [...prev, id]);
    };
    const handleImageChange = (file: File | null, preview: string | null) => {
        setImageFile(file);
        setImagePreview(preview);
    };

    const handleSelectTypeContinue = () => {
        if (!selectedType) { setError("Selecciona un tipo."); return; }
        setError("");
        setStep("step1");
    };

    const handleStep1Continue = () => {
        setError("");
        if (selectedType === PublicationType.EDUCATION) {
            if (!eduData.titulo.trim() || !eduData.descripcion.trim() || !eduData.institution.trim() || !eduData.obtainedDate) {
                setError("Todos los campos son obligatorios."); return;
            }
        } else if (selectedType === PublicationType.PROJECT) {
            if (!projData.titulo.trim() || !projData.descripcion.trim() || !projData.whyIBuiltThis.trim() || !projData.howItWorks.trim()) {
                setError("Título, descripción, motivación y proceso son obligatorios."); return;
            }
            if (projData.whatILearned.filter((s) => s.trim()).length < 3) {
                setError("Al menos 3 aprendizajes son obligatorios."); return;
            }
        } else if (selectedType === PublicationType.EXPERIENCE) {
            if (!expData.titulo.trim() || !expData.descripcion.trim() || !expData.company.trim()) {
                setError("Todos los campos son obligatorios."); return;
            }
        }
        setStep("step2");
    };

    const handleFinalSubmit = async () => {
        setError("");
        if (!imageFile) { setError("La imagen es obligatoria."); return; }
        if (!imageDescription.trim()) { setError("La descripción de la imagen es obligatoria."); return; }

        setIsSubmitting(true);
        setSubmitStatus("optimizing");
        try {
            if (selectedType === PublicationType.EDUCATION) {
                if (skillsLearned.filter((s) => s.trim()).length < 3) { setError("Al menos 3 skills son obligatorios."); setIsSubmitting(false); setSubmitStatus("idle"); return; }
                await onSubmit(
                    PublicationType.EDUCATION,
                    { title: eduData.titulo.trim(), description: eduData.descripcion.trim(), image_description: imageDescription.trim(), type: PublicationType.EDUCATION, order_index: currentCount + 1 },
                    { institution: eduData.institution.trim(), obtained_date: eduData.obtainedDate, skills_learned: skillsLearned.filter((s) => s.trim()) },
                    selectedTechIds, selectedTopicIds, imageFile,
                    undefined, undefined, setSubmitStatus
                );
            } else if (selectedType === PublicationType.PROJECT) {
                await onSubmit(
                    PublicationType.PROJECT,
                    { title: projData.titulo.trim(), description: projData.descripcion.trim(), image_description: imageDescription.trim(), type: PublicationType.PROJECT, order_index: currentCount + 1 },
                    { why_i_built_this: projData.whyIBuiltThis.trim(), how_it_works: projData.howItWorks.trim(), what_i_learned: projData.whatILearned.filter((s) => s.trim()), url_repository: projData.urlRepository.trim(), status: projStatus },
                    selectedTechIds, [], imageFile,
                    undefined, undefined, setSubmitStatus
                );
            } else if (selectedType === PublicationType.EXPERIENCE) {
                if (responsibilities.filter((s) => s.trim()).length < 3) { setError("Al menos 3 responsabilidades son obligatorias."); setIsSubmitting(false); setSubmitStatus("idle"); return; }
                if (achievements.filter((s) => s.trim()).length < 3) { setError("Al menos 3 logros son obligatorios."); setIsSubmitting(false); setSubmitStatus("idle"); return; }
                await onSubmit(
                    PublicationType.EXPERIENCE,
                    { title: expData.titulo.trim(), description: expData.descripcion.trim(), image_description: imageDescription.trim(), type: PublicationType.EXPERIENCE, order_index: currentCount + 1 },
                    { company: expData.company.trim() },
                    selectedTechIds, [], imageFile,
                    responsibilities.filter((s) => s.trim()),
                    achievements.filter((s) => s.trim()),
                    setSubmitStatus
                );
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al crear publicación.");
            setIsSubmitting(false);
            setSubmitStatus("idle");
        }
    };

    const getTitle = () => {
        if (step === "selectType") return "Nueva Publicación";
        if (selectedType === PublicationType.EDUCATION) return "Creando publicación respecto a Educación";
        if (selectedType === PublicationType.PROJECT) return "Creando publicación respecto a Proyectos";
        return "Creando publicación respecto a Experiencia";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="glass-panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl px-8 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-aperture-yellow">
                        {getTitle()}
                    </h3>
                    <button onClick={onCancel} className="text-zinc-400 transition hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {step === "selectType" && (
                    <SelectTypeNivelPublicacion selected={selectedType} onSelect={setSelectedType} onContinue={handleSelectTypeContinue} />
                )}

                {step === "step1" && selectedType === PublicationType.EDUCATION && (
                    <AddInfoEducation data={eduData} onChange={setEduData} onContinue={handleStep1Continue} error={error} />
                )}
                {step === "step1" && selectedType === PublicationType.PROJECT && (
                    <AddInfoProject data={projData} onChange={setProjData} onContinue={handleStep1Continue} error={error} />
                )}
                {step === "step1" && selectedType === PublicationType.EXPERIENCE && (
                    <AddInfoExperience data={expData} onChange={setExpData} onContinue={handleStep1Continue} error={error} />
                )}

                {step === "step2" && selectedType === PublicationType.EDUCATION && (
                    <AddPicsAdditionalInfoEducation
                        imagePreview={imagePreview} imageFile={imageFile} imageDescription={imageDescription}
                        skillsLearned={skillsLearned} selectedTopicIds={selectedTopicIds} selectedTechIds={selectedTechIds}
                        technologies={technologies} topics={topics}
                        onImageChange={handleImageChange} onImageDescriptionChange={setImageDescription}
                        onSkillsChange={setSkillsLearned} onTopicToggle={toggleTopic} onTechToggle={toggleTech}
                        onAddTechnology={onAddTechnology} onDeleteTechnology={onDeleteTechnology}
                        onAddTopic={onAddTopic} onDeleteTopic={onDeleteTopic}
                        onSubmit={handleFinalSubmit} isSubmitting={isSubmitting} submitStatus={submitStatus} error={error}
                    />
                )}
                {step === "step2" && selectedType === PublicationType.PROJECT && (
                    <AddPicsAdditionalInfoProject
                        imagePreview={imagePreview} imageFile={imageFile} imageDescription={imageDescription}
                        status={projStatus} selectedTechIds={selectedTechIds} technologies={technologies}
                        onImageChange={handleImageChange} onImageDescriptionChange={setImageDescription}
                        onStatusChange={setProjStatus} onTechToggle={toggleTech}
                        onAddTechnology={onAddTechnology} onDeleteTechnology={onDeleteTechnology}
                        onSubmit={handleFinalSubmit} isSubmitting={isSubmitting} submitStatus={submitStatus} error={error}
                    />
                )}
                {step === "step2" && selectedType === PublicationType.EXPERIENCE && (
                    <AddPicsAdditionalInfoExperience
                        imagePreview={imagePreview} imageFile={imageFile} imageDescription={imageDescription}
                        responsibilities={responsibilities} achievements={achievements}
                        selectedTechIds={selectedTechIds} technologies={technologies}
                        onImageChange={handleImageChange} onImageDescriptionChange={setImageDescription}
                        onResponsibilitiesChange={setResponsibilities} onAchievementsChange={setAchievements}
                        onTechToggle={toggleTech} onAddTechnology={onAddTechnology} onDeleteTechnology={onDeleteTechnology}
                        onSubmit={handleFinalSubmit} isSubmitting={isSubmitting} submitStatus={submitStatus} error={error}
                    />
                )}
            </div>
        </div>
    );
};
