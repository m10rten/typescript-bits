import { DocsSidebar } from "#/docs-sidebar";
import { getAllModules, getAllSkills, getAllRecipes } from "../../../scripts/source-files";

const allModules = getAllModules();
const allSkills = getAllSkills();
const allRecipes = getAllRecipes();

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <DocsSidebar allModules={allModules} allSkills={allSkills} allRecipes={allRecipes} />
      <div className="flex-1 min-w-0 border-l flex">{children}</div>
    </div>
  );
}
