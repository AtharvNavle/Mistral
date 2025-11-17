import { NextRequest, NextResponse } from "next/server";
import { requestChatCompletion } from "@/lib/mistral";

const SUMMARY_PROMPT =
  "You are a note-taking mentor. Summarize the conversation into 3 concise bullet points focused on goals, risks, and next steps. Respond with bullets only.";

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (typeof transcript !== "string" || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    const { content } = await requestChatCompletion([
      { role: "system", content: SUMMARY_PROMPT },
      { role: "user", content: transcript },
    ]);

    const bullets =
      content
        ?.split("\n")
        .map((line) => line.replace(/^[\-\u2022\*]+\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 4) ?? [];

    return NextResponse.json({ bullets });
  } catch (error) {
    console.error("[summary-route]", error);
    return NextResponse.json(
      { error: "Failed to build summary" },
      { status: 500 }
    );
  }
}

