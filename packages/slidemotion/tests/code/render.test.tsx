import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { atSteps, Code, Slide, Step, Terminal } from "../../src/index.js";
import {
  PresentationContext,
  SlideRenderIndexContext,
  type PresentationContextValue,
} from "../../src/core/context.js";
import { createInitialState } from "../../src/core/engine.js";
import { createStepRegistry } from "../../src/core/step-registry.js";
import type { PresentationState } from "../../src/core/types.js";

vi.mock("../../src/code/highlighter.js", () => ({
  SM_CODE_THEME: "sm-code",
  getSharedHighlighter: () => null,
  initHighlighter: vi.fn(),
}));

function createStubContext(state: PresentationState): PresentationContextValue {
  return {
    state,
    dispatch: () => {},
    stepRegistry: createStepRegistry(),
    slideCount: 1,
    setSlideCount: () => {},
    slideTransitionRegistry: {
      register: () => {},
      unregister: () => {},
      get: () => "none",
    },
    slideIndexCounter: {
      next: () => 0,
      get count() {
        return 1;
      },
    },
    speakerNotesRegistry: {
      register: () => {},
      unregister: () => {},
      get: () => null,
    },
  };
}

function renderActiveSlide(state: PresentationState, children: ReactNode) {
  return renderToStaticMarkup(
    <PresentationContext.Provider value={createStubContext(state)}>
      <SlideRenderIndexContext.Provider value={0}>
        <Slide id="test-slide">{children}</Slide>
      </SlideRenderIndexContext.Provider>
    </PresentationContext.Provider>,
  );
}

describe("sparse step rendering", () => {
  it("shows the matching code snapshot for sparse atSteps", () => {
    const state: PresentationState = {
      ...createInitialState({
        width: 1920,
        height: 1080,
        defaultStepDuration: 300,
        defaultSlideTransition: "none",
      }),
      currentSlide: 0,
      currentStep: 3,
    };

    const html = renderActiveSlide(
      state,
      <Code
        lang="ts"
        steps={["const a = 1", "const a = 2", "const a = 3"]}
        atSteps={atSteps(1, 3)}
      />,
    );

    expect(html).toContain("const a = 3");
    expect(html).not.toContain("const a = 2");
  });

  it("renders token-based code without magic move wrapper", () => {
    const highlighter = {
      getLoadedThemes: () => ["sm-code"],
      codeToTokens: () => ({
        tokens: [[{ content: "const", offset: 0, color: "#111111" }]],
        fg: "#111111",
        bg: "#ffffff",
      }),
    } as unknown as NonNullable<Parameters<typeof Code>[0]["highlighter"]>;

    const state: PresentationState = {
      ...createInitialState({
        width: 1920,
        height: 1080,
        defaultStepDuration: 300,
        defaultSlideTransition: "none",
      }),
      currentSlide: 0,
      currentStep: 0,
    };

    const html = renderActiveSlide(
      state,
      <Code
        lang="ts"
        steps={["const a = 1"]}
        theme="sm-code"
        highlighter={highlighter}
        renderer={{ kind: "tokens" }}
      />,
    );

    expect(html).toContain("const");
    expect(html).not.toContain("shiki-magic-move");
  });

  it("dims non-highlighted lines in token renderer", () => {
    const highlighter = {
      getLoadedThemes: () => ["sm-code"],
      codeToTokens: () => ({
        tokens: [
          [{ content: "const a = 1", offset: 0, color: "#111111" }],
          [{ content: "const b = 2", offset: 0, color: "#111111" }],
        ],
        fg: "#111111",
        bg: "#ffffff",
      }),
    } as unknown as NonNullable<Parameters<typeof Code>[0]["highlighter"]>;

    const state: PresentationState = {
      ...createInitialState({
        width: 1920,
        height: 1080,
        defaultStepDuration: 300,
        defaultSlideTransition: "none",
      }),
      currentSlide: 0,
      currentStep: 1,
    };

    const html = renderActiveSlide(
      state,
      <Code
        lang="ts"
        steps={["const a = 1\nconst b = 2", "const a = 1\nconst b = 3"]}
        theme="sm-code"
        highlighter={highlighter}
        renderer={{ kind: "tokens" }}
        atSteps={atSteps(1)}
        highlight={{
          1: "2",
        }}
      />,
    );

    expect(html).toContain("opacity:0.6");
    expect(html).toContain("opacity:1");
  });

  it("uses code animation duration for token highlight dimming", () => {
    const highlighter = {
      getLoadedThemes: () => ["sm-code"],
      codeToTokens: () => ({
        tokens: [
          [{ content: "const a = 1", offset: 0, color: "#111111" }],
          [{ content: "const b = 2", offset: 0, color: "#111111" }],
        ],
        fg: "#111111",
        bg: "#ffffff",
      }),
    } as unknown as NonNullable<Parameters<typeof Code>[0]["highlighter"]>;

    const state: PresentationState = {
      ...createInitialState({
        width: 1920,
        height: 1080,
        defaultStepDuration: 300,
        defaultSlideTransition: "none",
      }),
      currentSlide: 0,
      currentStep: 1,
    };

    const html = renderActiveSlide(
      state,
      <Code
        lang="ts"
        steps={["const a = 1\nconst b = 2", "const a = 1\nconst b = 3"]}
        theme="sm-code"
        highlighter={highlighter}
        renderer={{ kind: "tokens" }}
        animationDuration={600}
        atSteps={atSteps(1)}
        highlight={{
          1: "2",
        }}
      />,
    );

    expect(html).toContain("transition:opacity 600ms ease");
  });

  it("shows the expected number of sparse terminal entries", () => {
    const hiddenState: PresentationState = {
      ...createInitialState({
        width: 1920,
        height: 1080,
        defaultStepDuration: 300,
        defaultSlideTransition: "none",
      }),
      currentSlide: 0,
      currentStep: 2,
    };

    const visibleState: PresentationState = {
      ...createInitialState({
        width: 1920,
        height: 1080,
        defaultStepDuration: 300,
        defaultSlideTransition: "none",
      }),
      currentSlide: 0,
      currentStep: 4,
    };

    const hiddenHtml = renderActiveSlide(
      hiddenState,
      <Terminal
        steps={[{ command: "bun install" }, { command: "bun test", output: "109 passed" }]}
        atSteps={atSteps(2, 4)}
      />,
    );

    const visibleHtml = renderActiveSlide(
      visibleState,
      <Terminal
        steps={[{ command: "bun install" }, { command: "bun test", output: "109 passed" }]}
        atSteps={atSteps(2, 4)}
      />,
    );

    expect((hiddenHtml.match(/<span>\$<\/span>/g) ?? []).length).toBe(2);
    expect((visibleHtml.match(/<span>\$<\/span>/g) ?? []).length).toBe(3);
  });

  it("keeps exiting step content mounted while moving backward", () => {
    const state: PresentationState = {
      ...createInitialState({
        width: 1920,
        height: 1080,
        defaultStepDuration: 300,
        defaultSlideTransition: "none",
      }),
      currentSlide: 0,
      currentStep: 1,
      stepProgress: 0.4,
      direction: "backward",
      animationStatus: "running",
    };

    const html = renderActiveSlide(
      state,
      <>
        <Step order={2}>
          <div>backward exit</div>
        </Step>
      </>,
    );

    expect(html).toContain("backward exit");
  });
});
