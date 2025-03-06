import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "../styles/globals.css";
import { Providers } from "./providers";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Prompt Library - Share and Discover Prompts",
  description: "A community-driven library of prompts for large language models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}