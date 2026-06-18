import type { Conversation } from "./types";

/** .txt de exemplo (negociação Gabro 604) — pré-preenche a tela de importar. */
export const SAMPLE = `10/06/2026 18:04 - Anderson Ruviaro Corretor SM Gabro: Olá, boa tarde! Tudo bem??
10/06/2026 18:06 - Anderson Ruviaro Corretor SM Gabro: Estou entrando em contato referente a um apartamento de vocês anunciado conosco. Residencial Gabro, unidade 604. Estou com uma proposta de compra para ele.
10/06/2026 18:07 - Sanchai: Boa tarde, ótimo. Qual seria a proposta?
10/06/2026 18:12 - Anderson Ruviaro Corretor SM Gabro: R$ 330.000,00 valor da proposta. R$ 110.000 entrada no ato, R$ 110.000 junho 2027, R$ 110.000 junho 2028.
10/06/2026 18:25 - Sanchai: Não consigo. Mínimo 370.000.
10/06/2026 18:35 - Anderson Ruviaro Corretor SM Gabro: Certo, compreendo. Neste caso R$ 370.000: R$ 110.000 entrada, R$ 130.000 junho 2027, R$ 130.000 junho 2028. Fecharíamos assim?
10/06/2026 18:37 - Sanchai: Não consigo parcelar tanto, e preciso mais entrada. Por 110 mil de entrada não dá.
10/06/2026 18:38 - Sanchai: Tenta orientar teu cliente pra financiar e abater essas parcelas anuais, mais fácil.
10/06/2026 18:39 - Sanchai: Máximo que conseguiria seria uns 200 de entrada e 3x (dez/26, jun/27, dez/27) com 1% de juros no saldo. Nesse preço somente à vista ou financiamento.
10/06/2026 18:41 - Sanchai: Deixa dar uma calculada amanhã com o dono da construtora, pode ser? Assim já te apresento contraproposta formal.
10/06/2026 18:42 - Anderson Ruviaro Corretor SM Gabro: Sim, visitou. Faz sentido pra ele.
11/06/2026 11:24 - Sanchai: Bom dia Anderson, segue proposta.
11/06/2026 11:28 - Sanchai: Anderson Ruviaro - Edifício Gabro - 604.pdf (arquivo anexado)
11/06/2026 11:59 - Anderson Ruviaro Corretor SM Gabro: Muito obrigado pelo envio. Vou tentar a evolução com o cliente.
15/06/2026 11:11 - Anderson Ruviaro Corretor SM Gabro: Fica fora pra ele, infelizmente não consegue chegar na proposta de vocês.
15/06/2026 11:19 - Sanchai: Qual o máximo que ele chegaria? Ou onde tá o problema, na parcela de dezembro, na entrada? Daí vejo com a direção se conseguimos ajustar algo.
15/06/2026 12:20 - Anderson Ruviaro Corretor SM Gabro: Na realidade em tudo, é demais para a capacidade dele, tanto no valor quanto no prazo. Mas vou tentar abrir a mentalidade dele.
16/06/2026 17:50 - Anderson Ruviaro Corretor SM Gabro: R$ 345.000: R$ 115.000 entrada, R$ 115.000 junho 2027, R$ 115.000 junho 2028. Consegui melhorar um pouco com eles.
16/06/2026 17:52 - Sanchai: Não tem como, infelizmente.
16/06/2026 17:54 - Sanchai: PTT-20260616-WA0053.opus (arquivo anexado)
17/06/2026 10:43 - Anderson Ruviaro Corretor SM Gabro: PTT-20260617-WA0013.opus (arquivo anexado)
17/06/2026 10:49 - Sanchai: Produto pronto para morar é via financiamento. Prazo somente na planta. Máximo que conseguimos é entrada, dez/26, jun/27, dez/27.
17/06/2026 11:34 - Sanchai: Anderson, acabei de falar com o dono da empresa e podemos ajustar mais um pouco. Entrada precisa ser mais que 115: 200 entrada, 85 junho/27, 85 junho/28. É o máximo mesmo que consegui.
17/06/2026 11:44 - Anderson Ruviaro Corretor SM Gabro: Perfeito, vou informá-lo.`;

