import { Animate, Slide, Step, Terminal, atSteps } from "slidemotion";

const terminalSteps = [
  { command: "bun install" },
  { command: "bun test", output: "109 passed" },
];

export function SyncedTerminalSlide() {
  return (
    <Slide id="synced-terminal" className="flex flex-col">
      <div className="flex-1 grid grid-cols-[1fr_1.1fr] gap-10 items-center px-16">
        <div className="flex flex-col gap-6">
          <h2 className="text-5xl font-semibold">Sync terminal with steps</h2>

          <Step order={2}>
            <Animate enter={{ opacity: 0, y: 24 }}>
              <div className="rounded-2xl border border-sm-border bg-sm-muted px-8 py-6">
                <p className="text-2xl font-medium">Install lands on step 2</p>
                <p className="mt-2 text-xl text-sm-muted-foreground">
                  Use sparse timing when slides need room for narration first.
                </p>
              </div>
            </Animate>
          </Step>

          <Step order={4}>
            <Animate enter={{ opacity: 0, y: 24 }}>
              <div className="rounded-2xl border border-sm-border bg-sm-muted px-8 py-6">
                <p className="text-2xl font-medium">Tests land on step 4</p>
                <p className="mt-2 text-xl text-sm-muted-foreground">
                  Terminal output stays aligned with the rest of the slide.
                </p>
              </div>
            </Animate>
          </Step>
        </div>

        <div className="rounded-xl overflow-hidden border border-sm-border bg-sm-surface shadow-xl shadow-black/8">
          <Terminal
            title="demo"
            steps={terminalSteps}
            atSteps={atSteps(2, 4)}
            classNames={{
              chrome: "flex items-center gap-3 border-b border-sm-border px-5 py-4",
              dots: "flex gap-2",
              dotClose: "h-3 w-3 rounded-full bg-red-400",
              dotMinimize: "h-3 w-3 rounded-full bg-yellow-400",
              dotMaximize: "h-3 w-3 rounded-full bg-green-400",
              title: "text-lg text-sm-muted-foreground",
              body: "min-h-90 p-5 font-mono text-2xl leading-relaxed",
              line: "flex items-center gap-3",
              prompt: "text-sm-primary",
              cursor: "inline-block h-[1.1em] w-3 animate-pulse bg-sm-foreground align-middle",
              output: "ml-8 text-sm-muted-foreground",
            }}
          />
        </div>
      </div>
    </Slide>
  );
}
