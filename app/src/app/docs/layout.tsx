import { DocsSidebar } from "#/docs-sidebar";
import { getAllModules } from "../../../scripts/source-files";

const allModules = getAllModules();

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <DocsSidebar allModules={allModules} />
      <div className="flex-1 min-w-0 border-l flex">{children}</div>
    </div>
  );
}
