function injectManagerButton() {
  if (document.querySelector(".macondoplus-manager-btn")) return;
  const toolbar = document.querySelector(".flex.items-center.gap-2.ml-auto");
  if (!toolbar) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "macondoplus-manager-btn flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 h-[34px] sm:h-[38px] md:h-[46px] bg-parchment/90 backdrop-blur-sm border-[3px] border-ds-brown text-ds-brown hover:bg-parchment transition-colors focus:outline-none focus:ring-2 focus:ring-ds-brown/40 text-xs sm:text-sm md:text-base font-bold";
  btn.setAttribute("aria-label", "Macondo+ Modules");
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-4 h-4 md:w-5 md:h-5 lucide-package-icon lucide-package w-4 h-4 md:w-5 md:h-5">
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
      <path d="M12 22V12"/>
      <polyline points="3.29 7 12 12 20.71 7"/>
      <path d="m7.5 4.27 9 5.15"/>
    </svg>
  `;

  const panel = document.createElement("div");
  panel.className = "macondoplus-manager-panel";
  panel.style.cssText = `
    display: none;
    position: fixed;
    top: 70px;
    right: 16px;
    width: 320px;
    z-index: 9999;
    background: var(--color-parchment, #f5e6c8);
    border: 3px solid var(--color-ds-brown, #5c3d1e);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  `;

  const {MODULES, isEnabled, setEnabled} = window.MacondoPlus;

  const initialState = {};
  MODULES.forEach(mod => {initialState[mod.id] = isEnabled(mod.id);});

  const categories = {};
  [...MODULES]
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(module => {
      if (!categories[module.category]) categories[module.category] = [];
      categories[module.category].push(module);
    });
  
  const totalEnabled = MODULES.filter(module => isEnabled(module.id)).length;

  function renderToggle(mod) {
    const on = isEnabled(mod.id);
    return `
      <div data-module-row="${mod.id}" style="display:flex;align-items:flex-start;gap:12px;padding:12px 16px;border-bottom:1px solid rgba(92,61,30,0.1);">
        <div style="flex:1;min-width:0;">
          <div style="font-size: 13px; font-weight: 700; color: var(--color-ds-brown, #5c3d1e);">${mod.name}</div>
          <div style="font-size: 11px; color: rgba(92,61,30,0.6); margin-top: 2px;">${mod.description}</div>
        </div>
        <button
          type="button"
          data-module-id="${mod.id}"
          class="macondoplus-toggle"
          style="flex-shrink: 0; margin-top: 2px; width: 36px; height: 20px; border-radius: 10px; border: 2px solid var(--color-ds-brown, #5c3d1e); cursor: pointer; position: relative; transition:background 0.2s;background:${on ? "var(--color-ds-brown,#5c3d1e)" : "transparent"};"
          aria-pressed="${on}"
          aria-label="Toggle ${mod.name}"
        >
          <span style="position:absolute;top:2px;left:${on ? "16px" : "2px"};width:12px;height:12px;border-radius:50%;background:${on ? "var(--color-parchment,#f5e6c8)" : "var(--color-ds-brown,#5c3d1e)"};transition:left 0.2s;"></span>
        </button>
      </div>
    `;
  }

  function renderCategories() {
    return Object.entries(categories).sort(([a], [b]) => a.localeCompare(b)).map(([cat, mods]) => `
      <div>
        <div style="padding: 8px 16px 4px; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(92, 61, 30, 0.4); background: rgba(92, 61, 30, 0.04); border-bottom: 1px solid rgba(92, 61, 30, 0.08);">${cat}</div>
        ${mods.map(renderToggle).join("")}
      </div>
    `).join("");
  }

  panel.innerHTML = `
    <div style="padding:14px 16px;border-bottom:2px solid rgba(92,61,30,0.2);display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-size:15px;font-weight:800;color:var(--color-ds-brown,#5c3d1e);">Macondo+ Modules</div>
        <div style="font-size: 11px; color: rgba(92, 61, 30, 0.45); margin-top: 1px;">${totalEnabled} of ${MODULES.length} enabled</div>
      </div>
      <input type="text" placeholder="Filter..." class="macondoplus-module-filter ds-input" style="width: 120px; font-size: 12px; padding: 4px 8px;"/>
    </div>
    <div class="macondoplus-reload-callout" style="display: none; margin: 10px 12px 0; padding: 10px 12px; background: #fee2e2; border: 2px solid #ef4444; border-radius: 6px;">
      <div style="font-size: 12px; font-weight: 800; color: #b91c1c; margin-bottom: 2px;">Reload required!</div>
      <div style="font-size: 11px; color: #b91c1c; margin-bottom: 8px;">Reload now to apply new modules.</div>
      <button type="button" class="macondoplus-reload-btn" style="width: 100%; padding: 5px 0; background: #ef4444; border: none; border-radius: 4px; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer;">Reload</button>
    </div>
    <div class="macondoplus-module-list" style="max-height:400px;overflow-y:auto;">
      ${renderCategories()}
    </div>
  `;

  const callout = panel.querySelector(".macondoplus-reload-callout");
  const reloadBtn = panel.querySelector(".macondoplus-reload-btn");
  const moduleList = panel.querySelector(".macondoplus-module-list");
  const filterInput = panel.querySelector(".macondoplus-module-filter");
  const header = panel.querySelector("div[style*='font-size: 11px']");

  reloadBtn.addEventListener("click", () => location.reload());

  function updateEnabledCount() {
    const count = MODULES.filter(m => isEnabled(m.id)).length;
    panel.querySelector("div[style*='font-size: 11px; color: rgba(92, 61, 30, 0.45)']") && (panel.querySelector("div[style*='font-size: 11px; color: rgba(92, 61, 30, 0.45)']").textContent = `${count} of ${MODULES.length} enabled`);
  }
  
  function checkForChanges() {
    const hasChanges = MODULES.some(module => isEnabled(module.id) !== initialState[module.id]);
    callout.style.display = hasChanges ? "block" : "none";
  }

  function applyFilter(query) {
    const q = query.toLowerCase();
    panel.querySelectorAll("[data-module-row]").forEach(row => {
      const id = row.dataset.moduleRow;
      const mod = MODULES.find(m => m.id === id);
      const match = !q || mod.name.toLowerCase().includes(q) || mod.description.toLowerCase().includes(q) || mod.category.toLowerCase().includes(q);  
      row.style.display = match ? "flex" : "none";
    });
    panel.querySelectorAll(".macondoplus-manager-panel > div > div > div:first-child").forEach(header => {
      const rows = header.parentElement.querySelectorAll("[data-module-row]");
      const anyVisible = [...rows].some(r => r.style.display !== "none");
      header.style.display = anyVisible ? "" : "none";
    });
  }

  filterInput.addEventListener("input", () => applyFilter(filterInput.value));

  panel.querySelectorAll(".macondoplus-toggle").forEach(toggleBtn => {
    toggleBtn.addEventListener("click", () => {
      const id = toggleBtn.dataset.moduleId;
      const nowEnabled = !isEnabled(id);
      setEnabled(id, nowEnabled);

      toggleBtn.style.background = nowEnabled ? "var(--color-ds-brown, #5c3d1e" : "transparent";
      toggleBtn.setAttribute("aria-pressed", nowEnabled);
      const knob = toggleBtn.querySelector("span");
      knob.style.left = nowEnabled ? "16px" : "2px";
      knob.style.background = nowEnabled ? "var(--color-parchment, #f5e6c8)" : "var(--color-ds-brown, #5c3d1e)";

      checkForChanges();
      updateEnabledCount();
    });
  });

  document.body.appendChild(panel);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    if (panel.style.display === "block") filterInput.focus();
  });

  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && e.target !== btn) {
      panel.style.display = "none";
    }
  });

  toolbar.insertBefore(btn, toolbar.firstChild);
}

document.addEventListener("DOMContentLoaded", () => {
  injectManagerButton();
  const observer = new MutationObserver(injectManagerButton);
  observer.observe(document.body, {childList: true, subtree: true});
});