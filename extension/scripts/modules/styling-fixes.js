function init() {
  const style = document.createElement("style");
  (document.head || document.documentElement).appendChild(style);
  style.textContent = `
    div.px-4.py-2.text-center.text-sm.font-bold.text-ds-success {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
  `;
}

if (window.MacondoPlus?.isEnabled("styling-fixes")) {
  document.addEventListener("DOMContentLoaded", () => {
    init();
    const observer = new MutationObserver(init);
    observer.observe(document.body, {childList: true, subtree: true});
  });
}