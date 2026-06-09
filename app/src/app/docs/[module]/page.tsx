import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "#/ui/breadcrumb";
import { Badge } from "#/ui/badge";
import { Card } from "#/card";
import { Suspense } from "react";
import {
  getModuleNames,
  getModuleContent,
  highlightCode,
  addCodeAnchors,
  getImportCode,
  getLocalImportCode,
  concatExampleCode,
  transformImportsToLocal,
} from "../../../../scripts/source-files";
import dynamic from "next/dynamic";
import { PageContent } from "#/page-content";
import { ScrollProgress } from "#/scroll-progress";
import { BackToTop } from "#/back-to-top";

const ViewToggle = dynamic(() => import("#/view-toggle").then((mod) => mod.ViewToggle), {
  loading: () => null,
});

const siteUrl = "https://ts.mvdlei.nl";

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const { module: moduleName } = await params;
  const module = getModuleContent(moduleName);
  return {
    title: `${module.displayName} — typescript-bits`,
    description: module.description,
    openGraph: {
      title: module.displayName,
      description: module.description,
    },
    twitter: {
      title: module.displayName,
      description: module.description,
    },
  };
}

export function generateStaticParams() {
  return getModuleNames().map((name) => ({ module: name }));
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleName } = await params;
  let module;
  try {
    module = getModuleContent(moduleName);
  } catch {
    notFound();
  }

  const highlighted = addCodeAnchors(await highlightCode(module.sourceClean), module.exportsClean);

  // Compute truncated source for collapsed "Copy Source" view
  // Show fewer lines when just over 50 so the expand button always has weight
  const MAX_SHOW = 50;
  const MIN_SHOW = 30;
  const HIDE_OFFSET = 20;
  const sourceLines = module.sourceClean.split("\n");
  const totalLines = sourceLines.length;
  const displayLines =
    totalLines > MAX_SHOW ? Math.max(MIN_SHOW, Math.min(MAX_SHOW, totalLines - HIDE_OFFSET)) : totalLines;
  const hiddenLines = totalLines - displayLines;
  const isSourceLong = totalLines > MAX_SHOW;
  const truncatedSource = isSourceLong ? sourceLines.slice(0, displayLines).join("\n") : module.sourceClean;
  const truncatedHtml = isSourceLong
    ? addCodeAnchors(
        await highlightCode(truncatedSource),
        module.exportsClean.filter((e) => e.line <= displayLines),
      )
    : undefined;

  // Pre-highlight import statements
  const importCode = getImportCode(moduleName);
  const importHtml = await highlightCode(importCode);

  const importLocalCode = getLocalImportCode(moduleName);
  const importLocalHtml = await highlightCode(importLocalCode);

  // Build concatenated examples and highlight as a single block
  const combinedCode = concatExampleCode(module.examples);
  const examplesHtml = combinedCode ? addCodeAnchors(await highlightCode(combinedCode), []) : "";
  const combinedLocalCode = transformImportsToLocal(combinedCode);
  const examplesLocalHtml = combinedLocalCode ? addCodeAnchors(await highlightCode(combinedLocalCode), []) : "";

  return (
    <>
      <ScrollProgress />
      <div className="flex flex-col container-main py-8 gap-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TechArticle",
              "@id": `${siteUrl}/docs/${moduleName}`,
              name: module.displayName,
              description: module.description,
              url: `${siteUrl}/docs/${moduleName}`,
            }),
          }}
        />
        {/* Breadcrumbs + View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{module.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Suspense>
            <ViewToggle />
          </Suspense>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">{module.name}</h1>
          <p className="text-muted-foreground">{module.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {module.imports.length > 0 ? (
            module.imports.map((imp) => (
              <Link key={imp} href={`/docs/${imp.replace(/\.ts$/, "")}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
                  imports {imp}
                </Badge>
              </Link>
            ))
          ) : (
            <Badge variant="ghost">zero dependencies</Badge>
          )}
        </div>

        {/* Submodules — always visible, independent of view toggle */}
        {module.children && module.children.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Submodules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {module.children.map((child) => (
                <Card
                  key={child.name}
                  title={`${child.name}.ts`}
                  href={`/docs/${moduleName}/${child.name}`}
                  badges={
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      submodule
                    </Badge>
                  }
                  description={child.description}
                />
              ))}
            </div>
          </div>
        )}

        {/* Toggled content */}
        <Suspense fallback={<div className="text-muted-foreground text-sm">Loading…</div>}>
          <PageContent
            sourceHtml={highlighted}
            sourceTruncatedHtml={truncatedHtml}
            sourceTotalLines={totalLines}
            sourceHiddenLines={hiddenLines}
            sourceCode={module.sourceClean}
            sourceName={module.name}
            importHtml={importHtml}
            importLocalHtml={importLocalHtml}
            examplesHtml={examplesHtml}
            examplesLocalHtml={examplesLocalHtml}
          />
        </Suspense>
        <BackToTop />
      </div>
    </>
  );
}
