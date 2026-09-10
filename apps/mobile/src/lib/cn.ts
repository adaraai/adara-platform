import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge classifies `text-*` by inspecting the value: anything that
 * is not a recognised size falls through to the text-color group. Our scale
 * is named by role (`text-body`, `text-hero`), so without this it would read
 * `text-body text-text` as two colors and silently drop the size.
 *
 * Both lists must track `tailwind.config.js`.
 */
const merge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "hero",
            "display",
            "title",
            "heading",
            "body",
            "callout",
            "caption",
            "micro",
          ],
        },
      ],
      "text-color": [
        { text: ["text", "text-secondary", "text-tertiary", "text-inverse"] },
      ],
    },
  },
});

/**
 * Merge class strings, letting a caller's prop override a component's
 * default for the same Tailwind group (`p-4` + `p-6` resolves to `p-6`).
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return merge(parts.filter(Boolean).join(" "));
}
