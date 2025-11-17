"use client";

import { ChatThread } from "@/types/chat";
import { getPersonaById } from "@/constants/personas";
import { SessionSummaryPanel } from "./session-summary-panel";
import { SessionAnalytics } from "./session-analytics";
import { ShareCard } from "./share-card";

interface UtilityPanelProps {
  thread?: ChatThread;
}

export const UtilityPanel = ({ thread }: UtilityPanelProps) => {
  const persona = thread ? getPersonaById(thread.personaId) : null;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <section className="rounded-2xl border border-zinc-200 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          Persona
        </p>
        {persona ? (
          <div className="mt-3">
            <p className="text-lg font-semibold text-zinc-900">
              {persona.name}
            </p>
            <p className="text-sm text-zinc-600">{persona.tagline}</p>
            <span
              className="mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: persona.color }}
            >
              {persona.tone}
            </span>
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-600">
            Select a thread to view persona context.
          </p>
        )}
      </section>

      <SessionSummaryPanel thread={thread} />

      <SessionAnalytics thread={thread} />

      <ShareCard thread={thread} />
    </div>
  );
};

