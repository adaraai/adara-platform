import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const contactPaths = [
  {
    title: "General",
    description: "Questions about ADARA, our team, or working together.",
    href: "mailto:info@adara.ai?subject=General%20inquiry",
    external: true,
  },
  {
    title: "API & product",
    description: "Technical questions, API access, and integration help.",
    href: "/documentation",
    external: false,
  },
  {
    title: "Press",
    description: "Media inquiries, speaking requests, and brand assets.",
    href: "mailto:info@adara.ai?subject=Press%20inquiry",
    external: true,
  },
  {
    title: "Support",
    description: "Help with billing, access, or an existing integration.",
    href: "/support",
    external: false,
  },
];

const inputClassName =
  "h-12 w-full rounded-full border border-border bg-background px-5 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/25 focus:outline-none focus:ring-0";

const textareaClassName =
  "min-h-[140px] w-full resize-y rounded-3xl border border-border bg-background px-5 py-3.5 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/25 focus:outline-none focus:ring-0";

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("ADARA inquiry");
    const body = encodeURIComponent(
      `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nCompany: ${formData.company || "—"}\n\n${formData.message}`
    );
    window.location.href = `mailto:info@adara.ai?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="section-auto bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-normal leading-[1.08] tracking-[-0.03em] text-foreground">
          Get in touch
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Email us directly, or send a message below — it opens your mail app so nothing is faked.
        </p>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border/50 bg-border/40 sm:grid-cols-2">
          {contactPaths.map((path) => {
            const inner = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-normal text-foreground">{path.title}</h3>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                </div>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {path.description}
                </p>
              </>
            );

            const className =
              "group block min-h-[5.5rem] bg-background p-5 transition-colors hover:bg-muted/20 sm:p-7";

            return path.external ? (
              <a key={path.title} href={path.href} className={className}>
                {inner}
              </a>
            ) : (
              <Link key={path.title} to={path.href} className={className}>
                {inner}
              </Link>
            );
          })}
        </div>

        <div className="mt-10 border-t border-border/50 pt-10 sm:mt-16 sm:pt-16">
          <h3 className="text-2xl font-normal tracking-[-0.02em] text-foreground sm:text-3xl">
            Contact us
          </h3>

          <form onSubmit={handleSubmit} className="mt-10 max-w-2xl space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-base text-foreground">
                    First name <span className="text-muted-foreground">*</span>
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
                  <label htmlFor="lastName" className="text-base text-foreground">
                    Last name <span className="text-muted-foreground">*</span>
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
                <label htmlFor="email" className="text-base text-foreground">
                  Work email <span className="text-muted-foreground">*</span>
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
                <label htmlFor="company" className="text-base text-foreground">
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
                <label htmlFor="message" className="text-base text-foreground">
                  How can we help? <span className="text-muted-foreground">*</span>
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

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-foreground/20 px-8 font-mono text-xs uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-background sm:w-auto"
              >
                Open email
              </button>
            </form>
        </div>
      </div>
    </section>
  );
}
