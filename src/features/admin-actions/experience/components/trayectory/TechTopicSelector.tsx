"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { Technology, Topic } from "../../../../experience/types";

interface TechTopicSelectorProps {
    label: string;
    items: (Technology | Topic)[];
    selectedIds: (string | number)[];
    onToggle: (id: string | number) => void;
    onAdd: (name: string) => Promise<Technology | Topic | void>;
    onDelete: (id: string | number) => Promise<void>;
    type: "technology" | "topic";
}

export const TechTopicSelector = ({
    label,
    items,
    selectedIds,
    onToggle,
    onAdd,
    onDelete,
    type,
}: TechTopicSelectorProps) => {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newName, setNewName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAdd = async () => {
        if (!newName.trim()) return;
        setIsSubmitting(true);
        try {
            const created = await onAdd(newName.trim());
            if (created && typeof created === "object" && "id" in created) {
                if (!selectedIds.some((sId) => String(sId) === String(created.id))) {
                    onToggle(created.id);
                }
            }
            setNewName("");
            setIsAddingNew(false);
        } catch (err) {
            console.error(`Error adding ${type}:`, err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string | number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await onDelete(id);
        } catch (err) {
            console.error(`Error deleting ${type}:`, err);
        }
    };

    return (
        <div>
            <div className="mb-3 flex items-center gap-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                    {label}
                </label>
                <button
                    type="button"
                    onClick={() => setIsAddingNew(true)}
                    className="flex h-5 w-5 items-center justify-center rounded border border-aperture-blue/40 bg-aperture-blue/10 text-aperture-blue transition hover:bg-aperture-blue/20"
                >
                    <Plus className="h-2.5 w-2.5" />
                </button>
            </div>

            {isAddingNew && (
                <div className="mb-3 flex items-center gap-2">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder={`Nuevo ${type === "technology" ? "tecnología" : "topic"}...`}
                        className="flex-1 rounded-lg border border-aperture-gray bg-aperture-dark/80 px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none transition focus:border-aperture-blue/60"
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    />
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={isSubmitting}
                        className="rounded-lg border border-aperture-blue/40 bg-aperture-blue/10 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-aperture-blue transition hover:bg-aperture-blue/20 disabled:opacity-50"
                    >
                        {isSubmitting ? "..." : "Añadir"}
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsAddingNew(false); setNewName(""); }}
                        className="text-zinc-500 transition hover:text-white"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                {items.map((item) => {
                    const isSelected = selectedIds.some((sId) => String(sId) === String(item.id));
                    const isPredefined = "is_predefined" in item && item.is_predefined;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onToggle(item.id)}
                            className={`group relative flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] transition ${
                                isSelected
                                    ? "border-aperture-yellow/60 bg-aperture-yellow/20 text-aperture-yellow"
                                    : "border-aperture-gray/50 bg-aperture-dark/40 text-zinc-500 hover:border-zinc-400 hover:text-zinc-300"
                            }`}
                        >
                            {item.name}
                            {"sector" in item && (
                                <span className="ml-1 text-[8px] text-zinc-600">
                                    {(item as Technology).sector.substring(0, 3)}
                                </span>
                            )}
                            {!isPredefined && (
                                <span
                                    onClick={(e) => handleDelete(item.id, e)}
                                    className="ml-1 hidden text-red-400 transition hover:text-red-300 group-hover:inline-block"
                                >
                                    ×
                                </span>
                            )}
                        </button>
                    );
                })}
                {items.length === 0 && (
                    <p className="text-[10px] font-mono text-zinc-600">
                        No hay {type === "technology" ? "tecnologías" : "topics"} disponibles.
                    </p>
                )}
            </div>
        </div>
    );
};
