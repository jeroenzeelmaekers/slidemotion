---
title: Code Slides
description: Syntax-highlighted code with animated transitions.
---

`Code` and `Terminal` are step-aware. The best default for syncing them with the rest of a slide is `atSteps`.

`Code` also accepts a lightweight renderer hint when you want static fallback behavior instead of morphing.

Reference examples:

- [Code example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/code)
- [Terminal example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/terminal)

## Sync code with other animations

```tsx
<Step order={1}>
  <FadeIn>Introduce the refactor</FadeIn>
</Step>

<Step order={3}>
  <FadeIn>Point out the guard clause</FadeIn>
</Step>

<Code
  lang="ts"
  steps={[before, afterName, afterGuard]}
  atSteps={[1, 3]}
/>
```

This makes code changes happen on the same clicks as the rest of your slide choreography.

## Choose between `atSteps` and `stepOffset`

- Use `atSteps` for explicit timing and non-consecutive steps.
- Use `stepOffset` only when every code change should happen on consecutive clicks.
- `stepOrders` still works as a compatibility alias.

Helpers are available if you want less array punctuation:

```tsx
import { atSteps, Code, Terminal, rangeStepOrders } from "slidemotion";

<Code
  lang="ts"
  steps={[before, afterName, afterGuard]}
  atSteps={atSteps(1, 3)}
/>

<Terminal
  steps={terminalSteps}
  atSteps={rangeStepOrders(2, 2)}
/>
```

## Terminal uses the same model

```tsx
<Terminal
  steps={[
    { command: "bun install" },
    { command: "bun test", output: "12 passed" },
  ]}
  atSteps={[2, 4]}
/>
```

## Highlighter setup

For morph mode, initialize Shiki once during app startup:

```tsx
await initHighlighter({
  langs: [import("@shikijs/langs/typescript")],
});
```

If you skip that, `Code` falls back to plain rendering and warns in dev.
