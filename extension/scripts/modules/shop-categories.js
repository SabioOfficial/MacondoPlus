(() => {
  if (!window.MacondoPlus?.isEnabled("shop-categories")) return;

  const ITEM_CATEGORIES = {
    "event_invite": ["Event"],
    "travel_stipend": ["Event"],
    "streak_freeze": ["Consumable"],

    "10": ["Food"], "18": ["Food"], "19": ["Food"], "20": ["Food"], "21": ["Food"], "23": ["Food"], "26": ["Food"], "27": ["Food"], "28": ["Food"], "29": ["Food"],

    "2": ["Tech"], "4": ["Tech"], "7": ["Tech"], "9": ["Tech"], "13": ["Tech"], "14": ["Tech"], "15": ["Tech"], "16": ["Tech"], "30": ["Tech"], "31": ["Tech"], "36": ["Tech"],
    "42": ["Tech"], "43": ["Tech"], "57": ["Tech", "Grant"], "62": ["Tech"], "64": ["Tech"], "65": ["Tech"],  "66": ["Tech"], "69": ["Tech", "Grant"], "70": ["Tech", "Grant"],
    "72": ["Tech"], "73": ["Tech"], "74": ["Tech"], "75": ["Tech"], "77": ["Tech", "Grant"], "78": ["Tech"], "79": ["Tech"], "81": ["Tech", "Grant"], "82": ["Tech"],
    "83": ["Tech"], "84": ["Tech", "Grant"], "85": ["Tech"], "86": ["Tech"],

    "32": ["Tech", "3D Printing"], "35": ["3D Printing"], "37": ["Tech", "3D Printing"], "58": ["Tech", "3D Printing"], "59": ["Tech", "3D Printing"],

    "34": ["Gaming", "Grant"], "44": ["Gaming", "Grant"], "47": ["Gaming", "Merch"], "51": ["Tech", "Gaming"], "54": ["Tech", "Gaming"], "63": ["Tech", "Gaming"],
    "68": ["Gaming", "Grant"],

    "1": ["Tech", "Apple"], "11": ["Tech", "Apple"], "43": ["Tech", "Apple"], "52": ["Tech", "Apple"], "53": ["Tech", "Apple"], "60": ["Tech", "Apple"],"61": ["Apple", "Grant"],

    "8": ["Grant"], "12": ["Grant"], "45": ["Grant"], "48": ["Tech", "Grant"], "49": ["Tech", "Grant"], "56": ["Grant"], "71": ["Grant"], "76": ["Grant"], "80": ["Grant"],

    "3": ["Merch"], "17": ["Merch"], "33": ["Merch"], "46": ["Merch"], "50": ["Merch"], "55": ["Merch"],
  };

  const COLORS = {
    "Event": {bg: "#dbeafe", border: "#3d82f6", text: "#1d4ed8"},
    "Consumable": {bg: "#f3e8ff", border: "#a855f7", text: "#7e22ce"},
    "Food": {bg: "#dcfce7", border: "#22c55e", text: "#15803d"},
    "Tech": {bg: "#e0f2fe", border: "#0ea5e9", text: "#0369a1"},
    "3D Printing": {bg: "#fff7ed", border: "#f97316", text: "#c2410c"},
    "Gaming": {bg: "#fce7f3", border: "#ec4899", text: "#be185d"},
    "Apple": {bg: "#f1f5f9", border: "#64748b", text: "#334155"},
    "Grant": {bg: "#fefce8", border: "#eab308", text: "#854d0e"},
    "Merch": {bg: "#fdf4ff", border: "#d946ef", text: "#86198f"},
    "Other": {bg: "#f5f5f5", border: "#9ca3af", text: "#374151"},
  };

  function getCategories(flipId) {
    return ITEM_CATEGORIES[flipId] ?? ["Other"];
  }

  function addBadge(card) {
    if (card.querySelector(".mp-cat-badge")) return;
    const cats = getCategories(card.dataset.flipId);

    const wrapper = document.createElement("div");
    wrapper.className = "mp-cat-badge";
    wrapper.style.cssText = `
      position: absolute;
      right: 12px;
      bottom: 110px;
      z-index: 10;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      gap: 3px;
      pointer-events: none;
    `;

    cats.forEach(cat => {
      const c = COLORS[cat] ?? COLORS["Other"];
      const chip = document.createElement("div");
      chip.textContent = cat;
      chip.style.cssText = `
        padding: 2px 7px;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        border-radius: 3px;
        border: 1.5px solid ${c.border};
        background: ${c.bg};
        color: ${c.text};
      `;
      wrapper.appendChild(chip);
    });

    card.appendChild(wrapper);
  }

  let activeFilter = "All";

  function applyFilter(cards) {
    cards.forEach(card => {
      const show = activeFilter === "All" || getCategories(card.dataset.flipId).includes(activeFilter);
      card.style.display = show ? "" : "none";
    });
  }

  function renderFilterBar(grid) {
    if (document.querySelector(".mp-cat-filterbar")) return;

    const cards = [...grid.querySelectorAll("[data-flip-id]")];
    const cats = ["All", ...new Set(cards.flatMap(c => getCategories(c.dataset.flipId)))];

    const bar = document.createElement("div");
    bar.className = "mp-cat-filterbar";
    bar.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;
    `;

    cats.forEach(cat => {
      const c = COLORS[cat] ?? COLORS["Other"];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = cat;
      btn.dataset.mpCat = cat;

      const isAll = cat === "All";
      const activeBg = isAll ? "var(--color-ds-brown, #5c3d1e)" : c.border;
      const activeColor = isAll ? "var(--color-parchment, #f5e6c8)" : "#fff";
      const inactiveBg = isAll ? "transparent" : c.bg;
      const inactiveColor = isAll ? "var(--color-ds-brown, #5c3d1e)" : c.text;
      const borderColor = isAll ? "var(--color-ds-brown, #5c3d1e)" : c.border;

      function paint(active) {
        btn.style.cssText = `
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 4px;
          border: 2px solid ${borderColor};
          background: ${active ? activeBg : inactiveBg};
          color: ${active ? activeColor : inactiveColor};
          cursor: pointer;
          transition: all 150ms;
        `;
      }

      btn._mpPaint = paint;

      paint(cat === activeFilter);
      btn.addEventListener("click", () => {
        activeFilter = cat;
        bar.querySelectorAll("[data-mp-cat]").forEach(b => b._mpPaint(b.dataset.mpCat === activeFilter));
        applyFilter([...grid.querySelectorAll("[data-flip-id]")]);
      });
      bar.appendChild(btn);
    });

    grid.parentElement.insertBefore(bar, grid);
  }

  function processShop() {
    const anyCard = document.querySelector("[data-flip-id]:not([data-flip-id^='auto-'])");
    if (!anyCard) return;
    const grid = anyCard.parentElement;

    const cards = [...grid.querySelectorAll("[data-flip-id]")]
      .filter(c => !c.dataset.flipId.startsWith("auto-"));
    cards.forEach(addBadge);
    renderFilterBar(grid);
    applyFilter(cards);
  }

  const observer = new MutationObserver(processShop);

  function init() {
    processShop();
    observer.observe(document.body, {childList: true, subtree: true});
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();