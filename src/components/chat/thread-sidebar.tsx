"use client";

import { useMemo, useState } from "react";
import { ChatThread } from "@/types/chat";
import { DEFAULT_PERSONA_ID, getPersonaById } from "@/constants/personas";
import { cn } from "@/lib/utils";
import {
  Plus,
  Pin,
  PinOff,
  Archive,
  MessageSquareText,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { formatDateLabel } from "@/lib/dates";

interface ThreadSidebarProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onCreateThread: (personaId: string) => void;
  onArchiveThread: (threadId: string) => void;
  onPinThread: (threadId: string, pinned: boolean) => void;
  onDeleteThread: (threadId: string) => void;
}

export const ThreadSidebar = ({
  threads,
  activeThreadId,
  onSelectThread,
  onCreateThread,
  onArchiveThread,
  onPinThread,
  onDeleteThread,
}: ThreadSidebarProps) => {
  const [showArchived, setShowArchived] = useState(false);

  const { activeThreads, archivedThreads } = useMemo(() => {
    const active = threads
      .filter((thread) => !thread.isArchived)
      .sort((a, b) => Number(b.pinned) - Number(a.pinned));
    const archived = threads.filter((thread) => thread.isArchived);
    return { activeThreads: active, archivedThreads: archived };
  }, [threads]);

  const renderThreadCard = (thread: ChatThread) => {
    const persona = getPersonaById(thread.personaId);
    const isActive = thread.id === activeThreadId;
    return (
      <li key={thread.id}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectThread(thread.id)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelectThread(thread.id);
            }
          }}
          className={cn(
            "w-full cursor-pointer rounded-2xl border px-3 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-zinc-400",
            isActive
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-900"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide opacity-80">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: persona.color }}
              />
              {persona.name}
            </span>
            <span className="text-xs opacity-70">
              {formatDateLabel(thread.updatedAt)}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm font-medium">
            {thread.title}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs opacity-80">
            <span>{thread.messages.length} exchanges</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-full p-1 hover:bg-white/20"
                onClick={(event) => {
                  event.stopPropagation();
                  onPinThread(thread.id, !thread.pinned);
                }}
                aria-label="Toggle pin"
              >
                {thread.pinned ? (
                  <PinOff className="h-4 w-4" />
                ) : (
                  <Pin className="h-4 w-4" />
                )}
              </button>
              {!thread.isArchived && (
                <button
                  type="button"
                  className="rounded-full p-1 hover:bg-white/20"
                  onClick={(event) => {
                    event.stopPropagation();
                    onArchiveThread(thread.id);
                  }}
                  aria-label="Archive thread"
                >
                  <Archive className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                className="rounded-full p-1 hover:bg-white/20"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteThread(thread.id);
                }}
                aria-label="Delete thread"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Threads
          </p>
          <p className="text-sm font-medium text-zinc-900">
            {activeThreads.length} active
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
          onClick={() => onCreateThread(DEFAULT_PERSONA_ID)}
        >
          <Plus className="h-4 w-4" />
          New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-zinc-500">
            <MessageSquareText className="h-6 w-6" />
            <p>No threads yet. Start with a new mentor prompt.</p>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            <ul className="space-y-2">{activeThreads.map(renderThreadCard)}</ul>

            {archivedThreads.length > 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-sm font-medium text-zinc-700"
                  onClick={() => setShowArchived((prev) => !prev)}
                >
                  <span>Archived ({archivedThreads.length})</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition",
                      showArchived ? "rotate-180" : ""
                    )}
                  />
                </button>
                {showArchived && (
                  <ul className="mt-3 space-y-2">
                    {archivedThreads.map(renderThreadCard)}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

