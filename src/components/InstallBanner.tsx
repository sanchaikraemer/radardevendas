"use client";

import { useEffect, useState } from "react";

/**
 * Banner "Baixar app" (PWA). No Android/Chrome o navegador dispara o evento
 * `beforeinstallprompt`; nós seguramos esse evento e mostramos um botão próprio.
 * Instalar o app é o que faz o ícone do Fechou aparecer no menu "Compartilhar"
 * do WhatsApp (Share Target). Em modo já-instalado (standalone) não aparece nada.
 */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallBanner() {
  const [evt, setEvt] = useState<InstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Já está rodando como app instalado? Não mostra o convite.
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS (não é o foco agora, mas evita mostrar à toa)
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    if (standalone) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallPromptEvent);
    };
    const onInstalled = () => setEvt(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (hidden || !evt) return null;

  const install = async () => {
    try {
      await evt.prompt();
      const choice = await evt.userChoice;
      if (choice.outcome === "accepted") setEvt(null);
    } catch {
      /* no-op */
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "16px",
        zIndex: 9999,
        width: "calc(100% - 28px)",
        maxWidth: "432px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 12px 12px 14px",
        borderRadius: "16px",
        background: "#16171C",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        border: "1px solid #2A2C36",
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
      }}
    >
      <span style={{ fontSize: "22px", lineHeight: 1 }}>📲</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          Baixar app
        </span>
        <span
          style={{
            display: "block",
            color: "#9DA2B3",
            fontSize: "11.5px",
            marginTop: "1px",
          }}
        >
          Instale pra receber conversas direto do WhatsApp
        </span>
      </span>
      <button
        onClick={() => setHidden(true)}
        aria-label="Agora não"
        style={{
          background: "transparent",
          border: "none",
          color: "#7E8290",
          fontSize: "12px",
          cursor: "pointer",
          padding: "6px",
        }}
      >
        agora não
      </button>
      <button
        onClick={install}
        style={{
          background: "#128A5B",
          color: "#fff",
          border: "none",
          borderRadius: "11px",
          padding: "10px 16px",
          fontSize: "13.5px",
          fontWeight: 700,
          cursor: "pointer",
          flexShrink: 0,
          fontFamily: "inherit",
        }}
      >
        Instalar
      </button>
    </div>
  );
}
