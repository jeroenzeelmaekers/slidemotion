import { Slide, Step, Animate } from "slidemotion";

export function TransitionsSlide() {
  return (
    <Slide id="transitions" className="flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <h2 className="text-5xl font-semibold">Custom Animate</h2>

        <Step order={1}>
          <Animate enter={{ opacity: 0, y: -30, rotate: -5 }}>
            <div className="px-12 py-6 rounded-xl border border-border bg-black/5 text-[22px]">
              <p>rotated + translated entry</p>
            </div>
          </Animate>
        </Step>

        <Step order={2}>
          <Animate enter={{ opacity: 0, scale: 0.5 }}>
            <div className="px-12 py-6 rounded-xl border border-border bg-black/5 text-[22px]">
              <p>scaled from 0.5</p>
            </div>
          </Animate>
        </Step>

        <Step order={3}>
          <Animate enter={{ opacity: 0, x: 200 }}>
            <div className="px-12 py-6 rounded-xl border border-border bg-black/5 text-[22px]">
              <p>slid from x: 200</p>
            </div>
          </Animate>
        </Step>
      </div>
    </Slide>
  );
}
