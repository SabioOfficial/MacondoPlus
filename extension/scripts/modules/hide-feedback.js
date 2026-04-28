if (window.MacondoPlus?.isEnabled("hide-feedback")) {
  const style = document.createElement("style");
  style.textContent = ".nps-trigger {display: none !important;}";
  (document.head || document.documentElement).appendChild(style);
}