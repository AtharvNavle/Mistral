"use client";

import { useMemo } from "react";
import { ChatThread } from "@/types/chat";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  thread: ChatThread;
}

export const MessageList = ({ thread }: MessageListProps) => {
  const sortedMessages = useMemo(
    () => [...thread.messages].sort((a, b) => a.createdAt - b.createdAt),
    [thread.messages]
  );

  if (sortedMessages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        Drop context to get tailored mentor advice.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sortedMessages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
};

