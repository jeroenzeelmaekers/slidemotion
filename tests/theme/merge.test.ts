import { describe, it, expect } from "vitest";
import { mergeClassName, mergeClassNames } from "../../src/theme/merge.js";

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
