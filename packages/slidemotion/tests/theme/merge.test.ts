import { describe, it, expect } from "vitest";
import { mergeClassName, mergeClassNames, mergeTheme } from "../../src/theme/merge.js";
import type { Theme } from "../../src/theme/types.js";

// ---------------------------------------------------------------------------
// mergeClassName
// ---------------------------------------------------------------------------

describe("mergeClassName", () => {
  it("returns undefined when both are undefined", () => {
    expect(mergeClassName(undefined, undefined)).toBeUndefined();
  });

  it("returns prop when theme is undefined", () => {
    expect(mergeClassName(undefined, "text-red")).toBe("text-red");
  });

  it("returns theme when prop is undefined", () => {
    expect(mergeClassName("bg-black", undefined)).toBe("bg-black");
  });

  it("concatenates theme first, then prop", () => {
    expect(mergeClassName("bg-black", "text-red")).toBe("bg-black text-red");
  });

  it("handles empty strings as falsy", () => {
    expect(mergeClassName("", "text-red")).toBe("text-red");
    expect(mergeClassName("bg-black", "")).toBe("bg-black");
    // both empty: first check passes (!themeClass), returns propClass ("")
    expect(mergeClassName("", "")).toBe("");
  });
});

// ---------------------------------------------------------------------------
// mergeClassNames
// ---------------------------------------------------------------------------

type TestClassNames = Readonly<Record<string, string | undefined>>;

describe("mergeClassNames", () => {
  it("returns undefined when both are undefined", () => {
    expect(mergeClassNames<TestClassNames>(undefined, undefined)).toBeUndefined();
  });

  it("returns prop when theme is undefined", () => {
    const prop: TestClassNames = { prev: "a", next: "b" };
    expect(mergeClassNames<TestClassNames>(undefined, prop)).toBe(prop);
  });

  it("returns theme when prop is undefined", () => {
    const theme: TestClassNames = { prev: "x", next: "y" };
    expect(mergeClassNames<TestClassNames>(theme, undefined)).toBe(theme);
  });

  it("shallow-merges with per-key concatenation", () => {
    const theme: TestClassNames = { prev: "theme-prev", next: "theme-next" };
    const prop: TestClassNames = { prev: "prop-prev", counter: "prop-counter" };
    const result = mergeClassNames<TestClassNames>(theme, prop);

    expect(result).toEqual({
      prev: "theme-prev prop-prev",
      next: "theme-next",
      counter: "prop-counter",
    });
  });

  it("handles keys present only in theme", () => {
    const theme: TestClassNames = { prev: "a", next: "b", counter: "c" };
    const prop: TestClassNames = { prev: "x" };
    const result = mergeClassNames<TestClassNames>(theme, prop);

    expect(result).toEqual({
      prev: "a x",
      next: "b",
      counter: "c",
    });
  });

  it("handles keys present only in prop", () => {
    const theme: TestClassNames = { prev: "a" };
    const prop: TestClassNames = { prev: "x", next: "y" };
    const result = mergeClassNames<TestClassNames>(theme, prop);

    expect(result).toEqual({
      prev: "a x",
      next: "y",
    });
  });

  it("handles undefined values within objects", () => {
    const theme: TestClassNames = { prev: "a", next: undefined };
    const prop: TestClassNames = { prev: undefined, next: "b" };
    const result = mergeClassNames<TestClassNames>(theme, prop);

    expect(result).toEqual({
      prev: "a",
      next: "b",
    });
  });
});

// ---------------------------------------------------------------------------
// mergeTheme
// ---------------------------------------------------------------------------

describe("mergeTheme", () => {
  it("returns overrides when base is empty", () => {
    const overrides: Theme = {
      Slide: { className: "bg-red" },
    };
    expect(mergeTheme({}, overrides)).toEqual(overrides);
  });

  it("returns base when overrides is empty", () => {
    const base: Theme = {
      Slide: { className: "bg-blue" },
    };
    expect(mergeTheme(base, {})).toEqual(base);
  });

  it("concatenates className for same slot (base first)", () => {
    const base: Theme = { Slide: { className: "bg-blue" } };
    const overrides: Theme = { Slide: { className: "text-white" } };
    const result = mergeTheme(base, overrides);

    expect(result.Slide?.className).toBe("bg-blue text-white");
  });

  it("merges classNames per key within a compound slot", () => {
    const base: Theme = {
      Controls: {
        className: "flex",
        classNames: { prev: "base-prev", next: "base-next" },
      },
    };
    const overrides: Theme = {
      Controls: {
        classNames: { prev: "override-prev", counter: "override-counter" },
      },
    };
    const result = mergeTheme(base, overrides);

    expect(result.Controls?.className).toBe("flex");
    expect(result.Controls).toHaveProperty("classNames");
    const classNames = (result.Controls as { classNames: Record<string, string> }).classNames;
    expect(classNames.prev).toBe("base-prev override-prev");
    expect(classNames.next).toBe("base-next");
    expect(classNames.counter).toBe("override-counter");
  });

  it("preserves slots only in base or only in overrides", () => {
    const base: Theme = { Slide: { className: "a" } };
    const overrides: Theme = { Presenter: { className: "b" } };
    const result = mergeTheme(base, overrides);

    expect(result.Slide?.className).toBe("a");
    expect(result.Presenter?.className).toBe("b");
  });

  it("handles both themes with disjoint slots", () => {
    const base: Theme = {
      Slide: { className: "bg-blue" },
      Code: { className: "font-mono" },
    };
    const overrides: Theme = {
      Presenter: { className: "h-screen" },
      Terminal: { className: "rounded" },
    };
    const result = mergeTheme(base, overrides);

    expect(result.Slide?.className).toBe("bg-blue");
    expect(result.Code?.className).toBe("font-mono");
    expect(result.Presenter?.className).toBe("h-screen");
    expect(result.Terminal?.className).toBe("rounded");
  });
});
