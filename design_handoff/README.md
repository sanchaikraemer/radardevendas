# Handoff: Fechou — assistente de respostas para corretores

> **Para o desenvolvedor (Claude Code):** este pacote tem (1) um protótipo de design em HTML e (2) a especificação para transformá-lo num SaaS/PWA real. Os arquivos `.html` são **referência de design** — mostram a aparência e o comportamento desejados. **Não copie o HTML para produção.** Recrie as telas no ambiente alvo (recomendado **Next.js + React**) seguindo este documento, e implemente o **backend** descrito na seção "Arquitetura de produção".

---

## 1. Visão geral

**Fechou** ajuda corretores/vendedores de imóveis a responder clientes no WhatsApp com qualidade. O usuário **importa uma conversa exportada do WhatsApp** (texto + áudios + anexos); o sistema **transcreve os áudios, monta a linha do tempo, analisa a negociação** e **sugere 3 respostas** prontas (em 3 tons: Amigável / Direto / Formal) para enviar.

Caso de uso real embutido no protótipo: negociação do **apto 604 do Residencial Gabro (Santa Maria/RS)** entre Sanchai (construtora Senger) e Anderson (corretor do comprador, REDE MOI) — propostas de R$ 330k → 370k → 345k → 370k (200+85+85).

Público: corretor autônomo / popular. Plataforma: **PWA mobile-first** (funciona em celular e desktop).

## 2. Fidelidade

**Alta fidelidade (hi-fi).** Cores, tipografia, espaçamento e interações são finais. Recrie pixel-perfect usando as libs do projeto. Os tokens exatos estão na seção 6.

## 3. Arquivos de design neste pacote

- `Fechou.dc.html` — fonte do protótipo. É um "Design Component" (runtime próprio com `<x-dc>`, `support.js`, `sc-for`/`sc-if`). **Leia para entender layout, estados e a lógica** (classe `Component`), mas reimplemente em React.
- `Fechou-standalone.html` — versão única auto-contida (abre offline no navegador). Boa para ver rodando.
- `assets/icon-192.png`, `assets/icon-512.png` — ícones do PWA (esmeralda).
- `assets/cartao-redemoi.jpg`, `assets/matricula-604.jpg`, `assets/matricula-box.jpg` — anexos de exemplo usados na timeline.
- `manifest.json`, `sw.js` — manifest e service worker do PWA (cache-first do shell).

A lógica de negócio (parse do WhatsApp, prompt da IA, montagem da timeline, geração de sugestões) está na classe `Component` dentro de `Fechou.dc.html` — **use como referência funcional**.

## 4. Telas / Views

### 4.1 Inbox (caixa de entrada)
- **Layout:** coluna full-height. Header branco (wordmark "Fechou" + ponto esmeralda; avatar do usuário à direita) → saudação ("Boa tarde, Sanchai" + subtítulo) → **CTA "Importar conversa do WhatsApp"** (card escuro `#16171C`, ícone esmeralda) → chips de filtro (Todas / Ativas / Esfriaram, com contadores) → lista de conversas (scroll).
- **Item da lista:** avatar quadrado-arredondado (raio 15px, cor própria, iniciais), nome (700/15px), horário, snippet (ellipsis), badge de status (pill) + nota da IA ("✨ análise pronta").
- **Filtro ativo:** fundo `#16171C`, texto branco, contador `#3FBE86`. Inativo: fundo branco, borda `#E7E4DA`, texto `#5B5D67`.

### 4.2 Importar (2 estados)
- **Estado colar (idle):** tela escura `#16171C`. Título "Importar conversa" → input "Seu nome na conversa" → textarea grande com o `.txt` colado (vem com exemplo pré-preenchido) → aviso sobre áudio → botão **"✨ Analisar com IA"** (esmeralda `#128A5B`) → botão secundário "Ver exemplo pronto".
- **Estado analisando (busy):** título "Analisando conversa…", pílula com contagem de mensagens lidas, lista de etapas com check/spinner ("Lendo o arquivo .txt", "Identificando remetentes", "Organizando a linha do tempo", "Analisando com a IA", "Gerando sugestões"), barra de progresso esmeralda.

