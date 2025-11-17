import { NextRequest, NextResponse } from "next/server";
import { requestChatCompletion } from "@/lib/mistral";
import { ChatMessage } from "@/types/chat";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const messages = payload.messages as Array<
      Pick<ChatMessage, "role" | "content">
    >;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages payload is required" },
        { status: 400 }
      );
    }

    const { content } = await requestChatCompletion(messages, {
      model: payload.model,
    });

    if (!content) {
      return NextResponse.json(
        { error: "No content returned from Mistral" },
        { status: 502 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("[chat-route]", error);
    return NextResponse.json(
      { error: "Failed to reach mentor assistant" },
      { status: 500 }
    );
  }
}

