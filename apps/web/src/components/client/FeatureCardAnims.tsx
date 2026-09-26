import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const QA_ITEMS = [
  {
    q: "How do you say hello in Twi?",
    a: "Maakye in the morning, or simply Agoo to call attention.",
  },
  {
    q: "What is mobile money in local context?",
    a: "Cash over the phone. In Ghana and Kenya it is how most people pay, save, and send money.",
  },
  {
    q: "Why do models miss African idioms?",
    a: "Training data underrepresents them. Adara corpus fills that gap with community-sourced language.",
  },
];

const AGENT_STEPS = [
  { kind: "think" as const, text: "Thinking..." },
  { kind: "tool" as const, text: "▸ search_corpus", meta: "Twi greetings" },
  { kind: "tool" as const, text: "▸ score_model", meta: "yoruba-speech · 0.94" },
  { kind: "tool" as const, text: "▸ route_backend", meta: "swahili-context" },
  { kind: "done" as const, text: "Routed to best speech backend" },
];

const CODE_LINES = [
  { type: "keep" as const, text: "export async function understand(req) {" },
  { type: "del" as const, text: "  const lang = detectEnglish(req.text);" },
  { type: "add" as const, text: "  const lang = await adara.detect(req.text);" },
  { type: "add" as const, text: "  const ctx = await adara.context(lang);" },
  { type: "keep" as const, text: "  return schema.parse(ctx);" },
  { type: "keep" as const, text: "}" },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Chat-style Q&A — Context API card */
export function CorpusAnim() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const item = QA_ITEMS[index];

  useEffect(() => {
    if (reduced) return;
    const hold = window.setTimeout(() => setVisible(false), 2800);
    return () => window.clearTimeout(hold);
  }, [index, reduced]);

  useEffect(() => {
    if (reduced || visible) return;
    const swap = window.setTimeout(() => {
      setIndex((i) => (i + 1) % QA_ITEMS.length);
      setVisible(true);
    }, 400);
    return () => window.clearTimeout(swap);
  }, [visible, reduced]);

  return (
    <div className="absolute inset-0 flex flex-col justify-center px-5 pb-14 pt-6 sm:px-6">
      <div
        className={cn(
          "space-y-3 transition-all duration-500 ease-out",
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <p className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-white sm:text-[18px]">
          {item.q}
        </p>
        <p className="text-[14px] font-light leading-relaxed text-white/55 sm:text-[15px]">
          {item.a}
        </p>
      </div>
      <div className="mt-5 flex gap-2">
        {QA_ITEMS.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i === index ? "w-4 bg-primary" : "w-1.5 bg-white/25",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** Agent / tool-call stream — Corpus card */
export function ModelsAnim() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reduced ? AGENT_STEPS.length : 0);

  useEffect(() => {
    if (reduced) return;

    if (visible === 0) {
      const t = window.setTimeout(() => setVisible(1), 450);
      return () => window.clearTimeout(t);
    }

    if (visible >= AGENT_STEPS.length) {
      const reset = window.setTimeout(() => setVisible(0), 2400);
      return () => window.clearTimeout(reset);
    }

    const delay = AGENT_STEPS[visible - 1]?.kind === "think" ? 1200 : 900;
    const t = window.setTimeout(() => setVisible((v) => v + 1), delay);
    return () => window.clearTimeout(t);
  }, [visible, reduced]);

  return (
    <div className="absolute inset-0 flex flex-col px-4 pb-14 pt-5 font-mono sm:px-5">
      <div className="mb-4 flex items-center gap-2.5 text-[13px] sm:text-[14px]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50 opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="text-white/60">speech-router</span>
      </div>

      <div className="space-y-2.5 overflow-hidden text-[13px] leading-relaxed sm:text-[14px]">
        {AGENT_STEPS.slice(0, visible).map((step, i) => (
          <div
            key={`${step.text}-${i}`}
            className={cn(
              "flex items-start gap-2",
              step.kind === "think" && "text-white/45",
              step.kind === "tool" && "text-white/80",
              step.kind === "done" && "font-medium text-emerald-300",
            )}
            style={{
              animation: reduced ? undefined : "featureFadeSlide 450ms ease-out both",
            }}
          >
            <span className="shrink-0">{step.text}</span>
            {step.meta ? (
              <span className="truncate text-white/35">{step.meta}</span>
            ) : null}
            {step.kind === "think" && visible === 1 && !reduced ? (
              <span className="ml-0.5 inline-flex gap-0.5 self-center">
                <span className="h-1 w-1 animate-pulse rounded-full bg-white/40" />
                <span className="h-1 w-1 animate-pulse rounded-full bg-white/40 [animation-delay:160ms]" />
                <span className="h-1 w-1 animate-pulse rounded-full bg-white/40 [animation-delay:320ms]" />
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Code migrate panel — Models card */
export function ContextApiAnim() {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState(reduced ? CODE_LINES.length : 0);

  useEffect(() => {
    if (reduced) return;
    if (phase === 0) {
      const t = window.setTimeout(() => setPhase(1), 400);
      return () => window.clearTimeout(t);
    }
    if (phase >= CODE_LINES.length) {
      const reset = window.setTimeout(() => setPhase(0), 2800);
      return () => window.clearTimeout(reset);
    }
    const line = CODE_LINES[phase - 1];
    const delay = line?.type === "keep" ? 520 : 780;
    const t = window.setTimeout(() => setPhase((p) => p + 1), delay);
    return () => window.clearTimeout(t);
  }, [phase, reduced]);

  return (
    <div className="absolute inset-0 flex flex-col px-3 pb-14 pt-4 sm:px-4">
      <div className="mb-2 flex items-center gap-1.5 px-1">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 font-mono text-[12px] text-white/45 sm:text-[13px]">context.ts</span>
      </div>
      <div className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden rounded-lg border border-white/10 bg-black/50 p-3 font-mono text-[11.5px] leading-[1.7] sm:text-[13.5px]">
        {CODE_LINES.slice(0, phase).map((line, i) => (
          <div
            key={`${line.text}-${i}`}
            className={cn(
              "whitespace-pre",
              line.type === "add" && "bg-emerald-500/15 text-emerald-300",
              line.type === "del" && "bg-red-500/12 text-red-300/85 line-through decoration-red-400/50",
              line.type === "keep" && "text-white/70",
            )}
            style={{
              animation: reduced ? undefined : "featureFadeSlide 400ms ease-out both",
            }}
          >
            <span
              className={cn(
                "mr-2 inline-block w-3 select-none",
                line.type === "add" && "text-emerald-400",
                line.type === "del" && "text-red-400",
                line.type === "keep" && "text-white/20",
              )}
            >
              {line.type === "add" ? "+" : line.type === "del" ? "-" : " "}
            </span>
            {line.text}
          </div>
        ))}
        {!reduced && phase > 0 && phase < CODE_LINES.length ? (
          <span className="ml-5 inline-block h-3.5 w-[2px] animate-pulse bg-primary" />
        ) : null}
      </div>
    </div>
  );
}