### 4.3 Conversa (tela principal)
- **Layout:** coluna full-height: Header → barra de Análise (recolhível) → timeline (scroll, flex:1) → painel de Sugestões da IA (recolhível) → barra de input.
- **Header:** voltar (‹), avatar, nome + contexto (imóvel · valor), badge de status.
- **Análise da IA (card escuro recolhível):** título "✨ Análise da negociação"; chips horizontais (Imóvel, Posição, Temperatura...); resumo (2-3 frases); chips de atrito (⚠, vermelho `#E8542F`); caixa "Recomendação" (borda/realce esmeralda); rodapé "🎙️ Gerado a partir de N áudios...". Recolhida vira uma barra de 1 linha ("✨ Análise: …  ver ↓").
- **Timeline — tipos de mensagem (renderizar cada um):**
  - `divisor de data` — pílula centralizada cinza.
  - `texto` — balão. **Eu (corretor):** fundo `#D8EEE0`, texto `#143B2A`, alinhado à direita, raio `16px 16px 5px 16px`. **Contato:** fundo branco, borda `#ECE9DF`, esquerda, raio `16px 16px 16px 5px`.
  - `áudio transcrito` — balão com botão play, waveform (barras), duração, transcrição em itálico e selo "🎙️ TRANSCRITO POR IA".
  - `proposta` — card branco estruturado: rótulo (uppercase, cor por lado), **total grande** (Bricolage 21px), linhas (Entrada / safras), nota opcional, badge "MELHOR CENÁRIO" (esmeralda) quando aplicável.
  - `documento` — chip com ícone 📄, nome, meta (PDF/Imagem/áudio).
  - `imagem` — miniatura (raio 11px) + legenda.
- **Painel de Sugestões (escuro, recolhível):** título "✨ Sugestões da IA"; **controle de tom segmentado** (Amigável/Direto/Formal — ativo = esmeralda `#128A5B`, texto branco); **carrossel horizontal de 3 cards** (cada um: chip de categoria colorido, texto da sugestão, botão "Usar resposta" esmeralda); ações "↻ Gerar outras" e "📋 Modelos".
- **Input:** textarea + botão enviar (44–46px, esmeralda quando há texto, cinza quando vazio).

### 4.4 Modelos (bottom sheet)
Overlay com lista de templates rápidos (categoria + texto); toque insere no campo. Fechar no scrim ou no ✕.

## 5. Interações e comportamento

- **Importar:** colar `.txt` → parse client-side em mensagens → chamar LLM → criar conversa + abrir.
- **Trocar tom:** troca o texto das 3 sugestões instantaneamente (o LLM retorna os 3 tons de uma vez).
- **Usar resposta:** insere o texto no input (editável antes de enviar).
- **Enviar:** adiciona balão "eu"; (no protótipo) simula resposta do contato após ~2s e esquenta o status. Em produção, integra ao envio real (WhatsApp API) ou só copia para a área de transferência.
- **Gerar outras:** rechama o LLM para novas sugestões da conversa ativa (mostra skeleton/loading).
- **Análise e Painel:** recolhíveis independentemente.
- **Animações:** spinner (rotate), waveform, "digitando" (3 pontos). Evitar animações de entrada que usem `opacity` com `fill: both` (causou bug no protótipo — preferir só `transform`).

## 6. Design tokens (exatos)

