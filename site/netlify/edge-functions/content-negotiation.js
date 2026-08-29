const REPRESENTATIONS = [
  { name: "html", type: "text/html", serverPriority: 1 },
  { name: "markdown", type: "text/markdown", serverPriority: 0 },
];

const MARKDOWN_ROUTES = new Map([
  ["/", "/index.md"],
  ["/index.html", "/index.md"],
  ["/example", "/example/index.md"],
  ["/example/index.html", "/example/index.md"],
  ["/approach", "/approach/index.md"],
  ["/approach/index.html", "/approach/index.md"],
  ["/tutorials", "/tutorials/index.md"],
  ["/tutorials/index.html", "/tutorials/index.md"],
  ["/app", "/app/index.md"],
  ["/app/index.html", "/app/index.md"],
  ["/developers", "/developers/index.md"],
  ["/developers/index.html", "/developers/index.md"],
]);

export const NOT_FOUND_MARKDOWN = `# Clarity page not found

The requested path does not exist.

- [Clarity home](https://clarity.addy.ie/)
- [Approach, example, and evals](https://clarity.addy.ie/approach/)
- [Tutorials](https://clarity.addy.ie/tutorials/)
- [Agent index](https://clarity.addy.ie/llms.txt)
- [Sitemap](https://clarity.addy.ie/sitemap-index.xml)
- [Developer resources](https://clarity.addy.ie/developers/)
- [Browser editor](https://clarity.addy.ie/app/)
`;

function parseQuality(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(1, Math.max(0, number));
}

export function parseAccept(acceptHeader) {
  if (!acceptHeader?.trim()) {
    return [{ type: "*", subtype: "*", q: 1, index: 0 }];
  }

  return acceptHeader
    .split(",")
    .map((part, index) => {
      const [mediaRange, ...parameters] = part.split(";").map((value) => value.trim());
      const [type = "", subtype = ""] = mediaRange.toLowerCase().split("/");
      let q = 1;
      for (const parameter of parameters) {
        const [name, value] = parameter.split("=").map((item) => item.trim());
        if (name?.toLowerCase() === "q") q = parseQuality(value);
      }
      return { type, subtype, q, index };
    })
    .filter((range) => range.type && range.subtype);
}

function matchOffer(offer, ranges) {
  const [offerType, offerSubtype] = offer.type.split("/");
  const matches = ranges
    .map((range) => {
      const typeMatches = range.type === "*" || range.type === offerType;
      const subtypeMatches = range.subtype === "*" || range.subtype === offerSubtype;
      if (!typeMatches || !subtypeMatches) return null;
      const specificity = range.type === "*" ? 0 : range.subtype === "*" ? 1 : 2;
      return { ...range, specificity };
    })
    .filter(Boolean)
    .sort((a, b) => b.specificity - a.specificity || a.index - b.index);

  const best = matches[0];
  return best
    ? { q: best.q, specificity: best.specificity, index: best.index }
    : { q: 0, specificity: -1, index: Number.MAX_SAFE_INTEGER };
}

export function negotiateRepresentation(acceptHeader) {
  const ranges = parseAccept(acceptHeader);
  const ranked = REPRESENTATIONS.map((offer) => ({
    ...offer,
    ...matchOffer(offer, ranges),
  }))
    .filter((offer) => offer.q > 0)
    .sort(
      (a, b) =>
        b.q - a.q ||
        b.specificity - a.specificity ||
        a.index - b.index ||
        b.serverPriority - a.serverPriority,
    );
  return ranked[0]?.name ?? null;
}

export function mergeVary(current, value) {
  const fields = new Map();
  for (const field of `${current ?? ""},${value}`.split(",")) {
    const trimmed = field.trim();
    if (trimmed) fields.set(trimmed.toLowerCase(), trimmed);
  }
  return [...fields.values()].join(", ");
}

function normalizeDocumentPath(pathname) {
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
}

function isDocumentPath(pathname) {
  const finalSegment = pathname.split("/").filter(Boolean).at(-1) ?? "";
  return !finalSegment.includes(".") || finalSegment.endsWith(".html");
}

function alternateLink(markdownPath) {
  return `<${markdownPath}>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"`;
}

function responseWithHeaders(response, { contentType, markdownPath } = {}) {
  const headers = new Headers(response.headers);
  headers.set("Vary", mergeVary(headers.get("Vary"), "Accept"));
  if (contentType) headers.set("Content-Type", contentType);
  if (markdownPath) headers.set("Link", alternateLink(markdownPath));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function directResponse(request, body, status, contentType) {
  return new Response(request.method === "HEAD" ? null : body, {
    status,
    headers: {
      "Content-Type": contentType,
      "Vary": "Accept",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export default async function contentNegotiation(request, context) {
  if (!['GET', 'HEAD'].includes(request.method)) return;

  const url = new URL(request.url);
  if (!isDocumentPath(url.pathname)) return;

  const documentPath = normalizeDocumentPath(url.pathname);
  const markdownPath = MARKDOWN_ROUTES.get(documentPath);

  if (!markdownPath) {
    const originResponse = await context.next();
    if (originResponse.status !== 404) return originResponse;
    const representation = negotiateRepresentation(request.headers.get("Accept"));
    if (representation === "markdown") {
      return directResponse(request, NOT_FOUND_MARKDOWN, 404, "text/markdown; charset=utf-8");
    }
    return responseWithHeaders(originResponse);
  }

  const representation = negotiateRepresentation(request.headers.get("Accept"));
  if (!representation) {
    return directResponse(
      request,
      "Not Acceptable\n\nAvailable: text/html, text/markdown\n",
      406,
      "text/plain; charset=utf-8",
    );
  }

  if (representation === "markdown") {
    const markdownUrl = new URL(markdownPath, request.url);
    const markdownRequest = new Request(markdownUrl, request);
    const markdownResponse = await context.next(markdownRequest);
    return responseWithHeaders(markdownResponse, {
      contentType: "text/markdown; charset=utf-8",
      markdownPath,
    });
  }

  const htmlResponse = await context.next();
  return responseWithHeaders(htmlResponse, { markdownPath });
}

export const config = {
  path: "/*",
  excludedPath: ["/_astro/*"],
};
