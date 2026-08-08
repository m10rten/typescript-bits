/**
 * Stamp release dates onto undated version headings in the root CHANGELOG.md.
 *
 * Changesets cannot emit dates in `## <version>` headings, so this runs after
 * `changeset version` to rewrite any undated heading to `## <version> - YYYY-MM-DD`.
 * Idempotent: headings that already carry a date are left untouched.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHANGELOG_PATH = resolve(__dirname, "..", "CHANGELOG.md");

const HEADING_RE = /^## (\d+\.\d+\.\d+.*)$/gm;
const DATE_SUFFIX_RE = / - \d{4}-\d{2}-\d{2}$/;

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

const content = readFileSync(CHANGELOG_PATH, "utf-8");
const date = todayUtc();
let changed = false;

const updated = content.replace(HEADING_RE, (match, version: string) => {
  if (DATE_SUFFIX_RE.test(version)) return match;
  changed = true;
  return `## ${version} - ${date}`;
});

if (changed) {
  writeFileSync(CHANGELOG_PATH, updated);
}
