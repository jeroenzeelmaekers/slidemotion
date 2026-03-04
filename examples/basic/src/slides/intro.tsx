import { Slide, Step, FadeIn } from "slidemotion";

export function IntroSlide() {
  return (
    <Slide id="intro" className="flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <h1 className="text-7xl font-bold tracking-tight">slidemotion</h1>
        <Step order={1}>
          <FadeIn>
            <p className="text-3xl text-sm-muted-foreground">
              animated slide decks in JSX
            </p>
          </FadeIn>
        </Step>
        <Step order={2}>
          <FadeIn>
            <p className="text-xl text-sm-muted-foreground">
              press <kbd className="px-2 py-0.5 border border-sm-border rounded font-mono text-sm-primary">→</kbd> to continue
            </p>
          </FadeIn>
        </Step>
      </div>
    </Slide>
  );
}
