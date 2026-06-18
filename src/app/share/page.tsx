"use client";

import { useEffect } from "react";

/**
 * Rota de destino do Share Target. Em uso normal, o service worker intercepta o
 * POST /share, guarda os arquivos e redireciona pra "/?shared=1". Esta página é
 * só uma rede de segurança: se cair aqui (ex.: GET direto), volta pro app.
 */
export default function SharePage() {
  useEffect(() => {
    window.location.replace("/?shared=1");
  }, []);
  return null;
}
