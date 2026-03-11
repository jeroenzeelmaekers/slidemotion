import { FadeIn, ScaleIn, Slide, SlideIn, Stagger, Step } from "slidemotion";

export function StepsSlide() {
  return (
    <Slide id="steps" className="flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <h2 className="text-5xl font-semibold">Step animations</h2>

        <Step order={1}>
          <FadeIn>
            <p className="text-2xl text-sm-muted-foreground">
              Each step reveals on next -&gt;
            </p>
          </FadeIn>
        </Step>

        <Step order={2}>
          <SlideIn from="left" exitTo="right">
            <p className="text-2xl text-sm-primary">&lt;- slid in from the left</p>
          </SlideIn>
        </Step>

        <Step order={3} duration={650}>
          <ScaleIn exitTo={0.65}>
            <p className="text-2xl text-sm-primary">scaled in from 0.8</p>
          </ScaleIn>
        </Step>

        <Step order={4}>
          <Stagger interval={0.16} y={18}>
            <p className="text-xl">staggered item 1</p>
            <p className="text-xl">staggered item 2</p>
            <p className="text-xl">staggered item 3</p>
          </Stagger>
        </Step>
      </div>
    </Slide>
  );
}
