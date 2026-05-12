(() => {
  if (!window.MacondoPlus?.isEnabled("achievements")) return;

  const ACHIEVEMENTS = [
    {id: "on-fire", name: "On Fire", description: "You're on fire!", emoji: "🔥", threshold: 5},
    {id: "ablaze", name: "Ablaze", description: "Keep it up!", emoji: "🌋", threshold: 10},
    {id: "raging", name: "Raging", description: "Amazing!!", emoji: "🧨", threshold: 15},
    {id: "inferno", name: "Inferno", description: "Take a break...", emoji: "♨️", threshold: 30},
  ];

  function getUnlocked() {
    try {
      return JSON.parse(localStorage.getItem("macondoplus_achievements")) || {};
    } catch {
      return {};
    }
  }

  function unlock(id) {
    const u = getUnlocked();
    if (!u[id]) {
      u[id] = Date.now();
      localStorage.setItem("macondoplus_achievements", JSON.stringify(u));
    }
  }

  function getStreak() {
    const flameBtn = document.querySelector("button svg.lucide-flame")?.closest("button");
    if (!flameBtn) return 0;
    const span = [...flameBtn.querySelectorAll("span")].find(s =>
      /^\d+$/.test(s.textContent.trim()) && !s.querySelector("span")
    );
    const val = parseInt(span?.textContent.trim(), 10);
    return isNaN(val) ? 0 : val;
  }

  function checkAchievements() {
    const streak = getStreak();
    if (!streak) return;
    const unlocked = getUnlocked();
    ACHIEVEMENTS.forEach(a => {
      if (!unlocked[a.id] && streak >= a.threshold) unlock(a.id);
    });
  }

  function buildPanel() {
    if (!window.MacondoPlus?.newPanel) return null;
    const {open: openPanel, close, content} = window.MacondoPlus.newPanel();

    function render() {
      content.innerHTML = "";
      const unlocked = getUnlocked();
      const streak = getStreak();
      const unlockedCount = ACHIEVEMENTS.filter(a => unlocked[a.id]).length;

      const innerContent = document.createElement("div");
      innerContent.className = "relative z-10 max-w-4xl mx-auto px-4 pb-12 pt-6 flex flex-col gap-6";
      content.appendChild(innerContent);

      const header = document.createElement("div");
      header.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid rgba(92, 61, 30, 0.15);
      `;
      header.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 44px;">🏆</span>
          <div>
            <h2 style="font-size: 18px; font-weight: 800; color: #5c3d1e; margin: 0;">Achievements</h2>
            <p style="font-size: 14px; color: rgba(92, 61, 30, 0.55); margin: 3px 0 0;">${unlockedCount} / ${ACHIEVEMENTS.length} unlocked (${unlockedCount/ACHIEVEMENTS.length*100}%)</p>
          </div>
        </div>
      `;
      innerContent.appendChild(header);

      const pill = document.createElement("div");
      pill.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 20px;
        padding: 10px 14px;
        background: rgba(92, 61, 30, 0.06);
        border: 2px solid rgba(92, 61, 30, 0.12);
      `;
      pill.innerHTML = `
        <span style="font-size: 18px;">🔥</span>
        <span style="font-size: 13px; font-weight: 700; color: #5c3d1e;">Current streak: <span style="color: #c2410c;"><span style="font-size: 16px;">${streak}</span> day${streak !== 1 ? "s" : ""}</span></span>
      `;
      innerContent.appendChild(pill);

      const list = document.createElement("div");
      list.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;

      ACHIEVEMENTS.forEach(a => {
        const isUnlocked = !!unlocked[a.id];
        const card = document.createElement("div");
        card.style.cssText = `
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border: 2px solid ${isUnlocked ? "rgba(92, 61, 30, 0.3)" : "rgba(92, 61, 30, 0.1)"};
          background: ${isUnlocked ? "rgba(92, 61, 30, 0.04)" : "transparent"};
          opacity: ${isUnlocked ? "1" : "0.45"};
          transition: opacity 200ms;
        `;

        const iconWrap = document.createElement("div");
        iconWrap.style.cssText = `
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          filter: ${isUnlocked ? "none" : "grayscale(1)"};
        `;
        iconWrap.textContent = a.emoji;

        const info = document.createElement("div");
        info.style.cssText = `
          flex: 1;
          min-width: 0;
        `;
        info.innerHTML = `
          <div style="font-size: 14px; font-weight: 800; color: #5c3d1e;">${a.name}</div>
          <div style="font-size: 12px; color: rgba(92, 61, 30, 0.6); margin-top: 2px;">${a.description}</div>
        `;

        const status = document.createElement("div");
        status.style.cssText = `
          flex-shrink: 0;
          text-align: right;
        `;
        if (isUnlocked) {
          const date = new Date(unlocked[a.id]).toLocaleDateString();
          status.innerHTML = `
            <div style="font-size: 10px; margin-top: 2px; color: rgba(92, 61, 30, 0.45);">Unlocked ${date}</div>
          `;
        } else {
          status.innerHTML = `
            <div style="font-size: 11px; font-weight: 700; color: rgba(92, 61, 30, 0.4);">${a.threshold}-day streak</div>
          `;
        }

        card.appendChild(iconWrap);
        card.appendChild(info);
        card.appendChild(status);
        list.appendChild(card);
      });

      innerContent.appendChild(list);
    }

    return {
      open: () => {
        checkAchievements();
        render();
        openPanel();
      },
      close,
    };
  }

  function injectButton(panel) {
    if (document.getElementById("macondoplus-achievements-btn")) return;

    const toolbar = document.querySelector("div.flex.items-center.gap-2.ml-auto");
    if (!toolbar) return;

    const btn = document.createElement("button");
    btn.id = "macondoplus-achievements-btn";
    btn.type = "button";
    btn.className = "flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 h-[34px] sm:h-[38px] md:h-[46px] bg-parchment/90 backdrop-blur-sm border-[3px] border-ds-brown text-ds-brown hover:bg-parchment transition-colors focus:outline-none focus:ring-2 focus:ring-ds-brown/40";
    btn.setAttribute("aria-label", "Achievements");
    btn.title = "Achievements";
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-4 h-4 md:w-5 md:h-5" aria-hidden="true">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
      </svg>
    `;
    btn.addEventListener("click", () => panel.open());

    toolbar.insertBefore(btn, toolbar.querySelector(".macondoplus-manager-btn"));
  }

  function init() {
    if (!window.MacondoPlus?.newPanel) return;
    checkAchievements();
    const panel = buildPanel();
    if (!panel) return;
    injectButton(panel);
    const obs = new MutationObserver(() => injectButton(panel));
    obs.observe(document.body, {childList: true, subtree: true});
  }

  const checkObs = new MutationObserver(checkAchievements);

  function start() {
    checkObs.observe(document.body, {childList: true, subtree: true, characterData: true});
    init();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();