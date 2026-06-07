import { emitKeypressEvents } from "node:readline";
import { dim, green, bold } from "./util.js";
import type { SelectOption } from "./util.js";

/**
 * Interactive multi-select prompt.
 * Supports arrow keys, space to toggle, A for all/none, Enter to confirm.
 * Falls back to listing options if not a TTY.
 */
export async function multiSelect(options: SelectOption[]): Promise<string[]> {
  if (options.length === 0) return [];

  const stdin = process.stdin;
  const stdout = process.stdout;

  if (!stdin.isTTY) {
    for (const opt of options) {
      console.log(`  ${opt.value}  ${dim(opt.hint)}`);
    }
    return options.map((o) => o.value);
  }

  const selected = new Set<string>();
  let cursor = 0;

  function renderCheckbox(value: string, isSelected: boolean, isCursor: boolean): string {
    const check = isSelected ? "●" : "○";
    const prefix = isCursor ? bold("❯") : " ";
    return `${prefix} ${check} ${value}`;
  }

  const lines: string[] = [];

  function buildLines(): void {
    lines.length = 0;
    lines.push(`${bold("?")} Select modules to install:`);
    for (let i = 0; i < options.length; i++) {
      const opt = options[i]!;
      lines.push(`  ${renderCheckbox(opt.label, selected.has(opt.value), i === cursor)}  ${dim(opt.hint)}`);
    }
    lines.push(`${dim("(Space) Toggle  (A) All/None  (↑↓) Navigate  (Enter) Confirm")}`);
  }

  // ── Initial draw ───────────────────────────────────────────────────────
  stdout.write("\x1b[?25l"); // HIDE_CURSOR
  buildLines();
  stdout.write("\x1b[s"); // SAVE_CURSOR
  stdout.write(lines.join("\n"));

  // ── Re-render (restore cursor, clear down, redraw) ─────────────────────
  function render(): void {
    buildLines();
    stdout.write("\x1b[u\x1b[J" + lines.join("\n"));
  }

  return new Promise<string[]>((resolve) => {
    emitKeypressEvents(stdin);
    const wasRaw = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();

    function onKeypress(_str: string, key: { name: string; ctrl: boolean }) {
      try {
        if (key.ctrl && key.name === "c") {
          cleanup();
          process.exit(1);
        }

        if (key.name === "return" || key.name === "enter") {
          cleanup();
          const result = [...selected];
          stdout.write(`\n${green("✓")} ${result.length} module(s) selected\n`);
          resolve(result);
          return;
        }

        if (key.name === "up") {
          cursor = cursor > 0 ? cursor - 1 : options.length - 1;
          render();
          return;
        }

        if (key.name === "down") {
          cursor = cursor < options.length - 1 ? cursor + 1 : 0;
          render();
          return;
        }

        if (key.name === "space") {
          const val = options[cursor]!.value;
          if (selected.has(val)) selected.delete(val);
          else selected.add(val);
          render();
          return;
        }

        if (key.name === "a") {
          if (selected.size === options.length) selected.clear();
          else for (const opt of options) selected.add(opt.value);
          render();
          return;
        }
      } catch {
        // Ignore keypress errors during shutdown
      }
    }

    function cleanup() {
      stdin.removeListener("keypress", onKeypress as unknown as (...args: unknown[]) => void);
      try {
        stdin.setRawMode(wasRaw ?? false);
      } catch {
        // Not in raw mode
      }
      // Don't call stdin.pause() — it triggers a libuv assertion on Windows
      // (src/win/async.c:76). The listener is removed and raw mode is off,
      // so stdin is effectively inert.
      stdout.write("\x1b[?25h"); // SHOW_CURSOR
    }

    stdin.on("keypress", onKeypress);
  });
}
