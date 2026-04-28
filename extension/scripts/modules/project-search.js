if (window.MacondoPlus?.isEnabled("project-search")) {
  const STORAGE_KEY = "macondoplus_projects";
  const MAX_MISSES = 15;
  const CONCURRENCY = 10;

  function getCache() {
    return new Promise(resolve => {
      chrome.storage.local.get(STORAGE_KEY, r => resolve(r[STORAGE_KEY] || {
        projects: {},
        lowestSynced: null,
        highestSynced: 0
      }));
    });
  }

  function setCache(data) {
    return new Promise(resolve => chrome.storage.local.set({[STORAGE_KEY]: data}, resolve));
  }

  async function fetchProject(id) {
    try {
      const res = await fetch(`/projects/${id}`, {credentials: "include"});
      if (!res.ok) return null;
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const projectTitle = doc.querySelector("h1.text-xl");
      if (!projectTitle) return null;
      return {id, name: projectTitle.textContent.trim()};
    } catch {
      return null;
    }
  }

  let syncing = false;

  async function sync(onProgress, onDone) {
    if (syncing) return;
    syncing = true;

    const cache = await getCache();

    let misses = 0;
    let id = cache.highestSynced + 1;
    onProgress(`Scanning for new projects...`);
    while (misses < MAX_MISSES) {
      const project = await fetchProject(id);
      if (project) {
        cache.projects[id] = project.name;
        cache.highestSynced = Math.max(cache.highestSynced, id);
        misses = 0;
        onProgress(`Finding new projects... (#${id})`);
      } else {
        misses++;
      }
      id++;
      if (id % 10 === 0) await setCache(cache);
    }

    misses = 0;
    id = cache.lowestSynced - 1;
    while (id > 0 && misses < MAX_MISSES) {
      const project = await fetchProject(id);
      if (project) {
        cache.projects[id] = project.name;
        cache.highestSynced = Math.max(cache.highestSynced, id);
        misses = 0;
        onProgress(`Backfilling projects... (#${id})`);
      } else {
        misses++;
      }
      cache.lowestSynced = id;
      id--;
      if (id % 10 === 0) await setCache(cache);
    }

    await setCache(cache);
    syncing = false;
    onDone?.();
  }

  function createSearchUI() {
    if (!document.querySelector('button[aria-label="Get help"]')) return;
    if (document.querySelector(".macondoplus-search-btn")) return;

    const isMd = window.innerWidth >= 768;
    const searchRight = 24 + (isMd ? 64 : 48) + 24;
    const panelRight = searchRight + (isMd ? 64 : 48) + 24;

    const searchBtn = document.createElement("button");
    searchBtn.type = "button";
    searchBtn.className = "macondoplus-search-btn fixed bottom-6 right-24 md:right-28 z-40 w-12 h-12 md:w-16 md:h-16 bg-parchment/90 backdrop-blur-sm border-[3px] border-ds-brown text-ds-brown flex items-center justify-center shadow-xl hover:bg-parchment active:scale-95 transition-all";
    searchBtn.setAttribute("aria-label", "Search projects");
    searchBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search">
        <path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>
      </svg>
    `;

    const panel = document.createElement("div");
    panel.className = "macondoplus-search-panel fixed z-40 bg-parchment border-[3px] border-ds-brown shadow-xl";
    panel.style.cssText = `display: none; bottom: 24px; right: ${panelRight}px; width: 300px;`;
    panel.innerHTML = `
      <div style="padding: 12px; display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; gap: 6px; align-items: stretch;">
          <input type="text" placeholder="Search projects..." class="ds-input flex-1" style="font-size: 13px; min-width: 0;"/>
          <button type="button" class="macondoplus-sync-btn ds-input" style="font-size: 13px; font-weight: bold; white-space: nowrap; cursor: pointer; border-width: 3px;">Sync</button>
        </div>
        <div class="macondoplus-sync-status" style="font-size: 11px; color: #999; display: none;"></div>
        <div class="macondoplus-results" style="height: 220px; overflow-y: auto; display: none; flex-direction: column; gap: 2px;"></div>
      </div>
    `;

    document.body.appendChild(searchBtn);
    document.body.appendChild(panel);

    const input = panel.querySelector("input");
    const syncBtn = panel.querySelector(".macondoplus-sync-btn");
    const statusEl = panel.querySelector(".macondoplus-sync-status");
    const resultsEl = panel.querySelector(".macondoplus-results");

    function setStatus(msg) {
      if (msg) {
        statusEl.textContent = msg;
        statusEl.style.display = "block";
      } else {
        statusEl.style.display = "none";
      }
    }

    searchBtn.addEventListener("click", () => {
      const open = panel.style.display !== "none";
      panel.style.display = open ? "none" : "block";
      if (!open) input.focus();
    });

    document.addEventListener("click", e => {
      if (!panel.contains(e.target) && !searchBtn.contains(e.target)) {
        panel.style.display = "none";
      }
    });

    input.addEventListener("input", async () => {
      const query = input.value.trim().toLowerCase();
      resultsEl.innerHTML = "";

      if (!query) {
        resultsEl.style.display = "none";
        return;
      }

      resultsEl.style.display = "flex";

      const cache = await getCache();
      const matches = Object.entries(cache.projects)
        .filter(([, name]) => name.toLowerCase().includes(query))
        .sort((a, b) => Number(b[0]) - Number (a[0]))
        .slice(0, 10);

      if (!matches.length) {
        resultsEl.innerHTML = `<div style="font-size: 12px; color: #999; padding: 4px 6px;">No results for ${query}. Try syncing first?</div>`;
        return;
      }

      for (const [id, name] of matches) {
        const a = document.createElement("a");
        a.href = `/projects/${id}`;
        a.target = "_blank";
        a.className = "text-ds-brown hover:bg-ds-brown/10 transition-colors";
        a.style.cssText = "display: block; font-size: 13px; font-weight: 600; padding: 5px 8px; text-decoration: none;";
        a.innerHTML = `
          ${name} <small>(#${id})</small>
        `;
        resultsEl.appendChild(a);
      }
    });

    syncBtn.addEventListener("click", () => {
      syncBtn.disabled = true;
      syncBtn.textContent = "Syncing...";
      sync(msg => {setStatus(msg);}, () => {
        setStatus("Sync complete!");
        syncBtn.disabled = false;
        syncBtn.textContent = "Sync";
        input.dispatchEvent(new Event("input"));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    createSearchUI();
    const observer = new MutationObserver(createSearchUI);
    observer.observe(document.body, {childList: true, subtree: true});
  });
}