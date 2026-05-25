/**
 * Interactive multi-select for the terminal.
 * Zero dependencies — uses raw terminal mode + ANSI escape codes.
 */

import { emitKeypressEvents } from "node:readline";

// ── ANSI helpers ─────────────────────────────────────────────────────────

const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";
const HIDE_CURSOR = "\x1b[?25l";
const SHOW_CURSOR = "\x1b[?25h";
const CLEAR_LINE = "\x1b[2K";

function dim(s: string): string {
  return `${DIM}${s}${RESET}`;
}

function bold(s: string): string {
  return `${BOLD}${s}${RESET}`;
}

function green(s: string): string {
  return `${GREEN}${s}${RESET}`;
}

// ── Public interface ─────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  hint: string;
}

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

  function render() {
    const totalLines = options.length + 2;
    stdout.write(`\x1b[${totalLines}A`);
    stdout.write(`${CLEAR_LINE}${bold("?")} Select modules to install:\n`);
    for (let i = 0; i < options.length; i++) {
      const opt = options[i]!;
      stdout.write(
        `${CLEAR_LINE}  ${renderCheckbox(opt.label, selected.has(opt.value), i === cursor)}  ${dim(opt.hint)}\n`,
      );
    }
    stdout.write(`${CLEAR_LINE}${dim("(Space) Toggle  (A) All/None  (↑↓) Navigate  (Enter) Confirm")}`);
  }

  // Initial render
  stdout.write(HIDE_CURSOR);
  stdout.write(`${bold("?")} Select modules to install:\n`);
  for (let i = 0; i < options.length; i++) {
    const opt = options[i]!;
    stdout.write(`  ${renderCheckbox(opt.label, false, false)}  ${dim(opt.hint)}\n`);
  }
  stdout.write(`${dim("(Space) Toggle  (A) All/None  (↑↓) Navigate  (Enter) Confirm")}`);

  return new Promise<string[]>((resolve) => {
    emitKeypressEvents(stdin);
    const wasRaw = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();

    function onKeypress(_str: string, key: { name: string; ctrl: boolean }) {
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
    }

    function cleanup() {
      stdin.removeListener("keypress", onKeypress as unknown as (...args: unknown[]) => void);
      stdin.setRawMode(wasRaw ?? false);
      stdin.pause();
      stdout.write(SHOW_CURSOR);
    }

    stdin.on("keypress", onKeypress);
  });
}
