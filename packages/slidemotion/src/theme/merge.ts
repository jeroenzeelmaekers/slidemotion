import type { Theme } from "./types.js";

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

  const allKeys = new Set([...Object.keys(themeClassNames), ...Object.keys(propClassNames)]);

  const result: Record<string, string | undefined> = {};
  for (const key of allKeys) {
    result[key] = mergeClassName(themeClassNames[key], propClassNames[key]);
  }

  return result as T;
}

// ---------------------------------------------------------------------------
// Theme merging
// ---------------------------------------------------------------------------

/**
 * Deep-merges two themes. The `overrides` theme is layered on top of `base`.
 * For each component slot, classNames are concatenated (base first, override
 * second) so override classes win in Tailwind's last-class-wins model.
 */
export function mergeTheme(base: Theme, overrides: Theme): Theme {
  const merged: Record<string, unknown> = {};
  const allKeys = new Set([...Object.keys(base), ...Object.keys(overrides)]);

  for (const key of allKeys) {
    const k = key as keyof Theme;
    const baseSlot = base[k];
    const overrideSlot = overrides[k];

    if (!baseSlot) {
      merged[key] = overrideSlot;
    } else if (!overrideSlot) {
      merged[key] = baseSlot;
    } else {
      // Both exist — merge className and classNames
      const mergedSlot: Record<string, unknown> = {
        className: mergeClassName(baseSlot.className, overrideSlot.className),
      };

      const baseClassNames =
        "classNames" in baseSlot
          ? (baseSlot as { classNames?: Readonly<Record<string, string | undefined>> }).classNames
          : undefined;
      const overrideClassNames =
        "classNames" in overrideSlot
          ? (overrideSlot as { classNames?: Readonly<Record<string, string | undefined>> })
              .classNames
          : undefined;

      if (baseClassNames ?? overrideClassNames) {
        mergedSlot.classNames = mergeClassNames(baseClassNames, overrideClassNames);
      }

      merged[key] = mergedSlot;
    }
  }

  return merged as Theme;
}
