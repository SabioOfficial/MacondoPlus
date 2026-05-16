(() => {
  if (!window.MacondoPlus?.isEnabled("additional-project-info")) return;

  const CACHE = new Map();

  function getProjectId() {
    const m = location.pathname.match(/\/projects\/(\d+)/);
    if (m) return m[1];
    const link = document.querySelector("a[href*='/projects/'][target='_blank']");
    if (link) {
      const m2 = link.getAttribute("href").match(/\/projects\/(\d+)/);
      if (m2) return m2[1];
    }
    return null;
  }

  function getUserId() {
    const link = document.querySelector("a[href^='/u/']");
    if (!link) return null;
    const m = link.getAttribute("href").match(/\/u\/([a-f0-9-]+)/);
    return m ? m[1] : null;
  }

  function findInsertionPoint() {
    const authorLink = document.querySelector("a[href^='/u/']");
    if (!authorLink) return null;

    const borderSection = authorLink.closest("[class*='border-b-2']");
    if (borderSection) return borderSection;

    const woodframe = authorLink.closest("woodframe");
    if (woodframe) return woodframe;

    return null;
  }

  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/_/g, " ").replace(/-/g, " ");
  }

  function daysAgo(dateStr) {
    if (!dateStr) return null;
    const [y, mo, d] = dateStr.slice(0, 10).split("-").map(Number);
    const then = new Date(y, mo - 1, d);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = Math.round((today - then) / 86400000);
    if (diff <= 0) return "today";
    else if (diff === 1) return "yesterday";
    return `${diff}d ago`;
  }

  function label(text) {
    const el = document.createElement("div");
    el.style.cssText = `
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(92, 61, 30, 0.45);
      margin-bottom: 8px;
    `;
    el.textContent = text;
    return el;
  }

  function renderPanel(project, user, insertAfter) {
    if (document.querySelector(".mp-project-info-panel")) return;

    const panel = document.createElement("div");
    panel.className = "mp-project-info-panel";
    panel.style.cssText = `
      padding: 14px 16px;
      border-bottom: 2px solid rgba(92, 61, 30, 0.12);
      display: flex;
      flex-direction: column;
      gap: 16px;
    `;

    const authorSection = document.createElement("div");
    authorSection.appendChild(label(`About ${user.username}`));

    const statsRow = document.createElement("div");
    statsRow.style.cssText = `
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    `;

    [
      {v: user.project_count, l: "Projects"},
      {v: `${user.top_streak_days}d`, l: "Top streak"},
      {v: user.total_upvotes, l: "Upvotes"}
    ].forEach(({v, l: lbl}) => {
      const chip = document.createElement("div");
      chip.style.cssText = `
        display: flex;
        flex-direction: column;
        padding: 5px 10px;
        border: 2px solid rgba(92, 61, 30, 0.15);
        background: rgba(92, 61, 30, 0.04);
      `;
      chip.innerHTML = `
        <span style="font-size: 14px; font-weight: 800; color: #5c3d1e;">${esc(v)}</span>
        <span style="font-size: 9px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(92, 61, 30, 0.5);">${esc(lbl)}</span>
      `;
      statsRow.appendChild(chip);
    });
    authorSection.appendChild(statsRow);

    const others = (user.projects ?? []).filter((p) => String(p.id) !== String(project.id));
    if (others.length) {
      const othersLabel = document.createElement("div");
      othersLabel.style.cssText = `
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: rgba(92, 61, 30, 0.5);
        margin-bottom: 5px;
      `;
      othersLabel.textContent = "Other projects";
      authorSection.appendChild(othersLabel);

      const list = document.createElement("div");
      list.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 3px;
      `;

      others.slice(0, 6).forEach((p) => {
        const row = document.createElement("a");
        row.href = `/projects/${p.id}`;
        row.style.cssText = `
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 7px;
          font-size: 12px;
          font-weight: 600;
          color: #5c3d1e;
          text-decoration: none;
          border: 2px solid rgba(92, 61, 30, 0.1);
          transition: background 120ms;
        `;
        row.onmouseenter = () => (row.style.background = "rgba(92, 61, 30, 0.06);");
        row.onmouseleave = () => (row.style.background = "");

        const tick = p.has_shipped ? "✓" : "·";
        const color = p.has_shipped ? "#15803d" : "rgba(92, 61, 30, 0.35)";

        row.innerHTML = `
          <span style="color: ${color}; font-weight: 800; font-size: 11px; flex-shrink: 0;">${tick}</span>
          <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${esc(p.name)}</span>
          <span style="font-size: 10px; color: rgba(92, 61, 30, 0.4); white-space: nowrap; flex-shrink: 0;">${esc(p.fruit ?? "")}</span>
        `;
        list.appendChild(row);
      });

      authorSection.appendChild(list);
    }

    panel.appendChild(authorSection);

    const metaSection = document.createElement("div");
    metaSection.appendChild(label("Project Details"));

    const rows = [];

    if (project.hackatime_projects?.length) {
      rows.push({k: "Hackatime", v: project.hackatime_projects.join(", ")});
    }
    rows.push({
      k: "Auto streak freeze",
      v: project.auto_use_streak_freezes ? "Enabled" : "Disabled",
    });
    if (project.last_worked_date) {
      rows.push({k: "Last worked", v: daysAgo(project.last_worked_date)});
    }
    if (project.hasPreviousShippedShip) {
      rows.push({k: "Previously shipped", v: "Yes"});
    }
    if (project.is_fork) {
      rows.push({k: "Fork", v: "Yes"});
    }
    if (project.unshippedJournalHours != null && project.unshippedJournalHours > 0) {
      rows.push({k: "Unshipped Journal hours", v: `${project.unshippedJournalHours}h`});
    }
    if (project.streakStatus && project.streakStatus !== "under_review") {
      rows.push({k: "Streak status", v: project.streakStatus});
    } else if (project.streakStatus && project.streakStatus === "under_review") {
      rows.push({k: "Streak status", v: project.streakStatus + " (Paused)"});
    }

    const grid = document.createElement("div");
    grid.style.cssText = `
      display: flex;
      flex-direction: column;
    `;

    rows.forEach(({k, v}) => {
      const row = document.createElement("div");
      row.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 8px;
        font-size: 12px;
        padding: 5px 0;
        border-bottom: 1px solid rgba(92, 61, 30, 0.07);
      `;
      row.innerHTML = `
        <span style="color: rgba(92, 61, 30, 0.55); font-weight: 600;">${esc(k)}</span>
        <span style="color: #5c3d1e; font-weight: 700; text-align: right; text-transform: capitalize;">${esc(v)}</span>
      `;
      grid.appendChild(row);
    });

    metaSection.appendChild(grid);
    panel.appendChild(metaSection);
    insertAfter.insertAdjacentElement("afterend", panel);
  }

  let lastKey = null;
  let pending = false;

  async function tryInject() {
    if (pending) return;

    const projectId = getProjectId();
    const userId = getUserId();
    if (!projectId || !userId) return;

    const key = `${projectId}:${userId}`;
    if (document.querySelector(".mp-project-info-panel")) {
      lastKey = key;
      return;
    }
    if (key === lastKey) return;

    const insertionPoint = findInsertionPoint();
    if (!insertionPoint) return;

    lastKey = key;
    pending = true;

    try {
      let data = CACHE.get(key);
      if (!data) {
        const [pRes, uRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetch(`/api/users/${userId}`),
        ]);
        if (!pRes.ok || !uRes.ok) {
          lastKey = null;
          pending = false;
          return;
        }
        data = {project: await pRes.json(), user: await uRes.json()};
        CACHE.set(key, data);
      }
      renderPanel(data.project, data.user, insertionPoint);
    } catch (e) {
      console.error(e);
    }

    pending = false;
  }

  let debounce = null;
  const observer = new MutationObserver(() => {
    if (lastKey && !document.querySelector(".mp-project-info-panel")) lastKey = null;
    clearTimeout(debounce);
    debounce = setTimeout(tryInject, 250);
  });

  function init() {
    tryInject();
    observer.observe(document.body, {childList: true, subtree: true});
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();