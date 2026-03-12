import { Presentation, Presenter } from "slidemotion";
import { IntroSlide } from "./slides/intro.js";
import { SlideTransitionSlide } from "./slides/slide-transition.js";
import { StepsSlide } from "./slides/steps.js";
import { TransitionsSlide } from "./slides/transitions.js";
import { orangeTheme } from "./themes/orange.js";

export function App() {
  return (
    <Presentation theme={orangeTheme} defaultSlideTransition={{ type: "fade", duration: 220 }}>
      <Presenter devtools>
        <IntroSlide />
        <StepsSlide />
        <TransitionsSlide />
        <SlideTransitionSlide />
      </Presenter>
    </Presentation>
  );
}
