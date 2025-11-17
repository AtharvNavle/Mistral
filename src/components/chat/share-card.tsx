"use client";

import { useMemo, useState } from "react";
import { ChatThread } from "@/types/chat";
import { buildSharePayload, encodeSharePayload } from "@/lib/share";
import { Share2, Check } from "lucide-react";

interface ShareCardProps {
  thread?: ChatThread;
}

export const ShareCard = ({ thread }: ShareCardProps) => {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const payload = useMemo(() => {
    if (!thread) return null;
    return encodeSharePayload(buildSharePayload(thread));
  }, [thread]);

  const handleCopy = async () => {
    if (!payload || typeof window === "undefined") return;
    try {
      setIsCopying(true);
      const link = `${window.location.origin}/share/${encodeURIComponent(
        payload
      )}`;
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCopying(false);
    }
  };

  const canCopy = Boolean(payload) && typeof window !== "undefined";

  return (
    <section className="rounded-2xl border border-zinc-200 p-4">
      <div className="flex items-center gap-2 text-zinc-900">
        <Share2 className="h-4 w-4" />
        <span className="font-semibold">Share thread</span>
      </div>
      <p className="mt-2 text-sm text-zinc-600">
        Generate a read-only link capturing persona context, history, and the
        latest summary.
      </p>
      <button
        type="button"
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
        onClick={handleCopy}
        disabled={!canCopy || isCopying}
      >
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {copied ? "Link copied" : "Copy share link"}
      </button>
    </section>
  );
};

