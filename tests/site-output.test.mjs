import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative, sep } from "node:path";
import { test } from "node:test";

const dist = resolve("dist");
assert.ok(existsSync(dist), "Run npm run build before these tests.");
const pages = readdirSync(dist, { recursive: true }).filter((file) =>
  file.endsWith(".html"),
);

function outputPath(pathname) {
  const file = join(dist, decodeURIComponent(pathname));
  return existsSync(file) && statSync(file).isDirectory()
    ? join(file, "index.html")
    : file;
}

for (const page of pages) {
  const html = readFileSync(join(dist, page), "utf8");
  const route =
    "/" +
    page
      .split(sep)
      .join("/")
      .replace(/index\.html$/, "");

  test(route + " has a main landmark, one h1 and an early theme script", () => {
    assert.equal((html.match(/<main\b/g) ?? []).length, 1);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.match(html, /id="main-content"/);
    const script =
      html.match(/<script\b[^>]*src="\/scripts\/theme\.js"[^>]*>/g) ?? [];
    assert.equal(script.length, 1);
    assert.doesNotMatch(script[0], /\b(?:async|defer|type)=/);
    assert.ok(html.indexOf(script[0]) < html.indexOf("</head>"));
    assert.doesNotMatch(html, /[?&]view=/);
  });

  test(route + " has valid local navigation and asset targets", () => {
    const origin = new URL(route, "https://blog.test");
    for (const match of html.matchAll(
      /<(?:a|link|script|img)\b[^>]*?\b(?:href|src)="([^"]+)"/g,
    )) {
      const value = match[1].replaceAll("&amp;", "&");
      const url = new URL(value, origin);
      if (url.origin !== origin.origin) continue;
      const file = outputPath(url.pathname);
      assert.ok(
        !relative(dist, file).startsWith(".."),
        "Target must remain in dist",
      );
      assert.ok(existsSync(file), route + " has missing target " + value);
      if (url.hash && file.endsWith(".html")) {
        const target = readFileSync(file, "utf8");
        const id = decodeURIComponent(url.hash.slice(1));
        assert.ok(
          target.includes('id="' + id + '"'),
          route + " has missing anchor " + value,
        );
      }
    }
  });
}

test("temporary UI verification articles do not ship", () => {
  assert.ok(!existsSync(join(dist, "articles/phase3-ui-check/index.html")));
});

test("article code contains both Shiki palettes", () => {
  const articlePages = pages.filter((page) =>
    page.startsWith("articles" + sep),
  );
  const codePages = articlePages
    .map((page) => readFileSync(join(dist, page), "utf8"))
    .filter((html) => html.includes('class="astro-code'));
  for (const html of codePages) assert.match(html, /--shiki-dark/);
});
