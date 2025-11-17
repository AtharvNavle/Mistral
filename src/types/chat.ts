export type ChatRole = "user" | "assistant" | "system";

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  tone: "mentor" | "reviewer" | "pm";
  systemPrompt: string;
  color: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  template: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  personaId?: string;
}

export interface SessionSummary {
  id: string;
  threadId: string;
  bullets: string[];
  updatedAt: number;
}

export interface ThreadMeta {
  id: string;
  title: string;
  personaId: string;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
}

export interface ChatThread extends ThreadMeta {
  messages: ChatMessage[];
  summary?: SessionSummary;
  isArchived?: boolean;
  status: "idle" | "streaming" | "error";
}

export interface ChatStateSnapshot {
  activeThreadId: string | null;
  threads: ChatThread[];
}

export interface ChatStore extends ChatStateSnapshot {
  setActiveThread: (threadId: string) => void;
  createThread: (personaId: string, title?: string) => ChatThread;
  archiveThread: (threadId: string) => void;
  pinThread: (threadId: string, pinned: boolean) => void;
  deleteThread: (threadId: string) => void;
  appendMessage: (threadId: string, message: ChatMessage) => void;
  updateThreadStatus: (threadId: string, status: ChatThread["status"]) => void;
  upsertSummary: (threadId: string, summary: SessionSummary) => void;
  hydrate: (snapshot: ChatStateSnapshot) => void;
  reset: () => void;
}

