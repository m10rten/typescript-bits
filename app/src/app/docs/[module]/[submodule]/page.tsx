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
import { Suspense } from "react";
import {
  getModuleNames,
  getModuleContent,
  getSubmoduleContent,
  highlightCode,
  addCodeAnchors,
  getImportCode,
  getLocalImportCode,
  concatExampleCode,
  transformImportsToLocal,
} from "../../../../../scripts/source-files";
import dynamic from "next/dynamic";
import { PageContent } from "#/page-content";

const ViewToggle = dynamic(() => import("#/view-toggle").then((mod) => mod.ViewToggle), {
  loading: () => null,
});

const siteUrl = "https://ts.mvdlei.nl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string; submodule: string }>;
}): Promise<Metadata> {
  const { module: moduleName, submodule: submoduleName } = await params;
  const parentModule = getModuleContent(moduleName);
  const submodule = getSubmoduleContent(moduleName, submoduleName);
  return {
    title: `${moduleName}/${submoduleName} — typescript-bits`,
    description: submodule.description,
    openGraph: {
      title: `${parentModule.displayName}: ${submoduleName}`,
      description: submodule.description,
    },
    twitter: {
      title: `${parentModule.displayName}: ${submoduleName}`,
      description: submodule.description,
    },
  };
}

export function generateStaticParams() {
  const params: { module: string; submodule: string }[] = [];
  for (const name of getModuleNames()) {
    const mod = getModuleContent(name);
    if (mod.children) {
      for (const child of mod.children) {
        params.push({ module: name, submodule: child.name });
      }
    }
  }
  return params;
}

export default async function SubmodulePage({ params }: { params: Promise<{ module: string; submodule: string }> }) {
  const { module: moduleName, submodule: submoduleName } = await params;
  const modulePath = `${moduleName}/${submoduleName}`;
  let module;
  try {
    module = getSubmoduleContent(moduleName, submoduleName);
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
  const importCode = getImportCode(modulePath);
  const importHtml = await highlightCode(importCode);

  const importLocalCode = getLocalImportCode(modulePath);
  const importLocalHtml = await highlightCode(importLocalCode);

  // Build concatenated examples and highlight as a single block
  const combinedCode = concatExampleCode(module.examples);
  const examplesHtml = combinedCode ? addCodeAnchors(await highlightCode(combinedCode), []) : "";
  const combinedLocalCode = transformImportsToLocal(combinedCode);
  const examplesLocalHtml = combinedLocalCode ? addCodeAnchors(await highlightCode(combinedLocalCode), []) : "";

  return (
    <div className="flex flex-col container-main py-8 gap-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "@id": `${siteUrl}/docs/${moduleName}/${submoduleName}`,
            name: `${moduleName}/${submoduleName}`,
            description: module.description,
            url: `${siteUrl}/docs/${moduleName}/${submoduleName}`,
          }),
        }}
      />
      {/* Breadcrumbs + View Toggle */}
      <div className="flex items-center justify-between gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/docs/${moduleName}`}>{moduleName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{submoduleName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Suspense>
          <ViewToggle />
        </Suspense>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {moduleName}/{submoduleName}.ts
        </h1>
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
        <Badge variant="secondary">submodule of {moduleName}</Badge>
      </div>

      {/* Toggled content */}
      <Suspense fallback={<div className="text-muted-foreground text-sm">Loading…</div>}>
        <PageContent
          sourceHtml={highlighted}
          sourceTruncatedHtml={truncatedHtml}
          sourceTotalLines={totalLines}
          sourceHiddenLines={hiddenLines}
          sourceCode={module.sourceClean}
          sourceName={`${moduleName}/${submoduleName}`}
          importHtml={importHtml}
          importLocalHtml={importLocalHtml}
          examplesHtml={examplesHtml}
          examplesLocalHtml={examplesLocalHtml}
        />
      </Suspense>
    </div>
  );
}
