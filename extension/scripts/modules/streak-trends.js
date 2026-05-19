(() => {
  if (!window.MacondoPlus?.isEnabled("streak-trends")) return;

  function parseCalendar() {
    return [...document.querySelectorAll("[title]")].map(el => {
      const title = el.getAttribute("title") || "";
      const minsMatch = title.match(/:\s*(\d+)\s*min\s+logged/i);
      const dateMatch = title.match(/(\d{4}-\d{2}-\d{2})/);
      if (!minsMatch || !dateMatch) return null;
      return {
        mins: parseInt(minsMatch[1], 10),
        date: dateMatch[1],
      };
    }).filter(Boolean).filter(d => !isNaN(d.mins));
  }

  function fmtDate(str) {
    if (!str) return "-";
    return new Date(str + "T00:00:00").toLocaleDateString("en-GB", {day: "numeric", month: "short"});
  }

  function fmtMins(m) {
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60), rem = m % 60;
    return rem ? `${h}h ${rem}m` : `${h}h`;
  }

  function buildSparkline(days, w, h) {
    if (days.length < 2) return "";
    const max = Math.max(...days.map(d => d.mins), 1);
    const pts = days.map((d, i) => {
      const x = (i / (days.length - 1)) * w;
      const y = h - (d.mins / max) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const dots = days.map((d, i) => {
      const x = (i / (days.length - 1)) * w;
      const y = h - (d.mins / max) * (h - 4) - 2;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="rgb(245,101,24)"/>`;
    }).join("");
    return `
      <polyline points="${pts.join(" ")}" fill="none" stroke="rgb(245,101,24)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
      ${dots}
    `;
  } 

  function computeTrend(days) {
    if (days.length < 4) return 0;
    const half = Math.floor(days.length / 2);
    const avg = arr => arr.reduce((s, d) => s + d.mins, 0) / arr.length;
    return avg(days.slice(half)) - avg(days.slice(0, half));
  }

  function renderPanel(days) {
    const logged = days.filter(d => d.mins > 0);
    if (!logged.length) return null;

    const avg = Math.round(logged.reduce((s, d) => s + d.mins, 0) / logged.length);
    const peak = logged.reduce((b, d) => d.mins > b.mins ? d : b, logged[0]);
    const trend = computeTrend(logged);
    const recent7 = logged.slice(-7);
    const recent7Avg = Math.round(recent7.reduce((s, d) => s + d.mins, 0) / recent7.length);
    const consistency = Math.round(logged.filter(d => d.mins >= 60).length / logged.length * 100);

    const trendLabel = trend > 8 ? "⮝ Improving" : trend < -8 ? "⮟ Declining" : "⮞ Steady";
    const trendColor = trend > 8 ? "#15803d" : trend < -8 ? "#dc2626" : "#b45309";

    const spark14 = logged.slice(-14);

    const panel = document.createElement("div");
    panel.className = "macondoplus-streak-trends";
    panel.style.cssText = `
      margin-top: 10px;
      padding: 10px 12px;
      background: rgba(92, 61, 30, 0.04);
      border: 1px solid rgba(92, 61, 30, 0.12);
      border-radius: 6px;
      color: var(--color-ds-brown, #5c3d1e);
      font-family: inherit;
    `;
    panel.innerHTML = `
      <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(92, 61, 30, 0.4); margin-bottom: 8px;">Streak Trends</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 10px;">
        <div>
          <div style="font-size: 9px; color: rgba(92, 61, 30, 0.45); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Avg / day</div>
          <div style="font-size: 14px; font-weight: 800;">${fmtMins(avg)}</div>
        </div>
        <div>
          <div style="font-size: 9px; color: rgba(92, 61, 30, 0.45); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Peak day</div>
          <div style="font-size: 14px; font-weight: 800;">${fmtMins(peak.mins)}</div>
          <div style="font-size: 9px; color: rgba(92, 61, 30, 0.45);">${fmtDate(peak.date)}</div>
        </div>
        <div>
          <div style="font-size: 9px; color: rgba(92, 61, 30, 0.45); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Consistency</div>
          <div style="font-size: 14px; font-weight: 800;">${consistency}%</div>
          <div style="font-size: 9px; color: rgba(92, 61, 30, 0.45);">hit 1hr/day</div>
        </div>
        <div>
          <div style="font-size: 9px; color: rgba(92, 61, 30, 0.45); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Trajectory</div>
          <div style="font-size: 14px; font-weight: 800; color: ${trendColor};">${trendLabel}</div>
          <div style="font-size: 9px; color: rgba(92, 61, 30, 0.45);">7d avg: ${fmtMins(recent7Avg)}</div>
        </div>
      </div>
      <div style="font-size: 9px; color: rgba(92, 61, 30, 0.45); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Last ${spark14.length} days</div>
      <svg id="mp-spark" width="100%" height="36" viewBox="0 0 640 36" preserveAspectRatio="none" style="display: block; overflow: visible;">
        ${buildSparkline(spark14, 640, 36)}
      </svg>
    `;

    requestAnimationFrame(() => {
      const svg = panel.querySelector("#mp-spark");
      if (!svg) return;
      const w = svg.getBoundingClientRect().width;
      if (w < 1) return;
      svg.setAttribute("viewBox", `0 0 ${w} 36`);
      svg.innerHTML = buildSparkline(spark14, w, 36);
    });

    return panel;
  }

  function inject() {
    if (document.querySelector(".macondoplus-streak-trends")) return;
    const days = parseCalendar();
    if (!days.length) return;
    const calendar = document.querySelector(".grid.grid-cols-7");
    if (!calendar) return;
    const panel = renderPanel(days);
    if (panel) calendar.after(panel);
  }

  function init() {
    inject();
    new MutationObserver((mutations) => {
      if (!document.querySelector(".macondoplus-streak-trends")) {
        inject();
        return;
      }
      const titleChanged = mutations.some(m => m.type === "attributes" && m.attributeName === "title");
      if (titleChanged) {
        const existing = document.querySelector(".macondoplus-streak-trends");
        if (existing) existing.remove();
        inject();
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["title"],
    });
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();