import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "U-OS Token Platform",
  description: "The future of decentralized infrastructure. U-OS Tokens & NFTs — coming soon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#050510] text-slate-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
