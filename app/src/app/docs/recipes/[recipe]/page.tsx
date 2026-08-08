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
import { getRecipeNames, getRecipeContent } from "../../../../../scripts/source-files";
import { renderMarkdown, groupIntoChapters } from "~/render-markdown";
import { CodeBlock } from "#/code-block";
import { ScrollProgress } from "#/scroll-progress";
import { BackToTop } from "#/back-to-top";
import { CodeCopyButton } from "#/copy-button";
import { RecipeWizard } from "#/recipe-wizard";

export async function generateMetadata({ params }: { params: Promise<{ recipe: string }> }): Promise<Metadata> {
  const { recipe: recipeName } = await params;
  let recipe;
  try {
    recipe = getRecipeContent(recipeName);
  } catch {
    notFound();
  }
  return {
    title: `${recipe.title} — typescript-bits recipes`,
    description: recipe.description,
    openGraph: { title: recipe.title, description: recipe.description },
    twitter: { title: recipe.title, description: recipe.description },
  };
}

export function generateStaticParams() {
  return getRecipeNames().map((name) => ({ recipe: name }));
}

export default async function RecipePage({ params }: { params: Promise<{ recipe: string }> }) {
  const { recipe: recipeName } = await params;
  let recipe;
  try {
    recipe = getRecipeContent(recipeName);
  } catch {
    notFound();
  }

  const contentChunks = await renderMarkdown(recipe.content);
  const chapters = groupIntoChapters(contentChunks);

  // Numbered steps are chapters that came from a `##` heading (all except the optional "overview")
  const numberedChapters = chapters.filter((c) => c.id !== "overview");

  return (
    <>
      <ScrollProgress />
      <div className="flex flex-col container-main py-8 gap-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs/recipes">Recipes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{recipe.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{recipe.title}</h1>
          <p className="text-muted-foreground">{recipe.description}</p>
        </div>

        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Recipe content */}
        <div className="flex flex-col gap-0">
          <div className="w-[85%] mx-auto border-t border-border" />
          <div className="flex items-center justify-end gap-2 pt-4">
            {/* Wizard trigger — renders null internally when < 2 numbered steps */}
            <RecipeWizard chapters={chapters} />
            <CodeCopyButton
              source={recipe.content}
              label="Copy Content"
              className="h-7 gap-1 px-2 rounded-md border border-border bg-background text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-3 dark:border-input dark:bg-input/30 dark:hover:bg-input/50 shrink-0"
            />
          </div>

          {/* Chapter-aware content with numbered counters and connecting rail */}
          <div className="max-w-none mt-2">
            {chapters.map((chapter, chapterIndex) => {
              const isOverview = chapter.id === "overview";
              // stepNumber is 1-based among numbered chapters only
              const stepNumber = isOverview ? null : numberedChapters.indexOf(chapter) + 1;
              const isLastNumbered = !isOverview && stepNumber === numberedChapters.length;

              return (
                <div key={chapter.id} className="group relative flex gap-4">
                  {/* Left gutter: counter + connecting rail */}
                  <div className="flex flex-col items-center shrink-0 pt-1">
                    {isOverview ? (
                      // Overview: unnumbered marker
                      <div className="size-7 rounded-full border bg-muted flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-muted-foreground font-mono">◆</span>
                      </div>
                    ) : (
                      <div className="size-7 rounded-full border bg-muted flex items-center justify-center shrink-0 tabular-nums">
                        <span className="text-xs font-medium text-muted-foreground">{stepNumber}</span>
                      </div>
                    )}
                    {/* Connecting rail — drawn for all chapters except the last numbered one */}
                    {!isLastNumbered && chapterIndex < chapters.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1 mb-0 min-h-4" />
                    )}
                  </div>

                  {/* Chapter content */}
                  <div className="flex-1 min-w-0 pb-6">
                    {chapter.chunks.map((chunk, i) => {
                      // The first chunk in a ##-chapter is the heading itself —
                      // render it with an anchor link overlay
                      if (i === 0 && !isOverview && chunk.type === "html" && chunk.headingLevel === 2) {
                        return (
                          <div key={i} className="relative flex items-baseline gap-2 group/heading">
                            <h2 id={chunk.id} className="text-xl font-semibold mt-0 mb-1">
                              {chunk.headingText}
                            </h2>
                            <a
                              href={`#${chunk.id}`}
                              aria-label={`Link to ${chunk.headingText}`}
                              className="opacity-0 group-hover/heading:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-foreground transition-opacity text-sm no-underline">
                              #
                            </a>
                          </div>
                        );
                      }

                      if (chunk.type === "code") {
                        return (
                          <div key={i} className="my-4">
                            <CodeBlock html={chunk.html} code={chunk.code} lang={chunk.lang} />
                          </div>
                        );
                      }
                      return <div key={i} dangerouslySetInnerHTML={{ __html: chunk.html }} />;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <BackToTop />
      </div>
    </>
  );
}
