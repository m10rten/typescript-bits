import Link from "next/link";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "#/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "#/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "#/ui/card";
import { Badge } from "#/ui/badge";
import { getAllModules } from "../../../../scripts/source-files";

export default function IntroductionPage() {
  const allModules = getAllModules();
  const topLevelModules = allModules.filter((m) => !m.isReset);
  const resetModules = allModules.filter((m) => m.isReset);

  return (
    <div className="flex flex-col container-main py-8 gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Docs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold tracking-tight">Introduction</h1>

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground">
          A collection of production-ready TypeScript utility primitives — zero-dependency building blocks for everyday
          patterns.
        </p>

        <h2 className="text-xl font-semibold mt-8">What's inside</h2>
        <p>
          Every module is a standalone <code>.ts</code> file you can import directly. No bundler magic, no barrel
          exports — just pick what you need.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Atom</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Reactive state atom with subscriptions — lightweight signals for state management.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Result</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Type-safe Ok/Err discriminated union — explicit error handling without try/catch.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Queue</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Event-driven queue with a typed event system — push, shift, and subscribe.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Safe</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Wrap any throwable function and return a Result — no more uncaught exceptions.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Retry</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configurable retry with backoff strategies — exponential, linear, or custom.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Rich JSON</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Extended JSON serialization supporting Dates, Maps, Sets, and more.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Types</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Utility types like <code>Enumerate</code> and <code>Range</code> for numeric type gymnastics.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Type Resets</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Global type augmentations for better DX — Array.filter, Map.get, JSON.parse, etc.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-10">Design principles</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            <strong>Zero dependencies</strong> — every module is self-contained or imports from sibling modules only.
          </li>
          <li>
            <strong>Tree-shakeable by default</strong> — import only what you use, no bundler overhead.
          </li>
          <li>
            <strong>Strict TypeScript</strong> — full type safety with <code>strict: true</code> throughout.
          </li>
          <li>
            <strong>Production first</strong> — every piece is tested and ready for real-world use.
          </li>
        </ul>
      </div>

      <hr className="border-t" />

      <h2 className="text-2xl font-bold tracking-tight">All modules</h2>
      <p className="text-muted-foreground">Browse all available modules and type reset augmentations.</p>

      <Tabs defaultValue="modules">
        <TabsList>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="resets">Type Resets</TabsTrigger>
        </TabsList>
        <TabsContent value="modules" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topLevelModules.map((m) => (
              <Card key={m.name}>
                <CardHeader>
                  <CardTitle>
                    <Link href={`/docs/${m.name}`} className="hover:underline">
                      {m.name}.ts
                    </Link>
                  </CardTitle>
                  <CardDescription>{m.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  {m.imports.length > 0 ? (
                    <Badge variant="outline">{m.imports.length} dep(s)</Badge>
                  ) : (
                    <Badge variant="ghost">zero deps</Badge>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="resets" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resetModules.map((m) => (
              <Card key={m.name}>
                <CardHeader>
                  <CardTitle>
                    <Link href={`/docs/${m.name}`} className="hover:underline">
                      {m.name}.ts
                    </Link>
                  </CardTitle>
                  <CardDescription>{m.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Badge variant="secondary">type reset</Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
