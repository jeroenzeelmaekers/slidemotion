import { Slide, Step, FadeIn, SlideIn, ScaleIn, Stagger } from "slidemotion";

export function StepsSlide() {
  return (
    <Slide id="steps" className="flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <h2 className="text-5xl font-semibold">Step animations</h2>

        <Step order={1}>
          <FadeIn>
            <p className="text-2xl opacity-70">
              Each step reveals on next →
            </p>
          </FadeIn>
        </Step>

        <Step order={2}>
          <SlideIn from="left">
            <p className="text-2xl text-[#ff8c00]">
              ← slid in from the left
            </p>
          </SlideIn>
        </Step>

        <Step order={3}>
          <ScaleIn>
            <p className="text-2xl text-[#1A8E7D]">
              scaled in from 0.8
            </p>
          </ScaleIn>
        </Step>

        <Step order={4}>
          <Stagger>
            <p className="text-xl">staggered item 1</p>
            <p className="text-xl">staggered item 2</p>
            <p className="text-xl">staggered item 3</p>
          </Stagger>
        </Step>
      </div>
    </Slide>
  );
}
