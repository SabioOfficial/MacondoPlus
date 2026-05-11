(function () {
  if (!window.MacondoPlus?.isEnabled("streak-intensity")) return;

  const STOPS = [
    [0, 254, 240, 138],
    [60, 249, 115, 22],
    [75, 245, 100, 24],
    [90, 240, 82, 26],
    [105, 235, 63, 32],
    [120, 228, 45, 38],
    [150, 220, 38, 38],
    [180, 185, 28, 28],
    [360, 127, 29, 29],
    [720, 26, 2, 2],
  ];

  function lerp(a, b, t) {
    return Math.round(a + (b - a) * t);
  }

  function minsToRGB(mins) {
    const first = STOPS[0], last = STOPS[STOPS.length - 1];
    if (mins <= first[0]) return [first[1], first[2], first[3]];
    if (mins >= last[0]) return [last[1], last[2], last[3]];
    for (let i = 0; i < STOPS.length - 1; i++) {
      const [m0, r0, g0, b0] = STOPS[i];
      const [m1, r1, g1, b1] = STOPS[i + 1];
      if (mins >= m0 && mins <= m1) {
        const t = (mins - m0) / (m1 - m0);
        return [lerp(r0, r1, t), lerp(g0, g1, t), lerp(b0, b1, t)];
      }
    }
    return [first[1], first[2], first[3]];
  }

  function applyIntensity(root) {
    (root || document).querySelectorAll("[title]").forEach(el => {
      const title = el.getAttribute("title") || "";
      const m = title.match(/:\s*(\d+)\s*min\s+logged/i);
      if (!m) return;
      const mins = parseInt(m[1], 10);
      if (el.dataset.mpIntensityMins === String(mins)) return;
      el.dataset.mpIntensityMins = String(mins);
      const [r, g, b] = minsToRGB(mins);
      el.style.background = `rgb(${r}, ${g}, ${b})`;
      el.style.borderColor = `rgb(${Math.round(r*.7)}, ${Math.round(g*.7)}, ${Math.round(b*.7)})`;
    });
  }

  const LEGEND_STOPS = [
    [0, "≤ 1hr"],
    [60, "1hr"],
    [120, "2hr"],
    [180, "3hr"],
    [360, "6hr"],
    [720, "≥ 12hr"],
  ];

  function findLegend() {
    for (const span of document.querySelectorAll(".inline-flex.items-center.gap-1")) {
      if (span.textContent.includes("Active") && span.querySelector(".lucide-flame")) {
        return span.parentElement;
      }
    }
    return null;
  }

  function applyLegend() {
    const legend = findLegend();
    if (!legend || legend.dataset.mpIntensityLegend) return;
    legend.dataset.mpIntensityLegend = "1";

    const seperator = document.createElement("span");
    seperator.style.cssText = `
      width: 1px;
      height: 10px;
      background: currentColor;
      opacity: 0.2;
      margin: 0 2px;
    `;
    legend.appendChild(seperator);

    LEGEND_STOPS.forEach(([mins, label]) => {
      const [r, g, b] = minsToRGB(mins === 0 ? 0 : mins);
      const dr = Math.round(r*.7), dg = Math.round(g*.7), db = Math.round(b*.7);
      const entry = document.createElement("span");
      entry.className = "inline-flex items-center gap-1";
      entry.innerHTML = `
        <span style="width: 12px; height: 12px; display: inline-block; background: rgb(${r}, ${g}, ${b}); border: 1px solid rgb(${dr}, ${dg}, ${db}); flex-shrink: 0;"></span>${label}
      `;
      legend.appendChild(entry);
    });
  }

  function init() {
    applyIntensity(document);
    applyLegend();
    const observer = new MutationObserver(() => {
      applyIntensity(document);
      applyLegend();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["title"],
    });
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();