// Service worker mínimo: garante "instalável" (PWA) sem cache offline ainda.
// O cache do shell offline entra no polimento do PWA (Milestone 7) — cachear os
// chunks do Next sem cuidado quebraria a navegação, então aqui é passthrough.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", () => {
  // passthrough (rede normal)
});
