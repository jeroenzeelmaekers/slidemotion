import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Presenter } from "../../src/presenter/presenter.js";
import { PresentationContext, type PresentationContextValue } from "../../src/core/context.js";
import { createInitialState } from "../../src/core/engine.js";
import { createStepRegistry } from "../../src/core/step-registry.js";

vi.mock("../../src/presenter/keyboard.js", () => ({
  useKeyboardNavigation: vi.fn(),
}));

function createStubContext(): PresentationContextValue {
  return {
    state: createInitialState({
      width: 1920,
      height: 1080,
      defaultStepDuration: 300,
      defaultSlideTransition: "none",
    }),
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
      get: () => "Remember the punchline",
    },
  };
}

describe("Presenter", () => {
  it("renders devtools when enabled", () => {
    const html = renderToStaticMarkup(
      <PresentationContext.Provider value={createStubContext()}>
        <Presenter devtools controls={false} keyboard={false}>
          <div>Slide</div>
        </Presenter>
      </PresentationContext.Provider>,
    );

    expect(html).toContain("slide 1/1 | step 0 | idle | forward");
  });

  it("renders inline speaker notes panel when notes are visible", () => {
    const context = createStubContext();
    const html = renderToStaticMarkup(
      <PresentationContext.Provider value={context}>
        <Presenter controls={false} keyboard={false}>
          <div>Slide</div>
        </Presenter>
      </PresentationContext.Provider>,
    );

    expect(context.speakerNotesRegistry.get(0)).toBe("Remember the punchline");
    expect(html).toContain("Slide");
  });
});
