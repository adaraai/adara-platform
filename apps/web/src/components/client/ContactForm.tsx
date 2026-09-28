import { useState } from "react";
import { isWeb3FormsConfigured, submitToWeb3Forms } from "@/lib/web3forms";

const inputClassName =
  "h-12 w-full rounded-full border border-white/15 bg-white/[0.04] px-5 text-base text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none focus:ring-0";

const textareaClassName =
  "min-h-[140px] w-full resize-y rounded-3xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-base text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none focus:ring-0";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  message: "",
};

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    if (!isWeb3FormsConfigured) {
      setStatus("error");
      setErrorMessage("The contact form isn't configured yet. Please email infoadaraai@gmail.com.");
      return;
    }

    const honeypot = new FormData(e.currentTarget).get("botcheck");
    if (honeypot) return;

    setStatus("sending");
    setErrorMessage("");

    try {
      await submitToWeb3Forms({
        subject: `New inquiry from ${formData.firstName} ${formData.lastName}`,
        from_name: "Adara website",
        replyto: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company: formData.company || "-",
        message: formData.message,
        form: "Contact",
      });

      setStatus("sent");
      setFormData(emptyForm);
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong sending your message. Please try again.");
    }
  };

  return (
    <section id="contact" className="border-t border-white/10 py-14 text-white sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-[clamp(1.85rem,5.5vw,3.5rem)] font-bold leading-[1.2] tracking-[-0.02em]">
          Contact us
        </h2>

        {status === "sent" ? (
          <div className="mt-8 max-w-2xl rounded-3xl border border-white/15 bg-white/[0.04] px-6 py-8 sm:mt-10 sm:px-8">
            <p className="text-lg font-semibold text-white">Thanks, your message is on its way.</p>
            <p className="mt-2 text-base text-white/70">
              We&apos;ll get back to you at the email you provided, usually within one to two business days.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-5 text-sm text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-5 sm:mt-10">
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-base text-white">
                First name <span className="text-white/45">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-base text-white">
                Last name <span className="text-white/45">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-base text-white">
              Email <span className="text-white/45">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="text-base text-white">
              Company name
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-base text-white">
              How can we help? <span className="text-white/45">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={textareaClassName}
            />
          </div>

          {status === "error" && (
            <p role="alert" className="text-sm text-red-400">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex h-10 w-auto items-center justify-center rounded-full bg-primary px-6 text-[13px] sm:h-12 sm:px-8 sm:text-sm font-medium text-primary-foreground transition-colors hover:bg-adara-orange-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {status === "sending" ? "Sending..." : "Send message"}
          </button>
        </form>
        )}
      </div>
    </section>
  );
}
