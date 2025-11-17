import { ChatMessage, SessionSummary } from "./chat";

export interface ShareableThread {
  title: string;
  persona: {
    id: string;
    name: string;
    tagline: string;
    color: string;
  };
  messages: Pick<ChatMessage, "role" | "content" | "createdAt">[];
  summary?: SessionSummary["bullets"];
  updatedAt: number;
}

