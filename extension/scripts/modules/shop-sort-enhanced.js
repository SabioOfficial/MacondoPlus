(() => {
  if (!window.MacondoPlus?.isEnabled("shop-sort")) return;

  function getGrid() {
    const card = document.querySelector("[data-flip-id]:not([data-flip-id^='auto-'])");
    return card ? card.parentElement : null;
  }

  function getCards(grid) {
    return [...grid.querySelectorAll("[data-flip-id]")].filter((c) => !c.dataset.flipId.startsWith("auto-"));
  }

  function cardName(card) {
    return card.querySelector("h3")?.textContent?.trim() ?? "";
  }

  function cardGold(card) {
    const priceSpan = card.querySelector("span.flex.items-center.gap-1.text-lg.font-bold");
    if (priceSpan) {
      const num = parseInt(
        [...priceSpan.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent.trim())
          .join("")
          .replace(/[^\d]/g, ""),
        10
      );
      if (!isNaN(num)) return num;
    }
    return Infinity;
  }

  function cardIsLimitReached(card) {
    return [...card.querySelectorAll("div")].some((d) => d.classList.contains("absolute") && d.textContent.trim() === "Limit reached");
  }

  function cardIsStarfruitLocked(card) {
    const btn = card.querySelector("button[disabled]");
    return btn ? !!btn.querySelector("img[src*='starfruit']") : false;
  }

  function getUserGold() {
    const goldImg = document.querySelector("img[alt='Gold']");
    if (!goldImg) return 0;
    const span = goldImg.closest("div")?.querySelector("span.text-2xl");
    if (!span) return 0;
    const num = parseInt(span.textContent.replace(/[^\d]/g, ""), 10);
    return isNaN(num) ? 0 : num;
  }

  let currentMpSort = null;

  function applyMpSort(grid) {
    const cards = getCards(grid);

    if (!currentMpSort) {
      cards.forEach((c) => c.style.removeProperty("order"));
      return;
    }

    const sorted = [...cards].sort((a, b) => {
      switch (currentMpSort) {
        case "mp_az": return cardName(a).localeCompare(cardName(b));
        case "mp_za": return cardName(b).localeCompare(cardName(a));
        default: return 0;
      }
    });

    sorted.forEach((card, i) => {card.style.order = i;});
  }

  const toggleState = {
    affordable: false,
    unlocked: false
  };

  function applyToggles(cards) {
    const userGold = toggleState.affordable ? getUserGold() : null;
    cards.forEach((card) => {
      let hidden = false;
      if (toggleState.affordable && cardGold(card) > userGold) hidden = true;
      if (toggleState.unlocked && (cardIsLimitReached(card) || cardIsStarfruitLocked(card))) hidden = true;
      card.classList.toggle("mp-toggle-hidden", hidden);
    });
  }

  const MP_OPTIONS = [
    {value: "mp_az", label: "Name: A to Z"},
    {value: "mp_za", label: "Name: Z to A"},
  ];

  function injectOptions(select) {
    if (select.dataset.mpSortInjected) return;
    select.dataset.mpSortInjected = "1";

    const divider = document.createElement("option");
    divider.disabled = true;
    divider.textContent = "—— Macondo+ ——"; // NO BEFORE YOU ACCUSE ME WITH VIBE CODING THE EM DASH IS JUST BECAUSE ITS THE LONGEST DASH
    divider.style.color = "#9ca3af";
    select.appendChild(divider);

    MP_OPTIONS.forEach(({value, label}) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      select.appendChild(opt);
    });

    select.addEventListener("change", (e) => {
      if (select.value.startsWith("mp_")) {
        e.stopImmediatePropagation();
        currentMpSort = select.value;
      } else {
        currentMpSort = null;
      }
      needsApply = true;
      tick();
    }, true);
  }

  function findSortSelect() {
    for (const s of document.querySelectorAll("select.ds-input")) {
      if ([...s.options].some((o) => o.value === "featured")) return s;
    }
    return null;
  }

  const TOGGLES = [
    {key: "affordable", label: "Affordable"},
    {key: "unlocked", label: "Unlocked Only"},
  ];

  function renderToggleBar(grid) {
    if (document.querySelector(".mp-toggle-bar")) return;

    const bar = document.createElement("div");
    bar.className = "mp-toggle-bar";
    bar.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    `;

    const label = document.createElement("span");
    label.textContent = "Show:";
    label.style.cssText = `
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--color-ds-brown, #5c3d1e);
      opacity: 0.6;
    `;
    bar.appendChild(label);

    TOGGLES.forEach(({key, label: toggleLabel}) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = toggleLabel;

      function paint(active) {
        btn.style.cssText = `
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 4px;
          border: 2px solid var(--color-ds-brown, #5c3d1e);
          background: ${active ? "var(--color-ds-brown, #5c3d1e)" : "transparent"};
          color: ${active ? "var(--color-parchment, #f5e6c8)" : "var(--color-ds-brown, #5c3d1e)"};
          cursor: pointer;
          transition: all 150ms;
        `;
      }

      paint(toggleState[key]);
      
      btn.addEventListener("click", () => {
        toggleState[key] = !toggleState[key];
        paint(toggleState[key]);
        const grid = getGrid();
        if (grid) applyToggles(getCards(grid));
      });

      bar.appendChild(btn);
    });

    const anchor = document.querySelector(".mp-cat-filterbar") ?? grid;
    anchor.parentElement.insertBefore(bar, anchor);
  }

  let lastGrid = null;
  let lastCardCount = 0;
  let needsApply = false;
  let tickTimeout = null;

  function applyAll(grid) {
    applyMpSort(grid);
    applyToggles(getCards(grid));
  }

  function tick() {
    const select = findSortSelect();
    if (select) injectOptions(select);

    const grid = getGrid();
    if (!grid) return;

    renderToggleBar(grid);
    
    const cardCount = getCards(grid).length;
    if (grid !== lastGrid || cardCount !== lastCardCount || needsApply) {
      lastGrid = grid;
      lastCardCount = cardCount;
      needsApply = false;
      applyAll(grid);
    }
  }

  const observer = new MutationObserver(() => {
    clearTimeout(tickTimeout);
    tickTimeout = setTimeout(tick, 60);
  });

  function init() {
    const style = document.createElement("style");
    style.textContent = ".mp-toggle-hidden {display: none !important;}";
    document.head.appendChild(style);

    tick();
    observer.observe(document.body, {childList: true, subtree: true});
  }

  if (document.head) init();
  else document.addEventListener("DOMContentLoaded", init);
})();