import type { Metadata } from "next";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "#/ui/breadcrumb";
import { Badge } from "#/ui/badge";
import { Card } from "#/card";
import { getAllModules } from "../../../../scripts/source-files";

export const metadata: Metadata = {
  title: "Modules — typescript-bits",
  description: "All TypeScript utility primitives available in typescript-bits",
};

export default function ModulesOverviewPage() {
  const modules = getAllModules();

  return (
    <div className="flex flex-col container-main py-8 gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Docs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Modules</h1>
        <p className="text-muted-foreground max-w-prose">
          Zero-dependency, tree-shakeable, fully typed TypeScript utility primitives.
        </p>
      </div>

      {modules.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map((m) => (
            <Card
              key={m.name}
              title={m.name}
              href={`/docs/${m.name}`}
              size="sm"
              badges={
                <>
                  {m.imports.length > 0 ? (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {m.imports.length} dep{m.imports.length !== 1 ? "s" : ""}
                    </Badge>
                  ) : (
                    <Badge variant="ghost" className="text-[10px] px-1.5 py-0">
                      zero dep
                    </Badge>
                  )}
                  {m.children && m.children.length > 0 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {m.children.length} sub
                    </Badge>
                  )}
                </>
              }>
              {m.description}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
