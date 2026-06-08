"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/utils";
import { useState } from "react";
import { Menu, X, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { ModuleMeta, SkillMeta } from "../../scripts/source-files";

function CollapsibleHeader({
  label,
  href,
  isOpen,
  onToggle,
}: {
  label: string;
  href: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <Link
        href={href}
        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
        {label}
      </Link>
      <button
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? `Collapse ${label}` : `Expand ${label}`}
        aria-expanded={isOpen}
        className="inline-flex items-center justify-center size-5 rounded text-muted-foreground/40 hover:text-foreground hover:bg-muted transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        {isOpen ? <ChevronUpIcon className="size-3.5" /> : <ChevronDownIcon className="size-3.5" />}
      </button>
    </div>
  );
}

export function DocsSidebar({ allModules, allSkills }: { allModules: ModuleMeta[]; allSkills: SkillMeta[] }) {
  const pathname = usePathname();
  const currentModule = pathname.startsWith("/docs/") ? pathname.replace("/docs/", "") : null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gettingStartedOpen, setGettingStartedOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(true);
  const [skillsOpen, setSkillsOpen] = useState(true);

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
          "md:sticky md:top-0 md:max-h-[calc(100vh-3.5rem)] md:w-64 md:shrink-0 md:self-start md:shadow-none md:z-40",
          // Mobile
          "fixed inset-y-0 left-0 w-72 z-50 shadow-xl transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}>
        <nav className="flex-1 space-y-6 p-4" aria-label="Documentation sidebar">
          {/* Getting Started */}
          <div>
            <CollapsibleHeader
              label="Getting Started"
              href="/docs/introduction"
              isOpen={gettingStartedOpen}
              onToggle={() => setGettingStartedOpen((v) => !v)}
            />
            {gettingStartedOpen && (
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
                            ? "bg-accent/10 font-medium text-accent"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Skills */}
          {allSkills.length > 0 && (
            <div>
              <CollapsibleHeader
                label="Skills"
                href="/docs/skills"
                isOpen={skillsOpen}
                onToggle={() => setSkillsOpen((v) => !v)}
              />
              {skillsOpen && (
                <ul className="space-y-1">
                  {allSkills.map((skill) => {
                    const skillHref = `/docs/skills/${skill.name}`;
                    const active = pathname === skillHref;
                    return (
                      <li key={skill.name}>
                        <Link
                          href={skillHref}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "block rounded px-2 py-1 text-sm transition-colors",
                            active
                              ? "bg-accent/10 font-medium text-accent"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}>
                          {skill.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Modules */}
          <div>
            <CollapsibleHeader
              label="Modules"
              href="/docs/modules"
              isOpen={modulesOpen}
              onToggle={() => setModulesOpen((v) => !v)}
            />
            {modulesOpen && (
              <ul className="space-y-1">
                {allModules.map((m) => {
                  const active = currentModule === m.name;
                  const inSub = m.children?.some((c) => currentModule === `${m.name}/${c.name}`);
                  return (
                    <li key={m.name}>
                      <Link
                        href={`/docs/${m.name}`}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block rounded px-2 py-1 text-sm transition-colors",
                          active || inSub
                            ? "bg-accent/10 font-medium text-accent"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}>
                        {m.name}
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
                      {/* Submodule children — only when active or inside a submodule */}
                      {(active || inSub) && m.children && m.children.length > 0 && (
                        <ul className="ml-3 mt-1 space-y-0.5 border-l pl-2">
                          {m.children.map((child) => {
                            const childPath = `${m.name}/${child.name}`;
                            const childActive = currentModule === childPath;
                            return (
                              <li key={child.name}>
                                <Link
                                  href={`/docs/${childPath}`}
                                  onClick={() => setMobileOpen(false)}
                                  className={cn(
                                    "block truncate rounded px-2 py-0.5 text-xs transition-colors",
                                    childActive
                                      ? "text-accent font-medium"
                                      : "text-muted-foreground hover:text-accent",
                                  )}>
                                  {child.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
