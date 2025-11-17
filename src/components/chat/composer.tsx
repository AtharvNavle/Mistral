"use client";

import { FormEvent } from "react";
import { Send } from "lucide-react";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void | Promise<void>;
  isStreaming?: boolean;
}

export const Composer = ({
  value,
  onChange,
  onSubmit,
  isStreaming = false,
}: ComposerProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-4 py-4">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        placeholder="Describe the context, paste a snippet, or outline goals…"
        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
        disabled={isStreaming}
      />
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <p>Shift + Enter for newline</p>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
          disabled={isStreaming}
        >
          <Send className="h-4 w-4" />
          Send
        </button>
      </div>
    </form>
  );
};

