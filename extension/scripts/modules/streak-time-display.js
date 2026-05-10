(function () {
  const TAG = "[mp:streak-time]";
  if (!window.MacondoPlus?.isEnabled("streak-time-display")) return;

  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function formatTime(mins) {
    if (mins >= 60) {
      const h = Math.floor(mins / 60), m = mins % 60;
      return m ? `${h}h ${m}m` : `${h}h`;
    }
    return `${mins}m`;
  }

  function readCache() {
    try {
      const v = JSON.parse(localStorage.getItem("macondoplus_today_mins"));
      if (v && v.ts && (Date.now() - v.ts) < 60_000) return v.mins;
    } catch (_) {}
    return null;
  }

  function writeCache(mins) {
    localStorage.setItem("macondoplus_today_mins", JSON.stringify({ts: Date.now(), mins}));
  }

  function fetchMins() {
    return new Promise(resolve => {
      const today = todayISO();
      let settled = false;

      function done(value) {
        if (settled) return;
        settled = true;
        try {document.body.removeChild(iframe);} catch (_) {}
        resolve(value);
      }

      const iframe = document.createElement("iframe");
      iframe.src = "https://macondo.hackclub.com/profile";
      iframe.style.cssText = [
        "position: fixed",
        "top: -9999px",
        "left: -9999px",
        "width: 390px",
        "height: 844px",
        "opacity: 0",
        "pointer-events: none",
        "border: none",
        "z-index: -1",
      ].join(";"); // lets make this stupidly complicated :D

      const timeoutId = setTimeout(() => {
        done(null);
      }, 10_000);

      function scanForTodayCell() {
        if (settled) return;
        try {
          const doc = iframe.contentDocument;
          if (!doc || !doc.body) {setTimeout(scanForTodayCell, 500); return;}

          const allTitled = doc.querySelectorAll("[title]");
          for (const el of allTitled) {
            const t = el.getAttribute("title") || "";
            const m = t.match(new RegExp(`^${today}:\\s*(\\d+)\\s*min`, "i"));
            if (m) {
              clearTimeout(timeoutId);
              return done(parseInt(m[1], 10));
            }
            if (t === today) {
              clearTimeout(timeoutId);
              return done(0);
            }
          }

          setTimeout(scanForTodayCell, 500);
        } catch (e) {
          clearTimeout(timeoutId);
          done(null);
        }
      }

      function clickCalendarToggle(doc) {
        const buttons = doc.querySelectorAll("button");
        for (const btn of buttons) {
          if (btn.textContent.trim().toLowerCase().includes("streak calendar")) {
            btn.click();
            return true;
          }
        }
        return false;
      }

      iframe.addEventListener("load", () => {
        setTimeout(() => {
          if (settled) return;
          try {
            const doc = iframe.contentDocument;
            if (!doc) {
              done(null);
              return;
            }
            clickCalendarToggle(doc);
            setTimeout(scanForTodayCell, 500);
          } catch (e) {
            done(null);
          }
        }, 1_500);
      });

      document.body.appendChild(iframe);
    });
  }

  async function getMins() {
    try {
      return await fetchMins();
    } catch (err) {
      return null;
    }
  }

  function findStreakButton() {
    return (
      document.querySelector("button[title*='streak' i]") || document.querySelector("button[aria-label*='streak' i]")
    );
  }

  function renderBadge(btn, mins) {
    const pct = Math.min(100, Math.round((mins / 60) * 100));
    const label = `${formatTime(mins)}/1hr`;
    const done = mins >= 60;
    const fg = done ? "rgb(206, 92, 35)" : "rgb(104 77 58)";

    let el = btn.querySelector(".mp-streak-time");
    if (!el) {
      el = document.createElement("span");
      el.className = "mp-streak-time";
      el.style.cssText = `
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 2px;
        margin-left: 5px;
        line-height: 1;
        pointer-events: none;
      `;
      el.innerHTML = `
        <span class="mp-sl" style="font-size: 11px; font-weight: 700; white-space: nowrap; opacity: 0.9;"></span>
        <span style="width: 100%; height: 3px; border-radius: 2px; background: rgba(92, 61, 30, 0.15); overflow: hidden;">
          <span class="mp-sf" style="display: block; height: 100%; border-radius: 2px; transition: width .4s, background .4s"></span>
        </span>
      `;
      btn.appendChild(el);
    }
    el.querySelector(".mp-sl").textContent = label;
    el.querySelector(".mp-sl").style.color = done ? fg : "var(--color-ds-brown, #5c3d1e)";
    el.querySelector(".mp-sf").style.width = `${pct}%`;
    el.querySelector(".mp-sf").style.background = fg;
  }

  function paintFromCache() {
    const cached = readCache();
    if (cached === null) return;
    const btn = findStreakButton();
    if (btn) renderBadge(btn, cached);
  }

  async function refresh() {
    const mins = await getMins();
    if (mins !== null) {
      writeCache(mins);
      const btn = findStreakButton();
      if (btn) renderBadge(btn, mins);
    } else {
      paintFromCache();
    }
  }

  function onMutation() {
    const btn = findStreakButton();
    if (!btn) return;
    if (!btn.querySelector(".mp-streak-time")) paintFromCache();
  }

  function init() {
    paintFromCache();
    refresh();
    setInterval(refresh, 60_000);
    const observer = new MutationObserver(onMutation);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["title", "aria-label"],
    });
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();