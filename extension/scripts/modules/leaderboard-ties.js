if (window.MacondoPlus?.isEnabled("leaderboard-ties")) {
  const RANK_META = [
    {label: "1st", badgeClass: "border-yellow-500 text-yellow-500", color: "#ca8a04"},
    {label: "2nd", badgeClass: "border-gray-400 text-gray-400", color: "#9ca3af"},
    {label: "3rd", badgeClass: "border-orange-700 text-orange-700", color: "#c2410c"},
  ];

  function buildAvatarStack(tiedAvatars, color) {
    const maxShow = 4;
    const shown = tiedAvatars.slice(0, maxShow);
    const overflow = tiedAvatars.length - maxShow;
    const size = 28;
    const step = size - 10;
    const totalSlots = Math.min(tiedAvatars.length, maxShow + (overflow > 0 ? 1 : 0));
    const wrapWidth = size + (totalSlots - 1) * step;

    const imgs = shown.map((a, i) => `
      <div style="position: absolute; left: ${i * step}px; width: ${size}px; height: ${size}px; border-radius: 50%; overflow: hidden; border: 2px solid ${color}; background: #f5f0e8;">
        <img src="${a.src}" alt="${a.name}" style="width: 100%; height: 100%; object-fit: cover;"/>
      </div>`).join("");
    
    const badge = overflow > 0 ? `
      <div style="position: absolute; left: ${maxShow * step}px; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid ${color}; background: #f5f0e8; box-sizing: border-box; display: flex; align-items: center; justify-content: center; line-height: 1;">
        <span style="font-size: 0.6rem; font-weight: bold; color: ${color};">+${overflow}</span>
      </div>` : "";
    
    return `<div style="position: relative; width: ${wrapWidth}px; height: ${size}px;">${imgs}${badge}</div>`;
  }

  function getListScore(item) {
    return parseInt(item.querySelector("span.shrink-0")?.textContent ?? "-1");
  }

  function processLeaderboard() {
    const grid = document.querySelector(".grid.grid-cols-1.sm\\:grid-cols-3");
    const list = document.querySelector("ol");
    if (!grid || !list || grid.dataset.mpfTies) return;

    const bigCards = [...grid.querySelectorAll("button[data-card-id]")];
    if (bigCards.length < 3) return;

    const listItems = [...list.querySelectorAll("button[data-card-id]")];

    for (let i = 2; i < bigCards.length; i++) {
      const card = bigCards[i];
      const {label, color} = RANK_META[i] ?? {label: `${i+1}th`, color: "#78716c"};
      const score = parseInt(card.querySelector(".text-sl.font-bold")?.textContent ?? "0");

      const tiedListItems = listItems.filter(item => getListScore(item) === score);
      if (tiedListItems.length === 0) continue;

      const originalAvatar = {src: card.querySelector("img")?.src ?? "", name: card.querySelector(".flex.flex-col.items-center span")?.textContent?.trim() ?? ""};
      const tiedAvatars = [originalAvatar, ...tiedListItems.map(item => ({
        src: item.querySelector("img")?.src ?? "",
        name: item.querySelector("p")?.textContent?.trim() ?? "",
      }))];

      card.style.display = "none";

      const multiple = document.createElement("button");
      multiple.type = "button";
      multiple.className = card.className;
      multiple.style.cursor = "pointer";
      multiple.innerHTML = `
        <div class="relative" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
          <div class="w-20 h-20 rounded-full border-[3px] flex items-center justify-center bg-ds-brown/10" style="border-color: ${color};">
            ${buildAvatarStack(tiedAvatars, color)}
          </div>
          <div class="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-parchment" style="border-color: ${color}; color: ${color};">
            ${label}
          </div>
        </div>
        <div class="flex flex-col items-center w-full min-w-0">
          <span class="text-sm font-bold text-ds-brown truncate w-full">Multiple</span>
        </div>
        <div class="flex flex-col items-center text-ds-brown">
          <span class="text-xl font-bold tabular-nums">${score}</span>
          <span class="text-[10px] uppercase tracking-wider text-ds-brown/60">Most upvotes</span>
        </div>
      `;
      card.parentElement.insertBefore(multiple, card);

      const listItem = makeListItem(`#${i + 1}`, originalAvatar.src, originalAvatar.name, score, card.dataset.cardId);
      listItem.addEventListener("click", () => card.click());
      list.insertBefore(listItem, list.firstChild);

      for (const item of tiedListItems) {
        const rankEl = item.querySelector("span.w-7");
        if (rankEl) rankEl.textContent = `#${i + 1}`;
      }
    }

    fixListRanks([...list.querySelectorAll("button[data-card-id]")]);
    grid.dataset.mpfTies = "1";
  }

  function makeListItem(rank, avatar, name, score, cardId) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.cardId = cardId;
    btn.className = "flex items-center gap-3 px-3 py-2 border:bg-ds-brown/5 transition-colors text-left";
    btn.innerHTML = `
      <span class="w-7 text-right text-xs font-bold text-ds-brown/50 tabular-nums">${rank}</span>
      <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-ds-brown/30 shrink-0">
        <img src="${avatar}" alt="${name}" class="w-full h-full object-cover"/>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-bold text-ds-brown truncate">${name}</p>
      </div>
      <span class="text-sm font-bold text-ds-brown tabular-nums shrink-0">${score}</span>
    `;
    return btn;
  }

  function fixListRanks(items) {
    let trueRank = 3;
    let countAtCurrentRank = 0;
    let prevScore = null;

    for (const item of items) {
      const score = parseInt(item.querySelector("span.shrink-0")?.textContent ?? "0");
      const rankEl = item.querySelector("span.w-7");
      if (!rankEl) continue;

      if (prevScore === null || score !== prevScore) {
        trueRank += countAtCurrentRank;
        countAtCurrentRank = 1;
        prevScore = score;
      } else {
        countAtCurrentRank++;
      }

      rankEl.textContent = `#${trueRank}`;
    }
  }

  function init() {
    const mo = new MutationObserver(processLeaderboard);
    mo.observe(document.body, {childList: true, subtree: true});
    processLeaderboard();
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
}