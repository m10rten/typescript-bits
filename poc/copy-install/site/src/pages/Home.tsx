import { modules } from "../data/modules";
import ModuleCard from "../components/ModuleCard";

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Modules</h1>
        <p className="text-gray-400">
          Lightweight TypeScript utilities. Install individual modules or copy-paste directly.
        </p>
      </div>
      <div className="space-y-3">
        {modules.map((mod) => (
          <ModuleCard key={mod.name} name={mod.name} exports={mod.exports} dependencies={mod.dependencies} />
        ))}
      </div>
    </div>
  );
}
