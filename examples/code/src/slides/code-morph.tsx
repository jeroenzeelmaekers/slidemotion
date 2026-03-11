import { Code, Slide, atSteps } from "slidemotion";
import { orangeJuiceLight } from "../themes/orange-juice-light.js";

const codeSteps = [
  `const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error("Cannot divide by zero")
  }
  return a / b
}`,
  `import { Effect } from "effect"

const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error("Cannot divide by zero")
  }
  return a / b
}`,
  `import { Effect } from "effect"

const divide = (a: number, b: number): Effect.Effect<number, Error, never> =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b)`,
];

const codeStepOrders = atSteps(1, 2);

export function CodeMorphSlide() {
  return (
    <Slide id="code-morph" className="flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-16">
        <h2 className="text-4xl font-semibold">Effect example</h2>
        <div className="w-full max-w-400 h-175 rounded-xl overflow-hidden bg-sm-surface shadow-xl shadow-black/8 border border-sm-border flex flex-col">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-sm-border">
            <span className="font-mono text-lg text-sm-muted-foreground">
              src <span className="mx-1">&rsaquo;</span> utils{" "}
              <span className="mx-1">&rsaquo;</span> divide.ts
            </span>
          </div>
          <Code
            lang="typescript"
            theme={orangeJuiceLight}
            steps={codeSteps}
            atSteps={codeStepOrders}
            lineNumbers
            animationDuration={600}
            className="font-mono text-3xl leading-relaxed"
            classNames={{
              content: "p-4",
            }}
          />
        </div>
      </div>
    </Slide>
  );
}
