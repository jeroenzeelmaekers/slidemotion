# slidemotion

A React framework for building animated slide decks in JSX, optimized for presenting code.

## Examples

- [Core deck example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/core)
- [Code example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/code)
- [Terminal example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/terminal)

## Install

```bash
npm install slidemotion react react-dom
```

## Quick Start

```tsx
import { Presentation, Presenter, Slide } from "slidemotion";
import "slidemotion/styles.css";

function App() {
  return (
    <Presentation>
      <Presenter>
        <Slide id="hello">Hello, world!</Slide>
      </Presenter>
    </Presentation>
  );
}
```

## Features

- Declarative slides with React components
- Step-based animations and transitions
- Code highlighting with Shiki and animated code morphing
- Theming system with CSS variable support
- Presenter mode with speaker notes
- Spring and tween animation primitives
- Built-in default theme, with `theme={false}` for headless mode
- Per-step durations and backward exit choreography
- Optional presenter devtools and inline speaker notes panel

## Syncing Code With Steps

Use `atSteps` as the default way to choreograph code changes with the rest of a slide.

```tsx
<Step order={1}>
  <FadeIn>Explain the refactor</FadeIn>
</Step>

<Code
  lang="ts"
  steps={[before, after]}
  atSteps={[1]}
/>
```

Use `atSteps` when:

- code changes should line up with other `Step` animations
- code changes should happen on non-consecutive presentation steps
- you want slide timing to stay explicit in one place

Use `stepOffset` only as a shorthand for simple consecutive code changes.

```tsx
<Code lang="ts" steps={[before, after, final]} atSteps={[1, 3]} />
```

That means the first code change happens on step 1, the second on step 3, and step 2 stays free for other slide content.

If you want a tiny helper, use `atSteps(...)` for sparse timing or `rangeStepOrders(start, count)` for consecutive timing.

```tsx
import { atSteps, Code } from "slidemotion";

<Code lang="ts" steps={[before, afterName, afterGuard]} atSteps={atSteps(1, 3)} />;
```

`stepOrders` still works as a compatibility alias.

## Sub-path Exports

| Import                   | Description                                 |
| ------------------------ | ------------------------------------------- |
| `slidemotion`            | Core components, hooks, and types           |
| `slidemotion/animation`  | Easing, spring, and interpolation utilities |
| `slidemotion/code`       | Code highlighting and terminal components   |
| `slidemotion/theme`      | Theme provider, presets, and utilities      |
| `slidemotion/presenter`  | Presenter mode and keyboard navigation      |
| `slidemotion/styles.css` | Required base styles                        |

## License

MIT
