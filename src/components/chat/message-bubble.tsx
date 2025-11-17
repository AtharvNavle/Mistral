"use client";

import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";
import { formatTimeLabel } from "@/lib/dates";

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-xl rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-zinc-900 text-white"
            : "bg-white text-zinc-900 border border-zinc-200"
        )}
      >
        <p className="whitespace-pre-line">{message.content}</p>
        <p className="mt-2 text-xs opacity-60">
          {formatTimeLabel(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

