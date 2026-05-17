import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

/** Extract relative import specifiers from a TypeScript file. */
export function extractImports(filePath: string): string[] {
  const content = readFileSync(filePath, "utf-8");
  const importRegex = /(?:import|export)\s+.*?from\s+["']([^"']+)["']/g;
  const imports: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content)) !== null) {
    const [, specifier] = match;
    if (specifier) {
      imports.push(specifier);
    }
  }
  return imports;
}

/** Resolve a specifier to an absolute .ts file path within srcDir. */
function resolveSpecifier(specifier: string, fromFile: string, srcDir: string): string | undefined {
  // Only handle relative imports
  if (!specifier.startsWith(".")) return undefined;

  // Strip .js extension (ESM imports use .js for .ts files)
  const clean = specifier.replace(/\.js$/, "");

  // Resolve relative to the importing file
  const candidate = resolve(fromFile, "..", clean);

  // Try .ts first, then .tsx
  for (const ext of [".ts", ".tsx"]) {
    const path = candidate + ext;
    if (existsSync(path)) return path;
  }

  // Try as directory with index
  for (const ext of [".ts", ".tsx"]) {
    const indexPath = join(candidate, `index${ext}`);
    if (existsSync(indexPath)) return indexPath;
  }

  return undefined;
}

/**
 * Resolve all transitive dependencies for a given module.
 * Returns an array of absolute file paths, with the entry module first.
 */
export function resolveDependencies(moduleName: string, srcDir: string): string[] {
  const resolved = resolve(srcDir, `${moduleName}.ts`);
  if (!existsSync(resolved)) {
    throw new Error(`Module "${moduleName}" not found in ${srcDir}. Available: ${readdirSync(srcDir).join(", ")}`);
  }

  const visited = new Set<string>();
  const order: string[] = [];
  const queue = [resolved];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    order.push(current);

    const imports = extractImports(current);
    for (const imp of imports) {
      const resolvedPath = resolveSpecifier(imp, current, srcDir);
      if (resolvedPath && !visited.has(resolvedPath)) {
        queue.push(resolvedPath);
      }
    }
  }

  return order;
}

/** Get all available module names from srcDir. */
export function listModules(srcDir: string): string[] {
  return readdirSync(srcDir)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .map((f) => f.replace(/\.tsx?$/, ""))
    .sort();
}
