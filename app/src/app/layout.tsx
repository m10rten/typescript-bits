import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { TooltipProvider } from "#/ui/tooltip";
import { StickyHeader } from "#/sticky-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "typescript-bits — TypeScript utility primitives",
  description:
    "Production-ready TypeScript utility primitives: Result, Atom, Queue, Safe, Retry, RichJSON, and type reset modules.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressContentEditableWarning={true}
      suppressHydrationWarning={true}>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:outline-ring">
          Skip to main content
        </a>
        <StickyHeader />
        <TooltipProvider>
          <main id="main-content" className="flex-1 flex flex-col">
            {children}
          </main>
        </TooltipProvider>
        <footer className="border-t py-6 text-sm text-muted-foreground">
          <div className="container-main flex items-center justify-between">
            <span>typescript-bits</span>
            <span>MIT</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
