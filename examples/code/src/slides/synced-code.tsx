import { Animate, Code, Slide, Step, atSteps } from "slidemotion";
import { orangeJuiceLight } from "../themes/orange-juice-light.js";

const codeSteps = [
  `const greeting = (name: string) => {
  return "Hello"
}`,
  `const greeting = (name: string) => {
  return \`Hello, \${name}\`
}`,
  `const greeting = (name: string) => {
  return name.length === 0
    ? "Hello"
    : \`Hello, \${name}\`
}`,
];

export function SyncedCodeSlide() {
  return (
    <Slide id="synced-code" className="flex flex-col">
      <div className="flex-1 grid grid-cols-[1fr_1.1fr] gap-10 items-center px-16">
        <div className="flex flex-col gap-6">
          <h2 className="text-5xl font-semibold">Sync visuals with code</h2>

          <Step order={1}>
            <Animate enter={{ opacity: 0, x: -40 }}>
              <div className="rounded-2xl border border-sm-border bg-sm-muted px-8 py-6">
                <p className="text-2xl font-medium">Step 1</p>
                <p className="mt-2 text-xl text-sm-muted-foreground">
                  Message appears as the function starts using the name.
                </p>
              </div>
            </Animate>
          </Step>

          <Step order={3}>
            <Animate enter={{ opacity: 0, x: -40 }}>
              <div className="rounded-2xl border border-sm-border bg-sm-muted px-8 py-6">
                <p className="text-2xl font-medium">Step 3</p>
                <p className="mt-2 text-xl text-sm-muted-foreground">
                  Guard clause lands on the same click as this callout.
                </p>
              </div>
            </Animate>
          </Step>
        </div>

        <div className="rounded-xl overflow-hidden bg-sm-surface shadow-xl shadow-black/8 border border-sm-border">
          <Code
            lang="typescript"
            theme={orangeJuiceLight}
            steps={codeSteps}
            atSteps={atSteps(1, 3)}
            highlight={{
              1: "2",
              2: "2-4",
            }}
            dimOpacity={0.82}
            lineNumbers
            animationDuration={600}
            className="font-mono text-3xl leading-relaxed"
            classNames={{
              content: "p-4",
            }}
          />
        </div>

        <div className="col-span-2 -mt-4 text-center text-lg text-sm-muted-foreground">
          this slide uses the token renderer to show the new pluggable code path
        </div>
      </div>
    </Slide>
  );
}
