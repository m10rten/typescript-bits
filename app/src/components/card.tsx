import Link from "next/link";
import type { ReactNode } from "react";
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
        isLink && "cursor-pointer hover:-translate-y-0.5 hover:shadow-sm hover:border-accent/30",
        size === "default" ? "p-4" : "p-3",
        className,
      )}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={cn("font-semibold", size === "sm" && "text-sm")}>{title}</h3>
            {badges && <div className="flex items-center gap-1">{badges}</div>}
          </div>
          {(description ?? children) && (
            <p className={cn("text-muted-foreground line-clamp-2", size === "sm" ? "text-xs mt-0.5" : "text-sm mt-1")}>
              {description ?? children}
            </p>
          )}
        </div>
        {isLink && (
          <span className="mt-0.5 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:text-accent/70 group-hover:translate-x-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={size === "sm" ? 12 : 14}
              height={size === "sm" ? 12 : 14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );

  if (isLink && href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
