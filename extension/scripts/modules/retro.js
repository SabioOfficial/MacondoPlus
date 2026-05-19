(() => {
  if (!window.MacondoPlus?.isEnabled("retro")) return;

  function removeStylesheets() {
    document.querySelectorAll("link[rel='stylesheet']").forEach(el => el.remove());
    document.head?.querySelectorAll("style").forEach(el => el.remove());
  }

  removeStylesheets();

  new MutationObserver(mutations => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "LINK" && node.rel === "stylesheet") {
          node.remove();
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "STYLE" && node.closest("head")) {
          node.remove();
        }
      });
    }
  }).observe(document.head ?? document.documentElement, {childList: true, subtree: true});
})();