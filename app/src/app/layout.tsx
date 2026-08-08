import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { TooltipProvider } from "#/ui/tooltip";
import { StickyHeader } from "#/sticky-header";
import { BreadcrumbNav } from "#/breadcrumb-nav";
import { ThemeProvider } from "#/theme-provider";
import { CookieBanner } from "#/cookie-banner";
import { getSearchIndex } from "~/search-index";
import { getAllModules } from "../../scripts/source-files";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import ExternalLink from "#/external-link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://ts.mvdlei.nl";

function buildDescription(): string {
  const modules = getAllModules();
  const names = modules.map((m) => m.displayName);
  return `Production-ready TypeScript utility primitives: ${names.join(
    ", ",
  )} — zero-dependency, tree-shakeable, fully typed.`;
}

export function generateMetadata(): Metadata {
  const description = buildDescription();
  return {
    metadataBase: new URL(siteUrl),
    title: "typescript-bits — TypeScript utility primitives",
    description,
    icons: {
      icon: "/favicon.svg",
      apple: "/apple-icon.png",
    },
    openGraph: {
      title: "typescript-bits",
      description,
      url: siteUrl,
      siteName: "typescript-bits",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "typescript-bits",
      description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchItems = getSearchIndex();
  const searchQuestions = getAllModules().flatMap((m) => [
    `What is a ${m.displayName}?`,
    `How does the ${m.displayName} work?`,
  ]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning={true}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "typescript-bits",
              url: siteUrl,
              description: buildDescription(),
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${siteUrl}/?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="h-full flex flex-col overflow-hidden">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:outline-ring">
            Skip to main content
          </a>
          <StickyHeader searchItems={searchItems} questions={searchQuestions} />
          <TooltipProvider>
            <main
              id="main-content"
              className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-gutter-stable">
              <BreadcrumbNav />
              {children}
              <footer className="border-t py-8 text-sm text-foreground/70">
                <div className="container-main flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground">typescript-bits</span>
                      <span className="text-xs border rounded px-1.5 py-0.5">MIT</span>
                    </div>
                    <nav className="flex flex-row flex-wrap items-center gap-x-6 gap-y-1" aria-label="Footer">
                      <ExternalLink
                        href="https://github.com/m10rten"
                        className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground underline-offset-4 hover:underline decoration-foreground/30 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm">
                        m10rten
                        <ArrowUpRight size={12} className="text-foreground/50" aria-hidden="true" />
                      </ExternalLink>
                      <Link
                        href="/blog"
                        className="text-foreground/70 hover:text-foreground underline-offset-4 hover:underline decoration-foreground/30 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm">
                        Blog
                      </Link>
                      <Link
                        href="/release-notes"
                        className="text-foreground/70 hover:text-foreground underline-offset-4 hover:underline decoration-foreground/30 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm">
                        Release notes
                      </Link>
                      <Link
                        href="/contact"
                        className="text-foreground/70 hover:text-foreground underline-offset-4 hover:underline decoration-foreground/30 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm">
                        Contact
                      </Link>
                      <Link
                        href="/terms-of-service"
                        className="text-foreground/70 hover:text-foreground underline-offset-4 hover:underline decoration-foreground/30 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm">
                        Terms of Service
                      </Link>
                    </nav>
                  </div>
                  <p className="text-sm text-foreground/50">&copy; {new Date().getFullYear()} typescript-bits</p>
                </div>
              </footer>
            </main>
          </TooltipProvider>
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
