import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { Link as LinkIcon } from "lucide-react";
import { Badge } from "#/ui/badge";
import { ExternalLink } from "#/external-link";
import { Hero } from "#/hero";
import { cn } from "~/utils";
import { getAllReleases, type BumpType, type ReleaseEntry, type ReleaseMeta } from "../../../scripts/source-files";

export function generateMetadata(): Metadata {
  return {
    title: "Release notes — typescript-bits",
    description: "Every release of typescript-bits, generated from changesets.",
  };
}

export function pageContent(): string {
  const releases = getAllReleases();
  const summaries = releases.map((release) => {
    const descriptions = release.groups.flatMap((group) => group.entries.map((entry) => entry.description));
    return `${release.version}: ${descriptions.join(" ")}`;
  });
  return (
    "Every release of typescript-bits, generated from changesets. Versions follow semver: patch for fixes, minor for additions, major for breaking changes. " +
    summaries.join(" ")
  );
}

function resolveRepoUrl(): string | null {
  try {
    const pkgPath = join(/*turbopackIgnore: true*/ process.cwd(), "..", "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as { repository?: string | { url?: string } };
    const raw = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
    if (!raw) return null;
    return raw.replace(/^git\+/, "").replace(/\.git$/, "");
  } catch {
    return null;
  }
}

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}

function slugify(version: string): string {
  return `v${version.replace(/\./g, "-")}`;
}

const VERSION_SIZE: Record<BumpType, string> = {
  major: "text-3xl font-semibold",
  minor: "text-2xl font-semibold",
  patch: "text-xl font-medium",
};

const GROUP_LABEL: Record<BumpType, string> = {
  major: "Major changes",
  minor: "Minor changes",
  patch: "Patch changes",
};

function EntryRow({ entry, repoUrl }: { entry: ReleaseEntry; repoUrl: string | null }) {
  const commitUrl = entry.hash && repoUrl ? `${repoUrl}/commit/${entry.hash}` : null;

  return (
    <li className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
      <p className="text-sm md:text-base leading-relaxed text-foreground">{entry.description}</p>
      {entry.hash &&
        (commitUrl ? (
          <ExternalLink
            href={commitUrl}
            aria-label={`Commit ${entry.hash}`}
            className="mt-1 md:mt-0 shrink-0 font-mono text-xs text-muted-foreground tabular-nums hover:text-foreground transition-colors duration-150 ease-out">
            {entry.hash}
          </ExternalLink>
        ) : (
          <span className="mt-1 md:mt-0 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
            {entry.hash}
          </span>
        ))}
    </li>
  );
}

function ReleaseBlock({
  release,
  showLatestBadge,
  animate,
  animationDelayMs,
  repoUrl,
}: {
  release: ReleaseMeta;
  showLatestBadge: boolean;
  animate: boolean;
  animationDelayMs: number;
  repoUrl: string | null;
}) {
  const anchorId = slugify(release.version);

  return (
    <div
      className={cn(
        "grid md:grid-cols-[10rem_1fr] gap-x-8 gap-y-3 pt-10 md:pt-12 border-t border-border first:border-t-0 first:pt-0",
        release.bump === "major" && "border-l-2 border-accent pl-6 md:pl-8",
        animate && "release-fade-in",
      )}
      style={animate ? { animationDelay: `${animationDelayMs}ms` } : undefined}>
      <div className="flex items-baseline gap-3 flex-wrap md:flex-col md:items-start md:gap-1 md:sticky md:top-24 md:self-start">
        <h2
          id={anchorId}
          className={cn(
            "group/version font-mono tabular-nums tracking-tight leading-none text-foreground scroll-mt-24 inline-flex items-center gap-1.5",
            VERSION_SIZE[release.bump],
          )}>
          <span className="sr-only">Version </span>
          {release.version}
          <a
            href={`#${anchorId}`}
            aria-label={`Link to version ${release.version}`}
            className="opacity-0 group-hover/version:opacity-100 group-focus-within/version:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-foreground transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 rounded">
            <LinkIcon className="size-3.5" aria-hidden="true" />
          </a>
        </h2>
        {release.date && (
          <time dateTime={release.date} className="text-xs text-muted-foreground">
            {formatDate(release.date)}
          </time>
        )}
        {showLatestBadge && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            Latest
          </Badge>
        )}
      </div>

      <div className="max-w-[68ch] space-y-6">
        {release.groups.map((group) => (
          <div key={group.type} className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">{GROUP_LABEL[group.type]}</h3>
            <ul className="space-y-3 list-none">
              {group.entries.map((entry, i) => (
                <EntryRow key={i} entry={entry} repoUrl={repoUrl} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReleaseNotesPage() {
  const releases = getAllReleases();
  const repoUrl = resolveRepoUrl();
  const showLatestBadge = releases.length >= 2;
  const animateList = releases.length >= 2;

  return (
    <div className="flex flex-col flex-1">
      <Hero intensity="subtle">
        <div className="flex flex-col items-start gap-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Release notes</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Every release of typescript-bits, generated from changesets. Versions follow semver: patch for fixes, minor
            for additions, major for breaking changes.
          </p>
          {repoUrl && (
            <div className="flex flex-wrap gap-4">
              <ExternalLink
                href={`${repoUrl}/releases`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
                GitHub releases
              </ExternalLink>
              <ExternalLink
                href={`${repoUrl}/blob/main/CHANGELOG.md`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
                CHANGELOG.md
              </ExternalLink>
            </div>
          )}
        </div>
      </Hero>

      <div className="container-main py-12 md:py-16">
        <section aria-labelledby="releases-heading">
          <h2 id="releases-heading" className="sr-only">
            Releases
          </h2>
          {releases.length > 0 ? (
            <div className="flex flex-col">
              {releases.map((release, i) => (
                <ReleaseBlock
                  key={release.version}
                  release={release}
                  showLatestBadge={showLatestBadge && i === 0}
                  animate={animateList && i < 4}
                  animationDelayMs={i * 40}
                  repoUrl={repoUrl}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No releases yet.</p>
          )}
        </section>

        <div className="mt-10 pt-8 border-t border-border max-w-[68ch]">
          <h2 className="text-sm font-semibold text-foreground mb-2">Versioning</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            typescript-bits follows semantic versioning: patch releases fix bugs without changing behavior, minor
            releases add functionality without breaking existing code, and major releases may require changes on your
            end. Each entry links to the commit that shipped it. The trailing seven-character hash is a shortened Git
            SHA; click it to see the exact diff on GitHub.
          </p>
        </div>
      </div>
    </div>
  );
}
