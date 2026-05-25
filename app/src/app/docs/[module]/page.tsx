import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "#/ui/breadcrumb";
import { Badge } from "#/ui/badge";
import { getModuleNames, getModuleContent, highlightCode, addCodeAnchors } from "../../../../scripts/source-files";
import { CodeBlock } from "./code-block";
import { InstallCommand } from "#/install-command";

export function generateStaticParams() {
  return getModuleNames().map((name) => ({ module: name }));
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleName } = await params;
  let module;
  try {
    module = getModuleContent(moduleName);
  } catch {
    notFound();
  }

  const displayName = module.name.replace(/^reset\./, "");
  const highlighted = addCodeAnchors(await highlightCode(module.source), module.exports);

  return (
    <div className="flex flex-col container-main py-8 gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{displayName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{displayName}.ts</h1>
        <p className="text-muted-foreground">{module.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {module.imports.length > 0 ? (
          module.imports.map((imp) => (
            <Link key={imp} href={`/docs/${imp.replace(/\.ts$/, "")}`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
                imports {imp}
              </Badge>
            </Link>
          ))
        ) : (
          <Badge variant="ghost">zero dependencies</Badge>
        )}
        {module.isReset && <Badge variant="secondary">type reset</Badge>}
      </div>

      <div className="max-w-md">
        <InstallCommand />
      </div>

      <CodeBlock html={highlighted} source={module.source} displayName={displayName} />
    </div>
  );
}
