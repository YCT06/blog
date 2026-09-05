(() => {
  const mount = document.querySelector("[data-giscus]");
  if (!mount) return;

  const theme = () =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light";

  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.dataset.repo = mount.dataset.repo;
  script.dataset.repoId = mount.dataset.repoId;
  script.dataset.category = mount.dataset.category;
  script.dataset.categoryId = mount.dataset.categoryId;
  script.dataset.mapping = "pathname";
  script.dataset.strict = "1";
  script.dataset.reactionsEnabled = "1";
  script.dataset.emitMetadata = "0";
  script.dataset.inputPosition = "bottom";
  script.dataset.theme = theme();
  script.dataset.lang = "zh-TW";
  script.crossOrigin = "anonymous";
  script.async = true;
  mount.append(script);

  const sendTheme = () => {
    const frame = document.querySelector("iframe.giscus-frame");
    if (!frame) return;
    frame.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: theme() } } },
      "https://giscus.app",
    );
  };

  document.addEventListener("click", (event) => {
    if (
      !(event.target instanceof Element) ||
      !event.target.closest("[data-theme-toggle]")
    )
      return;
    sendTheme();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== "blog-theme" && event.key !== null) return;
    sendTheme();
  });
})();
