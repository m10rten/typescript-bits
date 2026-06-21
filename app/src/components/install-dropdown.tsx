import { CodeCopyButton } from "#/copy-button";

export function InstallDropdown({
  module: moduleName,
  mode,
  skillName,
}: {
  module?: string;
  /** Show only the install section or only the CLI section */
  mode?: "install" | "cli";
  /** When provided, shows a skills CLI command block instead of package install blocks */
  skillName?: string;
}) {
  // For submodules (e.g. "reset/array"), use the top-level module for the scoped package
  const scopedModule = moduleName?.split("/")[0] ?? "";

  const installCmd = "npm install typescript-bits";
  const scopedCmd = `npm install @typescript-bits/${scopedModule}`;
  const cliCmd = `npx typescript-bits ${moduleName ?? ""}`.trimEnd();
  const skillCmd = skillName ? `npx skills add m10rten/typescript-bits --skill ${skillName}` : null;

  const showSkill = !!skillName;
  const showInstall = !skillName && (!mode || mode === "install");
  const showCli = !skillName && !!moduleName && (!mode || mode === "cli");

  return (
    <div className="flex flex-col gap-3">
      {/* Skills CLI install */}
      {showSkill && (
        <div className="rounded-lg border overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/50">
            <span className="text-xs text-muted-foreground font-mono">skills</span>
            <CodeCopyButton source={skillCmd!} label="npx" />
          </div>
          <div
            className="px-4 py-3 font-mono text-sm text-foreground select-all bg-muted/30"
            style={{ fontVariantLigatures: "none" }}>
            {skillCmd}
          </div>
        </div>
      )}

      {/* Package install */}
      {showInstall && (
        <div className="rounded-lg border overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/50">
            <span className="text-xs text-muted-foreground font-mono">install</span>
            <CodeCopyButton source={installCmd} label="npm" />
          </div>
          <div
            className="px-4 py-3 font-mono text-sm text-foreground select-all bg-muted/30"
            style={{ fontVariantLigatures: "none" }}>
            {installCmd}
          </div>
        </div>
      )}

      {/* Scoped package install (module only) */}
      {showInstall && scopedModule && (
        <div className="rounded-lg border overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/50">
            <span className="text-xs text-muted-foreground font-mono">install (module)</span>
            <CodeCopyButton source={scopedCmd} label="npm" />
          </div>
          <div
            className="px-4 py-3 font-mono text-sm text-foreground select-all bg-muted/30"
            style={{ fontVariantLigatures: "none" }}>
            {scopedCmd}
          </div>
        </div>
      )}

      {/* CLI copy-install */}
      {showCli && (
        <div className="rounded-lg border overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/50">
            <span className="text-xs text-muted-foreground font-mono">local source</span>
            <CodeCopyButton source={cliCmd} label="npx" />
          </div>
          <div
            className="px-4 py-3 font-mono text-sm text-foreground select-all bg-muted/30"
            style={{ fontVariantLigatures: "none" }}>
            {cliCmd}
          </div>
        </div>
      )}
    </div>
  );
}
