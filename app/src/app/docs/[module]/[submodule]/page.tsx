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
import { getModuleNames, getModuleContent, highlightCode, addCodeAnchors } from "../../../../../scripts/source-files";
import { CodeBlock } from "../code-block";
import { InstallCommand } from "#/install-command";

export function generateStaticParams() {
  const params: { module: string; submodule: string }[] = [];
  for (const name of getModuleNames()) {
    const mod = getModuleContent(name);
    if (mod.children) {
      for (const child of mod.children) {
        params.push({ module: name, submodule: child.name });
      }
    }
  }
  return params;
}

export default async function SubmodulePage({ params }: { params: Promise<{ module: string; submodule: string }> }) {
  const { module: moduleName, submodule: submoduleName } = await params;
  const modulePath = `${moduleName}/${submoduleName}`;
  let module;
  try {
    module = getModuleContent(modulePath);
  } catch {
    notFound();
  }

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
            <BreadcrumbLink href={`/docs/${moduleName}`}>{moduleName}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{submoduleName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {moduleName}/{submoduleName}.ts
        </h1>
        <p className="text-muted-foreground">{module.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {module.imports.length > 0 ? (
          module.imports.map((imp) => (
            <Link key={imp} href={`/docs/${moduleName}/${imp.replace(/\.ts$/, "")}`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
                imports {imp}
              </Badge>
            </Link>
          ))
        ) : (
          <Badge variant="ghost">zero dependencies</Badge>
        )}
        <Badge variant="secondary">submodule of {moduleName}</Badge>
      </div>

      <div className="max-w-md">
        <InstallCommand module={modulePath} />
      </div>

      <CodeBlock html={highlighted} source={module.source} displayName={`${moduleName}/${submoduleName}`} />
    </div>
  );
}
