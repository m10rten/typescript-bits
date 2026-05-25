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
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "#/ui/card";
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
            <BreadcrumbPage>{module.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{module.name}</h1>
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
      </div>

      <div className="max-w-md">
        <InstallCommand module={moduleName} />
      </div>

      {module.children ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Submodules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {module.children.map((child) => (
              <Link key={child.name} href={`/docs/${moduleName}/${child.name}`}>
                <Card className="h-full cursor-pointer hover:bg-muted transition-colors">
                  <CardHeader>
                    <CardTitle>{child.name}.ts</CardTitle>
                    <CardDescription>{child.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Badge variant="secondary">submodule</Badge>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <CodeBlock html={highlighted} source={module.source} displayName={module.name} />
      )}
    </div>
  );
}
