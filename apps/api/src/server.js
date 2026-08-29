import http from "node:http";

const PORT = Number(process.env.PORT || 8080);

/** Development stubs. These are not production AI capabilities. */
const stubs = {
  "/v1/health": () => ({ status: "ok", service: "adara-api", mode: "development" }),
  "/v1/models": () => ({ data: [], note: "No production models are registered yet." }),
  "/v1/languages": () => ({
    data: [
      { code: "tw", name: "Twi", status: "planned" },
      { code: "yo", name: "Yoruba", status: "planned" },
      { code: "ha", name: "Hausa", status: "planned" },
      { code: "pcm", name: "Nigerian Pidgin", status: "planned" },
      { code: "sw", name: "Swahili", status: "planned" },
      { code: "am", name: "Amharic", status: "planned" },
    ],
  }),
};

const notImplemented = (path) => ({
  error: "not_implemented",
  path,
  message: "Development stub. This is not a production AI endpoint.",
});

export function handle(req, res) {
  const url = new URL(req.url || "/", "http://localhost");
  res.setHeader("content-type", "application/json");
  if (req.method === "GET" && stubs[url.pathname]) {
    res.writeHead(200);
    res.end(JSON.stringify(stubs[url.pathname]()));
    return;
  }
  if (req.method === "POST" && url.pathname.startsWith("/v1/")) {
    res.writeHead(501);
    res.end(JSON.stringify(notImplemented(url.pathname)));
    return;
  }
  res.writeHead(404);
  res.end(JSON.stringify({ error: "not_found" }));
}

function isMain() {
  const entry = process.argv[1] || "";
  return entry.replaceAll("\\", "/").endsWith("/server.js") || entry.endsWith("server.js");
}

if (isMain()) {
  http.createServer(handle).listen(PORT, () => {
    console.log(`adara-api (dev) http://localhost:${PORT}`);
  });
}
