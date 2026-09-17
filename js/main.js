(() => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  if (toggle && nav) {
    if (!nav.id) nav.id = "primary-navigation";
    toggle.setAttribute("aria-controls", nav.id);
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "開啟主選單" : "關閉主選單");
      nav.classList.toggle("is-open", !open);
      document.body.classList.toggle("menu-open", !open);
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      }
    });
  }

  const currentPage = document.body.dataset.page;
  if (currentPage) {
    document.querySelectorAll(`[data-nav-link="${currentPage}"]`).forEach((link) => {
      link.setAttribute("aria-current", "page");
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const search = document.querySelector("[data-insight-search]");
  const filters = [...document.querySelectorAll("[data-filter]")];
  const cards = [...document.querySelectorAll("[data-insight-card]")];
  const empty = document.querySelector("[data-no-results]");
  const filterStatus = document.querySelector("[data-filter-status]");
  let category = "全部";
  const updateInsights = () => {
    const query = (search?.value || "").trim().toLocaleLowerCase("zh-Hant-TW");
    let count = 0;
    cards.forEach((card) => {
      const searchable = (card.dataset.search || card.textContent).toLocaleLowerCase("zh-Hant-TW");
      const matchesCategory = category === "全部" || card.dataset.category === category;
      const visible = matchesCategory && searchable.includes(query);
      card.hidden = !visible;
      if (visible) count += 1;
    });
    empty?.classList.toggle("is-visible", count === 0);
    if (filterStatus) filterStatus.textContent = `目前顯示 ${count} 篇文章。`;
  };
  search?.addEventListener("input", updateInsights);
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      category = button.dataset.filter || "全部";
      filters.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      updateInsights();
    });
  });

  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) status.textContent = "請先完整填寫必填欄位。";
      return;
    }
    if (status) status.textContent = "內容已整理完成。此靜態網站不會儲存資料，請將訊息複製至您慣用的聯絡管道。";
  });

  const copyContact = document.querySelector("[data-copy-contact]");
  copyContact?.addEventListener("click", async () => {
    if (!form?.checkValidity()) {
      form?.reportValidity();
      if (status) status.textContent = "請先完整填寫必填欄位，再複製訊息。";
      return;
    }
    const value = (name) => form.elements.namedItem(name)?.value?.trim() || "未提供";
    const message = [
      `姓名／稱呼：${value("name")}`,
      `單位／媒體：${value("organization")}`,
      `電子郵件：${value("email")}`,
      `聯絡主題：${value("subject")}`,
      "",
      value("message")
    ].join("\n");
    try {
      await navigator.clipboard.writeText(message);
      if (status) status.textContent = "完整訊息已複製，可貼到電子郵件或其他正式聯絡管道。";
    } catch {
      if (status) status.textContent = "瀏覽器未允許自動複製，請手動選取欄位內容。";
    }
  });

})();
