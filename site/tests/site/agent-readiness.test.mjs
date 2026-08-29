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
    new Request("https://clarity.addy.ie/approach/", {
      headers: { Accept: "text/html, text/markdown;q=0.5" },
    }),
    context,
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "text/html; charset=utf-8");
  assert.match(response.headers.get("Vary"), /Accept/);
  assert.match(response.headers.get("Link"), /<\/approach\/index\.md>/);
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

test("tutorials negotiate their Markdown representation", async () => {
  const context = contextFor();
  const response = await contentNegotiation(
    new Request("https://clarity.addy.ie/tutorials/", {
      headers: { Accept: "text/markdown" },
    }),
    context,
  );
  assert.equal(response.headers.get("Content-Type"), "text/markdown; charset=utf-8");
  assert.deepEqual(context.calls, ["https://clarity.addy.ie/tutorials/index.md"]);
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
    "approach/index.html",
    "tutorials/index.html",
    "app/index.html",
    "developers/index.html",
    "404.html",
    "index.md",
    "example/index.md",
    "approach/index.md",
    "tutorials/index.md",
    "app/index.md",
    "developers/index.md",
    "404.md",
    "llms.txt",
    "llms-full.txt",
    ".well-known/agent-instructions.md",
    "robots.txt",
    "sitemap-index.xml",
    "og.png",
    "og-editor.png",
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
  assert.match(llms, /Tutorials/);
  assert.match(llms, /does not currently expose an API/);
});

test("homepage exposes identity JSON-LD and agent discovery links", async () => {
  const homepage = await readDist("index.html");
  assert.match(homepage, /rel="alternate" type="text\/markdown" href="\/index\.md"/);
  assert.match(homepage, /rel="describedby" href="\/llms\.txt"/);
  assert.match(homepage, /<title>Clarity: AI writing skill and editor \| Addy Osmani<\/title>/);

  const scriptMatch = homepage.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  assert.ok(scriptMatch, "homepage should contain JSON-LD");
  const structuredData = JSON.parse(scriptMatch[1]);
  const types = structuredData["@graph"].map((entry) => entry["@type"]);
  assert.deepEqual(types, ["Person", "SoftwareApplication", "WebSite", "WebPage"]);
  assert.equal(structuredData["@graph"][1].name, "Clarity by Addy Osmani");
  assert.equal(structuredData["@graph"][3].url, "https://clarity.addy.ie/");
});

test("public pages use distinct search metadata and generous preview directives", async () => {
  const pages = [
    {
      path: "index.html",
      title: "Clarity: AI writing skill and editor | Addy Osmani",
      phrase: "Open-source AI writing skill and private editor",
    },
    {
      path: "approach/index.html",
      title: "AI writing skill approach, examples, and evals | Clarity",
      phrase: "AI humanizer",
    },
    {
      path: "tutorials/index.html",
      title: "Clarity tutorials: review, rewrite, and interview",
      phrase: "Hands-on guides for Claude Code and Codex",
    },
    {
      path: "app/index.html",
      title: "Clarity AI Writing Editor: AI tells and readability",
      phrase: "Clarity Writing Editor",
    },
    {
      path: "developers/index.html",
      title: "Clarity developer resources | Addy Osmani",
      phrase: "Clarity by Addy Osmani: developer resources",
    },
  ];

  const titles = new Set();
  const descriptions = new Set();
  for (const page of pages) {
    const html = await readDist(page.path);
    assert.match(html, new RegExp(`<title>${page.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/title>`));
    assert.match(html, new RegExp(page.phrase));
    assert.match(
      html,
      /<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/,
    );

    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(title && title.length <= 60, `${page.path} should have a concise title`);
    assert.ok(description && description.length >= 100 && description.length <= 165);
    titles.add(title);
    descriptions.add(description);
  }
  assert.equal(titles.size, pages.length);
  assert.equal(descriptions.size, pages.length);
});

