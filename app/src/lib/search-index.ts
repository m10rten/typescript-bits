import { getAllBlogs, getAllModules, getAllSkills } from "../../scripts/source-files";
import { pageContent as getIntroductionContent } from "../app/docs/introduction/page";
import { pageContent as installationContent } from "../app/docs/installation/page";
import { pageContent as tosContent } from "../app/terms-of-service/page";
import { pageContent as contactContent } from "../app/contact/page";
import { pageContent as blogListContent } from "../app/blog/page";
import { pageContent as releaseNotesContent } from "../app/release-notes/page";

export interface SearchItemData {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  category: "Module" | "Submodule" | "Export" | "Page" | "Skill" | "Blog";
}

export function getSearchIndex(): SearchItemData[] {
  const items: SearchItemData[] = [];
  const modules = getAllModules();
  const skills = getAllSkills();
  const blogs = getAllBlogs();

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

  // Blog entries
  for (const blog of blogs) {
    items.push({
      id: `blog-${blog.name}`,
      title: blog.title,
      description: `Blog — ${blog.description}`,
      content: blog.content,
      url: `/blog/${blog.name}`,
      category: "Blog",
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
    {
      id: "page-blog",
      title: "Blog",
      description: "Pages — Design decisions, migration notes, and practical patterns behind typescript-bits",
      content: blogListContent(),
      url: "/blog",
      category: "Blog",
    },
    {
      id: "page-release-notes",
      title: "Release notes",
      description: "Pages — Every release of typescript-bits, generated from changesets",
      content: releaseNotesContent(),
      url: "/release-notes",
      category: "Page",
    },
  );

  return items;
}
