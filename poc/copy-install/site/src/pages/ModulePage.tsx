import { useParams, Link } from "react-router-dom";
import { modules } from "../data/modules";
import CodeBlock from "../components/CodeBlock";
import InstallHint from "../components/InstallHint";

export default function ModulePage() {
  const { module } = useParams<{ module: string }>();
  const mod = modules.find((m) => m.name === module);

  if (!mod) {
    return (
      <div>
        <h1 className="text-xl text-red-400 mb-4">Module not found</h1>
        <Link to="/" className="text-blue-400 hover:underline">
          ← Back to modules
        </Link>
      </div>
    );
  }

  // Collect all files needed (self + dependencies)
  const allModules = [mod, ...mod.dependencies.map((d) => modules.find((m) => m.name === d)!).filter(Boolean)];

  return (
    <div>
      <Link to="/" className="text-sm text-gray-400 hover:text-gray-300 mb-4 inline-block">
        ← Back to modules
      </Link>

      <h1 className="text-2xl font-bold text-white font-mono mb-2">{mod.name}.ts</h1>
      <p className="text-gray-400 mb-6">
        {mod.exports.length} exports
        {mod.dependencies.length > 0 && <span> · deps: {mod.dependencies.map((d) => `${d}.ts`).join(", ")}</span>}
      </p>

      <div className="mb-6">
        <InstallHint modules={allModules.map((m) => m.name)} />
      </div>

      <div className="space-y-4">
        {allModules.map((m) => (
          <CodeBlock key={m.name} code={m.code} filename={m.file} />
        ))}
      </div>
    </div>
  );
}
