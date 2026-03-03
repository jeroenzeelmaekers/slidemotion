import { Slide, Code } from "slidemotion";

const codeSteps = [
  `function greet(name: string) {
  return "hello " + name;
}`,
  `function greet(name: string) {
  return \`hello \${name}!\`;
}`,
  `function greet(name: string): string {
  return \`hello \${name}!\`;
}

greet("world");`,
];

export function CodeMorphSlide() {
  return (
    <Slide id="code-morph" className="flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-16">
        <h2 className="text-4xl font-semibold">Code morphing</h2>
        <p className="text-xl text-sm-muted-foreground">tokens animate between code states</p>
        <div className="w-full max-w-250 h-175 rounded-xl overflow-hidden bg-sm-surface shadow-2xl shadow-black/10 border border-sm-border flex flex-col">
          {/* Breadcrumb bar */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-sm-border">
            <span className="font-mono text-lg text-sm-muted-foreground">
              src <span className="mx-1">&rsaquo;</span> utils{" "}
              <span className="mx-1">&rsaquo;</span> greet.ts
            </span>
          </div>
          <Code
            lang="typescript"
            steps={codeSteps}
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
