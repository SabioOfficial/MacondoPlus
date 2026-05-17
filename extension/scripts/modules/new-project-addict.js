(() => {
  if (!window.MacondoPlus?.isEnabled("new-project-addict")) return;
  const style = document.createElement("style");
  style.textContent = `
    div.farm-tile-iso.farm-tile-project,
    div.donkey-area,
    div.house-area,
    div.explore-area {
      display: none !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
})();