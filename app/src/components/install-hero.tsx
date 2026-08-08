import { CommandBlock } from "#/command-block";

/**
 * Primary install call-to-action — co-primary weight with the hero CTAs.
 * The aria-live region announces copy confirmation to screen readers.
 */
export function InstallHero() {
  return (
    // aria-live wraps the block so "Copied" state change is announced
    <div aria-live="polite" aria-atomic="false">
      <CommandBlock command="npm install typescript-bits" label="install command" />
    </div>
  );
}
