# slidemotion

A React framework for building animated slide decks in JSX, optimized for presenting code.

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
        <Slide>Hello, world!</Slide>
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

## Sub-path Exports

| Import | Description |
| --- | --- |
| `slidemotion` | Core components, hooks, and types |
| `slidemotion/animation` | Easing, spring, and interpolation utilities |
| `slidemotion/code` | Code highlighting and terminal components |
| `slidemotion/theme` | Theme provider, presets, and utilities |
| `slidemotion/presenter` | Presenter mode and keyboard navigation |
| `slidemotion/styles.css` | Required base styles |

## License

MIT
