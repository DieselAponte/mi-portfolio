"use client";

import { useState, useRef } from "react";
import { X, Plus, Upload, Layers, HelpCircle, Cpu, Award, Trash2 } from "lucide-react";
import type { Project } from "../../../projects/types";

interface EditProjectPopupProps {
  project: Project;
  onSave: (
    id: string | number,
    updates: Partial<Project>,
    imageFile?: File | null
  ) => Promise<void>;
  onDelete: () => void;
  onCancel: () => void;
}

type TabKey = "general" | "problem" | "decisions" | "results";

export const EditProjectPopup = ({
  project,
  onSave,
  onDelete,
  onCancel,
}: EditProjectPopupProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const formatInitialDate = (rawDate: string) => {
    if (!rawDate) return new Date().toISOString().split("T")[0];
    const d = new Date(rawDate);
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
    return new Date().toISOString().split("T")[0];
  };

  // Tab 1: General
  const [title, setTitle] = useState(project.title);
  const [date, setDate] = useState(() => formatInitialDate(project.date));
  const [description, setDescription] = useState(project.description);
  const [githubUrl, setGithubUrl] = useState(project.github_url || "");
  const [liveDemoUrl, setLiveDemoUrl] = useState(project.live_demo_url || "");
  const [techStack, setTechStack] = useState<string[]>([...project.tech_stack]);
  const [techInput, setTechInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(project.image_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab 2: Problema & Solución
  const [problemStatement, setProblemStatement] = useState(project.problem_statement || "");
  const [solutionStatement, setSolutionStatement] = useState(project.solution_statement || "");
  const [targetUsers, setTargetUsers] = useState<string[]>(project.target_users ? [...project.target_users] : []);
  const [targetUserInput, setTargetUserInput] = useState("");
  const [valueProposition, setValueProposition] = useState(project.value_proposition || "");

  // Tab 3: Decisiones & Desafíos
  const [technicalDecisions, setTechnicalDecisions] = useState(project.technical_decisions || "");
  const [keyChallenge, setKeyChallenge] = useState(project.key_challenge || "");
  const [challengesFaced, setChallengesFaced] = useState(project.challenges_faced || "");

  // Tab 4: Resultados & Próximos Pasos
  const [measurableResults, setMeasurableResults] = useState(project.measurable_results || "");
  const [technicalLearnings, setTechnicalLearnings] = useState(project.technical_learnings || "");
  const [nextSteps, setNextSteps] = useState(project.next_steps || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setError("Formato de imagen no soportado. Usa PNG, JPG, WEBP o SVG.");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setError("");
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addTech = () => {
    const trimmed = techInput.trim();
    if (!trimmed) return;
    if (techStack.includes(trimmed)) return;
    setTechStack([...techStack, trimmed]);
    setTechInput("");
  };

  const removeTech = (index: number) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  const addTargetUser = () => {
    const trimmed = targetUserInput.trim();
    if (!trimmed) return;
    if (targetUsers.includes(trimmed)) return;
    setTargetUsers([...targetUsers, trimmed]);
    setTargetUserInput("");
  };

  const removeTargetUser = (index: number) => {
    setTargetUsers(targetUsers.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("El título del proyecto es obligatorio.");
      setActiveTab("general");
      return;
    }
    if (!description.trim()) {
      setError("La descripción del proyecto es obligatoria.");
      setActiveTab("general");
      return;
    }

    setIsSaving(true);
    setError("");

    const toValidIsoTimestamp = (dateStr: string) => {
      if (!dateStr.trim()) return new Date().toISOString();
      if (dateStr.includes("T")) {
        const d = new Date(dateStr);
        return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
      }
      const d = new Date(`${dateStr}T12:00:00.000Z`);
      return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    };

    try {
      const updates: Partial<Project> = {
        title: title.trim(),
        date: toValidIsoTimestamp(date),
        description: description.trim(),
        github_url: githubUrl.trim(),
        live_demo_url: liveDemoUrl.trim(),
        tech_stack: techStack,
        problem_statement: problemStatement.trim(),
        solution_statement: solutionStatement.trim(),
        target_users: targetUsers,
        value_proposition: valueProposition.trim(),
        technical_decisions: technicalDecisions.trim(),
        key_challenge: keyChallenge.trim(),
        challenges_faced: challengesFaced.trim(),
        measurable_results: measurableResults.trim(),
        technical_learnings: technicalLearnings.trim(),
        next_steps: nextSteps.trim(),
      };

      if (!imagePreview && !imageFile) {
        updates.image_url = "";
      }

      await onSave(project.id, updates, imageFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar proyecto");
      setIsSaving(false);
    }
  };

  const tabs: { key: TabKey; label: string; icon: typeof Layers }[] = [
    { key: "general", label: "1. General", icon: Layers },
    { key: "problem", label: "2. Problema & Solución", icon: HelpCircle },
    { key: "decisions", label: "3. Decisiones Técnicas", icon: Cpu },
    { key: "results", label: "4. Resultados & Roadmap", icon: Award },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-panel relative w-full max-w-3xl rounded-2xl border border-aperture-gray/60 bg-[#0f0f13] px-6 py-6 sm:px-8 sm:py-8 my-auto shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-aperture-gray/40 pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-aperture-yellow">
              Aperture Laboratories // Editar Proyecto
            </span>
            <h3 className="mt-1 text-xl font-black text-white truncate max-w-lg">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-aperture-gray/30 pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs uppercase tracking-wider transition ${
                  isActive
                    ? "border border-aperture-blue/50 bg-aperture-blue/15 text-aperture-blue font-semibold shadow-[0_0_15px_rgba(86,204,242,0.15)]"
                    : "border border-transparent text-zinc-400 hover:border-aperture-gray/50 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: General */}
        {activeTab === "general" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                  Título del Proyecto *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                    Fecha del Proyecto *
                  </label>
                  <button
                    type="button"
                    onClick={() => setDate(new Date().toISOString().split("T")[0])}
                    className="font-mono text-[9px] uppercase tracking-wider text-aperture-blue hover:text-white transition"
                  >
                    Hoy
                  </button>
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue [color-scheme:dark] cursor-pointer"
                />
                <p className="mt-1 font-mono text-[10px] text-zinc-500">
                  {date
                    ? `Vista previa: ${new Date(date + "T00:00:00").toLocaleDateString("es-ES", {
                        month: "short",
                        year: "numeric",
                        day: "numeric",
                      })}`
                    : "Selecciona una fecha"}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Descripción Resumen * (Sin límite de caracteres)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                  URL del Repositorio (GitHub)
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                  URL de Demostración en Vivo
                </label>
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="w-full rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
                />
              </div>
            </div>

            {/* Thumbnail upload */}
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Imagen / Mockup Principal
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpeg,.jpg,.webp,.svg"
                onChange={handleFileChange}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative overflow-hidden rounded-xl border border-aperture-gray bg-black/60">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 w-full object-cover"
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg bg-black/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white hover:bg-black"
                    >
                      <Upload className="mr-1 inline h-3 w-3" /> Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="rounded-lg bg-red-950/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-red-200 hover:bg-red-900"
                    >
                      <X className="mr-1 inline h-3 w-3" /> Quitar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-aperture-gray/60 bg-black/30 py-6 font-mono text-[10px] uppercase tracking-widest text-zinc-400 transition hover:border-aperture-blue/50 hover:text-aperture-blue"
                >
                  <Upload className="h-4 w-4" /> Subir Mockup o Captura
                </button>
              )}
            </div>

            {/* Tech Stack */}
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Stack Tecnológico
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                  placeholder="Agregar tecnología..."
                  className="flex-1 rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="flex items-center gap-1 rounded-lg border border-aperture-blue/40 bg-aperture-blue/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-aperture-blue hover:bg-aperture-blue/20"
                >
                  <Plus className="h-3 w-3" /> Añadir
                </button>
              </div>

              {techStack.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-aperture-gray/70 bg-black/60 px-3 py-1 font-mono text-[10px] text-aperture-blue"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(i)}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Problema & Solución */}
        {activeTab === "problem" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Declaración del Problema (Problem Statement)
              </label>
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                rows={4}
                className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Declaración de la Solución (Solution Statement)
              </label>
              <textarea
                value={solutionStatement}
                onChange={(e) => setSolutionStatement(e.target.value)}
                rows={4}
                className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
              />
            </div>

            {/* Target Users */}
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Usuarios Objetivo (Target Users)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetUserInput}
                  onChange={(e) => setTargetUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTargetUser();
                    }
                  }}
                  placeholder="Agregar usuario objetivo..."
                  className="flex-1 rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
                />
                <button
                  type="button"
                  onClick={addTargetUser}
                  className="flex items-center gap-1 rounded-lg border border-aperture-blue/40 bg-aperture-blue/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-aperture-blue hover:bg-aperture-blue/20"
                >
                  <Plus className="h-3 w-3" /> Añadir
                </button>
              </div>

              {targetUsers.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {targetUsers.map((user, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-aperture-yellow/40 bg-aperture-yellow/10 px-3 py-1 font-mono text-[10px] text-aperture-yellow"
                    >
                      {user}
                      <button
                        type="button"
                        onClick={() => removeTargetUser(i)}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Propuesta de Valor (Value Proposition)
              </label>
              <textarea
                value={valueProposition}
                onChange={(e) => setValueProposition(e.target.value)}
                rows={3}
                className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Decisiones & Desafíos */}
        {activeTab === "decisions" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Decisiones Técnicas y Patrones de Arquitectura
              </label>
              <textarea
                value={technicalDecisions}
                onChange={(e) => setTechnicalDecisions(e.target.value)}
                rows={5}
                className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Desafío Técnico Principal (Key Challenge Headline)
              </label>
              <input
                type="text"
                value={keyChallenge}
                onChange={(e) => setKeyChallenge(e.target.value)}
                className="w-full rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Desafíos Enfrentados y Solución (Challenges & Mitigation)
              </label>
              <textarea
                value={challengesFaced}
                onChange={(e) => setChallengesFaced(e.target.value)}
                rows={4}
                className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Resultados & Próximos Pasos */}
        {activeTab === "results" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Resultados Medibles e Impacto (Metrics & Impact)
              </label>
              <textarea
                value={measurableResults}
                onChange={(e) => setMeasurableResults(e.target.value)}
                rows={4}
                className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Aprendizajes Técnicos (Technical Learnings)
              </label>
              <textarea
                value={technicalLearnings}
                onChange={(e) => setTechnicalLearnings(e.target.value)}
                rows={4}
                className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Próximos Pasos y Roadmap (Next Steps)
              </label>
              <textarea
                value={nextSteps}
                onChange={(e) => setNextSteps(e.target.value)}
                rows={3}
                className="w-full resize-y rounded-lg border border-aperture-gray bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue"
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-between border-t border-aperture-gray/40 pt-4">
          <button
            type="button"
            onClick={onDelete}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="rounded-lg border border-aperture-gray px-4 py-2 font-mono text-xs uppercase tracking-wider text-zinc-400 transition hover:border-white/40 hover:text-white disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg border border-aperture-blue/50 bg-aperture-blue/15 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/25 hover:text-white hover:shadow-[0_0_20px_rgba(86,204,242,0.3)] disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border border-aperture-blue border-t-transparent" />
                  Guardando Cambios...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
