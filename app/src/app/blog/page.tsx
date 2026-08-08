import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "#/ui/badge";
import { getAllBlogs } from "../../../scripts/source-files";

export function generateMetadata(): Metadata {
  return {
    title: "Blog — typescript-bits",
    description: "Design decisions, migration notes, and practical patterns behind typescript-bits.",
  };
}

export function pageContent(): string {
  const summaries = getAllBlogs().map((blog) => `${blog.title} — ${blog.description}`);
  return "Design decisions, migration notes, and practical patterns behind typescript-bits. " + summaries.join(" ");
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogOverviewPage() {
  const blogs = getAllBlogs();

  return (
    <div className="container-main py-12 md:py-16">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground max-w-prose">
            Design decisions, migration notes, and practical patterns behind typescript-bits.
          </p>
        </div>

        {blogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {blogs.map((blog) => (
              <Link
                key={blog.name}
                href={`/blog/${blog.name}`}
                className="group flex h-full flex-col rounded-lg border border-border bg-background p-5 transition-colors duration-200 ease-out hover:bg-muted/50 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2">
                <h3 className="text-base font-semibold tracking-tight text-balance line-clamp-2 text-foreground transition-colors group-hover:text-accent">
                  {blog.title}
                </h3>
                {blog.description && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{blog.description}</p>
                )}
                <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
                  <time dateTime={blog.date} className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {formatDate(blog.date)}
                  </time>
                  {blog.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
