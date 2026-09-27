import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const ROBOTS_POLICY = "noindex, nofollow, noarchive, nosnippet, noimageindex";

// Known crawler / scraper / scanner user-agent fragments (an extra layer only; UA can be spoofed).
const BOT_UA = new RegExp(
  [
    "googlebot", "google-inspectiontool", "googleother", "google-extended", "adsbot-google",
    "mediapartners-google", "apis-google", "feedfetcher-google", "google-read-aloud", "storebot-google",
    "bingbot", "bingpreview", "msnbot", "adidxbot", "yandex", "baiduspider", "duckduckbot", "slurp",
    "sogou", "exabot", "seznambot", "petalbot", "applebot", "ahrefs", "semrush", "mj12bot", "dotbot",
    "rogerbot", "screaming frog", "serpstat", "blexbot", "dataforseo", "gptbot", "chatgpt-user",
    "oai-searchbot", "claudebot", "claude-web", "anthropic-ai", "perplexitybot", "bytespider",
    "ccbot", "cohere-ai", "diffbot", "amazonbot", "facebookbot", "meta-externalagent", "ia_archiver",
    "archive.org_bot", "heritrix", "scrapy", "python-requests", "python-urllib", "go-http-client",
    "curl/", "wget", "libwww-perl", "httpclient", "okhttp", "headlesschrome", "phantomjs",
    "nikto", "sqlmap", "nmap", "masscan", "zgrab", "nuclei", "wpscan", "crawler", "spider",
  ].map((s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")).join("|"),
  "i",
);

function isSensitivePath(path: string) {
  return path.startsWith("/track-transfer") || path.startsWith("/ecoencypt") || path.startsWith("/_serverFn") || path.startsWith("/api");
}

function withPrivacyHeaders(response: Response, path: string): Response {
  const res = new Response(response.body, response);
  res.headers.set("X-Robots-Tag", ROBOTS_POLICY);
  if (isSensitivePath(path)) {
    res.headers.set("Cache-Control", "no-store, private, max-age=0");
  }
  return res;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const path = new URL(request.url).pathname;
    const ua = request.headers.get("user-agent") ?? "";
    if (path === "/sitemap.xml") {
      return withPrivacyHeaders(new Response("Not found", { status: 404 }), path);
    }
    if (path !== "/robots.txt" && (!ua.trim() || BOT_UA.test(ua))) {
      return withPrivacyHeaders(
        new Response("Access denied", { status: 403, headers: { "content-type": "text/plain" } }),
        path,
      );
    }
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withPrivacyHeaders(await normalizeCatastrophicSsrResponse(response), path);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
