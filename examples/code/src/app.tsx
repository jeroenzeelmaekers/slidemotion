import { Presentation, Presenter } from "slidemotion";
import { CodeMorphSlide } from "./slides/code-morph.js";
import { SyncedCodeSlide } from "./slides/synced-code.js";
import { orangeTheme } from "./themes/orange.js";

export function App() {
  return (
    <Presentation
      theme={orangeTheme}
      defaultSlideTransition={{ type: "fade", duration: 220 }}
    >
      <Presenter devtools>
        <CodeMorphSlide />
        <SyncedCodeSlide />
      </Presenter>
    </Presentation>
  );
}
