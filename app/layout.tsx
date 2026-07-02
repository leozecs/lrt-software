import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://lrt-software.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "LRT Software · Software que transforma negócios",
  description:
    "A LRT Software cria produtos digitais escaláveis com engenharia moderna e Inteligência Artificial. Indica Pra Mim, Caixa Local, Pet Sistem e Zeta.",
  keywords: ["software", "SaaS", "Inteligência Artificial", "Next.js", "produtos digitais"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "LRT Software",
    title: "LRT Software",
    description:
      "Produtos digitais escaláveis com engenharia moderna e Inteligência Artificial.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LRT Software",
    description:
      "Produtos digitais escaláveis com engenharia moderna e Inteligência Artificial.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&f[]=jet-brains-mono@400,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Script src="https://unpkg.com/@phosphor-icons/web@2.1.1" strategy="afterInteractive" />
      </body>
    </html>
  );
}
