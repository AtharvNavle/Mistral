"use client";

import { useMemo, useState } from "react";
import { useChatStore } from "@/store/chat-store";
import { ThreadSidebar } from "./thread-sidebar";
import { MessagePanel } from "./message-panel";
import { UtilityPanel } from "./utility-panel";
import { PersonaSelector } from "./persona-selector";
import { PERSONAS, DEFAULT_PERSONA_ID } from "@/constants/personas";

export const ChatShell = () => {
  const {
    threads,
    activeThreadId,
    setActiveThread,
    createThread,
    archiveThread,
    pinThread,
    deleteThread,
  } = useChatStore();

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? threads[0],
    [threads, activeThreadId]
  );

  const [selectedPersonaId, setSelectedPersonaId] = useState(
    activeThread?.personaId ?? DEFAULT_PERSONA_ID
  );

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-50 md:flex-row">
      <aside className="w-full border-b border-zinc-200 bg-white md:w-72 md:border-b-0 md:border-r">
        <ThreadSidebar
          threads={threads}
          activeThreadId={activeThread?.id ?? null}
          onSelectThread={setActiveThread}
          onCreateThread={createThread}
          onArchiveThread={archiveThread}
          onPinThread={pinThread}
          onDeleteThread={deleteThread}
        />
      </aside>

      <main className="flex min-h-0 flex-1 flex-col">
        <header className="border-b border-zinc-200 bg-white p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                Mentor Lounge
              </p>
              <h1 className="text-2xl font-semibold text-zinc-900">
                Workspace threads
              </h1>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <PersonaSelector
                personas={PERSONAS}
                selectedPersonaId={selectedPersonaId}
                onSelectPersona={(personaId) => setSelectedPersonaId(personaId)}
              />
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                onClick={() => createThread(selectedPersonaId)}
              >
                Start new thread
              </button>
            </div>
          </div>
        </header>
        <MessagePanel thread={activeThread} />
      </main>

      <aside className="hidden w-80 border-l border-zinc-200 bg-white lg:flex lg:flex-col">
        <UtilityPanel thread={activeThread} />
      </aside>
    </div>
  );
};

