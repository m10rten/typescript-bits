import { DocsSidebar } from "#/docs-sidebar";
import { getAllModules } from "../../../scripts/source-files";

const allModules = getAllModules();
const topLevelModules = allModules.filter((m) => !m.isReset);
const resetModules = allModules.filter((m) => m.isReset);

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <DocsSidebar topLevelModules={topLevelModules} resetModules={resetModules} allModules={allModules} />
      <div className="flex-1 min-w-0 border-l">{children}</div>
    </div>
  );
}
