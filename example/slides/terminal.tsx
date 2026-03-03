import { Slide, Terminal } from "slidemotion";

const terminalSteps = [
  { command: "bun init", output: "Done! A package.json file was saved." },
  {
    command: "bun add react react-dom",
    output: "installed react@19.0.0\ninstalled react-dom@19.0.0",
  },
  { command: "bun run dev", output: "Server running at http://localhost:5173" },
];

export function TerminalSlide() {
  return (
    <Slide id="terminal" className="flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-16">
        <h2 className="text-4xl font-semibold">Terminal</h2>
        <p className="text-xl opacity-60">
          typing animation with output reveal
        </p>
        <div className="w-full max-w-250">
          <Terminal
            title="Install React"
            steps={terminalSteps}
            typingSpeed={30}
            className="rounded-xl overflow-hidden text-3xl leading-relaxed bg-[#FAFAF8] text-[#3B3B3B] shadow-2xl shadow-black/10 border border-black/8 font-mono"
            classNames={{
              chrome:
                "flex items-center gap-2 px-3 py-2 bg-[#F0EDE8] border-b border-black/8",
              dots: "flex gap-1.5",
              dotClose: "w-3 h-3 rounded-full bg-[#ff5f56]",
              dotMinimize: "w-3 h-3 rounded-full bg-[#ffbd2e]",
              dotMaximize: "w-3 h-3 rounded-full bg-[#27c93f]",
              title: "text-xl opacity-50 ml-2",
              body: "px-4 py-3",
              line: "flex items-center gap-2 min-h-[1.5em]",
              prompt: "text-[#ff8c00] select-none",
              cursor:
                "inline-block w-2 h-[1.2em] bg-[#ff8c00] animate-[slidemotion-blink_1s_step-end_infinite] align-text-bottom",
              output: "opacity-70 pl-6 mb-1",
            }}
          />
        </div>
      </div>
    </Slide>
  );
}
