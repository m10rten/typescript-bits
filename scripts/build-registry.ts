/**
 * Build shadcn registry artifacts from package sources.
 *
 * Reads registry.json at project root, resolves source files
 * directly from packages/*, rewrites @typescript-bits/* imports
 * to relative paths, and writes flattened registry JSON to
 * app/public/r/.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const OUTPUT_DIR = resolve(ROOT, "app", "public", "r");

interface RegistryCatalog {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItemEntry[];
}

interface RegistryItemEntry {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: { path: string; type: string }[];
}

interface RegistryFileOutput {
  path: string;
  type: string;
  content: string;
}

interface RegistryItemOutput {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFileOutput[];
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Derive the registry output path from a package source path.
 *  e.g. "packages/atom/src/index.ts" → "atom/index.ts"
 *       "packages/reset/src/array.ts" → "reset/array.ts"
 */
function getOutputPath(sourcePath: string, itemName: string): string {
  const prefix = `packages/${itemName}/src/`;
  if (sourcePath.startsWith(prefix)) {
    return `${itemName}/${sourcePath.slice(prefix.length)}`;
  }
  return sourcePath;
}

function rewriteImports(content: string, fileDir: string, depMap: Record<string, string>): string {
  let result = content;
  for (const [specifier, moduleName] of Object.entries(depMap)) {
    const regex = new RegExp(`from\\s+["']${escapeRegex(specifier)}["']`, "g");
    const depFilePath = `${moduleName}/index.js`;
    let relPath = relative(fileDir, depFilePath);
    relPath = relPath.replace(/\\/g, "/");
    if (!relPath.startsWith(".")) {
      relPath = `./${relPath}`;
    }
    result = result.replace(regex, `from "${relPath}"`);
  }
  return result;
}

// Read catalog
const catalog: RegistryCatalog = JSON.parse(readFileSync(resolve(ROOT, "registry.json"), "utf-8"));

// Build dependency map for import rewriting
const depMap: Record<string, string> = {};
for (const item of catalog.items) {
  depMap[`@typescript-bits/${item.name}`] = item.name;
}

// Build each item
for (const item of catalog.items) {
  const outputFiles: RegistryFileOutput[] = [];

  for (const file of item.files) {
    const filePath = resolve(ROOT, file.path);
    let content = readFileSync(filePath, "utf-8");

    // Derive the output path (e.g. "packages/safe/src/index.ts" → "safe/index.ts")
    // and use its directory for import rewriting so relative paths resolve correctly
    const outputPath = getOutputPath(file.path, item.name);
    const outputDir = dirname(outputPath);
    content = rewriteImports(content, outputDir, depMap);

    outputFiles.push({
      path: outputPath,
      type: file.type,
      target: `@bits/${outputPath}`,
      content,
    });
  }

  const outputItem: RegistryItemOutput = {
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    files: outputFiles,
  };

  if (item.dependencies && item.dependencies.length > 0) {
    outputItem.dependencies = item.dependencies;
  }
  if (item.registryDependencies && item.registryDependencies.length > 0) {
    outputItem.registryDependencies = item.registryDependencies;
  }

  const outputPath = resolve(OUTPUT_DIR, `${item.name}.json`);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(outputItem, null, 2), "utf-8");
}

// Write catalog
const catalogOutput = {
  $schema: catalog.$schema,
  name: catalog.name,
  homepage: catalog.homepage,
  items: catalog.items.map((item) => ({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
  })),
};

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(resolve(OUTPUT_DIR, "registry.json"), JSON.stringify(catalogOutput, null, 2), "utf-8");

console.log(`Registry built: ${catalog.items.length} items → ${OUTPUT_DIR}`);
