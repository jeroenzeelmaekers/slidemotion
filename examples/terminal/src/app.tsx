import { Presentation, Presenter } from "slidemotion";
import { SyncedTerminalSlide } from "./slides/synced-terminal.js";
import { TerminalSlide } from "./slides/terminal.js";
import { orangeTheme } from "./themes/orange.js";

export function App() {
  return (
    <Presentation
      theme={orangeTheme}
      defaultSlideTransition={{ type: "fade", duration: 220 }}
    >
      <Presenter devtools>
        <TerminalSlide />
        <SyncedTerminalSlide />
      </Presenter>
    </Presentation>
  );
}
