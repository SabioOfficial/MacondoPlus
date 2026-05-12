(function () {
  if (document.getElementById("macondoplus-styles") || !window.MacondoPlus?.isEnabled("macondoplus-styles")) return;
  const style = document.createElement("style");
  style.id = "macondoplus-styles";
  style.textContent = `
    @keyframes macondoplus-fadein {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes macondoplus-fadeout {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
    @keyframes macondoplus-fadein-with-scale {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes macondoplus-fadeout-with-scale {
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
    .macondoplus-panel-open {
      animation: macondoplus-fadein 200ms ease forwards;
    }
    .macondoplus-panel-close {
      animation: macondoplus-fadeout 200ms ease forwards;
    }
    .macondoplus-panel-open-with-scale {
      animation: macondoplus-fadein-with-scale 200ms ease forwards;
    }
    .macondoplus-panel-close-with-scale {
      animation: macondoplus-fadeout-with-scale 200ms ease forwards;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
})();