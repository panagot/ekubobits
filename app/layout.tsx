import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-body",
});

export const metadata: Metadata = {
  title: {
    default: "ekubobits — Ekubo extension call points on Starknet",
    template: "%s · ekubobits",
  },
  description:
    "Paste a Starknet Ekubo extension address and read Core.get_call_points — developer tooling inspired by hookbits, built for Starknet.",
  openGraph: {
    title: "ekubobits",
    description:
      "Inspect Ekubo extension call-point registration on Starknet Sepolia & mainnet.",
    siteName: "ekubobits",
  },
  twitter: {
    card: "summary_large_image",
    title: "ekubobits",
    description:
      "Inspect Ekubo extension call-point registration on Starknet Sepolia & mainnet.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable} antialiased`}>
        <Providers>
          <a href="#main" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <main id="main" className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
