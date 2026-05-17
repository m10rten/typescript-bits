import { clamp } from "./math.js";

/** Capitalize the first letter of a string. */
export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str[0]!.toUpperCase() + str.slice(1);
}

/** Convert a string to kebab-case. */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/** Truncate a string to a maximum length, adding an ellipsis if needed. */
export function truncate(str: string, maxLen: number, suffix = "..."): string {
  const effectiveLen = clamp(maxLen - suffix.length, 1, maxLen);
  if (str.length <= maxLen) return str;
  return str.slice(0, effectiveLen) + suffix;
}
