import { Presentation, Presenter } from "slidemotion";
import { orangeJuiceLightTheme } from "./themes/dark.js";
import { IntroSlide } from "./slides/intro.js";
import { StepsSlide } from "./slides/steps.js";
import { CodeMorphSlide } from "./slides/code-morph.js";
import { TerminalSlide } from "./slides/terminal.js";
import { TransitionsSlide } from "./slides/transitions.js";
import { SlideTransitionSlide } from "./slides/slide-transition.js";

export function App() {
  return (
    <Presentation theme={orangeJuiceLightTheme}>
      <Presenter>
        <IntroSlide />
        <StepsSlide />
        <CodeMorphSlide />
        <TerminalSlide />
        <TransitionsSlide />
        <SlideTransitionSlide />
      </Presenter>
    </Presentation>
  );
}
