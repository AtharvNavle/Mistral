import { ChatThread } from "@/types/chat";
import { ShareableThread } from "@/types/share";
import { getPersonaById } from "@/constants/personas";

export const buildSharePayload = (thread: ChatThread): ShareableThread => {
  const persona = getPersonaById(thread.personaId);
  return {
    title: thread.title,
    persona: {
      id: persona.id,
      name: persona.name,
      tagline: persona.tagline,
      color: persona.color,
    },
    messages: thread.messages.map(({ role, content, createdAt }) => ({
      role,
      content,
      createdAt,
    })),
    summary: thread.summary?.bullets,
    updatedAt: thread.updatedAt,
  };
};

const encodeBase64 = (value: string) => {
  if (typeof window === "undefined") {
    return Buffer.from(value, "utf-8").toString("base64url");
  }
  return window
    .btoa(encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, hex) =>
      String.fromCharCode(Number.parseInt(hex, 16))
    ));
};

const decodeBase64 = (value: string) => {
  if (typeof window === "undefined") {
    return Buffer.from(value, "base64url").toString("utf-8");
  }
  return decodeURIComponent(
    window
      .atob(value)
      .split("")
      .map((char) =>
        `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`
      )
      .join("")
  );
};

export const encodeSharePayload = (payload: ShareableThread) => {
  const json = JSON.stringify(payload);
  return encodeBase64(json);
};

export const decodeSharePayload = (encoded: string): ShareableThread => {
  const json = decodeBase64(encoded);
  return JSON.parse(json) as ShareableThread;
};

