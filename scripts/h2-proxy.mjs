// Local HTTP/2 (TLS) proxy in front of `next start`, for Lighthouse runs that model the
// network the way PageSpeed Insights does against Vercel. Lighthouse's simulated throttling
// treats HTTP/1.1 (plain localhost) as six cold connections and HTTP/2 as one multiplexed
// connection, so plain localhost overstates LCP.
//
// Needs a throwaway self-signed certificate in qa/certs (git-ignored):
//   openssl req -x509 -newkey rsa:2048 -nodes -keyout qa/certs/key.pem -out qa/certs/cert.pem \
//     -days 30 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
// Usage: node scripts/h2-proxy.mjs   (https://localhost:3443 -> http://localhost:3100)
import { readFileSync } from "node:fs";
import http from "node:http";
import http2 from "node:http2";

const TARGET = { host: "localhost", port: Number(process.env.QA_UPSTREAM_PORT ?? 3100) };
const PORT = Number(process.env.QA_H2_PORT ?? 3443);
const HOP_BY_HOP = new Set(["connection", "keep-alive", "transfer-encoding", "upgrade", "proxy-connection", "http2-settings", "te", "host"]);

const server = http2.createSecureServer({ key: readFileSync("qa/certs/key.pem"), cert: readFileSync("qa/certs/cert.pem"), allowHTTP1: true }, (req, res) => {
  const headers = Object.fromEntries(Object.entries(req.headers).filter(([name]) => !name.startsWith(":") && !HOP_BY_HOP.has(name)));
  // A fresh upstream socket per request: reused keep-alive sockets stalled some responses.
  const upstream = http.request({ ...TARGET, agent: false, method: req.method, path: req.url, headers: { ...headers, host: `${TARGET.host}:${TARGET.port}`, connection: "close" } }, (response) => {
    const out = Object.fromEntries(Object.entries(response.headers).filter(([name]) => !HOP_BY_HOP.has(name)));
    res.writeHead(response.statusCode ?? 502, out);
    response.pipe(res);
  });
  upstream.on("error", () => {
    if (!res.headersSent) res.writeHead(502);
    res.end();
  });
  req.pipe(upstream);
});
server.listen(PORT, () => console.log(`HTTP/2 proxy: https://localhost:${PORT} -> http://${TARGET.host}:${TARGET.port}`));
