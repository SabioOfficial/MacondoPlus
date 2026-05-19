(() => {
  if (!window.MacondoPlus?.isEnabled("flashlight")) return;

  function init() {
    const style = document.createElement("style");
    style.textContent = `
      .macondoplus-flashlight-overlay {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 999999;
        background: radial-gradient(circle 40px at var(--mp-fx, -9999px) var(--mp-fy, -9999px), transparent 30px, rgba(0, 0, 0, 0.97) 55px);
      }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.className = "macondoplus-flashlight-overlay";
    document.body.appendChild(overlay);

    document.addEventListener("mousemove", e => {
      overlay.style.setProperty("--mp-fx", e.clientX + "px");
      overlay.style.setProperty("--mp-fy", e.clientY + "px");
    });
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();