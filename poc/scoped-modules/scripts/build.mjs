import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const GENERATED = resolve(ROOT, "generated");

// ---------------------------------------------------------------------------
// 1. Read source package.json (the singular truth)
// ---------------------------------------------------------------------------
const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf-8"));
const { name, version, description, type } = pkg;
const SCOPE_PREFIX = `@${name}/`;

// ---------------------------------------------------------------------------
// 2. Compile TypeScript
// ---------------------------------------------------------------------------
console.log("◆ Compiling TypeScript…");
execSync("npx tsc", { cwd: ROOT, stdio: "inherit" });

// ---------------------------------------------------------------------------
// 3. Discover modules and their entry points from dist/
// ---------------------------------------------------------------------------
function discoverEntries(moduleName) {
  const modDist = resolve(DIST, moduleName);
  const entries = [];
  if (!existsSync(modDist)) return entries;

  function walk(dir) {
    const relPath = relative(modDist, dir).replace(/\\/g, "/");
    const indexPath = resolve(dir, "index.js");
    if (existsSync(indexPath)) {
      const exportPath = relPath === "" ? "." : `./${relPath}`;
      entries.push({ exportPath, filePath: indexPath });
    }
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(resolve(dir, entry.name));
    }
  }

  walk(modDist);
  return entries;
}

const MODULES = {};
for (const entry of readdirSync(DIST, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    MODULES[entry.name] = {
      name: entry.name,
      entries: discoverEntries(entry.name),
    };
  }
}

console.log("◆ Discovered modules:");
for (const [modName, info] of Object.entries(MODULES)) {
  console.log(`  ${modName}: ${info.entries.map((e) => e.exportPath).join(", ")}`);
}

// ---------------------------------------------------------------------------
// 4. Clean generated/
// ---------------------------------------------------------------------------
console.log("◆ Cleaning generated/…");
if (existsSync(GENERATED)) {
  rmSync(GENERATED, { recursive: true });
}

// ---------------------------------------------------------------------------
// 5. Import rewriting helpers
// ---------------------------------------------------------------------------

/**
 * Resolve a relative import spec against a file's dist-relative path.
 * Both args use forward-slash paths.
 *
 * @param {string} fileDistPath - e.g. "api/index.js"
 * @param {string} importSpec - e.g. "../core/result/index.js"
 * @returns {string} resolved path relative to dist/, e.g. "core/result/index.js"
 */
