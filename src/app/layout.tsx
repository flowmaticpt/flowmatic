import type { Metadata, Viewport } from "next";
import { inter, instrumentSerif } from "@/lib/fonts";
import { LanguageProvider } from "@/i18n/language-provider";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a0f1c",
};

export const metadata: Metadata = {
  title: "Flowmatica \u2014 Automatiza\u00e7\u00e3o de Processos",
  description: "Automatizamos tarefas repetitivas para PMEs portuguesas.",
  metadataBase: new URL("https://flowmatica.pt"),
  openGraph: {
    title: "Flowmatica \u2014 Automatiza\u00e7\u00e3o de Processos",
    description: "Automatizamos tarefas repetitivas para PMEs portuguesas.",
    type: "website",
    url: "https://flowmatica.pt",
    images: ["/assets/logo.png"],
    locale: "pt_PT",
  },
  icons: {
    icon: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-PT"
      className={`${inter.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="font-sans leading-relaxed bg-bg-dark text-flow-text">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
