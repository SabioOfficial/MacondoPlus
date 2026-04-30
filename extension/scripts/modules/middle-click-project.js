const projectUrlCache = new Map();

function tryBuildCache() {
  try {
    const raw = JSON.parse(document.getElementById("__NUXT_DATA__")?.textContent || "[]");
    const flat = raw.flat(Infinity);
    const projects = flat.filter(v => v && typeof v === "object" && typeof v.id === "number" && typeof v.name === "string" && v.fruit);
    const tiles = [...document.querySelectorAll("#projects .farm-title-project")];
    if (projects.length === tiles.length && projects.length > 0) {
      tiles.forEach((tile, i) => projectUrlCache.set(tile, `/projects/${projects[i].id}`));
    }
  } catch (e) {
    console.warn("[Middle Click Project Module] NUXT parse failed: ", e);
  }
}

function syntheticOpen(tile) {
  const observer = new MutationObserver(() => {
    const link = document.querySelector(".modal-frame a[href^='/projects/']");
    if (!link) return;
    observer.disconnect();
    const url = new URL(link.href).pathname;
    projectUrlCache.set(tile, url);
    document.querySelector(".modal-frame button")?.click();
    window.open(url, "_blank");
  });
  observer.observe(document.body, {childList: true, subtree: true});
  setTimeout(() => {observer.disconnect();}, 5000);

  const opts = {bubbles: true, cancelable: true, button: 0};
  tile.dispatchEvent(new PointerEvent("pointerdown", {...opts, pointerId: 1}));
  tile.dispatchEvent(new MouseEvent("mousedown", opts));
  tile.dispatchEvent(new MouseEvent("mouseup", opts));
  tile.dispatchEvent(new MouseEvent("click", opts));
}

function initMiddleClickProject() {
  if (!window.MacondoPlus?.isEnabled("middle-click-project")) return;
  tryBuildCache();
  document.addEventListener("click", (e) => {
    const tile = e.target.closest("#projects .farm-tile-project");
    if (!tile || projectUrlCache.has(tile)) return;
    const observer = new MutationObserver(() => {
      const link = document.querySelector(".modal-frame a[href^='/projects/']");
      if (!link) return;
      observer.disconnect();
      const url = new URL(link.href).pathname;
      projectUrlCache.set(tile, url);
    });
    observer.observe(document.body, {childList: true, subtree: true});
    setTimeout(() => observer.disconnect(), 3000);
  }, true);

  document.addEventListener("pointerdown", (e) => {
    if (e.button !== 1) return;
    const tile = e.target.closest("#projects .farm-tile-project");
    if (!tile) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const cached = projectUrlCache.get(tile);
    if (cached) {
      window.open(cached, "_blank");
      return;
    }
    syntheticOpen(tile);
  }, true);

  const hintObserver = new MutationObserver(() => {
    const hint = document.querySelector(".panel-hint");
    if (hint && !hint.dataset.middleClickInjected) {
      hint.dataset.middleClickInjected = "true";
      hint.innerHTML = "Click to open<br>Middle click to open in a new tab";
    }
  });
  hintObserver.observe(document.body, {childList: true, subtree: true});
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMiddleClickProject);
} else {
  initMiddleClickProject();
}