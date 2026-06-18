import type { AiResult, Message } from "./types";

/**
 * Transforma a timeline em texto "Nome: mensagem" (últimas ~50 linhas),
 * que é o que mandamos pro modelo. Portado do callAI do protótipo.
 */
export function serializeConversation(
  messages: Message[],
  myName: string,
): string {
  return (messages || [])
    .filter((m) => m.text && (m.k === "me" || m.k === "them"))
    .slice(-50)
    .map((m) => (m.k === "me" ? myName || "Você" : "Contato") + ": " + m.text)
    .join("\n");
}

/** System prompt validado no protótipo, adaptado para o chat da OpenAI (JSON mode). */
export function systemPrompt(myName: string): string {
  const me = myName || "Você";
  return [
    `Você é especialista em negociação imobiliária e atendimento comercial. Analise uma conversa de WhatsApp em que "${me}" é o vendedor/construtora e o "Contato" é o comprador ou o corretor dele.`,
    `Responda APENAS com um JSON válido (sem markdown, sem texto fora do JSON), exatamente neste formato:`,
    `{"oneLine":"resumo em 1 linha","chips":[{"label":"Imóvel","value":"..."},{"label":"Posição","value":"quem deve responder agora"},{"label":"Temperatura","value":"quente/morna/fria"}],"summary":"2 a 3 frases","frictions":["ponto","ponto"],"rec":"recomendação curta e acionável","suggestions":[{"cat":"RÓTULO","amigavel":"...","direto":"...","formal":"..."}]}`,
    `Gere exatamente 3 sugestões de resposta para "${me}" enviar agora — persuasivas, específicas ao contexto e curtas (no máximo 25 palavras por tom). Escreva em português do Brasil.`,
  ].join("\n");
}

/** Extrai o JSON da resposta do modelo, tolerando cercas ```json e texto ao redor. */
export function parseAiJson(raw: string): AiResult | null {
  if (!raw) return null;
  const str = String(raw).replace(/```json/gi, "").replace(/```/g, "");
  const a = str.indexOf("{");
  const b = str.lastIndexOf("}");
  if (a < 0 || b < 0) return null;
  try {
    return JSON.parse(str.slice(a, b + 1)) as AiResult;
  } catch {
    return null;
  }
}
