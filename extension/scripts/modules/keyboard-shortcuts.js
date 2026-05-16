(() => {
  if (!window.MacondoPlus?.isEnabled("keyboard-shortcuts")) return;

  let suppressEscapeRedispatch = false;

  document.addEventListener("keydown", (e) => {
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (suppressEscapeRedispatch && e.key === "Escape") return;

    switch (e.key) {
      case "Escape": {
        const backBtn = [...document.querySelectorAll("button, a")].find(el =>
          el.textContent.includes("Back to farm") || el.textContent.includes("Back")
        );
        if (backBtn) {
          backBtn.click();
        } else {
          suppressEscapeRedispatch = true;
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
          suppressEscapeRedispatch = false;
        }
        break;
      }
      case "e":
      case "E": {
        document.querySelector(".donkey-area")?.click();
        break;
      }
      case "r":
      case "R": {
        document.querySelector(".house-area")?.click();
        break;
      }
      case "q":
      case "Q": {
        document.querySelector(".explore-area")?.click();
        break;
      }
    }

    if (e.key >= "1" && e.key <= "9") {
      const tiles = document.querySelectorAll("#projects .farm-tile-project");
      const index = parseInt(e.key) - 1;
      if (tiles[index]) tiles[index].click();
    }
  });
})();