import {
  Text as RNText,
  type TextProps as RNTextProps,
} from "react-native";

import { cn } from "@/lib/cn";
import { textFontStyle } from "@/theme/fonts";

/**
 * Named type roles on the ChatGPT product face (system UI / SF Pro / Roboto).
 * Weights use Tailwind `font-*`; the face comes from `textFontStyle`.
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
  hero: "font-bold text-hero text-text",
  display: "font-semibold text-display text-text",
  title: "font-semibold text-title text-text",
  heading: "font-semibold text-heading text-text",
  body: "font-normal text-body text-text",
  bodyStrong: "font-semibold text-body text-text",
  callout: "font-normal text-callout text-text-secondary",
  caption: "font-normal text-caption text-text-secondary",
  label: "font-semibold text-caption text-text",
  micro: "font-medium text-micro uppercase text-text-tertiary",
};

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  className?: string;
};

export function Text({ variant = "body", className, style, ...rest }: TextProps) {
  return (
    <RNText
      className={cn(variants[variant], className)}
      style={[textFontStyle, style]}
      {...rest}
    />
  );
}
