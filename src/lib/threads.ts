import { nanoid } from "nanoid";
import { ChatMessage, ChatThread, SessionSummary } from "@/types/chat";
import { DEFAULT_PERSONA_ID } from "@/constants/personas";

export const createEmptyThread = (personaId = DEFAULT_PERSONA_ID): ChatThread => {
  const timestamp = Date.now();
  return {
    id: nanoid(),
    title: "Untitled session",
    personaId,
    createdAt: timestamp,
    updatedAt: timestamp,
    pinned: false,
    isArchived: false,
    status: "idle",
    messages: [],
  };
};

export const buildUserMessage = (
  threadId: string,
  content: string
): ChatMessage => ({
  id: nanoid(),
  threadId,
  role: "user",
  content,
  createdAt: Date.now(),
});

export const buildAssistantMessage = (
  threadId: string,
  content: string
): ChatMessage => ({
  id: nanoid(),
  threadId,
  role: "assistant",
  content,
  createdAt: Date.now(),
});

export const createSummary = (
  threadId: string,
  bullets: string[] = []
): SessionSummary => ({
  id: nanoid(),
  threadId,
  bullets,
  updatedAt: Date.now(),
});

