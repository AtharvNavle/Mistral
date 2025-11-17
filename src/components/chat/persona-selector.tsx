"use client";

import { Persona } from "@/types/chat";
import { cn } from "@/lib/utils";

interface PersonaSelectorProps {
  personas: Persona[];
  selectedPersonaId?: string | null;
  onSelectPersona: (personaId: string) => void;
}

export const PersonaSelector = ({
  personas,
  selectedPersonaId,
  onSelectPersona,
}: PersonaSelectorProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {personas.map((persona) => (
        <button
          key={persona.id}
          type="button"
          onClick={() => onSelectPersona(persona.id)}
          className={cn(
            "rounded-full border px-4 py-1 text-sm font-medium transition",
            selectedPersonaId === persona.id
              ? "border-transparent text-white"
              : "border-zinc-300 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900"
          )}
          style={{
            backgroundColor:
              selectedPersonaId === persona.id ? persona.color : "transparent",
          }}
        >
          {persona.name}
        </button>
      ))}
    </div>
  );
};

