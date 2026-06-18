import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { Message } from "@/lib/types";
import { parseAiJson, serializeConversation, systemPrompt } from "@/lib/prompt";

export const runtime = "nodejs";
// Análise pode levar alguns segundos; deixar folga.
export const maxDuration = 30;

interface AnalyzeBody {
  messages: Message[];
  myName: string;
}

export async function POST(req: Request) {
  const key = process.env.OPENAI_API_KEY;
  // Sem chave → app cai em modo demo (sugestões-fallback) no cliente.
  if (!key) return NextResponse.json({ ok: false, reason: "no_key" });

  let body: AnalyzeBody;
  try {
    body = (await req.json()) as AnalyzeBody;
  } catch {
    return NextResponse.json(
      { ok: false, reason: "bad_request" },
      { status: 400 },
    );
  }

  const myName = (body.myName || "").trim();
  const convo = serializeConversation(body.messages || [], myName);
  if (!convo.trim()) return NextResponse.json({ ok: false, reason: "empty" });

  try {
    const client = new OpenAI({ apiKey: key });
    const model = process.env.OPENAI_MODEL || "gpt-4o";
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt(myName || "Você") },
        { role: "user", content: convo },
      ],
    });
    const raw = completion.choices[0]?.message?.content || "";
    const ai = parseAiJson(raw);
    if (!ai) return NextResponse.json({ ok: false, reason: "parse" });
    return NextResponse.json({ ok: true, ai });
  } catch (err) {
    console.error("[/api/analyze] erro ao chamar a OpenAI:", err);
    return NextResponse.json({ ok: false, reason: "error" });
  }
}
