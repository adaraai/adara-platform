/**
 * ADARA Tailwind theme.
 *
 * Colors resolve to the CSS variables declared in `global.css`, written as
 * `rgb(var(--x) / <alpha-value>)` so opacity modifiers keep working
 * (`bg-surface/60`, `text-text-secondary/80`) and dark mode is a variable
 * swap rather than a second set of classes.
 */

/** Each RN font weight is a distinct family, so weights are named families. */
const family = (name) => [name, "system-ui", "sans-serif"];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-raised": "rgb(var(--surface-raised) / <alpha-value>)",
        "surface-sunken": "rgb(var(--surface-sunken) / <alpha-value>)",
        glass: "rgb(var(--glass) / <alpha-value>)",
        "glass-border": "rgb(var(--glass-border) / <alpha-value>)",

        text: "rgb(var(--text) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
        "text-tertiary": "rgb(var(--text-tertiary) / <alpha-value>)",
        "text-inverse": "rgb(var(--text-inverse) / <alpha-value>)",

        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-pressed": "rgb(var(--primary-pressed) / <alpha-value>)",
        "primary-soft": "rgb(var(--primary-soft) / <alpha-value>)",
        "on-primary": "rgb(var(--on-primary) / <alpha-value>)",

        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--accent-soft) / <alpha-value>)",

        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",

        border: "rgb(var(--border) / <alpha-value>)",
        "border-strong": "rgb(var(--border-strong) / <alpha-value>)",
      },

      /**
       * ChatGPT-like product scale on the system UI face (SF Pro / Roboto /
       * system-ui). Weights come from Tailwind `font-medium` / `font-semibold`.
       */
      fontSize: {
        hero: ["34px", { lineHeight: "40px", letterSpacing: "-0.8px" }],
        display: ["28px", { lineHeight: "34px", letterSpacing: "-0.6px" }],
        title: ["22px", { lineHeight: "28px", letterSpacing: "-0.4px" }],
        heading: ["18px", { lineHeight: "24px", letterSpacing: "-0.2px" }],
        body: ["16px", { lineHeight: "22px", letterSpacing: "-0.2px" }],
        callout: ["14px", { lineHeight: "20px", letterSpacing: "-0.1px" }],
        caption: ["13px", { lineHeight: "18px", letterSpacing: "0px" }],
        micro: ["11px", { lineHeight: "14px", letterSpacing: "0.4px" }],
      },

      fontFamily: {
        // Named aliases kept for existing classNames; all resolve to system UI.
        sans: family("System"),
        "sans-medium": family("System"),
        "sans-semibold": family("System"),
        "sans-bold": family("System"),
        display: family("System"),
        "display-medium": family("System"),
        "display-bold": family("System"),
      },

      borderRadius: {
        xs: "10px",
        sm: "14px",
        md: "20px",
        lg: "26px",
        xl: "32px",
        "2xl": "40px",
      },

      spacing: {
        gutter: "20px",
        section: "28px",
      },
    },
  },
  plugins: [],
};
