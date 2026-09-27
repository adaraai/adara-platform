import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/client/Logo";

const footerLinks = {
  product: [
    { label: "Corpus", href: "/#features" },
    { label: "Models", href: "/#features" },
    { label: "Context API", href: "/#approach" },
    { label: "Speech", href: "/#features" },
  ],
  developers: [
    { label: "Documentation", href: "/#contact" },
    { label: "API Reference", href: "/#approach" },
    { label: "Support", href: "/#contact" },
    { label: "Learn", href: "/#approach" },
  ],
  company: [
    { label: "About", href: "/#mission" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/#contact" },
    { label: "Careers", href: "/#mission" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com/company/adara", label: "LinkedIn" },
];

function FooterColumn({
  title,
  links,
  light,
}: {
  title: string;
  links: { label: string; href: string }[];
  light?: boolean;
}) {
  return (
    <div>
      <p
        className={cn(
          "text-[12px] font-bold uppercase tracking-[0.08em]",
          light ? "text-neutral-500" : "text-white/45",
        )}
      >
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {links.map((item) => (
          <li key={item.label}>
            <Link
              to={item.href}
              className={cn(
                "text-[14px] font-light transition-colors",
                light
                  ? "text-neutral-600 hover:text-neutral-900"
                  : "text-white/70 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type FooterProps = {
  variant?: "dark" | "light";
};

export function Footer({ variant = "dark" }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const light = variant === "light";

  return (
    <footer
      className={cn(
        "border-t",
        light ? "border-neutral-200 bg-white text-neutral-900" : "border-white/10 bg-black text-white",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:gap-x-8 sm:gap-y-12 sm:py-16 md:grid-cols-6 md:gap-x-6 md:py-20">
          <div className="col-span-2">
            {light ? <Logo forceLight size="sm" /> : <Logo onDark size="sm" />}
            <p
              className={cn(
                "mt-5 max-w-[17rem] text-[14px] font-light leading-[1.55]",
                light ? "text-neutral-500" : "text-white/70",
              )}
            >
              Teaching AI to understand Africa in its languages, its logic, and its lived reality.
            </p>
            <a
              href="mailto:info@adara.ai"
              className={cn(
                "mt-6 inline-block text-[14px] font-medium transition-colors hover:text-primary",
                light ? "text-neutral-900" : "text-white",
              )}
            >
              info@adara.ai
            </a>
            <p
              className={cn(
                "mt-2 text-[13px] font-light",
                light ? "text-neutral-400" : "text-white/55",
              )}
            >
              Accra · Lagos · Nairobi
            </p>

            <div className="mt-8 flex items-center gap-1">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center transition-colors",
                    light
                      ? "text-neutral-400 hover:text-neutral-900"
                      : "text-white/40 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Product" links={footerLinks.product} light={light} />
          <FooterColumn title="Developers" links={footerLinks.developers} light={light} />
          <FooterColumn title="Company" links={footerLinks.company} light={light} />
          <FooterColumn title="Legal" links={footerLinks.legal} light={light} />
        </div>

        <div
          className={cn(
            "flex flex-col gap-4 border-t py-6 sm:flex-row sm:items-center sm:justify-between",
            light ? "border-neutral-200" : "border-white/10",
          )}
        >
          <p
            className={cn(
              "text-[13px] font-light",
              light ? "text-neutral-400" : "text-white/35",
            )}
          >
            © {currentYear} Adara. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/#contact"
              className={cn(
                "text-[13px] font-light transition-colors",
                light
                  ? "text-neutral-500 hover:text-neutral-900"
                  : "text-white/45 hover:text-white",
              )}
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
