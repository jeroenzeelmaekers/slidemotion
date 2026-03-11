---
title: API Reference
description: Complete API reference for slidemotion.
---

Full API reference for all exports from `slidemotion`.

Focused examples live here:

- [Core deck example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/core)
- [Code example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/code)
- [Terminal example](https://github.com/jeroenzeelmaekers/slidemotion/tree/main/examples/terminal)

## Code choreography

### `Code`

- `steps: readonly string[]` - ordered code snapshots
- `renderer?: CodeRenderer` - override render strategy
- `atSteps?: readonly number[]` - preferred API for syncing code changes with `Step` animations
- `stepOrders?: readonly number[]` - compatibility alias for `atSteps`
- `stepOffset?: number` - shorthand for consecutive code changes

### `Terminal`

- `steps: readonly TerminalStepDef[]` - ordered command/output entries
- `atSteps?: readonly number[]` - preferred API for syncing terminal entries with `Step` animations
- `stepOrders?: readonly number[]` - compatibility alias for `atSteps`
- `stepOffset?: number` - shorthand for consecutive terminal entries

Use `atSteps` when timing should be explicit, sparse, or coordinated with other slide content.

### `Presentation`

- `theme?: Theme | false` - built-in theme by default, or disable with `false`
- `defaultStepDuration?: number` - baseline step duration
- `defaultSlideTransition?: SlideTransition` - deck-wide slide transition default

### `Presenter`

- `devtools?: boolean` - show inline runtime debug panel

### `Step`

- `duration?: number` - override animation duration for that step

### `Animate`

- `enter?: AnimateStyle`
- `animate?: AnimateStyle`
- `exit?: AnimateStyle`
