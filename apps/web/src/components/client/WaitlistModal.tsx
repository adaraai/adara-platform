import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { WaitlistForm } from "@/components/client/WaitlistForm";

type WaitlistModalProps = {
  open: boolean;
  onClose: () => void;
  source?: string;
};

export function WaitlistModal({ open, onClose, source = "waitlist-modal" }: WaitlistModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    }, 50);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-modal-title"
        aria-describedby="waitlist-modal-description"
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[26rem] overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 sm:max-w-md sm:rounded-3xl"
      >

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent"
          aria-hidden
        />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center touch-manipulation sm:right-4 sm:top-4 sm:h-8 sm:w-8 justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <div className="relative px-5 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">
            Early access
          </p>
          <h2
            id="waitlist-modal-title"
            className="mt-2 pr-10 text-xl font-bold tracking-[-0.02em] text-neutral-900 sm:pr-0 sm:text-2xl"
          >
            Join the waitlist
          </h2>
          <p id="waitlist-modal-description" className="mt-2 text-sm leading-relaxed text-neutral-600">
            Be among the first to access Adara&apos;s data and tools for building AI that
            understands Africa. We&apos;ll reach out as soon as spots open up.
          </p>

          <WaitlistForm source={source} submitLabel="Join the waitlist" variant="light" className="mt-6" />

          <p className="mt-4 text-center text-xs text-neutral-500">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
