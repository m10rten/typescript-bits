/**
 * Build the `typescript-bits` umbrella package.
 *
 * Bundles each module entry point with esbuild, resolving `@typescript-bits/*`
 * workspace imports to local source (zero runtime deps).
 * Outputs clean `dist/<module>/index.js` structure instead of `dist/packages/<name>/src/`.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, renameSync } from "node:fs";
import { resolve, dirname, relative, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import * as esbuild from "esbuild";

// ─── Setup ────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");

function readJson(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, "utf-8")) as Record<string, unknown>;
}

// ─── Types ────────────────────────────────────────────────────────────────

interface Entry {
  /** e.g. "./safe" */
  exportPath: string;
  /** e.g. "safe" or "reset/array" */
  moduleName: string;
  /** e.g. "./packages/safe/src/index.ts" */
  sourcePath: string;
  /** Relative to dist/, without extension. e.g. "safe/index" or "reset/array" */
  outPath: string;
}

// ─── Read config ──────────────────────────────────────────────────────────

const ROOT_PKG = readJson(join(ROOT, "package.json"));
const BITS = ROOT_PKG.bits as Record<string, unknown> | undefined;
if (!BITS?.exports) {
  console.error('No "bits" config found in root package.json');
  process.exit(1);
}

// ─── Parse entries ────────────────────────────────────────────────────────

