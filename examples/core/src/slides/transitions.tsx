import { Animate, Slide, Step } from "slidemotion";

export function TransitionsSlide() {
  return (
    <Slide id="transitions" className="flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <h2 className="text-5xl font-semibold">Custom Animate</h2>

        <Step order={1}>
          <Animate
            enter={{ opacity: 0, y: -30, rotate: -5 }}
            exit={{ opacity: 0, y: 24, rotate: 3 }}
          >
            <div className="px-12 py-6 rounded-xl border border-sm-border bg-sm-muted text-[22px]">
              <p>rotated + translated entry</p>
            </div>
          </Animate>
        </Step>

        <Step order={2}>
          <Animate enter={{ opacity: 0, scale: 0.5 }} exit={{ opacity: 0, scale: 0.8 }}>
            <div className="px-12 py-6 rounded-xl border border-sm-border bg-sm-muted text-[22px]">
              <p>scaled from 0.5</p>
            </div>
          </Animate>
        </Step>

        <Step order={3}>
          <Animate enter={{ opacity: 0, x: 200 }} exit={{ opacity: 0, x: -120 }}>
            <div className="px-12 py-6 rounded-xl border border-sm-border bg-sm-muted text-[22px]">
              <p>slid from x: 200</p>
            </div>
          </Animate>
        </Step>
      </div>
    </Slide>
  );
}
