"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "#/ui/breadcrumb";

function formatSegment(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function BreadcrumbNav() {
  const pathname = usePathname();

  // No breadcrumb on homepage
  if (pathname === "/") return null;

  // Doc pages handle their own breadcrumbs
  if (pathname.startsWith("/docs")) return null;

  const segments = pathname.split("/").filter(Boolean);

  // Single-segment pages: ~ > Page
  if (segments.length === 1) {
    return (
      <div className="container-main pt-6 pb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">~</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{formatSegment(segments[0]!)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
  }

  // Multi-segment pages: Segment > Segment > ... > Page (no ~)
  return (
    <div className="container-main pt-6 pb-2">
      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, i) => {
            const href = "/" + segments.slice(0, i + 1).join("/");
            const isLast = i === segments.length - 1;
            return (
              <BreadcrumbItem key={href}>
                {isLast ? (
                  <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{formatSegment(segment)}</BreadcrumbLink>
                )}
                {!isLast && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
