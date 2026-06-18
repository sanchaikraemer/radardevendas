import type { Message, Side } from "./types";

const MESES = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export function fmtDate(d: string): string {
  const p = String(d).split("/");
  const mi = parseInt(p[1], 10) - 1;
  return p[0] + " " + (MESES[mi] || p[1] || "");
}

export interface ParsedConversation {
  messages: Message[];
  themName: string;
  count: number;
}

// Caracteres invisíveis (LRM/RLM/marcas de direção) que o WhatsApp insere e
// que quebram o casamento do início da linha.
const STRIP_RE = /[‎‏‪-‮⁦-⁩]/g;
// Linhas de sistema / avisos que não são mensagens.
const SYSTEM_RE =
  /criptografia|lista de contatos|Saiba mais|adicionou|saiu do grupo|removeu|mudou o assunto|mudou o ícone|mensagem apagada|esta mensagem foi apagada|você apagou/i;
// "Mídia não incluída" (export "sem mídia") — ignoramos.
const OMITTED_RE =
  /^<?\s*(?:[áa]udio|imagem|figurinha|sticker|v[íi]deo|gif|foto|documento|m[íi]dia)?\s*(?:oculta|oculto|ocultad[oa]|omitid[oa]|omitted)\s*>?$|^<m[íi]dia[^>]*>$|^<arquivo de m[íi]dia[^>]*>$/i;
// Anexo no formato "<anexado: nome.ext>" / "<attached: nome.ext>".
const ATTACH_TAG_RE = /<(?:anexad[oa]|attached):\s*([^>]+?)>/i;
// Anexo no formato "nome.ext (arquivo anexado)".
const ATTACH_WORD_RE = /\(arquivo anexado\)|\(file attached\)/i;
// Qualquer nome de arquivo com extensão reconhecida.
const ANY_FILE_RE =
  /([^\s<>:"|*?]+\.(?:opus|ogg|m4a|mp3|wav|aac|amr|jpe?g|png|webp|gif|bmp|heic|pdf|mp4|3gp|mov|webm|mkv|docx?|xlsx?|pptx?|vcf|zip))/i;
// Extensões de áudio (o que nos interessa transcrever).
const AUDIO_RE = /\.(opus|ogg|m4a|mp3|wav|aac|amr)$/i;

/**
 * Lê o .txt exportado do WhatsApp e monta a linha do tempo.
 * Foco em TEXTO + ÁUDIO: áudios viram mensagem 'audio' (transcrição via Whisper
 * roda depois, no servidor); foto, vídeo, pdf e afins são ignorados de propósito.
 */
export function parseWhatsApp(text: string, myName: string): ParsedConversation {
  const lines = (text || "").split(/\r?\n/);
  const re =
    /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2})(?::\d{2})?\s*[-–]\s*([^:]+?):\s?([\s\S]*)$/;
  const out: Message[] = [];
  let last: Message | null = null;
  let lastDate: string | null = null;
  const senders: Record<string, number> = {};
  const me = (myName || "").trim();

  // Insere o divisor de data só quando vamos de fato adicionar uma mensagem,
  // evitando divisores "órfãos" de mídia ignorada.
  const ensureDiv = (date: string) => {
    if (date !== lastDate) {
      out.push({ k: "div", text: fmtDate(date) });
      lastDate = date;
    }
  };

  for (const raw of lines) {
    const line = raw.replace(STRIP_RE, "");
    const m = line.match(re);
    if (m) {
      if (SYSTEM_RE.test(line)) {
        last = null;
        continue;
      }
      const sender = m[3].trim();
      const date = m[1];
      const time = m[2];
      const body = m[4];
      const side: Side = sender === me ? "me" : "them";
      // Tudo que veio do contato conta pra descobrir o nome dele.
      if (side === "them") senders[sender] = (senders[sender] || 0) + 1;

      // Mídia não incluída no export → ignora (não vira balão de texto feio).
      if (OMITTED_RE.test(body.trim())) {
        last = null;
        continue;
      }

      // Tem um arquivo anexado nesta linha?
      const tag = body.match(ATTACH_TAG_RE);
      let fileName: string | null = null;
      if (tag) {
        fileName = tag[1].trim();
      } else if (ATTACH_WORD_RE.test(body)) {
        const fm = body.match(ANY_FILE_RE);
        fileName = fm ? fm[1].trim() : null;
      } else {
        // linha que é basicamente só o nome de um arquivo
        const fm = body.match(ANY_FILE_RE);
        if (fm && body.trim().length - fm[1].length <= 3) fileName = fm[1].trim();
      }

      if (fileName) {
        if (AUDIO_RE.test(fileName)) {
          ensureDiv(date);
          out.push({
            k: "audio",
            from: side,
            transcript: "",
            file: fileName,
            t: time,
          });
        }
        // foto/vídeo/pdf/documento → ignorados de propósito
        last = null;
        continue;
      }

      if (!body.trim()) {
        last = null;
        continue;
      }

      ensureDiv(date);
      const msg: Message = { k: side, text: body.trim(), t: time };
      out.push(msg);
      last = msg;
    } else if (last && line.trim()) {
      last.text = (last.text || "") + "\n" + line.trim();
    }
  }

  const themName =
    Object.keys(senders).sort((a, b) => senders[b] - senders[a])[0] ||
    "Contato";
  return {
    messages: out,
    themName,
    count: out.filter((x) => x.k === "me" || x.k === "them" || x.k === "audio")
      .length,
  };
}
