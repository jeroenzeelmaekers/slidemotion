import { Slide } from "slidemotion";

export function SlideTransitionSlide() {
  return (
    <Slide
      id="slide-transition"
      transition={{ type: "push", direction: "left", duration: 320 }}
      className="flex flex-col"
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <h2 className="text-5xl font-semibold">Slide transitions</h2>
        <p className="text-2xl text-sm-muted-foreground">this slide overrides the deck fade with a push</p>
        <p className="text-lg text-sm-muted-foreground">
          set <code className="font-mono text-sm-primary">defaultSlideTransition</code> once, then override per slide when needed
        </p>
      </div>
    </Slide>
  );
}
