import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsVisible } from "@/hooks/use-is-visible";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const START_DELAY_MS = 520;
const CHAR_MS = 22;
const JITTER_MS = 16;
const NEWLINE_PAUSE_MS = 150;
const PUNCT_PAUSE_MS = 90;
const HOLD_MS = 2800;
const PEAK_PCT = 16.15;

const codeSnippet = `export async function handler(req) {
  await rateLimit(req, { max: 100 });
  const ctx = await adara.context({
    locale: "sw-KE",
    domain: "agriculture",
  });
  if (!ctx) throw unauthorized();
  return schema.parse(ctx.localize(data));
}`;

/** Reveals the snippet a character at a time, then holds and starts over. */
function useTypedCode(active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (count >= codeSnippet.length) {
      const hold = window.setTimeout(() => setCount(0), HOLD_MS);
      return () => window.clearTimeout(hold);
    }

    const previous = codeSnippet[count - 1];
    let delay = CHAR_MS + Math.random() * JITTER_MS;
    if (count === 0) delay = START_DELAY_MS;
    else if (previous === "\n") delay = NEWLINE_PAUSE_MS;
    else if (previous === ";" || previous === "{" || previous === ",") delay = PUNCT_PAUSE_MS;

    const tick = window.setTimeout(() => setCount((c) => c + 1), delay);
    return () => window.clearTimeout(tick);
  }, [count, active]);

  return count;
}

export function BentoCodeDemo({ compact = false }: { compact?: boolean }) {
  const { ref, visible: onScreen } = useIsVisible<HTMLDivElement>();
  const reduced = useReducedMotion();
  const count = useTypedCode(onScreen && !reduced);

  const typed = reduced ? codeSnippet : codeSnippet.slice(0, count);
  const done = typed.length >= codeSnippet.length;
  const percent = (reduced ? PEAK_PCT : PEAK_PCT * (count / codeSnippet.length)).toFixed(2);

  if (compact) {
    return (
      <div ref={ref} className="flex h-full min-h-0 flex-col overflow-hidden px-4 pt-3 pb-0">
        <div className="mb-1.5 flex shrink-0 items-center gap-2 font-mono text-[10px] text-muted-foreground">
          <span className="text-foreground/70">projects/context-api</span>
          <span className="text-muted-foreground/40">|</span>
          <span className="tabular-nums text-emerald-600 dark:text-emerald-400/90">
            {percent}%
          </span>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <pre className="overflow-hidden font-mono text-[10px] leading-[1.55] whitespace-pre-wrap text-foreground/85 sm:text-[11px]">
            <code>
              {typed}
              <span
                className={cn(
                  "inline-block h-[1.1em] w-[6px] translate-y-[2px] bg-foreground/60 align-middle",
                  done && "bento-cursor"
                )}
              />
            </code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex h-full min-h-0 flex-col p-4 sm:p-5">
      <div className="mb-3 flex shrink-0 items-center gap-2 font-mono text-[10px] text-muted-foreground">
        <span>projects/context-api</span>
        <span className="text-muted-foreground/40">|</span>
        <span className="tabular-nums text-emerald-600 dark:text-emerald-400/80">{percent}%</span>
      </div>
      <div className="relative min-h-[9.5rem] flex-1 overflow-hidden">
        <pre className="overflow-hidden font-mono text-[11px] leading-[1.55] text-foreground/80 whitespace-pre-wrap sm:text-xs">
          <code>
            {typed}
            <span
              className={cn(
                "inline-block h-[1.1em] w-[7px] translate-y-[2px] bg-foreground/70 align-middle",
                done && "bento-cursor"
              )}
            />
          </code>
        </pre>
      </div>
    </div>
  );
}
