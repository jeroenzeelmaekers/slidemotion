// ---------------------------------------------------------------------------
// className merge utilities
// Theme classNames are concatenated with prop classNames. Theme goes first
// so prop classes can override (Tailwind last-class-wins).
// ---------------------------------------------------------------------------

/**
 * Concatenates two className strings. Returns undefined if both are empty.
 * Theme class comes first so explicit prop classes win in Tailwind.
 */
export function mergeClassName(
  themeClass: string | undefined,
  propClass: string | undefined,
): string | undefined {
  if (!themeClass) return propClass;
  if (!propClass) return themeClass;
  return `${themeClass} ${propClass}`;
}

/**
 * Shallow-merges two classNames objects, concatenating each key's value.
 * Keys present only in theme or only in props are preserved as-is.
 */
export function mergeClassNames<T extends Readonly<Record<string, string | undefined>>>(
  themeClassNames: T | undefined,
  propClassNames: T | undefined,
): T | undefined {
  if (!themeClassNames && !propClassNames) return undefined;
  if (!themeClassNames) return propClassNames;
  if (!propClassNames) return themeClassNames;

  const allKeys = new Set([
    ...Object.keys(themeClassNames),
    ...Object.keys(propClassNames),
  ]);

  const result: Record<string, string | undefined> = {};
  for (const key of allKeys) {
    result[key] = mergeClassName(
      themeClassNames[key],
      propClassNames[key],
    );
  }

  return result as T;
}
