"use client";

import { Sparkles } from "lucide-react";

export const EmptyState = () => (
  <div className="flex max-w-sm flex-col items-center gap-4 text-center text-zinc-500">
    <Sparkles className="h-8 w-8" />
    <div>
      <p className="text-lg font-semibold text-zinc-900">Start a mentor tap-in</p>
      <p className="mt-1 text-sm">
        Pick a persona and drop context. Each thread keeps system prompts and summaries so you can juggle multiple initiatives.
      </p>
    </div>
  </div>
);

