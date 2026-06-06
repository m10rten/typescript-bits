import { Button } from "#/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/ui/card";
import { Bug, Lightbulb, HelpCircle, Terminal, Search, ListChecks, MessageSquareText } from "lucide-react";

const quickActions = [
  {
    icon: Bug,
    label: "Report a bug",
    desc: "Something not working?",
    href: "https://github.com/m10rten/typescript-bits/issues/new?template=bug_report.md",
    color: "hover:border-destructive/30 hover:bg-destructive/5",
  },
  {
    icon: Lightbulb,
    label: "Request a feature",
    desc: "Have an idea?",
    href: "https://github.com/m10rten/typescript-bits/issues/new?template=feature_request.md",
    color: "hover:border-chart-2/30 hover:bg-chart-2/5",
  },
  {
    icon: HelpCircle,
    label: "Ask a question",
    desc: "Need help using a module?",
    href: "https://github.com/m10rten/typescript-bits/discussions",
    color: "hover:border-ring/30 hover:bg-accent/50",
  },
] as const;

const tips = [
  {
    icon: Search,
    title: "Search first",
    desc: "Check existing issues to avoid duplicates — yours might already be solved.",
  },
  {
    icon: ListChecks,
    title: "Be specific",
    desc: "Include the module name, TypeScript version, and a minimal reproduction.",
  },
  {
    icon: MessageSquareText,
    title: "Use labels",
    desc: "Tag your issue with bug, feature, or question so it reaches the right people.",
  },
] as const;

export function ContactForm() {
  return (
    <section className="container-main py-8 md:py-12 flex-1 space-y-8">
      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                "group flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm " +
                "transition-all duration-200 " +
                "hover:-translate-y-0.5 hover:shadow-sm " +
                action.color
              }>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background transition-colors group-hover:bg-background">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Primary CTA */}
        <div className="lg:col-span-3 space-y-6">
          {/* GitHub hero card */}
          <Card className="relative overflow-hidden">
            <div
              className="absolute inset-0 -z-10 opacity-[0.03]"
              aria-hidden="true"
              style={{
                backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                backgroundSize: "16px 16px",
              }}
            />
            <div
              className="absolute -top-24 -right-24 size-48 rounded-full bg-primary/5 blur-[80px] -z-10"
              aria-hidden="true"
            />
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base">
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
                </svg>
                Open a GitHub Issue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                All conversations happen in the open on GitHub. Whether it&rsquo;s a bug, feature request, or just a
                question — opening an issue is the fastest way to get help and helps everyone else too.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  nativeButton={false}
                  render={
                    <a
                      href="https://github.com/m10rten/typescript-bits/issues/new/choose"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  className="gap-2">
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
                  </svg>
                  New issue
                </Button>
                <Button
                  nativeButton={false}
                  variant="outline"
                  render={
                    <a
                      href="https://github.com/m10rten/typescript-bits/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  className="gap-2">
                  Browse existing issues
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips for a great issue */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tips for a great issue
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {tips.map((tip) => {
                const Icon = tip.icon;
                return (
                  <div key={tip.title} className="rounded-xl border border-border bg-card p-4 text-sm space-y-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                      <Icon className="size-4" />
                    </div>
                    <p className="font-medium">{tip.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <aside className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="size-4" />
                Quick reference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href="https://github.com/m10rten/typescript-bits/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-lg border border-border p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:bg-muted/50">
                <svg className="size-5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
                </svg>
                <div>
                  <p className="font-medium text-sm">All issues</p>
                  <p className="text-xs text-muted-foreground mt-0.5">View open and closed issues on GitHub.</p>
                </div>
              </a>

              <a
                href="https://github.com/m10rten/typescript-bits/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-lg border border-border p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:bg-muted/50">
                <HelpCircle className="size-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Discussions</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Q&A, ideas, and general conversation.</p>
                </div>
              </a>

              {/* Decorative terminal block */}
              <div className="rounded-lg border border-border bg-muted/30 overflow-hidden">
                <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-3 py-2">
                  <span className="size-2.5 rounded-full bg-destructive/60" />
                  <span className="size-2.5 rounded-full bg-chart-2/60" />
                  <span className="size-2.5 rounded-full bg-chart-2/30" />
                  <span className="ml-2 text-[10px] text-muted-foreground font-mono">contact.sh</span>
                </div>
                <div className="px-3 py-2.5 font-mono text-xs leading-relaxed">
                  <span className="text-muted-foreground">$ </span>
                  <span className="text-chart-2">gh issue create</span>
                  <br />
                  <span className="text-muted-foreground/60">&#8627; Creating issue in m10rten/typescript-bits</span>
                  <br />
                  <span className="text-muted-foreground/60">&#8627; Choose a template above</span>
                  <span className="animate-pulse ml-0.5 text-foreground/60">&#9612;</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardContent className="text-center py-4">
              <p className="text-xs text-muted-foreground">Built with TypeScript &middot; Open source &middot; MIT</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}
