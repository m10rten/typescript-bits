import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "~/utils";

interface CardProps {
  href?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  badges?: ReactNode;
  size?: "default" | "sm";
  className?: string;
}

export function Card({ href, title, description, children, badges, size = "default", className }: CardProps) {
  const isLink = Boolean(href);

  const content = (
    <div
      className={cn(
        "group relative rounded-lg border border-border bg-background transition-all duration-200 ease-out",
        isLink && "cursor-pointer hover:bg-muted/50 hover:border-accent/40",
        size === "default" ? "p-4" : "p-3",
        className,
      )}>
      <div className="flex items-center justify-between gap-4">
        {/* Left cluster: title + description */}
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "font-semibold tracking-tight text-foreground",
              size === "sm" ? "text-sm" : "text-base",
              isLink && "group-hover:text-accent",
            )}>
            {title}
          </h3>
          {(description ?? children) && (
            <p className={cn("text-muted-foreground line-clamp-1", size === "sm" ? "text-xs mt-0.5" : "text-sm mt-1")}>
              {description ?? children}
            </p>
          )}
        </div>

        {/* Right cluster: badges + arrow */}
        {isLink && (
          <div className="flex items-center gap-3 shrink-0">
            {badges && <div className="hidden sm:flex items-center gap-1">{badges}</div>}
            <span className="text-muted-foreground/40 transition-all duration-200 group-hover:text-accent/70 group-hover:translate-x-0.5">
              <ArrowRight className="size-3.5" />
            </span>
          </div>
        )}

        {/* Non-link badges (no arrow) */}
        {!isLink && badges && <div className="flex items-center gap-1 shrink-0">{badges}</div>}
      </div>
    </div>
  );

  if (isLink && href) {
    return (
      <Link
        href={href}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
