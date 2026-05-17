import { Link } from "react-router-dom";

interface ModuleCardProps {
  name: string;
  exports: readonly string[];
  dependencies: readonly string[];
}

export default function ModuleCard({ name, exports, dependencies }: ModuleCardProps) {
  return (
    <Link
      to={`/${name}`}
      className="block rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:border-gray-700 hover:bg-gray-900 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white font-mono">{name}.ts</h3>
        <span className="text-xs text-gray-500">{exports.length} exports</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {exports.map((exp) => (
          <span
            key={exp}
            className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {exp}
          </span>
        ))}
      </div>
      {dependencies.length > 0 && (
        <p className="mt-2 text-xs text-gray-500">deps: {dependencies.map((d) => `${d}.ts`).join(", ")}</p>
      )}
    </Link>
  );
}