test("approach page pairs visible search-intent answers with FAQ structured data", async () => {
  const approach = await readDist("approach/index.html");
  assert.match(approach, /anti-slop prompt/);
  assert.match(approach, /Claude Code writing\s+skill/);
  assert.match(approach, /It never treats a detector score as proof of good writing/);

  const scriptMatch = approach.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  assert.ok(scriptMatch, "approach should contain JSON-LD");
  const structuredData = JSON.parse(scriptMatch[1]);
  const faq = structuredData["@graph"].find((entry) => entry["@type"] === "FAQPage");
  assert.ok(faq, "approach should describe its visible FAQ");
  assert.equal(faq.mainEntity.length, 6);
  for (const item of faq.mainEntity) {
    assert.match(approach, new RegExp(item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.ok(item.acceptedAnswer.text.length > 80);
  }
});

test("editor identifies itself as a free private WebApplication", async () => {
  const editor = await readDist("app/index.html");
  const scriptMatch = editor.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  assert.ok(scriptMatch, "editor should contain JSON-LD");
  const structuredData = JSON.parse(scriptMatch[1]);
  assert.equal(structuredData["@type"], "WebApplication");
  assert.equal(structuredData.url, "https://clarity.addy.ie/app/");
  assert.equal(structuredData.isAccessibleForFree, true);
  assert.match(structuredData.featureList.join(" "), /AI writing tell review/);
});

test("tutorials show all three human-in-the-loop workflows", async () => {
  const tutorials = await readDist("tutorials/index.html");
  const tutorialsMarkdown = await read("public/tutorials/index.md");

  assert.match(tutorials, /id="review"/);
  assert.match(tutorials, /id="rewrite"/);
  assert.match(tutorials, /id="interview"/);
  assert.match(tutorials, /\/clarity review incident-reviews\.md/);
  assert.match(tutorials, /\$clarity Review incident-reviews\.md/);
  assert.match(tutorials, /ask-author/);
  assert.match(tutorials, /git diff --word-diff/);
  assert.match(tutorials, /The provenance note is part of the handoff/);

  const scriptMatch = tutorials.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  assert.ok(scriptMatch, "tutorials should contain JSON-LD");
  const structuredData = JSON.parse(scriptMatch[1]);
  const tutorialList = structuredData["@graph"].find(
    (entry) => entry["@type"] === "ItemList",
  );
  assert.equal(tutorialList.numberOfItems, 3);
  assert.deepEqual(
    tutorialList.itemListElement.map((entry) => entry.item["@type"]),
    ["HowTo", "HowTo", "HowTo"],
  );

  assert.match(tutorialsMarkdown, /## 1\. Review an existing draft/);
  assert.match(tutorialsMarkdown, /## 2\. Rewrite an existing draft/);
  assert.match(tutorialsMarkdown, /## 3\. Interview the author/);
});

test("the site and editor publish complete large-image sharing metadata", async () => {
  const homepage = await readDist("index.html");
  const editor = await readDist("app/index.html");

  for (const [html, image, title] of [
    [homepage, "https://clarity.addy.ie/og.png", "Clarity: AI writing skill"],
    [editor, "https://clarity.addy.ie/og-editor.png", "Clarity AI Writing Editor"],
  ]) {
    assert.match(html, new RegExp(`<meta property="og:title" content="${title}`));
    assert.match(html, new RegExp(`<meta property="og:image" content="${image.replaceAll(".", "\\.")}"`));
    assert.match(html, new RegExp(`<meta property="og:image:secure_url" content="${image.replaceAll(".", "\\.")}"`));
    assert.match(html, /<meta property="og:image:type" content="image\/png"/);
    assert.match(html, /<meta property="og:image:width" content="1200"/);
    assert.match(html, /<meta property="og:image:height" content="630"/);
    assert.match(html, /<meta property="og:image:alt" content="[^"].+"/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
    assert.match(html, new RegExp(`<meta name="twitter:image" content="${image.replaceAll(".", "\\.")}"`));
    assert.match(html, /<meta name="twitter:image:alt" content="[^"].+"/);
    assert.match(html, /<meta name="twitter:creator" content="@addyosmani"/);
  }
});

test("both sharing images are valid 1200 by 630 PNG files", async () => {
  for (const relativePath of ["og.png", "og-editor.png"]) {
    const image = await readFile(new URL(relativePath, distRoot));
    assert.equal(image.subarray(1, 4).toString(), "PNG", `${relativePath} should be a PNG`);
    assert.equal(image.readUInt32BE(16), 1200, `${relativePath} should be 1200 pixels wide`);
    assert.equal(image.readUInt32BE(20), 630, `${relativePath} should be 630 pixels tall`);
  }
});

test("custom 404 and developer page give agents honest recovery paths", async () => {
  const notFound = await readDist("404.html");
  const developers = await readDist("developers/index.html");
  assert.match(notFound, /llms\.txt/);
  assert.match(notFound, /sitemap-index\.xml/);
  assert.match(notFound, /\/tutorials\//);
  assert.match(notFound, /noindex, follow/);
  assert.match(developers, /Clarity by Addy Osmani: developer resources/);
  assert.match(developers, /does not currently expose an HTTP API/);
});

test("approach page explains differentiation and eval limits with public evidence", async () => {
  const approach = await readDist("approach/index.html");
  const approachMarkdown = await read("public/approach/index.md");
  assert.match(approach, /What makes it different/);
  assert.match(approach, /eleven public evaluation cases/i);
  assert.match(approach, /do not yet claim a benchmark win/i);
  assert.match(approach, /evals\/cases\.json/);
  assert.match(approach, /evals\/JUDGE\.md/);
  assert.match(approachMarkdown, /## One essay, three times/);
  assert.match(approachMarkdown, /## When to use Clarity/);
  assert.match(approachMarkdown, /## What the evals cover/);
  assert.match(approachMarkdown, /## Questions people ask/);
});

test("the core guidance remains complete and duplicate Markdown URLs are not indexed", async () => {
  const homepage = await readDist("index.html");
  const config = await read("../netlify.toml");
  assert.equal((homepage.match(/<article class="row rule"/g) ?? []).length, 18);
  assert.match(config, /for = "\/\*\.md"[\s\S]*?X-Robots-Tag\s*= "noindex"/);
});

test("old example URLs retain a permanent path to the approach", async () => {
  const config = await read("../netlify.toml");
  const legacyPage = await readDist("example/index.html");
  const sitemap = await readDist("sitemap-0.xml");
  assert.match(config, /from = "\/example\/"[\s\S]*?to = "\/approach\/#example"[\s\S]*?status = 301/);
  assert.match(legacyPage, /\/approach\/#example/);
  assert.match(legacyPage, /noindex, follow/);
  assert.match(sitemap, /https:\/\/clarity\.addy\.ie\/approach\//);
  assert.doesNotMatch(sitemap, /https:\/\/clarity\.addy\.ie\/example\//);
});

test("homepage leads visitors to the approach page", async () => {
  const homepage = await readDist("index.html");
  assert.match(homepage, /href="\/approach\/"[^>]*>Approach<\/a>/);
  assert.match(homepage, /href="\/tutorials\/"[^>]*>Tutorials<\/a>/);
  assert.match(homepage, /href="\/approach\/#example"[^>]*>See the approach/);
  assert.ok(
    homepage.indexOf('href="/approach/"') < homepage.indexOf('href="/tutorials/"'),
    "Tutorials should follow Approach in the navigation",
  );
  assert.ok(
    homepage.indexOf('href="/tutorials/"') < homepage.indexOf('href="/app/"'),
    "Tutorials should come before Editor in the navigation",
  );
  assert.doesNotMatch(homepage, /href="\/example\/"[^>]*>Example<\/a>/);
});
