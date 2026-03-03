import { Slide, Step, FadeIn } from "slidemotion";

export function IntroSlide() {
  return (
    <Slide id="intro" className="flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <h1 className="text-7xl font-bold">slidemotion</h1>
        <Step order={1}>
          <FadeIn>
            <p className="text-3xl opacity-60">
              animated slide decks in JSX
            </p>
          </FadeIn>
        </Step>
        <Step order={2}>
          <FadeIn>
            <p className="text-xl opacity-40">
              press <kbd className="px-2 py-0.5 border border-border rounded font-mono">→</kbd> to continue
            </p>
          </FadeIn>
        </Step>
      </div>
    </Slide>
  );
}
