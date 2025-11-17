"use client";

import { useMemo } from "react";
import { ChatThread } from "@/types/chat";
import { BarChart3 } from "lucide-react";

interface SessionAnalyticsProps {
  thread?: ChatThread;
}

const calcStats = (thread?: ChatThread) => {
  if (!thread) {
    return {
      turns: 0,
      userMessages: 0,
      mentorMessages: 0,
      durationMinutes: 0,
    };
  }

  const userMessages = thread.messages.filter(
    (message) => message.role === "user"
  ).length;
  const mentorMessages = thread.messages.length - userMessages;

  const timestamps = thread.messages.map((message) => message.createdAt);
  const duration =
    timestamps.length >= 2
      ? Math.max(...timestamps) - Math.min(...timestamps)
      : 0;

  return {
    turns: thread.messages.length,
    userMessages,
    mentorMessages,
    durationMinutes: duration > 0 ? Math.ceil(duration / 60000) : 0,
  };
};

export const SessionAnalytics = ({ thread }: SessionAnalyticsProps) => {
  const stats = useMemo(() => calcStats(thread), [thread]);

  return (
    <section className="rounded-2xl border border-zinc-200 p-4">
      <div className="flex items-center gap-2 text-zinc-900">
        <BarChart3 className="h-4 w-4" />
        <span className="font-semibold">Session analytics</span>
      </div>
      <p className="mt-2 text-sm text-zinc-600">
        Lightweight telemetry to gauge how engaged this mentor thread is.
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-zinc-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-zinc-500">Turns</dt>
          <dd className="text-xl font-semibold text-zinc-900">
            {stats.turns}
          </dd>
        </div>
        <div className="rounded-xl bg-zinc-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-zinc-500">
            Duration
          </dt>
          <dd className="text-xl font-semibold text-zinc-900">
            {stats.durationMinutes}m
          </dd>
        </div>
        <div className="rounded-xl bg-zinc-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-zinc-500">
            You
          </dt>
          <dd className="text-xl font-semibold text-zinc-900">
            {stats.userMessages}
          </dd>
        </div>
        <div className="rounded-xl bg-zinc-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-zinc-500">
            Mentor
          </dt>
          <dd className="text-xl font-semibold text-zinc-900">
            {stats.mentorMessages}
          </dd>
        </div>
      </dl>
    </section>
  );
};

