(() => {
  const root = document.documentElement;
  const key = "bangyin-lang";

  const apply = (lang) => {
    const value = lang === "en" ? "en" : "zh";
    root.dataset.lang = value;
    root.lang = value === "en" ? "en" : "zh-CN";
    document.querySelectorAll("[data-lang-trigger]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.langTrigger === value);
    });
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lang-trigger]");
    if (!button) return;
    const lang = button.dataset.langTrigger === "en" ? "en" : "zh";
    localStorage.setItem(key, lang);
    apply(lang);
  });

  apply(localStorage.getItem(key) || "zh");
})();
