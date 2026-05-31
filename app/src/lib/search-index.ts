import { getAllModules } from "../../scripts/source-files";

export interface SearchItemData {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "Module" | "Submodule" | "Export" | "Page";
}

export function getSearchIndex(): SearchItemData[] {
  const items: SearchItemData[] = [];
  const modules = getAllModules();

  for (const mod of modules) {
    items.push({
      id: `module-${mod.name}`,
      title: mod.name,
      description: mod.description,
      url: `/docs/${mod.name}`,
      category: "Module",
    });

    for (const exp of mod.exports) {
      items.push({
        id: `exp-${mod.name}-${exp.name}`,
        title: exp.name,
        description: `export from ${mod.name}`,
        url: `/docs/${mod.name}#${exp.name}`,
        category: "Export",
      });
    }

    if (mod.children) {
      for (const child of mod.children) {
        items.push({
          id: `sub-${mod.name}-${child.name}`,
          title: `${mod.name}/${child.name}`,
          description: child.description,
          url: `/docs/${mod.name}/${child.name}`,
          category: "Submodule",
        });
      }
    }
  }

  items.push(
    {
      id: "page-introduction",
      title: "Introduction",
      description: "Get started with typescript-bits",
      url: "/docs/introduction",
      category: "Page",
    },
    {
      id: "page-installation",
      title: "Installation",
      description: "Install and setup typescript-bits",
      url: "/docs/installation",
      category: "Page",
    },
  );

  return items;
}
