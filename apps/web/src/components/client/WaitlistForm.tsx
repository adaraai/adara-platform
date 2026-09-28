import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type WaitlistFormProps = {
  source: string;
  submitLabel?: string;
  className?: string;
  variant?: "default" | "light";
};

export function WaitlistForm({
  source,
  submitLabel = "Notify me",
  className,
  variant = "default",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const light = variant === "light";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) return;

    try {
      const key = "adara-waitlist";
      const existing = JSON.parse(localStorage.getItem(key) || "[]") as unknown[];
      localStorage.setItem(
        key,
        JSON.stringify([...existing, { email: value, source, at: Date.now() }])
      );
    } catch {
      /* ignore quota / private mode */
    }

    setSubmitted(true);
    setEmail("");
  }

  if (submitted) {
    return (
      <div
        className={cn(
          "rounded-2xl border px-5 py-6 text-center",
          light ? "border-neutral-200 bg-neutral-50" : "border-border bg-muted/20",
          className
        )}
      >
        <p className={cn("text-sm font-medium", light ? "text-neutral-900" : "text-foreground")}>
          You&apos;re on the list
        </p>
        <p className={cn("mt-1.5 text-sm", light ? "text-neutral-600" : "text-muted-foreground")}>
          We&apos;ll email you when this is ready. Nothing is live yet.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className={cn(
            "mt-4 text-xs transition-colors",
            light
              ? "text-neutral-500 hover:text-neutral-900"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Add another email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      <label htmlFor={`waitlist-email-${source}`} className="sr-only">
        Email
      </label>
      <input
        id={`waitlist-email-${source}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        autoComplete="email"
        className={cn(
          "h-12 w-full rounded-full border px-5 text-sm focus:outline-none",
          light
            ? "border-neutral-300 bg-white text-base text-neutral-900 sm:text-sm placeholder:text-neutral-400 transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/15"
            : "border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/25 focus:ring-0"
        )}
      />
      <button
        type="submit"
        className="h-12 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-adara-orange-hover"
      >
        {submitLabel}
      </button>
    </form>
  );
}
