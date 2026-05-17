import { capitalize, toKebabCase } from "./string-utils.js";
import { clamp, mapRange } from "./math-utils.js";

/**
 * Formats a numeric score into a human-readable label.
 * 0-33 → "Poor", 34-66 → "Fair", 67-100 → "Great"
 */
export function formatScore(score: number): string {
  const clamped = clamp(score, 0, 100);
  const label = clamped <= 33 ? "poor" : clamped <= 66 ? "fair" : "great";
  return capitalize(label);
}

/**
 * Creates a progress bar string from a value.
 * e.g. formatProgress(0.7, 20) → "[██████████████░░░░░░] 70%"
 */
export function formatProgress(value: number, width: number = 20): string {
  const clamped = clamp(value, 0, 1);
  const filled = Math.round(mapRange(clamped, 0, 1, 0, width));
  const empty = width - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  const pct = Math.round(clamped * 100);
  return `[${bar}] ${pct}%`;
}

/**
 * Formats a module name into a display-ready title.
 * e.g. "string-utils" → "String Utils"
 */
export function formatModuleName(name: string): string {
  const kebab = toKebabCase(name);
  return kebab.split("-").map(capitalize).join(" ");
}
