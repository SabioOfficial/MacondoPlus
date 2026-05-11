(function () {
  if (document.getElementById("macondoplus-styles") || !window.MacondoPlus?.isEnabled("macondoplus-styles")) return;
  const style = document.createElement("style");
  style.id = "macondoplus-styles";
  style.textContent = `
    @keyframes macondoplus-fadein {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes macondoplus-fadeout {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.95);
      }
    }
    .macondoplus-toggle:disabled {
      cursor: not-allowed !important;
      filter: blur(2px);
    }
  `;
  (document.head || document.documentElement).appendChild(style);
})();