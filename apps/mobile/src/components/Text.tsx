import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { cn } from "@/lib/cn";

/**
 * The type scale, as named roles rather than sizes. Using `variant` instead
 * of raw `text-*` classes keeps headline/body pairings consistent and means
 * the scale can be retuned in one place.
 */
export type TextVariant =
  | "hero"
  | "display"
  | "title"
  | "heading"
  | "body"
  | "bodyStrong"
  | "callout"
  | "caption"
  | "label"
  | "micro";

const variants: Record<TextVariant, string> = {
  hero: "font-display-bold text-hero text-text",
  display: "font-display text-display text-text",
  title: "font-display text-title text-text",
  heading: "font-display text-heading text-text",
  body: "font-sans text-body text-text",
  bodyStrong: "font-sans-semibold text-body text-text",
  callout: "font-sans text-callout text-text-secondary",
  caption: "font-sans text-caption text-text-secondary",
  label: "font-sans-semibold text-caption text-text",
  micro: "font-sans-semibold text-micro uppercase text-text-tertiary",
};

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  className?: string;
};

export function Text({ variant = "body", className, ...rest }: TextProps) {
  return <RNText className={cn(variants[variant], className)} {...rest} />;
}