function resolveDistPath(fileDistPath, importSpec) {
  const parts = fileDistPath.split("/");
  parts.pop(); // remove filename
  for (const part of importSpec.split("/")) {
    if (part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return parts.join("/");
}

/**
 * Compute the module name a dist-relative path belongs to.
 * e.g. "core/result/index.js" → "core" (the first path segment)
 */
function moduleOf(path) {
  return path.split("/")[0];
}

/**
 * Rewrite relative imports in a generated file (within a scoped package).
 *
 * @param {string} filePath       - Absolute path to the generated file
 * @param {string} currentModule  - The npm module this file belongs to (e.g. "core")
 * @param {object} modules        - All discovered modules
 * @param {string} pkgName        - Root package name (e.g. "my-example-test")
 * @returns {boolean}             - Whether any rewrites were performed
 *
 * Cross-module imports → bare specifier (@my-example-test/...)
 * Same-module imports  → kept as relative (they resolve within the scoped dist)
 */
function rewriteFile(filePath, currentModule, modules, pkgName) {
  const content = readFileSync(filePath, "utf-8");

  const distMarker = `${sep}dist${sep}`;
  const distIdx = filePath.indexOf(distMarker);
  if (distIdx === -1) return false;

  // Path within the scoped package's own dist/, e.g. "result/index.js"
  const scopedRelPath = filePath.slice(distIdx + distMarker.length).replace(/\\/g, "/");

  // Reconstruct the original path within the unified dist/ tree
  // so path resolution works correctly (e.g. "core/result/index.js")
  const originalDistPath = `${currentModule}/${scopedRelPath}`;

  const rewritten = content.replace(/(from\s+['"])(\.\.?\/[^'"]+)(['"])/g, (match, before, importPath, after) => {
    if (!importPath.startsWith(".")) return match;

    const resolved = resolveDistPath(originalDistPath, importPath);
    const resolvedModule = moduleOf(resolved);

    // Same module → keep relative import
    if (resolvedModule === currentModule) return match;

    // Different module → rewrite to bare specifier
    let subpath = resolved.slice(resolvedModule.length + 1);
    subpath = subpath.replace(/(^|\/)index\.(js|d\.ts)$/, "");

    const bareSpecifier = subpath ? `${SCOPE_PREFIX}${resolvedModule}/${subpath}` : `${SCOPE_PREFIX}${resolvedModule}`;

    return `${before}${bareSpecifier}${after}`;
  });

  if (rewritten !== content) {
    writeFileSync(filePath, rewritten);
    return true;
  }
  return false;
}

/**
 * Scan a file for cross-module relative imports.
 * Returns list of module names this file depends on.
 */
function detectDependencies(filePath, currentModule, modules) {
  const content = readFileSync(filePath, "utf-8");

  const distMarker = `${sep}dist${sep}`;
  const distIdx = filePath.indexOf(distMarker);
  if (distIdx === -1) return [];

  const scopedRelPath = filePath.slice(distIdx + distMarker.length).replace(/\\/g, "/");

  const originalDistPath = `${currentModule}/${scopedRelPath}`;
  const deps = new Set();

  const re = /(?:from\s+['"])(\.\.?\/[^'"]+)(['"])/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    const importPath = match[1];
    if (!importPath.startsWith(".")) continue;

    const resolved = resolveDistPath(originalDistPath, importPath);
    const resolvedModule = moduleOf(resolved);

    if (resolvedModule !== currentModule && Object.hasOwn(modules, resolvedModule)) {
      deps.add(resolvedModule);
    }
  }

  return [...deps];
}

/**
 * Collect all .js and .d.ts files recursively under a directory.
 */
function collectFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
    } else if (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// 6. Generate root package — `my-example-test`
//    Keeps relative imports (dist/ includes everything)
// ---------------------------------------------------------------------------
console.log("◆ Generating root package…");

const rootDir = resolve(GENERATED, name);
const rootDistDir = resolve(rootDir, "dist");
mkdirSync(rootDistDir, { recursive: true });

// Build root exports: all module entries prefixed with ./<module>
const rootExports = { ".": "./dist/index.js" };
for (const [modName, info] of Object.entries(MODULES)) {
  for (const entry of info.entries) {
    if (entry.exportPath === ".") {
      rootExports[`./${modName}`] = `./dist/${modName}/index.js`;
    } else {
      rootExports[`./${modName}/${entry.exportPath.slice(2)}`] =
        `./dist/${modName}/${entry.exportPath.slice(2)}/index.js`;
    }
  }
}

writeFileSync(
  resolve(rootDir, "package.json"),
  JSON.stringify(
    {
      name,
      version,
      description,
      type,
      exports: rootExports,
      files: ["dist"],
    },
    null,
    2,
  ) + "\n",
);

cpSync(DIST, rootDistDir, { recursive: true });

// ---------------------------------------------------------------------------
// 7. Generate scoped packages — `@my-example-test/{api,core,utils}`
// ---------------------------------------------------------------------------
for (const [modName, info] of Object.entries(MODULES)) {
  console.log(`  ◆ Generating ${SCOPE_PREFIX}${modName}…`);

  const modDir = resolve(GENERATED, modName);
  const modDistDir = resolve(modDir, "dist");
  mkdirSync(modDistDir, { recursive: true });

  // Copy compiled files for this module only
  const srcDist = resolve(DIST, modName);
  if (existsSync(srcDist)) {
    cpSync(srcDist, modDistDir, { recursive: true });
  }

  // Collect all output files
  const allFiles = collectFiles(modDistDir);

  // Phase A: Detect dependencies (before rewriting)
  const allDeps = new Set();
  for (const filePath of allFiles) {
    if (filePath.endsWith(".js")) {
      const deps = detectDependencies(filePath, modName, MODULES);
      for (const dep of deps) allDeps.add(dep);
    }
  }

  // Phase B: Rewrite imports
  for (const filePath of allFiles) {
    const changed = rewriteFile(filePath, modName, MODULES, name);
    if (changed) {
      const relPath = relative(modDistDir, filePath);
      console.log(`    ↻ Rewritten imports in ${relPath}`);
    }
  }

  // Build scoped package exports map
  const modExports = {};
  for (const entry of info.entries) {
    const distTarget = entry.exportPath === "." ? "./dist/index.js" : `./dist/${entry.exportPath.slice(2)}/index.js`;
    modExports[entry.exportPath] = {
      import: distTarget,
      types: distTarget.replace(/\.js$/, ".d.ts"),
    };
  }

  // Build explicit dependencies
  const dependencies = {};
  for (const dep of [...allDeps].sort()) {
    dependencies[`${SCOPE_PREFIX}${dep}`] = version;
  }

  const modPkg = {
    name: `${SCOPE_PREFIX}${modName}`,
    version,
    description: `${modName} module of ${name}`,
    type,
    exports: modExports,
    files: ["dist"],
    publishConfig: { access: "public" },
  };

  if (Object.keys(dependencies).length > 0) {
    modPkg.dependencies = dependencies;
    console.log(`    dependencies: ${Object.keys(dependencies).join(", ")}`);
  }

  writeFileSync(resolve(modDir, "package.json"), JSON.stringify(modPkg, null, 2) + "\n");
}

// ---------------------------------------------------------------------------
// 8. Summary
// ---------------------------------------------------------------------------
console.log("\n◇ Build complete — generated packages:\n");

console.log(`  ${name}`);
for (const [exportPath, target] of Object.entries(rootExports)) {
  if (exportPath === ".") continue;
  console.log(`    ${exportPath} -> ${target}`);
}
console.log();

for (const [modName] of Object.entries(MODULES)) {
  const modDir = resolve(GENERATED, modName);
  const modPkg = JSON.parse(readFileSync(resolve(modDir, "package.json"), "utf-8"));
  console.log(`  ${SCOPE_PREFIX}${modName}`);
  for (const [exportPath, target] of Object.entries(modPkg.exports)) {
    console.log(`    ${exportPath} -> ${target.import}`);
  }
  if (modPkg.dependencies) {
    console.log(`    depends on: ${Object.keys(modPkg.dependencies).join(", ")}`);
  }
  console.log();
}
