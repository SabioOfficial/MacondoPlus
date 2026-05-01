if (window.MacondoPlus?.isEnabled("hide-idea-generator")) {
  const style = document.createElement("style");
  style.textContent = "button[aria-label='Idea Box'] {display: none !important;}";
  (document.head || document.documentElement).appendChild(style);
}