import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const MAX_CONTEXT_LENGTH = 8000;
const MAX_HISTORY_PAIRS = 10;

export async function POST(req: NextRequest) {
  const { question, documentText, chatHistory, generateSuggestions } = await req.json();

  if (!documentText) {
    return new Response("Missing document text", { status: 400 });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const truncatedDoc =
    documentText.length > MAX_CONTEXT_LENGTH
      ? documentText.slice(0, MAX_CONTEXT_LENGTH) + "\n\n[Document truncated...]"
      : documentText;

  // Suggestions-only mode: return JSON with follow-up questions
  if (generateSuggestions) {
    const recentHistory = (chatHistory || []).slice(-MAX_HISTORY_PAIRS);
    const historyText = recentHistory
      .map((e: { question: string; response: string }) => `Q: ${e.question}\nA: ${e.response}`)
      .join("\n\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "Based on the document and the conversation so far, generate 3-5 short follow-up questions the user might want to ask next. Each question should be concise (under 12 words), specific to the document, and different from questions already asked. Return ONLY a JSON array of strings.",
        },
        {
          role: "user",
          content: `Document:\n${truncatedDoc}\n\nConversation so far:\n${historyText || "None yet"}`,
        },
      ],
      temperature: 0.7,
    });

    try {
      const content = response.choices[0]?.message?.content || "[]";
      const questions: string[] = JSON.parse(content);
      return NextResponse.json({ suggestions: questions.slice(0, 5) });
    } catch {
      return NextResponse.json({ suggestions: [] });
    }
  }

  // Normal streaming chat mode
  if (!question) {
    return new Response("Missing question", { status: 400 });
  }

  const systemPrompt = `You are a helpful document analysis assistant. Answer questions based on the following document content. Be concise, accurate, and helpful. If the answer cannot be found in the document, say so clearly. Return the response as plain text only, without any markdown formatting.

Document content:
${truncatedDoc}`;

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
  ];

  const recentHistory = (chatHistory || []).slice(-MAX_HISTORY_PAIRS);
  for (const entry of recentHistory) {
    messages.push({ role: "user", content: entry.question });
    if (entry.response) {
      messages.push({ role: "assistant", content: entry.response });
    }
  }

  messages.push({ role: "user", content: question });

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    stream: true,
    messages,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
