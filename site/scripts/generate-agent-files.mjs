import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const siteRoot = new URL("../", import.meta.url);
const publicRoot = new URL("../public/", import.meta.url);
const readmePath = new URL("../../README.md", import.meta.url);
const readme = await readFile(readmePath, "utf8");

const skillStart = readme.indexOf("\n## The skill in this repository");
const furtherStart = readme.indexOf("\n## Further reading");
if (skillStart === -1 || furtherStart === -1 || furtherStart <= skillStart) {
  throw new Error("Could not find the expected README sections for index.md");
}

const homepageMarkdown = `${readme.slice(0, skillStart).trim()}\n\n${readme.slice(furtherStart).trim()}\n`;
const generated = [
  [new URL("index.md", publicRoot), homepageMarkdown],
  [new URL("llms-full.txt", publicRoot), readme],
];

await mkdir(fileURLToPath(publicRoot), { recursive: true });
await Promise.all(
  generated.map(([url, content]) => writeFile(fileURLToPath(url), content, "utf8")),
);

console.log(`Generated ${generated.length} agent-readable files in ${fileURLToPath(siteRoot)}public`);
