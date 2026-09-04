// Progressive enhancement: Markdown remains readable without JavaScript.
const tocLinks = [...document.querySelectorAll<HTMLAnchorElement>(".toc a")];
const sections = tocLinks.flatMap((link) => {
  const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
  return heading ? [{ link, heading }] : [];
});
if (sections.length) {
  let pending = false;
  const updateReadingPosition = () => {
    pending = false;
    let current = sections[0];
    for (const section of sections) {
      if (section.heading.getBoundingClientRect().top <= 120) current = section;
    }
    for (const section of sections) {
      if (section === current) section.link.setAttribute("aria-current", "location");
      else section.link.removeAttribute("aria-current");
    }
  };
  const schedule = () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(updateReadingPosition);
    }
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule, { once: true });
  updateReadingPosition();
}
document.querySelectorAll<HTMLElement>(".prose pre").forEach((pre, index) => {
  const code = pre.querySelector("code");
  if (!code || pre.parentElement?.classList.contains("code-block")) return;
  const block = document.createElement("div");
  block.className = "code-block";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-code";
  button.textContent = "複製";
  button.setAttribute("aria-label", `複製第 ${index + 1} 段程式碼`);
  const status = document.createElement("p");
  status.className = "copy-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  pre.before(block);
  block.append(pre, button, status);
  pre.tabIndex = 0;
  pre.setAttribute("aria-label", `第 ${index + 1} 段程式碼，可水平捲動`);
  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(code.textContent ?? "");
      status.textContent = "已複製程式碼。";
    } catch {
      status.textContent = "無法存取剪貼簿，請手動選取並複製程式碼。";
    } finally {
      button.disabled = false;
    }
  });
});
document.querySelectorAll<HTMLTableElement>(".prose table").forEach((table) => {
  table.tabIndex = 0;
  table.setAttribute(
    "aria-label",
    table.caption?.textContent || "文章表格，可水平捲動",
  );
});
