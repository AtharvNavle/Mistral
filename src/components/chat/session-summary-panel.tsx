"use client";

import { ChatThread } from "@/types/chat";
import { ClipboardList } from "lucide-react";

interface SessionSummaryPanelProps {
  thread?: ChatThread;
}

export const SessionSummaryPanel = ({ thread }: SessionSummaryPanelProps) => {
  if (!thread) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
        Select a thread to view its summary.
      </div>
    );
  }

  const bullets = thread.summary?.bullets ?? [
    "Summaries will appear here once the Mistral follow-up call is wired.",
  ];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex items-center gap-2 text-zinc-900">
        <ClipboardList className="h-5 w-5" />
        <div>
          <p className="font-semibold">Session summary</p>
          <p className="text-xs text-zinc-500">
            Auto-updates after each long exchange.
          </p>
        </div>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
        {bullets.map((bullet, index) => (
          <li key={`${thread.id}-${index}`}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
};

