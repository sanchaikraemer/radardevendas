# Fechou — respostas que fecham 🟢

**Inteligência comercial para corretores de imóveis.** O corretor importa uma
conversa exportada do WhatsApp, o app monta a linha do tempo, **analisa a
negociação** e sugere **3 respostas prontas** em 3 tons (Amigável / Direto /
Formal) — prontas pra enviar.

PWA mobile-first (funciona no celular e no desktop).

---

## Stack

- **Next.js (App Router) + React + TypeScript + Tailwind**
- **OpenAI** para a IA:
  - **GPT** (chat, JSON mode) → análise da negociação + 3 sugestões — _já no MVP_
  - **Whisper** → transcrição dos áudios `.opus` do WhatsApp — _próxima fase_
- Deploy: **Vercel**

> Por que OpenAI e não Anthropic? A transcrição de áudio exige um modelo de voz
> (Whisper). Para usar **uma chave só**, a análise/sugestões também roda na
> OpenAI (GPT). Dá pra trocar o "cérebro" da análise por outro provedor depois
> sem mexer no front.

---

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # e preencha OPENAI_API_KEY
npm run dev                  # http://localhost:3000
```

Sem `OPENAI_API_KEY` o app **roda em modo demo**: a linha do tempo é montada
normalmente e as sugestões caem num _fallback_ genérico (a rota `/api/analyze`
responde `{ ok: false, reason: "no_key" }`).

### Variáveis de ambiente

| Variável         | Obrigatória | Descrição                                                            |
| ---------------- | ----------- | -------------------------------------------------------------------- |
| `OPENAI_API_KEY` | sim (p/ IA) | Chave da OpenAI (análise/sugestões via GPT; transcrição via Whisper) |
| `OPENAI_MODEL`   | não         | Modelo de chat. Padrão `gpt-4o-mini`. Mais qualidade: `gpt-4o`       |

---

## Como funciona

1. **Importar** (tela escura): cole o `.txt` exportado do WhatsApp + seu nome na
   conversa → o parser (`src/lib/parseWhatsApp.ts`) monta a timeline
   client-side.
2. **Analisar**: o front manda as mensagens pra `POST /api/analyze`, que chama o
   GPT com JSON mode e devolve `{ oneLine, chips, summary, frictions, rec,
   suggestions[] }`.
3. **Conversa**: timeline + análise recolhível + 3 sugestões (troca de tom
   instantânea, "Gerar outras" e "Modelos").

Áudios entram como `[áudio]` no MVP; a transcrição real (Whisper) roda no
servidor numa fase posterior.

---

## Deploy na Vercel

1. Importe o repositório na Vercel.
2. Em **Environment Variables**, configure `OPENAI_API_KEY` (e opcionalmente
   `OPENAI_MODEL`).
3. Deploy. O `manifest.json` + service worker (`public/`) deixam o app
   instalável como PWA.

---

## Roadmap

- [x] **Scaffolding** — Next + Tailwind + PWA, 3 telas pixel-fiéis ao protótipo
- [x] **Importação manual** — parser do `.txt` → timeline
- [x] **IA** — rota `/api/analyze` (GPT, JSON mode) + troca de tom + "Gerar outras"
- [ ] **Transcrição** — upload das mídias `.opus` → Whisper → preencher transcrições
- [ ] **Histórico/RAG** — modelar `clients`/`conversations`, persistir e injetar histórico no prompt
- [ ] **Banco + Auth** — Supabase (Postgres + Auth)
- [ ] **WhatsApp Cloud API** — ingestão/resposta ao vivo
- [ ] **Polimento PWA** — cache offline do shell

---

## Estrutura

```
src/
  app/
    layout.tsx          # fontes (Google), metadata, manifest/PWA
    page.tsx
    globals.css         # tokens de animação + reset
    api/analyze/route.ts# chama a OpenAI (server-only; usa OPENAI_API_KEY)
  components/
    FechouApp.tsx       # app inteiro: estado + 3 telas (Inbox/Importar/Conversa)
  lib/
    types.ts            # tipos do domínio
    parseWhatsApp.ts    # parser do .txt
    prompt.ts           # serialização da conversa + system prompt + parse do JSON
    ai.ts               # helpers de sugestão + fetch /api/analyze (client)
    sample.ts           # dados de exemplo (Gabro 604, Juliana, Marina)
public/
  manifest.json, sw.js, assets/   # PWA + ícones + anexos de exemplo
design_handoff/         # protótipo/spec de referência (NÃO é o código de produção)
```

O design original (protótipo HTML + tokens + spec) está em `design_handoff/`
como referência para as próximas fases.
