"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { PublicationType, ProjectStatus } from "../../../../experience/types";
import type { Technology, Topic, FullPublication, EducationPublication, ProjectPublication, ExperiencePublication } from "../../../../experience/types";
import { EditInfoEducation } from "./EditInfoEducation";
import { EditPicsAdditionalInfoEducation } from "./EditPics_AdditionalInfoEducation";
import { EditInfoProject } from "./EditInfoProject";
import { EditPicsAdditionalInfoProject } from "./EditPics_AdditionalInfoProject";
import { EditInfoExperience } from "./EditInfoExperience";
import { EditPicsAdditionalInfoExperience } from "./EditPics_AdditionalInfoExperience";

type Step = "step1" | "step2";

interface OnboardingEditProps {
    publication: FullPublication;
    technologies: Technology[];
    topics: Topic[];
    onSave: (
        id: string | number,
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
    onDelete: () => void;
    onAddTechnology: (name: string) => Promise<Technology>;
    onDeleteTechnology: (id: string | number) => Promise<void>;
    onAddTopic: (name: string) => Promise<Topic>;
    onDeleteTopic: (id: string | number) => Promise<void>;
    onCancel: () => void;
}

export const OnboardingEditNivelPublicacion = ({
    publication,
    technologies,
    topics,
    onSave,
    onDelete,
    onAddTechnology,
    onDeleteTechnology,
    onAddTopic,
    onDeleteTopic,
    onCancel,
}: OnboardingEditProps) => {
    const [step, setStep] = useState<Step>("step1");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "optimizing" | "uploading" | "saving">("idle");

    // Shared state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(publication.image_path || null);
    const [imageDescription, setImageDescription] = useState(publication.image_description || "");
    const [selectedTechIds, setSelectedTechIds] = useState<(string | number)[]>(
        (publication.technologies ?? []).map((t: Technology) => t.id)
    );
    const [selectedTopicIds, setSelectedTopicIds] = useState<(string | number)[]>(
        (publication.topics ?? []).map((t: Topic) => t.id)
    );

    // Education state
    const eduPub = publication.type === PublicationType.EDUCATION ? publication as EducationPublication : null;
    const [eduData, setEduData] = useState({
        titulo: publication.title,
        descripcion: publication.description,
        institution: eduPub?.details?.institution ?? "",
        obtainedDate: eduPub?.details?.obtained_date ?? "",
    });
    const [skillsLearned, setSkillsLearned] = useState<string[]>(
        eduPub?.details?.skills_learned?.length ? eduPub.details.skills_learned : ["", "", ""]
    );

    // Project state
    const projPub = publication.type === PublicationType.PROJECT ? publication as ProjectPublication : null;
    const [projData, setProjData] = useState({
        titulo: publication.title,
        descripcion: publication.description,
        whyIBuiltThis: projPub?.details?.why_i_built_this ?? "",
        howItWorks: projPub?.details?.how_it_works ?? "",
        whatILearned: projPub?.details?.what_i_learned?.length ? projPub.details.what_i_learned : ["", "", ""],
        urlRepository: projPub?.details?.url_repository ?? "",
    });
    const [projStatus, setProjStatus] = useState<ProjectStatus>(
        projPub?.details?.status ?? ProjectStatus.DESIGN
    );

    // Experience state
    const expPub = publication.type === PublicationType.EXPERIENCE ? publication as ExperiencePublication : null;
    const [expData, setExpData] = useState({
        titulo: publication.title,
        descripcion: publication.description,
        company: expPub?.details?.company ?? "",
    });
    const [responsibilities, setResponsibilities] = useState<string[]>(
        expPub?.responsibilities?.map((r) => r.content) ?? ["", "", ""]
    );
    const [achievements, setAchievements] = useState<string[]>(
        expPub?.achievements?.map((a) => a.content) ?? ["", "", ""]
    );

    const toggleTech = (id: string | number) => setSelectedTechIds((p) => p.some((t) => String(t) === String(id)) ? p.filter((t) => String(t) !== String(id)) : [...p, id]);
    const toggleTopic = (id: string | number) => setSelectedTopicIds((p) => p.some((t) => String(t) === String(id)) ? p.filter((t) => String(t) !== String(id)) : [...p, id]);

    const handleAddTechnology = async (name: string): Promise<Technology> => {
        const newTech = await onAddTechnology(name);
        if (newTech?.id) {
            setSelectedTechIds((p) =>
                p.some((id) => String(id) === String(newTech.id)) ? p : [...p, newTech.id]
            );
        }
        return newTech;
    };

    const handleAddTopic = async (name: string): Promise<Topic> => {
        const newTopic = await onAddTopic(name);
        if (newTopic?.id) {
            setSelectedTopicIds((p) =>
                p.some((id) => String(id) === String(newTopic.id)) ? p : [...p, newTopic.id]
            );
        }
        return newTopic;
    };

    const handleImageChange = (file: File | null, preview: string | null) => { setImageFile(file); setImagePreview(preview); };

    const handleStep1Continue = () => {
        setError("");
        if (publication.type === PublicationType.EDUCATION) {
            if (!eduData.titulo.trim() || !eduData.descripcion.trim() || !eduData.institution.trim()) { setError("Todos los campos son obligatorios."); return; }
        } else if (publication.type === PublicationType.PROJECT) {
            if (!projData.titulo.trim() || !projData.descripcion.trim()) { setError("Título y descripción son obligatorios."); return; }
        } else {
            if (!expData.titulo.trim() || !expData.descripcion.trim() || !expData.company.trim()) { setError("Todos los campos son obligatorios."); return; }
        }
        setStep("step2");
    };

    const handleSave = async () => {
        setError("");
        if (!imageDescription.trim()) { setError("La descripción de la imagen es obligatoria."); return; }
        setIsSaving(true);
        setSubmitStatus("optimizing");
        try {
            const type = publication.type;
            if (type === PublicationType.EDUCATION) {
                await onSave(publication.id, type,
                    { title: eduData.titulo.trim(), description: eduData.descripcion.trim(), image_description: imageDescription.trim(), image_path: publication.image_path },
                    { institution: eduData.institution.trim(), obtained_date: eduData.obtainedDate, skills_learned: skillsLearned.filter((s: string) => s.trim()) },
                    selectedTechIds, selectedTopicIds, imageFile,
                    undefined, undefined, setSubmitStatus
                );
            } else if (type === PublicationType.PROJECT) {
                await onSave(publication.id, type,
                    { title: projData.titulo.trim(), description: projData.descripcion.trim(), image_description: imageDescription.trim(), image_path: publication.image_path },
                    { why_i_built_this: projData.whyIBuiltThis.trim(), how_it_works: projData.howItWorks.trim(), what_i_learned: projData.whatILearned.filter((s: string) => s.trim()), url_repository: projData.urlRepository.trim(), status: projStatus },
                    selectedTechIds, [], imageFile,
                    undefined, undefined, setSubmitStatus
                );
            } else {
                await onSave(publication.id, type,
                    { title: expData.titulo.trim(), description: expData.descripcion.trim(), image_description: imageDescription.trim(), image_path: publication.image_path },
                    { company: expData.company.trim() },
                    selectedTechIds, [], imageFile,
                    responsibilities.filter((s: string) => s.trim()),
                    achievements.filter((s: string) => s.trim()),
                    setSubmitStatus
                );
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al guardar.");
            setIsSaving(false);
            setSubmitStatus("idle");
        }
    };

    const getTitle = () => {
        if (publication.type === PublicationType.EDUCATION) return "Editando publicación respecto a Educación";
        if (publication.type === PublicationType.PROJECT) return "Editando publicación respecto a Proyectos";
        return "Editando publicación respecto a Experiencia";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="glass-panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl px-8 py-8">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-aperture-yellow">{getTitle()}</h3>
                    <button onClick={onCancel} className="text-zinc-400 transition hover:text-white"><X className="h-5 w-5" /></button>
                </div>

                {/* Step Tabs Navigation */}
                <div className="mb-6 flex items-center gap-2 border-b border-aperture-gray/40 pb-3">
                    <button
                        type="button"
                        onClick={() => {
                            setError("");
                            setStep("step1");
                        }}
                        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] transition ${
                            step === "step1"
                                ? "border border-aperture-blue/50 bg-aperture-blue/15 text-aperture-blue shadow-sm shadow-aperture-blue/20"
                                : "text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                        <span>[01]</span>
                        <span>Información Básica</span>
                    </button>
                    <span className="text-zinc-600">//</span>
                    <button
                        type="button"
                        onClick={() => {
                            handleStep1Continue();
                        }}
                        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] transition ${
                            step === "step2"
                                ? "border border-aperture-blue/50 bg-aperture-blue/15 text-aperture-blue shadow-sm shadow-aperture-blue/20"
                                : "text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                        <span>[02]</span>
                        <span>Imagen y Tecnologías</span>
                    </button>
                </div>

                {/* Education */}
                {step === "step1" && publication.type === PublicationType.EDUCATION && (
                    <EditInfoEducation data={eduData} onChange={setEduData} onContinue={handleStep1Continue} onDelete={onDelete} error={error} />
                )}
                {step === "step2" && publication.type === PublicationType.EDUCATION && (
                    <EditPicsAdditionalInfoEducation
                        imagePreview={imagePreview} imageDescription={imageDescription} skillsLearned={skillsLearned}
                        selectedTopicIds={selectedTopicIds} selectedTechIds={selectedTechIds}
                        technologies={technologies} topics={topics}
                        onImageChange={handleImageChange} onImageDescriptionChange={setImageDescription}
                        onSkillsChange={setSkillsLearned} onTopicToggle={toggleTopic} onTechToggle={toggleTech}
                        onAddTechnology={handleAddTechnology} onDeleteTechnology={onDeleteTechnology}
                        onAddTopic={handleAddTopic} onDeleteTopic={onDeleteTopic}
                        onBack={() => setStep("step1")} onSave={handleSave} isSaving={isSaving} error={error}
                    />
                )}

                {/* Project */}
                {step === "step1" && publication.type === PublicationType.PROJECT && (
                    <EditInfoProject data={projData} onChange={setProjData} onContinue={handleStep1Continue} onDelete={onDelete} error={error} />
                )}
                {step === "step2" && publication.type === PublicationType.PROJECT && (
                    <EditPicsAdditionalInfoProject
                        imagePreview={imagePreview} imageDescription={imageDescription}
                        status={projStatus} selectedTechIds={selectedTechIds} technologies={technologies}
                        onImageChange={handleImageChange} onImageDescriptionChange={setImageDescription}
                        onStatusChange={setProjStatus} onTechToggle={toggleTech}
                        onAddTechnology={handleAddTechnology} onDeleteTechnology={onDeleteTechnology}
                        onBack={() => setStep("step1")} onSave={handleSave} isSaving={isSaving} error={error}
                    />
                )}

                {/* Experience */}
                {step === "step1" && publication.type === PublicationType.EXPERIENCE && (
                    <EditInfoExperience data={expData} onChange={setExpData} onContinue={handleStep1Continue} onDelete={onDelete} error={error} />
                )}
                {step === "step2" && publication.type === PublicationType.EXPERIENCE && (
                    <EditPicsAdditionalInfoExperience
                        imagePreview={imagePreview} imageDescription={imageDescription}
                        responsibilities={responsibilities} achievements={achievements}
                        selectedTechIds={selectedTechIds} technologies={technologies}
                        onImageChange={handleImageChange} onImageDescriptionChange={setImageDescription}
                        onResponsibilitiesChange={setResponsibilities} onAchievementsChange={setAchievements}
                        onTechToggle={toggleTech} onAddTechnology={handleAddTechnology} onDeleteTechnology={onDeleteTechnology}
                        onBack={() => setStep("step1")} onSave={handleSave} isSaving={isSaving} error={error}
                    />
                )}
            </div>
        </div>
    );
};