/** Conversas iniciais (caixa de entrada). Portadas do estado do protótipo. */
export const initialConvs: Record<string, Conversation> = {
  gabro: {
    id: "gabro",
    name: "Anderson Ruviaro · REDE MOI",
    initials: "AR",
    color: "#1FA99A",
    property: "Gabro 604 · Santa Maria",
    price: "R$ 370 mil",
    statusLabel: "Aguardando retorno",
    statusTone: "warm",
    group: "ativas",
    snippet: "Anderson: Perfeito, vou informá-lo.",
    time: "11:44",
    hasSug: true,
    aiNote: "13 áudios transcritos · análise pronta",
    reply:
      "Show, Sanchai! Vou levar essas condições pro cliente ainda hoje e já te dou um retorno. Com a minuta na mão fica bem mais fácil ele visualizar 👍",
    analysis: {
      oneLine: "bola com o comprador · proposta de R$ 370 mil na mesa",
      chips: [
        { label: "Imóvel", value: "Gabro 604 · 60,7m²" },
        { label: "Sua proposta atual", value: "R$ 370 mil (200+85+85)" },
        { label: "Posição", value: "Aguardando comprador" },
        { label: "Temperatura", value: "Morna ↓" },
      ],
      summary:
        "Negociação do apto 604 desde 10/06. O comprador (Anderson · REDE MOI) abriu em R$ 330 mil; você fixou o mínimo de R$ 370 mil. O cliente está no limite de capacidade — trava no valor e no prazo. Sua proposta final (200 de entrada + 85 + 85) está com o Anderson desde hoje, 11:44.",
      frictions: ["Entrada baixa", "Prazo de parcelamento", "Capacidade do cliente"],
      rec: "Mantenha aquecido sem pressionar. Reforce que 200 + 85 + 85 já é o teto e crie um próximo passo com data — ex.: preparar a minuta pro cliente visualizar.",
      source: "Gerado a partir de 13 áudios, 1 PDF e 3 imagens.",
    },
    messages: [
      { k: "div", text: "10 de junho" },
      { k: "them", text: "Olá, boa tarde! Tudo bem? 😊", t: "18:04" },
      {
        k: "image",
        from: "them",
        src: "/assets/cartao-redemoi.jpg",
        cap: "Cartão de visita · Maiquel Oliveira Imóveis (REDE MOI)",
        t: "18:06",
      },
      {
        k: "them",
        text: "Estou com uma proposta de compra para o Residencial Gabro, unidade 604.",
        t: "18:07",
      },
      { k: "me", text: "Boa tarde, ótimo. Qual seria a proposta?", t: "18:07" },
      {
        k: "proposal",
        from: "them",
        propTitle: "Proposta do comprador",
        propTotal: "R$ 330.000",
        propRows: [
          { l: "Entrada no ato", v: "R$ 110.000" },
          { l: "Junho 2027", v: "R$ 110.000" },
          { l: "Junho 2028", v: "R$ 110.000" },
        ],
        t: "18:12",
      },
      { k: "me", text: "Não consigo. Mínimo R$ 370.000.", t: "18:25" },
      { k: "them", text: "Certo, compreendo. Neste caso…", t: "18:35" },
      {
        k: "proposal",
        from: "them",
        propTitle: "Proposta revisada",
        propTotal: "R$ 370.000",
        propRows: [
          { l: "Entrada no ato", v: "R$ 110.000" },
          { l: "Junho 2027", v: "R$ 130.000" },
          { l: "Junho 2028", v: "R$ 130.000" },
        ],
        propNote: "Fecharíamos assim?",
        t: "18:35",
      },
      {
        k: "me",
        text: "Não consigo parcelar tanto e preciso de mais entrada. Por 110 mil de entrada não dá.",
        t: "18:37",
      },
      {
        k: "me",
        text: "Tenta orientar teu cliente a financiar e abater as parcelas anuais — fica mais fácil.",
        t: "18:38",
      },
      {
        k: "audio",
        from: "them",
        dur: "0:34",
        transcript:
          "Então, sobre financiar pra abater as parcelas: o cliente prefere o parcelamento direto com vocês, ele não quer envolver banco agora. Mas eu falo com ele sobre aumentar um pouco a entrada, tá?",
        t: "18:39",
      },
      {
        k: "me",
        text: "O máximo seria ~R$ 200 de entrada + 3x (dez/26, jun/27, dez/27), com 1% de juros no saldo. Nesse preço, só à vista ou financiamento.",
        t: "18:39",
      },
      {
        k: "me",
        text: "Deixa eu calcular amanhã com o dono da construtora. Já te apresento a contraproposta formal.",
        t: "18:41",
      },
      { k: "div", text: "11 de junho" },
      {
        k: "doc",
        from: "me",
        docName: "Proposta formal — Gabro 604.pdf",
        docMeta: "PDF · 1 página",
        t: "11:28",
      },
      {
        k: "image",
        from: "me",
        src: "/assets/matricula-604.jpg",
        cap: "Matrícula · Apto 604 — área privativa 60,70m²",
        t: "13:30",
      },
      {
        k: "them",
        text: "Muito obrigado pelo envio. Vou tentar a evolução com o cliente. 👍",
        t: "11:59",
      },
      {
        k: "audio",
        from: "them",
        dur: "0:21",
        transcript:
          "Essa indicação aqui veio pela Naiane, então vocês acertam a comissão com ela depois, beleza? Fechando o negócio eu deixo tudo certinho.",
        t: "13:46",
      },
      {
        k: "me",
        text: "Perfeito. Você acerta a comissão com a Naiane depois, correto? Fechando, deixo claro com ela também.",
        t: "13:48",
      },
      { k: "div", text: "15 de junho" },
      {
        k: "them",
        text: "Fica fora pra ele, infelizmente não consegue chegar na proposta de vocês…",
        t: "11:11",
      },
      {
        k: "me",
        text: "Onde está o problema — entrada, parcela de dezembro? Vejo com a direção se conseguimos ajustar algo.",
        t: "11:19",
      },
      {
        k: "them",
        text: "É demais para a capacidade dele, tanto no valor quanto no prazo. Mas vou tentar abrir a mentalidade dele.",
        t: "12:20",
      },
      { k: "div", text: "16 de junho" },
      {
        k: "proposal",
        from: "them",
        propTitle: "Nova tentativa do comprador",
        propTotal: "R$ 345.000",
        propRows: [
          { l: "Entrada no ato", v: "R$ 115.000" },
          { l: "Junho 2027", v: "R$ 115.000" },
          { l: "Junho 2028", v: "R$ 115.000" },
        ],
        propNote: "Consegui melhorar um pouco.",
        t: "17:51",
      },
      { k: "me", text: "Não tem como, infelizmente.", t: "17:52" },
      {
        k: "audio",
        from: "me",
        dur: "0:28",
        transcript:
          "Anderson, é produto pronto pra morar, então a gente não consegue alongar o prazo igual planta. Mas valorizo demais teu empenho, viu? Vamos seguir tentando.",
        t: "17:54",
      },
      {
        k: "them",
        text: "Compreendo sim! Logo encontramos um novo cliente. Conta conosco. 🤝",
        t: "17:57",
      },
      { k: "div", text: "17 de junho — hoje" },
      {
        k: "audio",
        from: "them",
        dur: "0:25",
        transcript:
          "Bom dia! Consegui essa estrutura aqui com ele: entrada de 115 e safras de 85 mil em 2027, 2028 e 2029. Vê se ajuda aí.",
        t: "10:43",
      },
      {
        k: "me",
        text: "Produto pronto pra morar é via financiamento; prazo só na planta. O máximo é entrada + dez/26 + jun/27 + dez/27.",
        t: "10:49",
      },
      {
        k: "me",
        text: "Anderson, acabei de falar com o dono da empresa — conseguimos ajustar mais um pouco. 🙌",
        t: "11:34",
      },
      {
        k: "proposal",
        from: "me",
        propTitle: "Sua proposta final",
        propTotal: "R$ 370.000",
        propRows: [
          { l: "Entrada no ato", v: "R$ 200.000" },
          { l: "Junho 2027", v: "R$ 85.000" },
          { l: "Junho 2028", v: "R$ 85.000" },
        ],
        propNote: "Melhor cenário liberado pela direção.",
        best: true,
        t: "11:36",
      },
      { k: "them", text: "Perfeito, vou informá-lo.", t: "11:44" },
    ],
    suggestions: [
      {
        cat: "NUTRIR",
        accent: "#3FBE86",
        t: {
          amigavel:
            "Anderson, qualquer dúvida na análise da proposta é só me chamar. Consigo segurar essas condições (200 + 85 + 85) até sexta — depois preciso reavaliar com a direção. Te ajudo no que precisar com o cliente 👍",
          direto:
            "Anderson, seguro as condições 200 + 85 + 85 até sexta. Depois reavalio com a direção. Precisando, chama.",
          formal:
            "Anderson, permaneço à disposição. Consigo manter as condições (200 + 85 + 85) até sexta-feira; após, precisarei reavaliar com a direção. Conte comigo no que for necessário.",
        },
      },
      {
        cat: "CRIAR VALOR",
        accent: "#E8542F",
        t: {
          amigavel:
            "Esse é o melhor cenário que a direção liberou, Anderson — produto pronto pra morar e com a parcela já bem diluída. Se ajudar o cliente a decidir, posso preparar a minuta do contrato pra ele ver como fica na prática. Topa?",
          direto:
            "É o teto da direção, Anderson. Posso já preparar a minuta pro cliente visualizar. Topa?",
          formal:
            "Trata-se do melhor cenário autorizado pela direção. Caso auxilie na decisão, posso elaborar a minuta contratual para apreciação do cliente.",
        },
      },
      {
        cat: "DESTRAVAR CAPACIDADE",
        accent: "#6FA0D9",
        t: {
          amigavel:
            "Se o aperto for a entrada, tem um caminho: o cliente financia a maior parte no banco e a gente reduz as safras. Quer que eu simule esse formato pra você levar pra ele?",
          direto:
            "Se o problema é a entrada, dá pra financiar parte no banco e reduzir as safras. Simulo pra você levar?",
          formal:
            "Caso a limitação seja a entrada, é possível estruturar parte via financiamento bancário, reduzindo as safras. Posso simular esse formato para apresentação ao cliente.",
        },
      },
    ],
  },
  juliana: {
    id: "juliana",
    name: "Juliana Reis",
    initials: "JR",
    color: "#B5573F",
    property: "Studio · Pinheiros",
    price: "R$ 2.300/mês",
    statusLabel: "Quente",
    statusTone: "hot",
    group: "ativas",
    snippet: "Pode ser amanhã de manhã?",
    time: "18 min",
    hasSug: true,
    aiNote: "resposta pronta",
    reply:
      "Confirmadíssimo! Amanhã 10h 🙌 Pode mandar a lista de documentos também",
    analysis: {
      oneLine: "lead quente · falta você confirmar a visita",
      chips: [
        { label: "Imóvel", value: "Studio · Pinheiros" },
        { label: "Posição", value: "Bola com você" },
        { label: "Temperatura", value: "Quente ↑" },
      ],
      summary:
        "Lead quente: quer visitar ainda essa semana e sugeriu amanhã de manhã. Falta só você confirmar o horário.",
      frictions: ["Aguardando confirmação"],
      rec: "Confirme o horário e reduza o atrito já enviando a lista de documentos.",
      source: "Gerado a partir de 4 mensagens.",
    },
    messages: [
      { k: "them", text: "Amei o studio em Pinheiros! 😍", t: "hoje 11:02" },
      { k: "them", text: "Consigo visitar ainda essa semana?", t: "hoje 11:02" },
      { k: "me", text: "Claro! Que dia fica bom pra você?", t: "hoje 11:20" },
      { k: "them", text: "Pode ser amanhã de manhã?", t: "hoje 11:38" },
    ],
    suggestions: [
      {
        cat: "FECHAR VISITA",
        accent: "#3FBE86",
        t: {
          amigavel:
            "Perfeito, Juliana! Amanhã às 10h fica reservado pra você 🗝️ Te mando o endereço e meu contato. Confirma pra mim que está de pé?",
          direto: "Fechado! Amanhã 10h. Te mando o endereço. Confirma?",
          formal:
            "Perfeito, Juliana. Deixo reservado amanhã às 10h. Enviarei o endereço e meus contatos. Pode confirmar a presença?",
        },
      },
      {
        cat: "ADIANTAR DECISÃO",
        accent: "#6FA0D9",
        t: {
          amigavel:
            "Pra já adiantar: esse studio costuma alugar rápido. Se você curtir na visita, já levo o contrato pra gente garantir na hora. Pode ser?",
          direto:
            "Esse studio sai rápido. Levo o contrato na visita pra garantir se você curtir. Ok?",
          formal:
            "Adianto que este studio tem alta procura. Caso aprove na visita, levarei o contrato para garantirmos no mesmo dia. Está de acordo?",
        },
      },
      {
        cat: "REDUZIR ATRITO",
        accent: "#E0A93A",
        t: {
          amigavel:
            "Quer que eu já te passe a lista de documentos? Assim, se for o seu, a gente não perde tempo nenhum 🙌",
          direto: "Te mando a lista de documentos já? Pra agilizar se for o seu.",
          formal:
            "Posso lhe enviar antecipadamente a relação de documentos, de modo a agilizar o processo caso decida seguir.",
        },
      },
    ],
  },
  marina: {
    id: "marina",
    name: "Marina Souza",
    initials: "MS",
    color: "#C99A3B",
    property: "Apto 2 dorm · Vila Mariana",
    price: "R$ 420 mil",
    statusLabel: "Esfriou",
    statusTone: "cold",
    group: "frias",
    snippet: "Você: Conseguiu falar com seu marido? 😅",
    time: "4 d",
    hasSug: true,
    aiNote: "retomada pronta",
    reply:
      "Oii! 🙌 Que isso, adorei o cuidado! Pode mandar os números sim. E o sábado 10h funciona certinho pra mim 😊",
    analysis: {
      oneLine: "esfriou há 4 dias · 2 follow-ups sem resposta",
      chips: [
        { label: "Imóvel", value: "Apto · Vila Mariana" },
        { label: "Posição", value: "Esfriou" },
        { label: "Temperatura", value: "Fria ↓" },
      ],
      summary:
        "A cliente demonstrou interesse e sumiu há 4 dias. Você enviou dois follow-ups genéricos sem resposta.",
      frictions: ["Sem resposta", "Objeção oculta"],
      rec: "Traga uma novidade concreta (nova condição ou urgência real) em vez de cobrar resposta.",
      source: "Gerado a partir de 6 mensagens.",
    },
    messages: [
      {
        k: "them",
        text: "Oi! Vi o anúncio do apê de 2 quartos na Vila Mariana, ainda está disponível?",
        t: "seg 09:12",
      },
      {
        k: "me",
        text: "Oi Marina! Está sim 😊 Lindo apê, 68m², super bem localizado. Quer agendar uma visita?",
        t: "seg 09:20",
      },
      {
        k: "them",
        text: "Que bom! Vou ver com meu marido e te falo 🙂",
        t: "seg 09:31",
      },
      { k: "div", text: "há 4 dias" },
      { k: "me", text: "Oi Marina, conseguiu ver?", t: "qui 14:02" },
      { k: "me", text: "Conseguiu falar com seu marido? 😅", t: "qui 14:03" },
    ],
    suggestions: [
      {
        cat: "RETOMAR",
        accent: "#3FBE86",
        t: {
          amigavel:
            "Oi Marina! 😊 Lembrei de você agora: o proprietário do apê na Vila Mariana abriu margem na entrada. Faz sentido eu te mandar os números novos?",
          direto:
            "Marina, novidade no apê da Vila Mariana — o proprietário baixou a entrada. Te mando os números agora?",
          formal:
            "Olá, Marina. Tenho uma atualização do apartamento na Vila Mariana: o proprietário sinalizou flexibilidade na entrada. Posso lhe enviar os detalhes?",
        },
      },
      {
        cat: "AVANÇAR",
        accent: "#6FA0D9",
        t: {
          amigavel:
            "Que tal conhecer o apê pessoalmente? Separei dois horários essa semana: quinta às 18h ou sábado às 10h. Qual fica melhor pra você? 🙂",
          direto: "Bora ver o apê? Quinta 18h ou sábado 10h — qual prefere?",
          formal:
            "Gostaria de agendar uma visita ao imóvel. Tenho disponibilidade quinta às 18h ou sábado às 10h. Qual horário lhe atende melhor?",
        },
      },
      {
        cat: "CRIAR URGÊNCIA",
        accent: "#E8542F",
        t: {
          amigavel:
            "Transparência total, Marina: esse apê teve mais 2 visitas essa semana. Não quero que você perca por falta de info — posso te ligar 5 minutinhos hoje?",
          direto:
            "Marina, procura alta nesse apê (2 visitas essa semana). Te ligo 5 min hoje pra não perder o timing?",
          formal:
            "Marina, sendo transparente: o imóvel recebeu mais duas visitas esta semana. Para que não perca a oportunidade, poderia lhe ligar por cinco minutos hoje?",
        },
      },
    ],
  },
};