**Cores**
- Acento (preenchimento, texto branco em cima): `#128A5B`
- Acento sobre fundo escuro (texto/ícone/borda): `#3FBE86`
- Acento detalhe claro: `#9BE8C2`
- Barra de progresso: `#2EB37A`
- Chrome escuro: `#16171C`; painéis `#21232C` / `#23252E`; bordas escuras `#2E3039`
- Fundo (paper): `#F2F6F2`; branco `#FFFFFF`; campo de input `#EEF3EF`; backdrop desktop `#0F1117`
- Texto: primário `#16171C`; secundário `#5B5D67` / `#7C7E88` / `#8A8C96`; terciário `#A9AAB2`; sobre escuro `#D6D8E0` / `#9DA2B3`
- Bordas claras: `#EDEAE0`, `#ECE9DF`, `#E7E4DA`
- Balão "eu": fundo `#D8EEE0`, borda `#BFE3CD`, texto `#143B2A`, meta `#6E8C7C`
- Balão "contato": fundo `#FFFFFF`, borda `#ECE9DF`, texto `#16171C`, meta `#B0B1B8`
- Status badges (fundo/texto): cold `#E8F0FB`/`#3D7FCC` · warm `#FBF0DD`/`#B07A1E` · hot `#FCE7E0`/`#D63D1F` · new `#ECECEF`/`#6B6D77`
- Acentos das sugestões (por índice): `#3FBE86`, `#E8542F`, `#6FA0D9`
- Atrito/alerta: `#E8542F`

**Tipografia**
- Display/wordmark/títulos/valores: **Bricolage Grotesque** (700/800)
- Corpo/UI: **Hanken Grotesk** (400–800)
- (Google Fonts)

**Raios:** balões 16px (canto "rabo" 4–5px); cards 13–18px; pílulas 999px; botões 11–14px.
**Sombras:** banner `0 10px 26px rgba(22,23,28,.2)`; painel `0 -10px 30px rgba(0,0,0,.18)`.
**Tema PWA:** `theme_color #128A5B`, `background_color #16171C`.

## 7. Estado (referência do protótipo)

`screen` (inbox|importing|chat), `activeId`, `filter`, `tone` (amigavel|direto|formal), `input`, `panelOpen`, `analysisOpen`, `regenerating`, `typing`, `showTemplates`, `aiBusy`, `myName`, `importText`, `aiError`, `importStep`, `convs` (mapa de conversas).
Cada conversa: `{ id, name, initials, color, property, price, statusLabel, statusTone, group, snippet, time, messages[], analysis{}, suggestions[], reply }`.
Cada mensagem: `{ k: 'div'|'me'|'them'|'audio'|'proposal'|'doc'|'image', text?, t?, transcript?, dur?, propTitle?, propTotal?, propRows[]?, propNote?, best?, docName?, docMeta?, src?, cap? }`.

---

## 8. Arquitetura de produção (o backend a construir)

O protótipo já faz, **no navegador**: parse do `.txt`, chamada a um LLM e montagem da timeline. Falta o backend real:

