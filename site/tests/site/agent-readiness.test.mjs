import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import {
  NOT_FOUND_MARKDOWN,
  mergeVary,
  negotiateRepresentation,
  parseAccept,
} from "../../netlify/edge-functions/content-negotiation.js";
import contentNegotiation from "../../netlify/edge-functions/content-negotiation.js";

const siteRoot = new URL("../../", import.meta.url);
const distRoot = new URL("../../dist/", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, siteRoot), "utf8");
}

async function readDist(relativePath) {
  return readFile(new URL(relativePath, distRoot), "utf8");
}

function contextFor({ htmlStatus = 200, htmlBody = "<h1>HTML</h1>" } = {}) {
  const calls = [];
  return {
    calls,
    async next(request) {
      calls.push(request?.url ?? "origin");
      if (request?.url?.endsWith(".md")) {
        return new Response("# Markdown representation\n", {
          status: 200,
          headers: { "Content-Type": "text/plain", "Vary": "Accept-Encoding" },
        });
      }
      return new Response(htmlBody, {
        status: htmlStatus,
        headers: { "Content-Type": "text/html; charset=utf-8", "Vary": "Accept-Encoding" },
      });
    },
  };
}

test("Accept parsing handles defaults, q-values, and wildcards", () => {
  assert.equal(parseAccept(undefined)[0].type, "*");
  assert.equal(negotiateRepresentation("text/markdown"), "markdown");
  assert.equal(negotiateRepresentation("text/html"), "html");
  assert.equal(negotiateRepresentation("*/*"), "html");
  assert.equal(
    negotiateRepresentation("text/html;q=0.4, text/markdown;q=0.9"),
    "markdown",
  );
  assert.equal(
    negotiateRepresentation("text/markdown;q=0.4, text/html;q=0.9"),
    "html",
  );
  assert.equal(negotiateRepresentation("application/json"), null);
  assert.equal(negotiateRepresentation("text/html;q=0, text/markdown;q=0"), null);
});

test("Vary merges Accept without dropping CDN fields", () => {
  assert.equal(mergeVary("Accept-Encoding", "Accept"), "Accept-Encoding, Accept");
  assert.equal(mergeVary("accept, Accept-Encoding", "Accept"), "Accept, Accept-Encoding");
});

test("known pages negotiate Markdown at the same URL", async () => {
  const context = contextFor();
  const response = await contentNegotiation(
    new Request("https://clarity.addy.ie/", {
      headers: { Accept: "text/markdown, text/html;q=0.8" },
    }),
    context,
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "text/markdown; charset=utf-8");
  assert.match(response.headers.get("Vary"), /Accept-Encoding/);
  assert.match(response.headers.get("Vary"), /Accept/);
  assert.match(response.headers.get("Link"), /<\/index\.md>.*alternate/);
  assert.deepEqual(context.calls, ["https://clarity.addy.ie/index.md"]);
});

test("HTML remains the default and advertises its Markdown alternate", async () => {
  const context = contextFor();
  const response = await contentNegotiation(
    new Request("https://clarity.addy.ie/example/", {
      headers: { Accept: "text/html, text/markdown;q=0.5" },
    }),
    context,
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "text/html; charset=utf-8");
  assert.match(response.headers.get("Vary"), /Accept/);
  assert.match(response.headers.get("Link"), /<\/example\/index\.md>/);
  assert.deepEqual(context.calls, ["origin"]);
});

test("explicit index.html URLs use the same negotiated representation", async () => {
  const context = contextFor();
  const response = await contentNegotiation(
    new Request("https://clarity.addy.ie/app/index.html", {
      headers: { Accept: "text/markdown" },
    }),
    context,
  );
  assert.equal(response.headers.get("Content-Type"), "text/markdown; charset=utf-8");
  assert.deepEqual(context.calls, ["https://clarity.addy.ie/app/index.md"]);
});

test("unsupported representations receive 406", async () => {
  const response = await contentNegotiation(
    new Request("https://clarity.addy.ie/developers/", {
      headers: { Accept: "application/xml" },
    }),
    contextFor(),
  );
  assert.equal(response.status, 406);
  assert.equal(response.headers.get("Content-Type"), "text/plain; charset=utf-8");
  assert.match(await response.text(), /Available: text\/html, text\/markdown/);
});

test("missing pages keep a real 404 with a recoverable Markdown body", async () => {
  const context = contextFor({ htmlStatus: 404, htmlBody: "<h1>Not found</h1>" });
  const response = await contentNegotiation(
    new Request("https://clarity.addy.ie/does-not-exist", {
      headers: { Accept: "text/markdown" },
    }),
    context,
  );
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("Content-Type"), "text/markdown; charset=utf-8");
  assert.equal(await response.text(), NOT_FOUND_MARKDOWN);
  assert.match(NOT_FOUND_MARKDOWN, /llms\.txt/);
  assert.match(NOT_FOUND_MARKDOWN, /sitemap-index\.xml/);
});

test("non-document assets bypass negotiation", async () => {
  const result = await contentNegotiation(
    new Request("https://clarity.addy.ie/app/app.js", {
      headers: { Accept: "application/javascript" },
    }),
    contextFor(),
  );
  assert.equal(result, undefined);
});

test("all human and machine-readable endpoints are emitted", async () => {
  const expected = [
    "index.html",
    "example/index.html",
    "app/index.html",
    "developers/index.html",
    "404.html",
    "index.md",
    "example/index.md",
    "app/index.md",
    "developers/index.md",
    "404.md",
    "llms.txt",
    "llms-full.txt",
    ".well-known/agent-instructions.md",
    "robots.txt",
    "sitemap-index.xml",
  ];
  for (const relativePath of expected) {
    const info = await stat(new URL(relativePath, distRoot));
    assert.ok(info.isFile(), `${relativePath} should be a file`);
    assert.ok(info.size > 20, `${relativePath} should not be empty`);
  }
});

test("llms.txt follows the proposed order and contains when-to-use guidance", async () => {
  const llms = await read("public/llms.txt");
  const lines = llms.split("\n");
  assert.match(lines[0], /^# Clarity by Addy Osmani$/);
  assert.match(lines[2], /^> /);
  assert.ok(llms.indexOf("## When to use this") > llms.indexOf("> Clarity"));
  assert.match(llms, /Developer resources/);
  assert.match(llms, /does not currently expose an API/);
});

test("homepage exposes identity JSON-LD and agent discovery links", async () => {
  const homepage = await readDist("index.html");
  assert.match(homepage, /rel="alternate" type="text\/markdown" href="\/index\.md"/);
  assert.match(homepage, /rel="describedby" href="\/llms\.txt"/);
  assert.match(homepage, /<title>Clarity by Addy Osmani/);

  const scriptMatch = homepage.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  assert.ok(scriptMatch, "homepage should contain JSON-LD");
  const structuredData = JSON.parse(scriptMatch[1]);
  const types = structuredData["@graph"].map((entry) => entry["@type"]);
  assert.deepEqual(types, ["Person", "SoftwareApplication", "WebSite"]);
  assert.equal(structuredData["@graph"][1].name, "Clarity by Addy Osmani");
});

test("custom 404 and developer page give agents honest recovery paths", async () => {
  const notFound = await readDist("404.html");
  const developers = await readDist("developers/index.html");
  assert.match(notFound, /llms\.txt/);
  assert.match(notFound, /sitemap-index\.xml/);
  assert.match(notFound, /noindex, follow/);
  assert.match(developers, /Clarity by Addy Osmani: developer resources/);
  assert.match(developers, /does not currently expose an HTTP API/);
});
