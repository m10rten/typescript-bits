import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { TooltipProvider } from "#/ui/tooltip";
import { StickyHeader } from "#/sticky-header";
import { BreadcrumbNav } from "#/breadcrumb-nav";
import { ThemeProvider } from "#/theme-provider";
import { getSearchIndex } from "~/search-index";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://typescript-bits.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "typescript-bits — TypeScript utility primitives",
  description:
    "Production-ready TypeScript utility primitives: Result, Atom, Queue, Safe, Retry, RichJSON, and reset type modules — zero-dependency, tree-shakeable, fully typed.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "typescript-bits",
    description:
      "Production-ready TypeScript utility primitives: Result, Atom, Queue, Safe, Retry, RichJSON, and reset type modules.",
    url: siteUrl,
    siteName: "typescript-bits",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "typescript-bits",
    description:
      "Production-ready TypeScript utility primitives: Result, Atom, Queue, Safe, Retry, RichJSON, and reset type modules.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchItems = getSearchIndex();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressContentEditableWarning={true}
      suppressHydrationWarning={true}>
      <body className="h-full flex flex-col overflow-hidden">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:outline-ring">
            Skip to main content
          </a>
          <StickyHeader searchItems={searchItems} />
          <TooltipProvider>
            <main
              id="main-content"
              className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-gutter-stable">
              <div className="flex-1">
                <BreadcrumbNav />
                {children}
              </div>
              <footer className="border-t py-8 text-sm text-muted-foreground">
                <div className="container-main flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground">typescript-bits</span>
                      <span className="text-xs border rounded px-1.5 py-0.5">MIT</span>
                    </div>
                    <nav className="flex flex-col items-end gap-1" aria-label="Footer">
                      <a
                        href="https://github.com/m10rten"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-foreground transition-colors">
                        m10rten ↗
                      </a>
                      <a href="/contact" title="Contact" className="hover:text-foreground transition-colors">
                        Contact
                      </a>
                      <a
                        href="/terms-of-service"
                        title="Terms of Service"
                        className="hover:text-foreground transition-colors">
                        Terms of Service
                      </a>
                    </nav>
                  </div>
                  <p className="text-xs italic font-bold">&copy; {new Date().getFullYear()} typescript-bits</p>
                </div>
              </footer>
            </main>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
