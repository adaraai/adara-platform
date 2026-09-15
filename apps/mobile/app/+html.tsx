import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

/**
 * Web document shell. Keeps the RN Web reset in sync with our global.css
 * rules so the phone frame fills the viewport and fonts render cleanly.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover, interactive-widget=resizes-content"
        />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html {
                -webkit-text-size-adjust: 100%;
              }
              html, body, #root {
                width: 100%;
                height: 100%;
                margin: 0;
                overflow: hidden;
              }
              #root {
                display: flex;
                flex-direction: column;
                min-height: 100dvh;
                height: 100dvh;
                max-height: 100dvh;
              }
              body {
                background-color: #f1f1f3;
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
                  "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              html.dark body {
                background-color: #161616;
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  if (dark) document.documentElement.classList.add("dark");
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
