import { Slide } from "slidemotion";

export function SlideTransitionSlide() {
  return (
    <Slide id="slide-transition" transition="fade" className="flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <h2 className="text-5xl font-semibold">Slide transitions</h2>
        <p className="text-2xl text-sm-muted-foreground">
          this slide faded in
        </p>
        <p className="text-lg text-sm-muted-foreground">
          set <code className="font-mono text-sm-primary">transition="fade"</code> on any Slide
        </p>
      </div>
    </Slide>
  );
}
