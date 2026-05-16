(() => {
  if (!window.MacondoPlus?.isEnabled("achievements")) return;

  let _nuxtCache = null;
  function getNuxtArray() {
    if (_nuxtCache) return _nuxtCache;
    try {
      const el = document.getElementById("__NUXT_DATA__");
      _nuxtCache = JSON.parse(el?.textContent || "null") || [];
    } catch {
      _nuxtCache = [];
    }
    return _nuxtCache;
  }

  function getUserValue(field) {
    const arr = getNuxtArray();
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      if (obj && typeof obj === "object" && !Array.isArray(obj) && "username" in obj && "email" in obj && field in obj) {
        return arr[obj[field]];
      }
    }
    return null;
  }

  function getGoldBalance() {
    const arr = getNuxtArray();
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      if (obj && typeof obj === "object" && !Array.isArray(obj) && "$sgold_balance" in obj) {
        const val = arr[obj["$sgold_balance"]];
        return typeof val === "number" ? val : 0;
      }
    }
    return 0;
  }

  function getProjectsData() {
    const arr = getNuxtArray();
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === "number") {
        const first = arr[obj[0]];
        if (first && typeof first === "object" && !Array.isArray(first) && "fruit" in first && "level" in first && "stage" in first) {
          return obj.map(idx => {
            const p = arr[idx];
            if (!p) return null;
            return {
              level: parseInt(arr[p.level], 10) || 0,
              stage: typeof arr[p.stage] === "number" ? arr[p.stage] : 0,
            };
          }).filter(Boolean);
        }
      }
    }
    return [];
  }

  const CATEGORIES = [
    {id: "streak", label: "Streak", icon: "🔥"},
    {id: "gold", label: "Gold", icon: "💰"},
    {id: "projects", label: "Projects", icon: "📁"},
    {id: "secret", label: "Secret", icon: "❓"},
  ];

  const ACHIEVEMENTS = [
    {
      id: "on-fire", category: "streak", emoji: "🔥",
      name: "On Fire", description: "You're on fire!",
      hint: "5-day streak",
      check: () => getStreak() >= 5,
    },
    {
      id: "ablaze", category: "streak", emoji: "🌋",
      name: "Ablaze", description: "Keep it up!",
      hint: "10-day streak",
      check: () => getStreak() >= 10,
    },
    {
      id: "raging", category: "streak", emoji: "🧨",
      name: "Raging", description: "Amazing!!",
      hint: "15-day streak",
      check: () => getStreak() >= 15,
    },
    {
      id: "inferno", category: "streak", emoji: "♨️",
      name: "Inferno", description: "Take a break soon...",
      hint: "30-day streak",
      check: () => getStreak() >= 30,
    },
    {
      id: "unstoppable", category: "streak", emoji: "🏔️",
      name: "Unstoppable", description: "Nothing can stop you.",
      hint: "50-day streak",
      check: () => getStreak() >= 50,
    },
    {
      id: "legendary", category: "streak", emoji: "⚡",
      name: "Legendary", description: "You're a legend.",
      hint: "75-day streak",
      check: () => getStreak() >= 75,
    },
    {
      id: "first-gold", category: "gold", emoji: "💰",
      name: "First Gold", description: "Your first earnings!",
      hint: "Obtain your first payout.",
      check: () => getGoldBalance() >= 1,
    },
    {
      id: "gilded", category: "gold", emoji: "💎",
      name: "Gilded", description: "The rich get richer.",
      hint: "Earn 500 gold",
      check: () => getGoldBalance() >= 500,
    },
    {
      id: "hoarder", category: "gold", emoji: "👑",
      name: "Hoarder", description: "Spare me some? 🥺",
      hint: "Earn 1500 gold",
      check: () => getGoldBalance() >= 1500,
    },
    {
      id: "mr-krabs", category: "gold", emoji: "🧐",
      name: "Mr Krabs", description: "I like money!",
      hint: "Earn 3000 gold",
      check: () => getGoldBalance() >= 3000,
    },
    {
      id: "bank-of-macondo", category: "gold", emoji: "🏦",
      name: "Bank of Macondo", description: "You now own the Bank of Macondo!",
      hint: "Earn 5000 gold",
      check: () => getGoldBalance() >= 5000,
    },
    {
      id: "planted", category: "projects", emoji: "🌱",
      name: "Planted", description: "Your journey begins.",
      hint: "Submit 1 project",
      check: () => getProjectsData().length >= 1,
    },
    {
      id: "growing", category: "projects", emoji: "🌿",
      name: "Growing", description: "The garden expands.",
      hint: "Have 3 projects",
      check: () => getProjectsData().length >= 3,
    },
    {
      id: "forest", category: "projects", emoji: "🌿",
      name: "Forest", description: "Roots run deep.",
      hint: "Have 5 projects",
      check: () => getProjectsData().length >= 5,
    },
    {
      id: "prepared", category: "secret", emoji: "🧊",
      name: "Prepared", description: "Always ready for the inevitable.",
      hint: "???",
      check: () => (getUserValue("streak_freezes_remaining") || 0) >= 6,
    },
    {
      id: "professional", category: "secret", emoji: "🏅",
      name: "Professional", description: "Future femboy- I mean Albert Einstein!",
      hint: "???",
      check: () => getProjectsData().some(p => p.stage >= 3),
    },
    {
      id: "perfectionist", category: "secret", emoji: "💯",
      name: "Perfectionist", description: "???",
      hint: "???",
      check: () => Object.keys(getUnlocked()).length >= 15,
    },
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
    const sorted = [...ACHIEVEMENTS].sort((a, b) => a.id === "perfectionist" ? 1 : b.id === "perfectionist" ? -1 : 0);
    const unlocked = getUnlocked();
    for (const a of sorted) {
      if (unlocked[a.id]) continue;
      try {
        if (a.check()) unlock(a.id);
      } catch {}
    }
  }

  function buildPanel() {
    const {open: openPanel, close, content} = window.MacondoPlus.newPanel();

    function render() {
      content.innerHTML = "";
      const unlocked = getUnlocked();
      const streak = getStreak();
      const gold = getGoldBalance();
      const projects = getProjectsData();
      const unlockedCount = ACHIEVEMENTS.filter(a => unlocked[a.id]).length;

      const wrap = document.createElement("div");
      wrap.className = "relative z-10 max-w-4xl mx-auto px-4 pb-12 pt-6 flex flex-col gap-6";
      content.appendChild(wrap);

      const header = document.createElement("div");
      header.style.cssText = `
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid rgba(92, 61, 30, 0.15);
      `;
      header.innerHTML = `
        <span style="font-size: 44px;">🏆</span>
        <div>
          <h2 style="font-size: 18px; font-weight: 800; color: #5c3d1e; margin: 0;">Achievements</h2>
          <p style="font-size: 13px; color: rgba(92, 61, 30, 0.55); margin: 3px 0 0;">
            ${unlockedCount} / ${ACHIEVEMENTS.length} unlocked (${Math.round(unlockedCount / ACHIEVEMENTS.length * 100)}%)
          </p>
        </div>
      `;
      wrap.appendChild(header);

      const stats = document.createElement("div");
      stats.style.cssText = `
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      `;
      [
        {icon: "🔥", label: "Streak", value: `${streak} day${streak !== 1 ? "s" : ""}`},
        {icon: "💰", label: "Gold", value: gold},
        {icon: "📁", label: "Projects", value: projects.length},
      ].forEach(({icon, label, value}) => {
        const pill = document.createElement("div");
        pill.style.cssText = `
          flex: 1;
          min-width: 100px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(92, 61, 30, 0.06);
          border: 2px solid rgba(92, 61, 30, 0.12);
        `;
        pill.innerHTML = `
          <span style="font-size: 18px;">${icon}</span>
          <div>
            <div style="font-size: 10px; font-weight: 600; color: rgba(92, 61, 30, 0.5); text-transform: uppercase; letter-spacing: 0.5px;">${label}</div>
            <div style="font-size: 15px; font-weight: 800; color: #5c3d1e;">${value}</div>
          </div>
        `;
        stats.appendChild(pill);
      });
      wrap.appendChild(stats);

      CATEGORIES.forEach(cat => {
        const catList = ACHIEVEMENTS.filter(a => a.category === cat.id);
        const catUnlocked = catList.filter(a => unlocked[a.id]).length;

        const section = document.createElement("div");
        section.style.cssText = "margin-bottom: 22px;";

        const catHeader = document.createElement("div");
        catHeader.style.cssText = `
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 10px; padding-bottom: 6px;
          border-bottom: 1px solid rgba(92, 61, 30, 0.1);
        `;
        catHeader.innerHTML = `
          <span style="font-size: 15px;">${cat.icon}</span>
          <span style="font-size: 12px; font-weight: 800; color: #5c3d1e; text-transform: uppercase; letter-spacing: 0.5px;">${cat.label}</span>
          <span style="font-size: 12px; color: rgba(92,61,30,.45); margin-left: auto;">
            ${catUnlocked}/${catList.length} (${Math.round(catUnlocked / catList.length * 100)}%)
          </span>
        `;
        section.appendChild(catHeader);

        const list = document.createElement("div");
        list.style.cssText = "display: flex; flex-direction: column; gap: 8px;";

        catList.forEach(a => {
          const isUnlocked = !!unlocked[a.id];
          const card = document.createElement("div");
          card.style.cssText = `
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 12px 14px;
            border: 2px solid ${isUnlocked ? "rgba(92,61,30,.3)" : "rgba(92,61,30,.1)"};
            background: ${isUnlocked ? "rgba(92,61,30,.04)" : "transparent"};
            opacity: ${isUnlocked ? "1" : "0.45"};
            transition: opacity 200ms;
          `;

          const iconEl = document.createElement("div");
          iconEl.style.cssText = `
            width: 46px;
            height: 46px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            filter: ${isUnlocked ? "none" : "grayscale(1)"};
          `;
          iconEl.textContent = a.emoji;

          const infoEl = document.createElement("div");
          infoEl.style.cssText = "flex: 1; min-width: 0;";
          infoEl.innerHTML = `
            <div style="font-size: 13px; font-weight: 800; color: #5c3d1e;">${a.name}</div>
            <div style="font-size: 11px; color: rgba(92, 61, 30, 0.6); margin-top: 2px;">${a.description}</div>
          `;

          const statusEl = document.createElement("div");
          statusEl.style.cssText = "flex-shrink: 0; text-align: right;";
          if (isUnlocked) {
            const d = new Date(unlocked[a.id]);
            const date = d.toLocaleDateString("en-US");
            const time = d.toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit", hour12: true});
            statusEl.innerHTML = `
              <div style="font-size: 10px; color: rgba(92,61,30,.45);">Unlocked ${date}, ${time}</div>
            `;
          } else {
            statusEl.innerHTML = `
              <div style="font-size: 11px; font-weight: 700; color: rgba(92, 61, 30, 0.4);">${a.hint}</div>
            `;
          }

          card.appendChild(iconEl);
          card.appendChild(infoEl);
          card.appendChild(statusEl);
          list.appendChild(card);
        });

        section.appendChild(list);
        wrap.appendChild(section);
      });
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
    checkObs.observe(document.body, {childList: true, subtree: true});
    init();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();