---
title: Quick Start
description: Build your first presentation with slidemotion.
---

A minimal slidemotion presentation.

This starter uses the built-in default theme. Pass `theme={false}` if you want a fully headless setup, or pass your own theme object for custom defaults.

Need a fuller starting point?

- [Core deck example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/core)
- [Code example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/code)
- [Terminal example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/terminal)

```tsx
import { Presentation, Presenter, Slide } from "slidemotion";
import "slidemotion/styles.css";

function App() {
  return (
    <Presentation defaultSlideTransition={{ type: "fade", duration: 220 }}>
      <Presenter>
        <Slide id="hello">Hello, world!</Slide>
      </Presenter>
    </Presentation>
  );
}
```

When you start building choreographed slides, prefer `atSteps` for code and terminal timing so those changes stay aligned with your `Step` animations.

For local debugging, set `devtools` on `Presenter`:

```tsx
<Presenter devtools>
  <Slide id="intro">...</Slide>
</Presenter>
```
