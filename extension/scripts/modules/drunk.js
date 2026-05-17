(() => {
  if (!window.MacondoPlus?.isEnabled("drunk")) return;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes macondoplus-drunk-sway {
      0% {
        transform: rotate(calc(var(--drunk-ang) * -1deg)) translateX(calc(var(--drunk-tx) * -1px));
      }
      28% {
        transform: rotate(calc(var(--drunk-ang) * 0.8deg)) translateX(calc(var(--drunk-tx) * 0.6px)) translateY(calc(var(--drunk-tx) * 0.3px));
      }
      55% {
        transform: rotate(calc(var(--drunk-ang) * -0.5deg)) translateX(calc(var(--drunk-tx) * 1px)) translateY(calc(var(--drunk-tx) * -0.4px));
      }
      80% {
        transform: rotate(calc(var(--drunk-ang) * 0.3deg)) translateX(calc(var(--drunk-tx) * -0.4px)) translateY(calc(var(--drunk-tx) * 0.2px));
      }
      100% {
        transform: rotate(calc(var(--drunk-ang) * -1deg)) translateX(calc(var(--drunk-tx) * -1px));
      }
    }
    @keyframes macondoplus-drunk-spin {
      to {
        transform: rotate(360deg);
      }
    }
    .macondoplus-drunk-target {
      transform-origin: 50% 50%;
      --drunk-ang: 0;
      --drunk-tx: 0;
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  function getTarget() {
    const existing = document.querySelector(".macondoplus-drunk-target");
    if (existing) return existing;
    const el = document.querySelector("div.fixed.inset-0");
    if (el) el.classList.add("macondoplus-drunk-target");
    return el;
  }

  const startTime = Date.now();
  const SWAY_END = 25_000;
  const SPIN_PEAK = 60_000;

  function update() {
    const target = getTarget();
    if (!target) return;

    const elapsed = Date.now() - startTime;

    if (elapsed < SWAY_END) {
      const p = elapsed / SWAY_END;
      target.style.setProperty("--drunk-ang", (p * 28).toFixed(2));
      target.style.setProperty("--drunk-tx",  (p * 35).toFixed(2));
      const cycleDur = (2.8 - p * 1.3).toFixed(2);
      target.style.animation = `macondoplus-drunk-sway ${cycleDur}s ease-in-out infinite`;
    } else {
      const p = Math.min((elapsed - SWAY_END) / (SPIN_PEAK - SWAY_END), 1);
      const spinDur = Math.max(0.12, 4 - p * 3.88);
      target.style.animation = `macondoplus-drunk-spin ${spinDur.toFixed(3)}s linear infinite`;
    }
  }

  setInterval(update, 350);
  update();
})();