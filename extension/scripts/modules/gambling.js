(() => {
  if (!window.MacondoPlus?.isEnabled("gambling")) return;

  const SKIP_IDS = new Set(["__nuxt"]);
  const SKIP_CLASSES = ["div.fixed.inset-0.overflow-hidden.bg-parchment"];

  function shouldSkip(el) {
    if (SKIP_IDS.has(el.id)) return true;
    if (SKIP_CLASSES.some(c => el.classList.contains(c))) return true;
    if (el.closest(".macondoplus-manager-panel, .macondoplus-ad")) return true;
    return false;
  }

  function gambling(root) {
    const divs = Array.from(root.querySelectorAll("div"));
    for (const div of divs) {
      if (shouldSkip(div) || !div.isConnected) continue;
      if (Math.random() < 0.1) div.remove();
    }
  }

  function init() {
    gambling(document.body);
    new MutationObserver(mutations => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "DIV") {
            if (!shouldSkip(node) && Math.random() < 0.1) node.remove();
          }
        });
      }
    }).observe(document.body, {childList: true, subtree: true});
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();