import { getAllModules, getAllSkills } from "../../scripts/source-files";
import { pageContent as getIntroductionContent } from "../app/docs/introduction/page";
import { pageContent as installationContent } from "../app/docs/installation/page";
import { pageContent as tosContent } from "../app/terms-of-service/page";
import { pageContent as contactContent } from "../app/contact/page";

export interface SearchItemData {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  category: "Module" | "Submodule" | "Export" | "Page" | "Skill";
}

export function getSearchIndex(): SearchItemData[] {
  const items: SearchItemData[] = [];
  const modules = getAllModules();
  const skills = getAllSkills();

  for (const mod of modules) {
    items.push({
      id: `module-${mod.name}`,
      title: mod.name,
      description: `Modules — ${mod.description}`,
      content: mod.sourceClean,
      url: `/docs/${mod.name}`,
      category: "Module",
    });

    // Find each export's surrounding source lines for richer content
    const sourceLines = mod.sourceClean.split("\n");

    for (const exp of mod.exports) {
      // Grab ~5 lines around the export declaration
      const start = Math.max(0, exp.line - 3);
      const end = Math.min(sourceLines.length, exp.line + 2);
      const context = sourceLines.slice(start, end).join("\n");

      items.push({
        id: `exp-${mod.name}-${exp.name}`,
        title: exp.name,
        description: `Exports — ${exp.name} from ${mod.name}`,
        content: context,
        url: `/docs/${mod.name}#${exp.name}`,
        category: "Export",
      });
    }

    if (mod.children) {
      for (const child of mod.children) {
        items.push({
          id: `sub-${mod.name}-${child.name}`,
          title: `${mod.name}/${child.name}`,
          description: `Submodules — ${child.description}`,
          content: "",
          url: `/docs/${mod.name}/${child.name}`,
          category: "Submodule",
        });
      }
    }
  }

  // Skills entries
  for (const skill of skills) {
    items.push({
      id: `skill-${skill.name}`,
      title: skill.displayName,
      description: `Skills — ${skill.description}`,
      content: skill.content,
      url: `/docs/skills/${skill.name}`,
      category: "Skill",
    });
  }

  items.push(
    {
      id: "page-introduction",
      title: "Introduction",
      description: "Pages — Get started with typescript-bits",
      content: getIntroductionContent(),
      url: "/docs/introduction",
      category: "Page",
    },
    {
      id: "page-installation",
      title: "Installation",
      description: "Pages — Install and setup typescript-bits",
      content: installationContent,
      url: "/docs/installation",
      category: "Page",
    },
    {
      id: "page-terms-of-service",
      title: "Terms of Service",
      description: "Pages — Terms of Service for the typescript-bits website",
      content: tosContent,
      url: "/terms-of-service",
      category: "Page",
    },
    {
      id: "page-contact",
      title: "Contact",
      description: "Pages — Get in touch with the typescript-bits team",
      content: contactContent,
      url: "/contact",
      category: "Page",
    },
  );

  return items;
}
