import { rmSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const remove = (p: string) => {
  try {
    rmSync(p, { recursive: true, force: true });
  } catch {
    // path doesn't exist
  }
};

// Root
remove("node_modules");
remove("dist");

// Packages
readdirSync("packages")
  .filter((d) => statSync(join("packages", d)).isDirectory())
  .forEach((pkg) => {
    remove(join("packages", pkg, "node_modules"));
    remove(join("packages", pkg, "dist"));
  });

// App
remove(join("app", "node_modules"));
remove(join("app", "dist"));
