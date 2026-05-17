(() => {
  if (!window.MacondoPlus?.isEnabled("deforestation")) return;
  const style = document.createElement("style");
  style.textContent = ".palma {display: none !important;}";
  (document.head || document.documentElement).appendChild(style);
})();