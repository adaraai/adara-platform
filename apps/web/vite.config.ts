import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

function localApiFunctions(): Plugin {
  return {
    name: "local-api-functions",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/waitlist-confirm", async (req, res) => {
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const request = new Request(`http://localhost${req.originalUrl ?? req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(chunks),
          });

          const mod = await server.ssrLoadModule("/api/waitlist-confirm.ts");
          const env = loadEnv(server.config.mode, server.config.envDir || server.config.root, "");
          const response: Response =
            req.method === "POST"
              ? await mod.sendWaitlistConfirmation(request, env)
              : new Response(null, { status: 405, headers: { Allow: "POST" } });

          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          server.config.logger.error(String(error));
          res.statusCode = 500;
          res.end(JSON.stringify({ ok: false, error: "Local API function crashed" }));
        }
      });
    },
  };
}

export default defineConfig({
  base: "/",
  appType: "spa",
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    host: "::",
    port: 4173,
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
  plugins: [react(), localApiFunctions()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssMinify: true,
    sourcemap: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react-router")) {
              return "vendor-react";
            }
            if (id.includes("@radix-ui")) {
              return "vendor-radix";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
          }
        },
      },
    },
  },
});
