import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ChatStore, ChatThread, ChatMessage, ChatStateSnapshot } from "@/types/chat";
import { createEmptyThread } from "@/lib/threads";
import { safeStorage } from "@/lib/storage";
import { DEFAULT_PERSONA_ID } from "@/constants/personas";

const seedThread: ChatThread = {
  id: "seed-thread",
  title: "Untitled session",
  personaId: DEFAULT_PERSONA_ID,
  createdAt: 0,
  updatedAt: 0,
  pinned: false,
  isArchived: false,
  status: "idle",
  messages: [],
};

const baseState: ChatStateSnapshot = {
  activeThreadId: seedThread.id,
  threads: [seedThread],
};

const updateThreadList = (
  threads: ChatThread[],
  threadId: string,
  updater: (thread: ChatThread) => ChatThread
) =>
  threads.map((thread) =>
    thread.id === threadId ? updater(thread) : thread
  );

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      ...baseState,
      setActiveThread: (threadId) => set({ activeThreadId: threadId }),
      createThread: (personaId, title) => {
        const newThread = {
          ...createEmptyThread(personaId),
          title: title?.trim() || "New session",
        };

        set((state) => ({
          threads: [newThread, ...state.threads],
          activeThreadId: newThread.id,
        }));

        return newThread;
      },
      archiveThread: (threadId) =>
        set((state) => ({
          threads: updateThreadList(state.threads, threadId, (thread) => ({
            ...thread,
            isArchived: true,
          })),
        })),
      pinThread: (threadId, pinned) =>
        set((state) => ({
          threads: updateThreadList(state.threads, threadId, (thread) => ({
            ...thread,
            pinned,
          })),
        })),
      deleteThread: (threadId) =>
        set((state) => {
          const threads = state.threads.filter((thread) => thread.id !== threadId);
          const activeThreadId =
            state.activeThreadId === threadId
              ? threads[0]?.id ?? null
              : state.activeThreadId;
          return { threads, activeThreadId };
        }),
      appendMessage: (threadId, message: ChatMessage) =>
        set((state) => ({
          threads: updateThreadList(state.threads, threadId, (thread) => ({
            ...thread,
            messages: [...thread.messages, message],
            updatedAt: Date.now(),
          })),
        })),
      updateThreadStatus: (threadId, status) =>
        set((state) => ({
          threads: updateThreadList(state.threads, threadId, (thread) => ({
            ...thread,
            status,
          })),
        })),
      upsertSummary: (threadId, summary) =>
        set((state) => ({
          threads: updateThreadList(state.threads, threadId, (thread) => ({
            ...thread,
            summary,
          })),
        })),
      hydrate: (snapshot) => set(snapshot),
      reset: () => set(baseState),
    }),
    {
      name: "mentor-lounge-chat",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        activeThreadId: state.activeThreadId,
        threads: state.threads.map((thread) => ({
          ...thread,
          status: "idle",
        })),
      }),
    }
  )
);

