(() => {
  if (!window.MacondoPlus?.isEnabled("traditionalist")) return;
  const style = document.createElement("style");
  style.textContent = "div.farm-tile-iso.farm-tile-add {display: none !important;}";
  (document.head || document.documentElement).appendChild(style);
})();