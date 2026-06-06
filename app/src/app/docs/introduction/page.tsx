import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "#/ui/breadcrumb";
import { ModuleCard } from "#/module-card";

export const pageContent =
  "A collection of production-ready TypeScript utility primitives — zero-dependency building blocks for everyday patterns. " +
  "Design principles: Zero dependencies, Tree-shakeable by default, Strict TypeScript, Production first. " +
  "Every module is a standalone .ts file you can import directly. No bundler magic, no barrel exports. " +
  "Modules include: Atom reactive state with subscriptions, Result type-safe Ok/Err error handling, " +
  "Queue event-driven queue with typed events, Safe wrap throwable functions returning a Result, " +
  "Retry configurable retry with exponential backoff strategies, Rich JSON serialization for Dates Maps and Sets, " +
  "Types utility types Enumerate and Range, Reset global type augmentations for Array.filter JSON.parse Set.";

export default function IntroductionPage() {
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
          <ModuleCard name="Atom" href="/docs/atom" deps={0}>
            Reactive state atom with subscriptions — lightweight signals for state management.
          </ModuleCard>
          <ModuleCard name="Result" href="/docs/result" deps={0}>
            Type-safe Ok/Err discriminated union — explicit error handling without try/catch.
          </ModuleCard>
          <ModuleCard name="Queue" href="/docs/queue" deps={0}>
            Event-driven queue with a typed event system — push, shift, and subscribe.
          </ModuleCard>
          <ModuleCard name="Safe" href="/docs/safe" deps={1}>
            Wrap any throwable function and return a Result — no more uncaught exceptions.
          </ModuleCard>
          <ModuleCard name="Retry" href="/docs/retry" deps={2}>
            Configurable retry with backoff strategies — exponential, linear, or custom.
          </ModuleCard>
          <ModuleCard name="Rich JSON" href="/docs/json" deps={0}>
            Extended JSON serialization supporting Dates, Maps, Sets, and more.
          </ModuleCard>
          <ModuleCard name="Types" href="/docs/types" deps={0}>
            Utility types like <code>Enumerate</code> and <code>Range</code> for numeric type gymnastics.
          </ModuleCard>
          <ModuleCard name="Reset" href="/docs/reset" submodules={6}>
            Global type augmentations for better DX — Array.filter, JSON.parse, Set, etc.
          </ModuleCard>
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
    </div>
  );
}