export const CONV_ORDER = ["gabro", "juliana", "marina"];

/** Modelos rápidos (bottom sheet). */
export const TEMPLATES: { cat: string; accent: string; text: string }[] = [
  {
    cat: "CONTRAPROPOSTA",
    accent: "#3FBE86",
    text: "Consegui um ajuste com a direção: entrada de R$ {entrada} + 2 safras. É o melhor cenário que liberam. Fechamos assim?",
  },
  {
    cat: "CRIAR URGÊNCIA",
    accent: "#E8542F",
    text: "Essas condições eu seguro até {data} — depois preciso reabrir com a direção. Se ajudar a decidir, já preparo a minuta.",
  },
  {
    cat: "DESTRAVAR FINANCIAMENTO",
    accent: "#6FA0D9",
    text: "Se o aperto for a entrada, dá pra financiar a maior parte no banco e reduzir as safras. Quer que eu simule pra você levar pro cliente?",
  },
  {
    cat: "PÓS-VISITA",
    accent: "#E0A93A",
    text: "O que pesou a favor e o que te deixou na dúvida na visita? Quero te ajudar a decidir com tranquilidade 🙂",
  },
  {
    cat: "REATIVAÇÃO",
    accent: "#1E9E5A",
    text: "Faz um tempinho que não falamos! Surgiram condições novas no imóvel que você buscava — quer dar uma olhada?",
  },
];
