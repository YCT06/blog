import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

// Frozen design values from the approved prototype. Test the shipped CSS,
// rather than an unused source declaration. Browser geometry is checked too.
const css = readdirSync("dist/_astro")
  .filter((name) => name.endsWith(".css"))
  .map((name) => readFileSync(join("dist/_astro", name), "utf8"))
  .join("\n");
function declaration(selector, property) {
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const rule = rules.find(
    ([, selectors, body]) =>
      selectors.includes(selector) &&
      new RegExp("(?:^|;)" + property + ":").test(body),
  );
  return rule?.[2]
    .match(new RegExp("(?:^|;)" + property + ":([^;}]*)"))?.[1]
    .trim();
}
test("home retains the prototype headline and geometry", () => {
  assert.match(
    readFileSync("dist/index.html", "utf8"),
    /記下學習，也收藏生活。/,
  );
  assert.equal(declaration(".home-intro", "min-height"), "270px");
  assert.equal(declaration(".home-intro", "padding"), "40px 42px");
});
test("cards retain the raised paper surface and rectangular tags", () => {
  assert.equal(declaration(".card[", "background"), "var(--paper-raised)");
  assert.equal(declaration(".labels[", "border-radius"), "3px");
});
test("reader retains the approved column sizes", () => {
  assert.equal(
    declaration(".reading-grid", "grid-template-columns"),
    "180px minmax(0,660px)",
  );
  assert.equal(declaration(".reading-grid", "gap"), "70px");
});
