interface InstallHintProps {
  modules: readonly string[];
}

export default function InstallHint({ modules }: InstallHintProps) {
  const command = `npx copy-install install ${modules.join(" ")}`;

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
      <h4 className="text-sm font-medium text-gray-300 mb-2">Install via CLI</h4>
      <code className="block text-sm font-mono bg-gray-950 px-3 py-2 rounded text-green-400">{command}</code>
    </div>
  );
}
