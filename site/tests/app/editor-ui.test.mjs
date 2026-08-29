import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import test from "node:test";

const appHtml = readFileSync(new URL("../../dist/app/index.html", import.meta.url), "utf8");
const editorSource = readFileSync(new URL("../../src/components/editor/EditorApp.tsx", import.meta.url), "utf8");

test("the editor ships as one hydrated app with its core controls", () => {
  assert.match(appHtml, /<astro-island[^>]+client="load"/);
  assert.match(appHtml, /aria-label="Writing editor"/);
  for (const label of ["Load example", "Clear", "Copy prompt", "Copy text"]) {
    assert.equal(appHtml.includes(label), true);
  }
  assert.match(appHtml, /Private in your browser/);
  assert.doesNotMatch(appHtml, /\/app\/(?:app|base)\.(?:js|css)/);
});

test("the visible editor chrome does not use em dashes", () => {
  assert.equal(appHtml.includes("—"), false);
});

test("the UI is composed from the local shadcn component layer", () => {
  for (const component of ["Button", "Card", "Progress", "ScrollArea", "Tabs", "Tooltip"]) {
    assert.match(editorSource, new RegExp(`@/components/ui/[a-z-]+`));
    assert.match(editorSource, new RegExp(`\\b${component}\\b`));
  }
});

test("the initial editor assets stay within the performance budget", () => {
  const assetPaths = [
    ...appHtml.matchAll(/(?:component-url|renderer-url|href)="(\/_astro\/(?:EditorApp|client|app)\.[^"]+\.(?:js|css))"/g),
  ].map((match) => match[1]);

  assert.equal(assetPaths.length, 3);
  const gzipBytes = assetPaths.reduce((total, assetPath) => {
    const file = new URL(`../../dist${assetPath}`, import.meta.url);
    return total + gzipSync(readFileSync(file)).byteLength;
  }, 0);

  assert.ok(gzipBytes <= 150 * 1024, `initial editor assets are ${Math.ceil(gzipBytes / 1024)} KB gzipped`);
});
