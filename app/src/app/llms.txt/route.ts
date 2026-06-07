import { getAllModules } from "../../../scripts/source-files";

function renderDescription(): string {
  const modules = getAllModules();
  const names = modules.map((m) => m.displayName);
  return `Production-ready TypeScript utility primitives. ${names.join(", ")} — zero-dependency, tree-shakeable, fully typed.`;
}

function renderModules(): string {
  const modules = getAllModules();
  const lines: string[] = [];

  for (const mod of modules) {
    lines.push(`- [${mod.name}](${mod.name}/): ${mod.description}`);

    if (mod.children) {
      for (const child of mod.children) {
        lines.push(`  - [${mod.name}/${child.name}](${mod.name}/${child.name}/): ${child.description}`);
      }
    }
  }

  return lines.join("\n");
}

export function GET(): Response {
  const body = `# typescript-bits

> ${renderDescription()}

## Docs

- [Introduction](/docs/introduction/): Overview of the typescript-bits library and its design principles
- [Installation](/docs/installation/): Install via package manager, CLI source install, or copy source

## Modules

${renderModules()}

## Resources

- [Terms of Service](/terms-of-service/)
- [Contact](/contact/)
- [GitHub](https://github.com/m10rten/typescript-bits)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
