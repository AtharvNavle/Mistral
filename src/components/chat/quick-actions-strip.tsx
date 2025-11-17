"use client";

import { QUICK_ACTIONS } from "@/constants/quick-actions";
import { cn } from "@/lib/utils";

interface QuickActionsStripProps {
  onInsertTemplate: (value: string) => void;
  currentDraft: string;
}

export const QuickActionsStrip = ({
  onInsertTemplate,
  currentDraft,
}: QuickActionsStripProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-zinc-100 px-4 py-3 text-xs text-zinc-600">
      <span className="font-semibold uppercase tracking-wide text-zinc-500">
        Quick actions
      </span>
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() =>
            onInsertTemplate(
              action.template.replace(
                "{context}",
                currentDraft || "<insert context>"
              )
            )
          }
          className={cn(
            "rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 hover:border-zinc-900 hover:text-zinc-900"
          )}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

