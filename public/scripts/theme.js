// Apply the saved light/dark choice before the body is painted. Default: light.
(() => {
  const key = "blog-theme";
  const root = document.documentElement;
  let theme = "light";
  try {
    if (localStorage.getItem(key) === "dark") theme = "dark";
  } catch { /* Controls still work when storage is unavailable. */ }
  const render = () => {
    root.dataset.theme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.hidden = false;
      button.setAttribute("aria-label", theme === "dark" ? "切換為明亮主題" : "切換為深色主題");
    });
    document.querySelectorAll("[data-theme-status]").forEach((status) => {
      status.textContent = "目前主題：" + (theme === "dark" ? "深色" : "明亮");
    });
  };
  render();
  document.addEventListener("DOMContentLoaded", render, { once: true });
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || !event.target.closest("[data-theme-toggle]")) return;
    theme = theme === "dark" ? "light" : "dark";
    try { localStorage.setItem(key, theme); } catch { /* Keep this page usable. */ }
    render();
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== key && event.key !== null) return;
    theme = event.newValue === "dark" ? "dark" : "light";
    render();
  });
})();
