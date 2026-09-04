import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const home = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
test("footer preserves two explicit pending contacts without RSS or theme controls", () => {
  const footer = home.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
  assert.ok(footer);
  assert.match(footer, /GitHub（尚未設定）/);
  assert.match(footer, /Email（尚未設定）/);
  assert.equal((footer.match(/aria-disabled="true"/g) || []).length, 2);
  assert.doesNotMatch(footer, /RSS|data-theme-system|href="#"/i);
  assert.doesNotMatch(footer, /<small\b|title=/);
});
test("theme is one icon-only button with no menu or system control", () => {
  const button = home.match(/<button\b[^>]*data-theme-toggle[\s\S]*?<\/button>/)?.[0];
  assert.ok(button);
  assert.doesNotMatch(button, /<small\b|title=/);
  assert.doesNotMatch(home, /data-theme-menu|data-theme-system|theme-options/);
});
