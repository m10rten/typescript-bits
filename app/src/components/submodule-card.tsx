import Link from "next/link";

interface SubmoduleCardProps {
  name: string;
  moduleName: string;
  description: string;
}

export function SubmoduleCard({ name, moduleName, description }: SubmoduleCardProps) {
  return (
    <Link
      href={`/docs/${moduleName}/${name}`}
      className="group relative rounded-lg border border-border bg-background p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm hover:border-primary/30">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{name}.ts</h3>
            <span className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/60 border-muted-foreground/20">
              submodule
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>
        <span className="mt-0.5 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:text-primary/70 group-hover:translate-x-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
