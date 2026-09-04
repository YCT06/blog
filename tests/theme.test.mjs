import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const source = readFileSync(
  new URL("../public/scripts/theme.js", import.meta.url),
  "utf8",
);

function setup({ saved = null, dark = false, blocked = false } = {}) {
  const listeners = {};
  const root = { dataset: {} };
  const control = () => ({
    hidden: true,
    attributes: {},
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
  });
  const toggle = control();
  const systemButton = control();
  const status = { textContent: "" };
  const stored = new Map(saved === null ? [] : [["blog-theme", saved]]);
  const media = {
    matches: dark,
    addEventListener(_, handler) {
      listeners.media = handler;
    },
  };
  class Element {
    constructor(selector) {
      this.selector = selector;
    }
    closest(selector) {
      return this.selector === selector ? this : null;
    }
  }
  runInNewContext(source, {
    Element,
    document: {
      documentElement: root,
      querySelectorAll(selector) {
        return selector === "[data-theme-toggle]"
          ? [toggle]
          : selector === "[data-theme-system]"
            ? [systemButton]
            : [status];
      },
      addEventListener(name, handler) {
        listeners[name] = handler;
      },
    },
    window: {
      matchMedia() {
        return media;
      },
      addEventListener(name, handler) {
        listeners[name] = handler;
      },
    },
    localStorage: {
      getItem(key) {
        if (blocked) throw new Error("Storage denied");
        return stored.get(key) ?? null;
      },
      setItem(key, value) {
        if (blocked) throw new Error("Storage denied");
        stored.set(key, value);
      },
      removeItem(key) {
        if (blocked) throw new Error("Storage denied");
        stored.delete(key);
      },
    },
  });
  return {
    root,
    toggle,
    systemButton,
    status,
    stored,
    ready() {
      listeners.DOMContentLoaded();
    },
    click(selector) {
      listeners.click({ target: new Element(selector) });
    },
    system(dark) {
      media.matches = dark;
      listeners.media?.();
    },
    storage(newValue, key = "blog-theme") {
      listeners.storage({ key, newValue });
    },
  };
}

test("default light theme is applied immediately and ignores system changes", () => {
  const app = setup({ dark: true });
  assert.equal(app.root.dataset.theme, "light");
  app.system(false);
  assert.equal(app.root.dataset.theme, "light");
  app.ready();
  assert.equal(app.toggle.hidden, false);
  assert.equal(app.systemButton.hidden, true);
});

test("an explicit preference overrides the system and survives the next page", () => {
  const app = setup({ saved: "light", dark: true });
  assert.equal(app.root.dataset.theme, "light");
  app.system(true);
  assert.equal(app.root.dataset.theme, "light");
  app.click("[data-theme-toggle]");
  assert.equal(app.stored.get("blog-theme"), "dark");
  assert.equal(app.root.dataset.theme, "dark");
  const nextPage = setup({ saved: app.stored.get("blog-theme"), dark: false });
  assert.equal(nextPage.root.dataset.theme, "dark");
});

test("removed system control cannot change the theme", () => {
  const app = setup({ saved: "light", dark: true });
  app.click("[data-theme-system]");
  assert.equal(app.stored.get("blog-theme"), "light");
  assert.equal(app.root.dataset.theme, "light");
  assert.equal(app.systemButton.hidden, true);
  app.system(false);
  assert.equal(app.root.dataset.theme, "light");
});

test("blocked storage does not break initialization or controls", () => {
  const app = setup({ blocked: true, dark: true });
  app.click("[data-theme-toggle]");
  assert.equal(app.root.dataset.theme, "dark");
  assert.equal(app.toggle.attributes["aria-label"], "切換為明亮主題");
  app.click("[data-theme-toggle]");
  assert.equal(app.root.dataset.theme, "light");
});

test("invalid stored values fall back to light", () => {
  const app = setup({ saved: "unexpected", dark: false });
  assert.equal(app.root.dataset.theme, "light");
});

test("cross-tab changes synchronize without reacting to unrelated storage", () => {
  const app = setup({ dark: false });
  app.storage("dark");
  assert.equal(app.root.dataset.theme, "dark");
  app.storage("light", "unrelated");
  assert.equal(app.root.dataset.theme, "dark");
  app.storage(null, null);
  assert.equal(app.root.dataset.theme, "light");
});
