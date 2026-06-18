// Service worker do Fechou — instalável + shell offline + Share Target.
// Estratégia segura para Next.js:
//   • POST /share → recebe a conversa do WhatsApp, guarda os arquivos e
//                   redireciona pra /?shared=1 (o app lê e processa)
//   • navegações  → network-first, com fallback para /offline.html
//   • _next/static e /assets (imutáveis, com hash) → cache-first
//   • API e o resto → passthrough (rede)
const VERSION = "fechou-v2";
const PRECACHE = `${VERSION}-precache`;
const RUNTIME = `${VERSION}-runtime`;
const SHARE_CACHE = "fechou-share"; // transitório: guarda o que veio do WhatsApp
const PRECACHE_URLS = [
  "/offline.html",
  "/manifest.json",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((c) => c.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(VERSION) && k !== SHARE_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Recebe a conversa exportada do WhatsApp (texto + áudios) e a deixa no cache
// pra o app consumir. Ignorar/filtrar mídia é responsabilidade do app.
async function handleShareTarget(request) {
  try {
    const form = await request.formData();
    const files = form
      .getAll("files")
      .filter((f) => f && typeof f === "object" && typeof f.size === "number" && f.size > 0);
    const text = form.get("text");
    const cache = await caches.open(SHARE_CACHE);
    for (const k of await cache.keys()) await cache.delete(k);

    const meta = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const key = `/__shared__/file-${i}`;
      await cache.put(
        new Request(key),
        new Response(f, {
          headers: { "content-type": f.type || "application/octet-stream" },
        }),
      );
      meta.push({ key, name: f.name || `arquivo-${i}`, type: f.type || "" });
    }
    await cache.put(
      new Request("/__shared__/index.json"),
      new Response(
        JSON.stringify({
          files: meta,
          text: typeof text === "string" ? text : "",
        }),
        { headers: { "content-type": "application/json" } },
      ),
    );
  } catch (e) {
    // se algo falhar, segue pro app mesmo assim
  }
  return Response.redirect(
    new URL("/?shared=1", self.location.origin).toString(),
    303,
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Share Target do WhatsApp
  if (req.method === "POST" && url.pathname === "/share") {
    event.respondWith(handleShareTarget(req));
    return;
  }

  if (req.method !== "GET") return;
  if (url.origin !== self.location.origin) return; // só mesma origem

  // Navegações → network-first, fallback offline
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() =>
        caches.match("/offline.html").then((r) => r || Response.error()),
      ),
    );
    return;
  }

  // Estáticos imutáveis → cache-first
  if (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/assets")
  ) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(RUNTIME).then((c) => c.put(req, copy));
            return res;
          }),
      ),
    );
    return;
  }
  // resto (inclui /api/*) → passthrough
});
