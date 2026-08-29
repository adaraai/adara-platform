import test from "node:test";
import assert from "node:assert/strict";
import { handle } from "./server.js";

function req(method, url) {
  return { method, url };
}

function collect() {
  const res = {
    status: 0,
    headers: {},
    body: "",
    setHeader(k, v) {
      this.headers[k] = v;
    },
    writeHead(code) {
      this.status = code;
    },
    end(chunk) {
      this.body = chunk || "";
    },
  };
  return res;
}

test("GET /v1/health", () => {
  const res = collect();
  handle(req("GET", "/v1/health"), res);
  assert.equal(res.status, 200);
  assert.equal(JSON.parse(res.body).status, "ok");
});

test("POST /v1/translate is a stub", () => {
  const res = collect();
  handle(req("POST", "/v1/translate"), res);
  assert.equal(res.status, 501);
  assert.equal(JSON.parse(res.body).error, "not_implemented");
});
