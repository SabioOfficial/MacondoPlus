function getCurrentGold() {
  const spans = document.querySelectorAll(".text-2xl.font-bold.text-ds-brown");
  for (const span of spans) {
    const val = parseInt(span.textContent.trim().replace(/,/g, ""), 10);
    if (!isNaN(val)) return val;
  }
  return 0;
}

function parseShopItems() {
  const items = [];

  document.querySelectorAll("[data-flip-id]").forEach(el => {
    const starBtn = el.querySelector("button[aria-label^='Unstar']");
    if (!starBtn) return;

    const name = el.querySelector("h3")?.textContent.trim() ?? "?";
    const img = el.querySelector(".aspect-\\[4\\/3\\] img")?.src ?? el.querySelector("img[alt]")?.src ?? "";
    const hours = el.querySelector(".text-ds-brown\\/55.font-bold")?.textContent.trim() ?? "";
    const buyBtn = el.querySelector("button.ds-btn-primary");
    const goldMatch = buyBtn?.textContent.match(/\d+/);
    const gold = goldMatch ? parseInt(goldMatch[0], 10) : 0;

    items.push({id: el.dataset.flipId, name, img, gold, hours});
  });

  return items;
}

function isShopVisible() {
  const items = document.querySelectorAll("[data-flip-id]");
  return items.length > 0;
}

