if (window.MacondoPlus?.isEnabled("persistent-filters")) {
  const SELECTORS = [
    "select:nth-of-type(1)",
    "select:nth-of-type(2)",
    "select:nth-of-type(3)",
    "select:nth-of-type(4)",
    "select:nth-of-type(5)",
  ];

  function getContainer() {
    return document.querySelector(".flex.flex-wrap.items-center.gap-2");
  }

  function projectsLoaded() {
    return !!document.querySelector("[data-card-id]");
  }

  function triggerReactChange(el, value) {
    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set;
    nativeSetter.call(el, value);
    el.dispatchEvent(new Event("change", {bubbles: true}));
  }

  function saveFilters() {
    const container = getContainer();
    if (!container) return;
    const values = SELECTORS.map(sel => container.querySelector(sel)?.value ?? "");
    localStorage.setItem("macondoplus_explore_filters", JSON.stringify(values));
  }

  function restoreFilters() {
    const container = getContainer();
    if (!container) return;
    let values;
    try {
      values = JSON.parse(localStorage.getItem("macondoplus_explore_filters") ?? "[]");
    } catch {
      return;
    }
    if (!values.length) return;
    SELECTORS.forEach((sel, i) => {
      const el = container.querySelector(sel);
      if (!el || values[i] === undefined) return;
      const exists = [...el.options].some(o => o.value === values[i]);
      if (!exists) return;
      triggerReactChange(el, values[i]);
    });
  }

  function attach() {
    const container = getContainer();
    if (!container || container.dataset.mpfAttached) return;
    container.dataset.mpfAttached = "1";
    container.querySelectorAll("select").forEach(sel => {
      sel.addEventListener("change", saveFilters);
    });
    if (projectsLoaded()) {
      restoreFilters();
    } else {
      const restoreObserver = new MutationObserver(() => {
        if (projectsLoaded()) {
          restoreObserver.disconnect();
          restoreFilters();
        }
      });
      restoreObserver.observe(document.body, {childList: true, subtree: true});
    }
  }

  function init() {
    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, {childList: true, subtree: true});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}