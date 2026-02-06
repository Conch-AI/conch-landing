import { NextRequest } from "next/server";
import OpenAI from "openai";

// Use Node.js runtime to avoid edge incompatibilities with the OpenAI SDK
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { question, tone } = await req.json();

  const systemPrompt = `You are a helpful assistant. Explain the following topic in a ${
    tone || "Informative"
  } tone. Keep the explanation concise and short. Return the response as plain text only, without any markdown formatting.`;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
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
