"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { ModuleMeta } from "../../scripts/source-files";

export function DocsSidebar({
  topLevelModules,
  resetModules,
  allModules,
}: {
  topLevelModules: ModuleMeta[];
  resetModules: ModuleMeta[];
  allModules: ModuleMeta[];
}) {
  const pathname = usePathname();
  const currentModule = pathname.startsWith("/docs/") ? pathname.replace("/docs/", "") : null;
  const currentData = currentModule ? (allModules.find((m) => m.name === currentModule) ?? null) : null;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={mobileOpen}
        className="md:hidden fixed bottom-4 right-4 z-50 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
        onClick={() => setMobileOpen((v) => !v)}>
        {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — desktop: sticky full-height, mobile: fixed overlay */}
      <aside
        className={cn(
          "flex flex-col bg-background overflow-y-auto",
          // Desktop: full viewport height below header
          "md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:w-64 md:shrink-0 md:self-start md:shadow-none md:z-40",
          // Mobile
          "fixed inset-y-0 left-0 w-72 z-50 shadow-xl transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}>
        <nav className="flex-1 space-y-6 p-4" aria-label="Documentation sidebar">
          {/* Getting Started */}
          <div className="sticky top-0 bg-background z-10 border-b border-border pb-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Getting Started
            </h2>
            <ul className="space-y-1">
              {[
                { label: "Introduction", href: "/docs/introduction" },
                { label: "Installation", href: "/docs/installation" },
              ].map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded px-2 py-1 text-sm transition-colors",
                        active
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Separator */}
          <div aria-hidden="true" className="border-t" />

          {/* Modules */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Modules</h2>
            <ul className="space-y-1">
              {topLevelModules.map((m) => {
                const active = currentModule === m.name;
                return (
                  <li key={m.name}>
                    <Link
                      href={`/docs/${m.name}`}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded px-2 py-1 text-sm transition-colors",
                        active
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}>
                      {m.name}.ts
                    </Link>
                    {/* Quicklinks for active module */}
                    {active && m.exports.length > 0 && (
                      <ul className="ml-3 mt-1 space-y-0.5 border-l pl-2">
                        {m.exports.map((exp) => (
                          <li key={exp.name + exp.line}>
                            <a
                              href={`#${exp.name}`}
                              onClick={() => setMobileOpen(false)}
                              className="block truncate rounded px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                              {exp.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Type Resets */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Type Resets</h2>
            <ul className="space-y-1">
              {resetModules.map((m) => {
                const displayName = m.name.replace(/^reset\./, "");
                const active = currentModule === m.name;
                return (
                  <li key={m.name}>
                    <Link
                      href={`/docs/${m.name}`}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded px-2 py-1 text-sm transition-colors",
                        active
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}>
                      {displayName}.ts
                    </Link>
                    {/* Quicklinks for active reset module */}
                    {active && m.exports.length > 0 && (
                      <ul className="ml-3 mt-1 space-y-0.5 border-l pl-2">
                        {m.exports.map((exp) => (
                          <li key={exp.name + exp.line}>
                            <a
                              href={`#${exp.name}`}
                              onClick={() => setMobileOpen(false)}
                              className="block truncate rounded px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                              {exp.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}
