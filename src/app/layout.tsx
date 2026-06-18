import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fechou — respostas que fecham",
  description:
    "Importa conversas do WhatsApp, analisa a negociação e sugere a resposta certa.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Fechou",
    statusBarStyle: "black-translucent",
  },
  icons: { apple: "/assets/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#128A5B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" translate="no">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