const entries: Entry[] = [];
for (const [exportPath, sourcePath] of Object.entries(BITS.exports as Record<string, string>)) {
  if (exportPath === "package.json") continue;
  const moduleName = exportPath.replace(/^\.\//, "");
  // "safe" → "safe/index", "reset/array" → "reset/array"
  const outPath = moduleName.includes("/") ? moduleName : `${moduleName}/index`;
  entries.push({ exportPath, moduleName, sourcePath, outPath });
}

entries.sort((a, b) => a.moduleName.localeCompare(b.moduleName));

// ─── Build workspace alias map ────────────────────────────────────────────
// Reads each package's zshy config to resolve @typescript-bits/* imports
// to local source files.

function buildAliases(): Record<string, string> {
  const aliases: Record<string, string> = {};

  for (const dir of readdirSync(join(ROOT, "packages"), { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const pkgPath = join(ROOT, "packages", dir.name, "package.json");
    if (!existsSync(pkgPath)) continue;

    const subPkg = readJson(pkgPath);
    const subZshy = subPkg.zshy as Record<string, unknown> | undefined;
    if (!subZshy?.exports) continue;

    const pkgName = subPkg.name as string;
    for (const [exp, src] of Object.entries(subZshy.exports as Record<string, string>)) {
      const specifier = exp === "." ? pkgName : `${pkgName}${exp.slice(1)}`;
      aliases[specifier] = resolve(ROOT, "packages", dir.name, src);
    }
  }

  return aliases;
}

const aliases = buildAliases();

// ─── Clean dist ───────────────────────────────────────────────────────────

if (existsSync(DIST)) {
  rmSync(DIST, { recursive: true, force: true });
}
mkdirSync(DIST, { recursive: true });

// ─── Bundle with esbuild ──────────────────────────────────────────────────

console.log("Bundling with esbuild...");

const bundleConfig: esbuild.BuildOptions = {
  bundle: true,
  platform: "node",
  target: "node24",
  alias: aliases,
  sourcemap: true,
};

async function bundleEntries() {
  const builds: Promise<esbuild.BuildResult>[] = [];

  for (const entry of entries) {
    const absSource = resolve(ROOT, entry.sourcePath);
    const outDir = join(DIST, dirname(entry.outPath));

    // ESM
    builds.push(
      esbuild.build({
        ...bundleConfig,
        entryPoints: [absSource],
        format: "esm",
        outfile: join(outDir, `${basename(entry.outPath)}.js`),
      }),
    );

    // CJS
    builds.push(
      esbuild.build({
        ...bundleConfig,
        entryPoints: [absSource],
        format: "cjs",
        outfile: join(outDir, `${basename(entry.outPath)}.cjs`),
      }),
    );
  }

  await Promise.all(builds);
}

await bundleEntries();
console.log(`  ${entries.length} modules bundled (ESM + CJS)`);

// ─── Bundle CLI binary ────────────────────────────────────────────────────

if (BITS.bin) {
  console.log("Bundling CLI...");

  const binEntries: [string, string][] =
    typeof BITS.bin === "string" ? [["cli", BITS.bin as string]] : Object.entries(BITS.bin as Record<string, string>);

  const binBuilds = binEntries.map(([name, src]) =>
    esbuild.build({
      entryPoints: [resolve(ROOT, src)],
      bundle: true,
      format: "cjs",
      platform: "node",
      target: "node24",
      outfile: join(DIST, "bin", `${name}.cjs`),
      sourcemap: true,
    }),
  );

  await Promise.all(binBuilds);
  console.log(`  ${binEntries.length} CLI binary(ies) bundled`);
}

// ─── Generate declarations with tsc ───────────────────────────────────────

console.log("Generating declarations...");

const TSCONFIG_UMBRELLA = join(ROOT, "tsconfig.umbrella.json");

const tsconfigContent = {
  extends: "./tsconfig.json",
  compilerOptions: {
    rootDir: "packages",
    outDir: "dist",
    declaration: true,
    emitDeclarationOnly: true,
    noEmit: false,
    rewriteRelativeImportExtensions: true,
  },
  include: ["packages/*/src/**/*.ts"],
  exclude: ["node_modules", "dist", "examples", "poc"],
};

writeFileSync(TSCONFIG_UMBRELLA, JSON.stringify(tsconfigContent, null, 2));

try {
  execSync(`npx tsc -p "${TSCONFIG_UMBRELLA}"`, { cwd: ROOT, stdio: "inherit" });
} finally {
  if (existsSync(TSCONFIG_UMBRELLA)) {
    rmSync(TSCONFIG_UMBRELLA);
  }
}

// ─── Restructure declarations ─────────────────────────────────────────────
// tsc outputs dist/<name>/src/<file>.d.ts — move to dist/<name>/<file>.d.ts

console.log("Restructuring declarations...");

let movedCount = 0;
for (const entry of entries) {
  // sourcePath: "./packages/safe/src/index.ts"
  // relative to rootDir "packages": "safe/src/index.ts"
  // tsc output at: "dist/safe/src/index.d.ts"
  const sourceNormalized = entry.sourcePath.replace(/\\/g, "/").replace(/^\.\//, "");
  const segments = sourceNormalized.split("/");
  // segments = ["packages", "safe", "src", "index.ts"]
  // remove leading "packages"
  const relFromRoot = segments.slice(1).join("/"); // "safe/src/index.ts"
  const declFrom = resolve(DIST, relFromRoot.replace(/\.ts$/, ".d.ts"));

  const declTo = resolve(DIST, `${entry.outPath}.d.ts`);

  if (existsSync(declFrom)) {
    mkdirSync(dirname(declTo), { recursive: true });
    renameSync(declFrom, declTo);
    movedCount++;
  }
}

// ─── Clean up empty src/ dirs ─────────────────────────────────────────────

function removeEmptySrcDirs(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      removeEmptySrcDirs(fullPath);
      if (entry.name === "src") {
        try {
          const remaining = readdirSync(fullPath);
          if (remaining.length === 0) {
            rmSync(fullPath, { recursive: true, force: true });
          }
        } catch {
          // ignore — might have been removed already
        }
      }
    }
  }
}

removeEmptySrcDirs(DIST);
console.log(`  ${movedCount} declaration files restructured`);

// ─── Rewrite @typescript-bits/* imports in .d.ts files ────────────────────
// Source files import from "@typescript-bits/result" — in the declarations,
// these must become relative paths like "../result/index.js" so consumers
// don't need the @typescript-bits/* packages installed.

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectDtsFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectDtsFiles(fullPath));
    } else if (entry.name.endsWith(".d.ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

function rewriteDeclarations(): void {
  // Build specifier → output-relative path map (with .js extension)
  // "@typescript-bits/safe" → "safe/index.js"
  const specMap: Record<string, string> = {};
  for (const entry of entries) {
    specMap[`@typescript-bits/${entry.moduleName}`] = `${entry.outPath}.js`;
  }

  const dtsFiles = collectDtsFiles(DIST);
  let rewrittenCount = 0;

  for (const file of dtsFiles) {
    let content = readFileSync(file, "utf-8");
    const fileDir = dirname(file);
    let modified = false;

    for (const [specifier, targetFile] of Object.entries(specMap)) {
      const regex = new RegExp(`from\\s+["']${escapeRegex(specifier)}["']`, "g");

      let relPath = relative(fileDir, resolve(DIST, targetFile));
      relPath = relPath.replace(/\\/g, "/");
      if (!relPath.startsWith(".")) {
        relPath = `./${relPath}`;
      }

      const newContent = content.replace(regex, `from "${relPath}"`);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }

    if (modified) {
      writeFileSync(file, content, "utf-8");
      rewrittenCount++;
    }
  }

  console.log(`  ${rewrittenCount} declaration files rewrote to relative imports`);
}

rewriteDeclarations();

// ─── Done ─────────────────────────────────────────────────────────────────

console.log("Build complete ✅");
