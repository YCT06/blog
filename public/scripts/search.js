(() => {
  let query = new URLSearchParams(location.search).get("q");
  query = query ? query.trim() : "";

  const titleEl = document.querySelector("[data-query-title]");
  const statusEl = document.querySelector("[data-search-status]");
  const headerInput = document.querySelector(".search input");
  const promptEl = document.querySelector("[data-search-prompt]");
  const resultsEl = document.querySelector("[data-search-results]");
  const emptyEl = document.querySelector("[data-search-empty]");
  const errorEl = document.querySelector("[data-search-error]");

  if (query && titleEl) titleEl.textContent = "「" + query + "」的搜尋結果";
  if (query && headerInput) headerInput.value = query;

  const show = (section) => {
    [promptEl, resultsEl, emptyEl, errorEl].forEach((el) => {
      if (el) el.hidden = el !== section;
    });
  };

  const renderResults = (results) => {
    if (!resultsEl) return;
    resultsEl.replaceChildren();
    results.forEach((result) => {
      const meta = result.meta || {};
      const item = document.createElement("li");

      const time = document.createElement("time");
      time.textContent = meta.date || "";

      const content = document.createElement("div");

      const h3 = document.createElement("h3");
      const link = document.createElement("a");
      link.className = "title";
      link.href = result.url;
      link.textContent = meta.title || result.url;
      h3.append(link);

      const metaRow = document.createElement("p");
      metaRow.className = "meta-row";
      if (meta.category) {
        const categoryEl = document.createElement(
          meta.categoryHref ? "a" : "span",
        );
        if (meta.categoryHref) categoryEl.href = meta.categoryHref;
        categoryEl.className = "category";
        categoryEl.textContent = meta.category;
        metaRow.append(categoryEl);
      }
      (meta.tags ? meta.tags.split("、") : []).forEach((tag) => {
        const tagEl = document.createElement("span");
        tagEl.className = "tag";
        tagEl.textContent = "#" + tag;
        metaRow.append(tagEl);
      });

      const excerpt = document.createElement("p");
      excerpt.className = "excerpt";
      excerpt.textContent = result.plain_excerpt || meta.description || "";

      content.append(h3, metaRow, excerpt);

      const arrow = document.createElement("b");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";

      item.append(time, content, arrow);
      resultsEl.append(item);
    });
  };

  const runSearch = async () => {
    if (!query) {
      show(promptEl);
      return;
    }

    if (statusEl) statusEl.textContent = "搜尋中…";
    show(null);

    try {
      const pagefind = await import("/pagefind/pagefind.js");
      await pagefind.init();
      const search = await pagefind.search(query);
      const results = await Promise.all(
        search.results.map((result) => result.data()),
      );

      if (statusEl)
        statusEl.textContent = results.length
          ? "共找到 " + results.length + " 篇文章"
          : "";

      if (results.length === 0) {
        show(emptyEl);
        return;
      }

      renderResults(results);
      show(resultsEl);
    } catch (error) {
      console.error("Pagefind search failed", error);
      if (statusEl) statusEl.textContent = "";
      show(errorEl);
    }
  };

  runSearch();
})();