### 8.1 Stack recomendada
- **Front-end:** Next.js (App Router) + React + TypeScript + Tailwind. PWA via `next-pwa`.
- **API/serverless:** rotas Next.js (ou um serviço Node separado para jobs longos).
- **Banco:** PostgreSQL (Supabase ou Neon). Storage de áudios: Supabase Storage / S3.
- **Auth:** Supabase Auth ou Clerk.
- **Transcrição:** **Whisper** (`whisper-large-v3` via OpenAI, ou `faster-whisper` self-hosted) — ótimo PT-BR; alternativa **AssemblyAI**/**Deepgram** (PT-BR + diarização).
- **LLM (análise + sugestões):** **Anthropic Claude** — `claude-sonnet` (qualidade de negociação) ou `claude-haiku` (custo). O protótipo já usa o padrão de prompt → JSON.
- **WhatsApp:** v1 = upload do `.txt`+mídias exportados; v2 = **WhatsApp Cloud API** (Meta) para puxar/responder ao vivo.
- **Hospedagem:** Vercel (front+API) + worker/fila (Upstash QStash / Inngest) para transcrição assíncrona.

### 8.2 Modelo de dados (mínimo)
- `users` (corretor)
- `clients` (perfil do cliente/lead: nome, telefone, imóvel de interesse, orçamento, notas)
- `conversations` (client_id, status, temperatura, última atividade)
- `messages` (conversation_id, sender 'me'|'them', type, text, timestamp, attachment_id)
- `attachments` (tipo, url, transcript, duração)
- `analyses` (conversation_id, oneLine, summary, frictions[], rec, chips[], created_at)
- `suggestions` (conversation_id, cat, accent, tone_variants {amigavel,direto,formal})

### 8.3 Pipeline
```
Importar (.txt + mídias)  OU  WhatsApp Cloud API (webhook)
  → salvar mensagens + anexos
  → enfileirar transcrição dos áudios (Whisper/AssemblyAI) → preencher messages.text
  → montar timeline ordenada por timestamp
  → buscar histórico do cliente no banco (RAG)
  → LLM (Claude): timeline + perfil/histórico → JSON { analysis, suggestions[3 tons] }
  → persistir analyses + suggestions
  → front exibe; "Gerar outras" e troca de tom rechamam/relêem
```

### 8.4 Prompt de IA (usar como base — já validado no protótipo)
O app envia a conversa (linhas "Nome: texto", últimas ~50) e pede **APENAS JSON compacto**:
```json
{"oneLine":"...","chips":[{"label":"Imóvel","value":"..."},{"label":"Posição","value":"quem responde agora"},{"label":"Temperatura","value":"quente/morna/fria"}],
 "summary":"2-3 frases","frictions":["...","..."],"rec":"recomendação curta",
 "suggestions":[{"cat":"RÓTULO","amigavel":"...","direto":"...","formal":"..."}]}
```
Instruções-chave do system/prompt: especialista em negociação imobiliária; identificar quem deve responder; gerar **3 sugestões persuasivas e específicas**, ≤25 palavras por tom; nada de markdown. Em produção, injetar também o **histórico do cliente** (RAG) no contexto.

### 8.5 Roadmap sugerido para o Claude Code
1. **Scaffolding:** Next.js + Tailwind + Supabase (auth + db) + PWA. Recriar as telas da seção 4 com os tokens da seção 6.
2. **Importação manual:** upload do `.txt` → parser (portar a função `parseWhatsApp` de `Fechou.dc.html`) → timeline → salvar.
3. **LLM:** rota `/api/analyze` chamando Claude com o prompt 8.4 → análise + sugestões. Ligar "Gerar outras" e troca de tom.
4. **Transcrição:** upload das mídias `.opus` → fila → Whisper/AssemblyAI → preencher transcrições → reanalisar.
5. **Histórico/RAG:** modelar `clients`, salvar conversas, injetar histórico no prompt.
6. **WhatsApp Cloud API:** ingestão/resposta ao vivo (requer conta Meta Business + número).
7. **Polimento PWA:** manifest/SW (já incluídos como base), "adicionar à tela inicial", offline shell.

### 8.6 Variáveis de ambiente
`ANTHROPIC_API_KEY`, `OPENAI_API_KEY` (ou `ASSEMBLYAI_API_KEY`), `DATABASE_URL`, `SUPABASE_URL`/`SUPABASE_ANON_KEY`, (v2) `WHATSAPP_TOKEN`/`WHATSAPP_PHONE_ID`.

---

## 9. Notas
- **Sem áudio no navegador:** a transcrição roda **no servidor**. No protótipo os áudios entram como `[áudio]`/chip — em produção, transcrever e preencher o texto.
- **Identidade visual** criada do zero (não é marca de cliente). REDE MOI / Senger aparecem apenas como dados do exemplo.
- O `.txt` de exemplo (negociação Gabro 604) está embutido na constante `SAMPLE` em `Fechou.dc.html` — útil para testes.