function buildWidget() {
  const widget = document.createElement("div");
  widget.id = "macondoplus-goals-widget";
  widget.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 280px;
    z-index: 10000;
    background: var(--color-parchment, #f5e6c8);
    border: 3px solid var(--color-ds-brown, #5c3d1e);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
    font-family: inherit;
    user-select: none;
  `;

  const header = document.createElement("div");
  header.style.cssText = `
    display: flex;
    align-items: center;
    justify-center: space-between;
    padding: 10px 12px 8px;
    border-bottom: 2px solid rgba(92, 61, 30, 0.18);
    cursor: pointer;
  `;

  const chervon = document.createElement("span");
  chervon.textContent = "▲";
  chervon.style.cssText = `
    font-size: 12px;
    color: #5c3d1e;
    transition: transform 0.2s;
    display: inline-block;
  `;

  const leftSlot = document.createElement("div");
  leftSlot.style.cssText = `
    display: flex;
    align-items: center;
    gap: 7px;
  `;
  leftSlot.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star" style="color: #5c3d1e; flex-shrink: 0;">
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
    </svg>
    <span style="font-size: 13px; font-weight: 800; color: #5c3d1e;">Starred Items</span>
  `;

  const countSpan = document.createElement("span");
  countSpan.className = "macondoplus-goals-count";
  countSpan.style.cssText = "font-size: 11px; font-weight: 700; color: rgba(92, 61, 30, 0.5);";

  const rightSlot = document.createElement("div");
  rightSlot.style.cssText = `
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
  `;

  rightSlot.appendChild(countSpan);
  rightSlot.appendChild(chervon);

  header.appendChild(leftSlot);
  header.appendChild(rightSlot);

  const globalSection = document.createElement("div");
  globalSection.style.cssText = `
    padding: 9px 12px;
    border-bottom: 2px solid rgba(92, 61, 30, 0.18);
  `;
  globalSection.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
      <span class="macondoplus-global-label" style="font-size: 11px; font-weight: 700; color: rgba(92, 61, 30, 0.6);">Overall progress</span>
      <div style="display: flex; gap: 0; border: 2px solid var(--color-ds-brown, #5c3d1e); overflow: hidden;">
        <button type="button" class="macondoplus-mode-btn" data-mode="individual" style="font-size: 10px; font-weight: 700; padding: 2px 7px; cursor: pointer; border: none; background: var(--color-ds-brown, #5c3d1e); color: var(--color-parchment, #f5e6c8);">
          Individual
        </button>
        <button type="button" class="macondoplus-mode-btn" data-mode="cumulative" style="font-size: 10px; font-weight: 700; padding: 2px 7px; cursor: pointer; border: none; background: transparent; color: var(--color-ds-brown, #5c3d1e);">
          Cumulative
        </button>
      </div>
    </div>
    <div style="height: 8px; background: rgba(92, 61, 30, 0.12); border-radius: 4px; overflow: hidden; margin-bottom: 4px;">
      <div class="macondoplus-global-bar" style="height: 100%; width: 0%; background: #8f690a; border-radius: 4px; transition: width 0.4s;"></div>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <span class="macondoplus-global-gold" style="font-size: 10px; font-weight: 600; color: rgba(92, 61, 30, 0.55);"></span>
      <span class="macondoplus-global-pct" style="font-size: 10px; font-weight: 700; color: #5c3d1e;"></span>
    </div>
  `;

  const body = document.createElement("div");
  body.style.cssText = "max-height: 300px; overflow-y: auto;";

  let collapsed = false;
  header.addEventListener("click", () => {
    collapsed = !collapsed;
    globalSection.style.display = collapsed ? "none" : "";
    body.style.display = collapsed ? "none" : "";
    chervon.style.transform = collapsed ? "rotate(180deg)" : "";
  });

  widget.appendChild(header);
  widget.appendChild(globalSection);
  widget.appendChild(body);

  return {widget, body, countSpan, globalSection};
}

function makeBar(pct, done) {
  const wrap = document.createElement("div");
  wrap.style.cssText = `
    margin: 4px 0 3px;
    height: 5px;
    background: rgba(92, 61, 30, 0.12);
    border-radius: 3px;
    overflow: hidden;
  `;

  const fill = document.createElement("div");
  fill.style.cssText = `
    height: 100%;
    width: ${Math.min(pct, 100)}%;
    background: ${done ? "#16a34a" : "#8f690a"};
    border-radius: 3px;
    transition: width 0.4s;
  `;

  wrap.appendChild(fill);
  return wrap;
}

function renderItem(item, currentGold, mode) {
  const row = document.createElement("div");
  row.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-bottom: 1px solid rgba(92, 61, 30, 0.1);
  `;

  const thumb = document.createElement("img");
  thumb.src = item.img;
  thumb.alt = item.name;
  thumb.style.cssText = `
    width: 36px;
    height: 36px;
    object-fit: contain;
    flex-shrink: 0;
    border: 2px solid rgba(92, 61, 30, 0.15);
    background: #ecd2ae;
    padding: 2px;
  `;

  const info = document.createElement("div");
  info.style.cssText = `
    flex: 1;
    min-width: 0;
  `;

  const nameEl = document.createElement("div");
  nameEl.title = item.name;
  nameEl.textContent = item.name;
  nameEl.style.cssText = `
    font-size: 12px;
    font-weight: 700;
    color: #5c3d1e;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;

  const pct = item.gold > 0 ? (currentGold / item.gold) * 100 : 100;
  const done = currentGold >= item.gold;
  const bar = makeBar(pct, done);

  const metaEl = document.createElement("div");
  metaEl.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 3px;
  `;

  const leftMeta = document.createElement("span");
  leftMeta.style.cssText = `
    font-size: 10px;
    font-weight: 600;
    color: rgba(92, 61, 30, 0.6);
  `;

  if (done) {
    leftMeta.textContent = "✓ Affordable!";
    leftMeta.style.color = "#16a34a";
  } else if (mode === "cumulative") {
    leftMeta.textContent = `Need ${item.gold - currentGold} more gold`;
  } else {
    leftMeta.textContent = `${item.hours}`;
  }

  const rightMeta = document.createElement("span");
  rightMeta.style.cssText = `
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    font-weight: 700;
    color: #5c3d1e;
    flex-shrink: 0;
  `;

  const goldIcon = document.createElement("img");
  goldIcon.src = "/images/icons/money.webp";
  goldIcon.style.cssText = `
    width: 12px;
    height: 12px;
    object-fit: contain;
  `;

  const goldText = document.createElement("span");
  goldText.textContent = item.gold;

  rightMeta.appendChild(goldIcon);
  rightMeta.appendChild(goldText);

  metaEl.appendChild(leftMeta);
  metaEl.appendChild(rightMeta);

  info.appendChild(nameEl);
  info.appendChild(bar);
  info.appendChild(metaEl);
  row.appendChild(thumb);
  row.appendChild(info);
  return row;
}

function renderEmpty(body) {
  const wrap = document.createElement("div");
  wrap.style.cssText = `
    padding: 16px 14px;
    text-align: center;
  `;
  wrap.innerHTML = `
    <div style="font-size: 28px; margin-bottom: 6px;">⭐</div>
    <div style="font-size: 12px; font-weight: 700; color: #5c3d1e; margin-bottom: 3px;">No starred items</div>
    <div style="font-size: 11px; color: rgba(92, 61, 30, 0.55);">Star items in the shop to track them here.</div>
  `;
  body.appendChild(wrap);
}

let _mode = "individual";
let _refreshPending = false;

function scheduleRefresh(body, countSpan, globalSection) {
  if (_refreshPending) return;
  _refreshPending = true;
  Promise.resolve().then(() => {
    _refreshPending = false;
    doRefresh(body, countSpan, globalSection);
  });
}

function doRefresh(body, countSpan, globalSection) {
  const widget = document.getElementById("macondoplus-goals-widget");
  if (widget) widget.style.display = isShopVisible() ? "" : "none";

  const items = parseShopItems();
  const currentGold = getCurrentGold();

  countSpan.textContent = items.length ? `${items.length} starred` : "";

  const globalBar = globalSection.querySelector(".macondoplus-global-bar");
  const globalGold = globalSection.querySelector(".macondoplus-global-gold");
  const globalPct = globalSection.querySelector(".macondoplus-global-pct");

  if (items.length) {
    let pct, label;
    if (_mode === "cumulative") {
      const total = items.reduce((s, i) => s + i.gold, 0);
      pct = total > 0 ? Math.min((currentGold / total) * 100, 100) : 100;
      label = `${currentGold} / ${total} gold total`;
    } else {
      const avg = items.reduce((s, i) => s + Math.min((currentGold / (i.gold || 1)) * 100, 100), 0) / items.length;
      pct = avg;
      const affordable = items.filter(i => currentGold >= i.gold).length;
      label = `${affordable} / ${items.length} affordable`;
    }
    globalBar.style.width = `${pct.toFixed(1)}%`;
    globalBar.style.background = pct >= 100 ? "#16a34a" : "#8f690a";
    globalGold.textContent = label;
    globalPct.textContent = `${pct.toFixed(1)}%`;
  } else {
    globalBar.style.width = "0%";
    globalGold.textContent = "";
    globalPct.textContent = "";
  }

  while (body.firstChild) body.removeChild(body.firstChild);
  if (!items.length) {
    renderEmpty(body);
    return;
  }
  items.forEach(item => body.appendChild(renderItem(item, currentGold, _mode)));
}

function initShopGoals() {
  if (!window.MacondoPlus?.isEnabled("shop-goals")) return;
  if (!document.querySelector("[data-flip-id]")) return;
  if (document.getElementById("macondoplus-goals-widget")) return;

  const {widget, body, countSpan, globalSection} = buildWidget();
  document.body.appendChild(widget);

  globalSection.querySelectorAll(".macondoplus-mode-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      _mode = btn.dataset.mode;
      globalSection.querySelectorAll(".macondoplus-mode-btn").forEach(b => {
        const active = b.dataset.mode === _mode;
        b.style.background = active ? "var(--color-ds-brown, #5c3d1e)" : "transparent";
        b.style.color = active ? "var(--color-parchment, #f5e6c8)" : "var(--color-ds-brown, #5c3d1e)";
      });
      doRefresh(body, countSpan, globalSection);
    });
  });

  doRefresh(body, countSpan, globalSection);

  const observer = new MutationObserver(mutations => {
    if (mutations.every(m => widget.contains(m.target) || m.target === widget)) return;
    scheduleRefresh(body, countSpan, globalSection);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-label", "class"],
  });

  window.addEventListener("storage", e => {
    if (e.key === "shop_wishlist") scheduleRefresh(body, countSpan, globalSection);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initShopGoals();
  const observer = new MutationObserver(() => {
    if (!document.getElementById("macondoplus-goals-widget")) initShopGoals();
  });
  observer.observe(document.body, {childList: true, subtree: true});
});