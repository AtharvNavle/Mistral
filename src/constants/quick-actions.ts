import { QuickAction } from "@/types/chat";

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "triage",
    label: "Bug triage",
    description: "Summarize a bug and suggest root causes.",
    template:
      "We found a regression:\n\n{context}\n\nList likely root causes, debug steps, and a severity rating.",
  },
  {
    id: "rewrite",
    label: "Spec rewrite",
    description: "Turn rough notes into a short spec.",
    template:
      "Rewrite the following brainstorm into a concise 1-page spec with goals, risks, and open questions:\n\n{context}",
  },
  {
    id: "retro",
    label: "Retro outline",
    description: "Create a retro agenda from a chat thread.",
    template:
      "From this conversation, build a retro outline with 'Went well', 'Needs attention', and 'Experiments':\n\n{context}",
  },
];

