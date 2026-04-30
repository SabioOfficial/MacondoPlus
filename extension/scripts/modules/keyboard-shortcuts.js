document.addEventListener("keydown", (e) => {
  if (!window.MacondoPlus?.isEnabled("keyboard-shortcuts")) return;
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  switch (e.key) {
    case "Escape": {
      const backBtn = [...document.querySelectorAll("button, a")].find(el => el.textContent.includes("Back to farm"));
      if (backBtn) {
        backBtn.click();
      } else {
        document.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true}));
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
    case "/": {
      e.preventDefault();
      document.querySelector(".macondoplus-search-btn")?.click();
      break;
    }
  }

  if (e.key >= "1" && e.key <= "9") {
    const tiles = document.querySelectorAll("#projects .farm-tile-project");
    const index = parseInt(e.key) - 1;
    if (tiles[index]) tiles[index].click();
  }
});