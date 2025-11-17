import { Mistral } from "@mistralai/mistralai";
import { ChatMessage } from "@/types/chat";

const DEFAULT_MODEL = "mistral-small-latest";

type ChatPayload = Pick<ChatMessage, "role" | "content">[];

type ChatCompletionResponse = Awaited<
  ReturnType<InstanceType<typeof Mistral>["chat"]["complete"]>
>;

let mistralClient: Mistral | null = null;

const getClient = () => {
  if (mistralClient) return mistralClient;
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("Missing MISTRAL_API_KEY");
  }
  mistralClient = new Mistral({ apiKey });
  return mistralClient;
};

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
}

const extractContent = (response: ChatCompletionResponse) => {
  const choice = response.choices?.[0];
  if (!choice) return "";
  const message = choice.message as { content?: string };
  return message?.content?.trim() ?? "";
};

export const requestChatCompletion = async (
  messages: ChatPayload,
  options: ChatCompletionOptions = {}
) => {
  const client = getClient();
  const response = await client.chat.complete({
    model: options.model ?? DEFAULT_MODEL,
    temperature: options.temperature ?? 0.3,
    messages,
  });

  return {
    content: extractContent(response),
    response,
  };
};

