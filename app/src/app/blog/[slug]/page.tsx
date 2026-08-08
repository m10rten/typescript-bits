import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "#/ui/badge";
import { Card } from "#/card";
import { CodeBlock } from "#/code-block";
import { getBlogContent, getAllBlogs, getRelatedBlogs } from "../../../../scripts/source-files";
import { renderMarkdown } from "~/render-markdown";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let blog;
  try {
    blog = getBlogContent(slug);
  } catch {
    notFound();
  }
  return {
    title: `${blog.title} — typescript-bits blog`,
    description: blog.description,
    openGraph: { title: blog.title, description: blog.description },
    twitter: { title: blog.title, description: blog.description },
  };
}

export function generateStaticParams() {
  return getAllBlogs().map((blog) => ({ slug: blog.name }));
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let blog;
  try {
    blog = getBlogContent(slug);
  } catch {
    notFound();
  }

  const contentChunks = await renderMarkdown(blog.content);
  const related = getRelatedBlogs(slug);

  return (
    <div className="container-main py-12 md:py-16">
      <article className="max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{blog.title}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(blog.date)}</p>
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-none">
          {contentChunks.map((chunk, i) => {
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

        {related.length > 0 && (
          <section className="space-y-4 pt-6 border-t">
            <h2 className="text-xl font-semibold tracking-tight">Related articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {related.map((post) => (
                <Card
                  key={post.name}
                  title={post.title}
                  description={post.description}
                  href={`/blog/${post.name}`}
                  size="sm"
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
