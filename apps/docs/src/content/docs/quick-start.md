---
title: Quick Start
description: Build your first presentation with slidemotion.
---

A minimal slidemotion presentation.

```tsx
import { Presentation, Presenter, Slide } from "slidemotion";
import "slidemotion/styles.css";

function App() {
  return (
    <Presentation>
      <Presenter>
        <Slide>Hello, world!</Slide>
      </Presenter>
    </Presentation>
  );
}
```
