import { describe, it } from "node:test";
import assert from "node:assert";
import { parseChangelog, type ReleaseMeta } from "../source-files.js";

describe("parseChangelog", () => {
  const testcases: { name: string; changelog: string; assert: (releases: ReleaseMeta[]) => void }[] = [
    {
      name: "renders an unrecognized ### heading as a fallback group without inflating bump",
      changelog: ["## 1.0.0", "", "### Deprecations", "", "- abcdef1: something deprecated", ""].join("\n"),
      assert: (releases) => {
        const [release] = releases;
        assert.strictEqual(release!.groups.length, 1);
        assert.strictEqual(release!.groups[0]!.label, "Deprecations");
        assert.strictEqual(release!.groups[0]!.type, "patch");
        assert.strictEqual(release!.groups[0]!.entries.length, 1);
        assert.strictEqual(release!.bump, "patch");
      },
    },
    {
      name: "preserves an indented nested bullet as its own distinct entry",
      changelog: [
        "## 1.0.0",
        "",
        "### Patch Changes",
        "",
        "- abcdef1: update dependencies",
        "  - some-dep@1.2.3",
        "",
      ].join("\n"),
      assert: (releases) => {
        const entries = releases[0]!.groups[0]!.entries;
        assert.strictEqual(entries.length, 2);
        assert.strictEqual(entries[0]!.description, "update dependencies");
        assert.strictEqual(entries[1]!.description, "some-dep@1.2.3");
      },
    },
    {
      name: "parses an entry without a commit hash",
      changelog: ["## 1.0.0", "", "### Patch Changes", "", "- just a plain note", ""].join("\n"),
      assert: (releases) => {
        const [entry] = releases[0]!.groups[0]!.entries;
        assert.strictEqual(entry!.hash, null);
        assert.strictEqual(entry!.description, "just a plain note");
      },
    },
    {
      name: "parses an undated release heading",
      changelog: ["## 1.0.0", "", "### Patch Changes", "", "- abcdef1: fix", ""].join("\n"),
      assert: (releases) => {
        assert.strictEqual(releases[0]!.date, null);
      },
    },
    {
      name: "parses a prerelease version",
      changelog: ["## 1.0.0-beta.1", "", "### Patch Changes", "", "- abcdef1: fix", ""].join("\n"),
      assert: (releases) => {
        assert.strictEqual(releases[0]!.version, "1.0.0-beta.1");
      },
    },
    {
      name: "keeps a colon inside a description intact",
      changelog: ["## 1.0.0", "", "### Patch Changes", "", "- abcdef1: fix: colon in message", ""].join("\n"),
      assert: (releases) => {
        assert.strictEqual(releases[0]!.groups[0]!.entries[0]!.description, "fix: colon in message");
      },
    },
    {
      name: "computes bump as major when both major and patch groups are present",
      changelog: [
        "## 1.0.0",
        "",
        "### Major Changes",
        "",
        "- abcdef1: breaking change",
        "",
        "### Patch Changes",
        "",
        "- 1234567: small fix",
        "",
      ].join("\n"),
      assert: (releases) => {
        assert.strictEqual(releases[0]!.bump, "major");
      },
    },
  ];

  for (const { name, changelog, assert: assertFn } of testcases) {
    it(name, () => {
      assertFn(parseChangelog(changelog));
    });
  }
});
