"use client";

import { useState } from "react";
import { ChatMessage, ChatThread } from "@/types/chat";
import { useChatStore } from "@/store/chat-store";
import {
  buildAssistantMessage,
  buildUserMessage,
  createSummary,
} from "@/lib/threads";
import { getPersonaById } from "@/constants/personas";
import { MessageList } from "./message-list";
import { Composer } from "./composer";
import { QuickActionsStrip } from "./quick-actions-strip";
import { EmptyState } from "./empty-state";

interface MessagePanelProps {
  thread?: ChatThread;
}

const buildTranscript = (messages: ChatMessage[]) =>
  messages
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n\n");

export const MessagePanel = ({ thread }: MessagePanelProps) => {
  const [draft, setDraft] = useState("");
  const { appendMessage, updateThreadStatus, upsertSummary } = useChatStore();

  if (!thread) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState />
      </div>
    );
  }

  const refreshSummary = async (threadId: string, transcript: string) => {
    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) return;
      const data = await response.json();
      const bullets = Array.isArray(data.bullets) ? data.bullets : [];
      upsertSummary(threadId, createSummary(threadId, bullets));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const persona = getPersonaById(thread.personaId);
    const userMessage = buildUserMessage(thread.id, trimmed);
    const historyBeforeSend = thread.messages;
    const payloadMessages = [
      { role: "system", content: persona.systemPrompt },
      ...historyBeforeSend.map(({ role, content }) => ({ role, content })),
      { role: userMessage.role, content: userMessage.content },
    ];

    appendMessage(thread.id, userMessage);
    updateThreadStatus(thread.id, "streaming");
    setDraft("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach mentor assistant");
      }

      const data = await response.json();
      const assistantContent = String(data.content ?? "").trim();

      if (!assistantContent) {
        throw new Error("Empty response from mentor assistant");
      }

      const assistantMessage = buildAssistantMessage(
        thread.id,
        assistantContent
      );

      appendMessage(thread.id, assistantMessage);
      updateThreadStatus(thread.id, "idle");

      const transcript = buildTranscript([
        ...historyBeforeSend,
        userMessage,
        assistantMessage,
      ]);

      void refreshSummary(thread.id, transcript);
    } catch (error) {
      console.error(error);
      updateThreadStatus(thread.id, "error");
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-zinc-50">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <MessageList thread={thread} />
      </div>
      <div className="border-t border-zinc-200 bg-white">
        <QuickActionsStrip onInsertTemplate={setDraft} currentDraft={draft} />
        <Composer
          value={draft}
          onChange={setDraft}
          onSubmit={handleSend}
          isStreaming={thread.status === "streaming"}
        />
      </div>
    </div>
  );
};

