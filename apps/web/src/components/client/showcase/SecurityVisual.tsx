import { useOffscreenPause } from "@/hooks/use-offscreen-pause";

const orbits = [
  {
    ring: "lock-orbit-a absolute inset-0 rounded-full border border-cyan-600/30 dark:border-cyan-300/25",
    node: "bg-cyan-500 dark:bg-cyan-300",
    shadow: "0 0 12px rgba(34,211,238,0.75)",
  },
  {
    ring: "lock-orbit-b absolute -inset-4 rounded-full border border-emerald-600/25 dark:border-emerald-300/20",
    node: "bg-emerald-500 dark:bg-emerald-300",
    shadow: "0 0 12px rgba(16,185,129,0.7)",
  },
  {
    ring: "lock-orbit-c absolute inset-2 rounded-full border border-foreground/12",
    node: "bg-foreground/70",
    shadow: "0 0 10px rgba(120,120,120,0.5)",
  },
];

export function SecurityVisual() {
  const pauseRef = useOffscreenPause<HTMLDivElement>();

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden rounded-xl bg-muted dark:bg-card">
      <div ref={pauseRef} className="absolute inset-0">
        <div className="lock-scene absolute inset-x-0 bottom-[3.25rem] top-0 flex items-center justify-center">
          <div className="lock-stage relative flex h-[8.5rem] w-[8.5rem] items-center justify-center">
            {orbits.map((orbit) => (
              <div key={orbit.ring} aria-hidden className={orbit.ring}>
                <span
                  className={`absolute -top-[3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${orbit.node}`}
                  style={{ boxShadow: orbit.shadow }}
                />
              </div>
            ))}

            <div
              aria-hidden
              className="lock-ping absolute inset-3 rounded-full border border-emerald-600/25 dark:border-emerald-300/25"
            />
            <div
              aria-hidden
              className="lock-ping absolute inset-3 rounded-full border border-emerald-600/25 dark:border-emerald-300/25"
              style={{ animationDelay: "1.8s" }}
            />

            <div className="lock-float relative">
              {/* shackle */}
              <div
                aria-hidden
                className="absolute left-1/2 top-0 h-8 w-10 -translate-x-1/2 rounded-t-full border-[5px] border-b-0 border-slate-500 dark:border-slate-600"
                style={{ transform: "translate3d(-50%, 0, -14px)" }}
              />
              <div
                className="mx-auto h-8 w-10 rounded-t-full border-[5px] border-b-0 border-slate-400 dark:border-slate-300/90"
                style={{ borderBottomColor: "transparent" }}
              />

              {/* body */}
              <div className="relative -mt-1.5" style={{ transformStyle: "preserve-3d" }}>
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-[15px] bg-slate-700 dark:bg-slate-900"
                  style={{ transform: "translateZ(-14px)" }}
                />
                <div
                  className="relative h-[3.25rem] w-[4.5rem] overflow-hidden rounded-[15px] ring-1 ring-black/15 dark:ring-white/25"
                  style={{
                    background:
                      "linear-gradient(148deg, #f1f5f9 0%, #cbd5e1 26%, #7c8ba1 58%, #3f4b5d 88%, #64748b 100%)",
                    boxShadow:
                      "0 14px 30px rgba(15,23,42,0.35), inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -8px 16px rgba(0,0,0,0.35)",
                  }}
                >
                  <span
                    aria-hidden
                    className="lock-sheen absolute -inset-y-4 left-0 w-8 bg-gradient-to-r from-transparent via-white/55 to-transparent"
                  />

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%]">
                    <div
                      className="lock-keyhole h-[9px] w-[9px] rounded-full bg-emerald-400"
                      style={{ boxShadow: "0 0 14px rgba(52,211,153,0.95)" }}
                    />
                    <div
                      className="lock-keyhole mx-auto -mt-[2px] h-[9px] w-[3px] rounded-b-[2px] bg-emerald-400"
                      style={{ boxShadow: "0 0 12px rgba(52,211,153,0.8)" }}
                    />
                  </div>
                </div>
              </div>

              {/* contact shadow */}
              <div
                aria-hidden
                className="absolute -bottom-4 left-1/2 h-3 w-16 -translate-x-1/2 rounded-[50%] bg-black/25 blur-md dark:bg-black/70"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
