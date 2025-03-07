import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Fira_Code } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "./providers";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Prompt Library - Share and Discover Prompts",
  description: "A community-driven library of prompts for large language models",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${firaCode.variable} antialiased bg-slate-50`}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}