(() => {
  if (!window.MacondoPlus?.isEnabled("25%-redder")) return;

  function init() {
    const style = document.createElement("style");
    style.textContent = `
      html {
        filter: url(#macondoplus-more-red-filter);
      }
    `;
    document.head.appendChild(style);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.cssText = `
      position: absolute;
      pointer-events: none;
    `;
    svg.innerHTML = `
      <defs>
        <filter id="macondoplus-more-red-filter" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="1.25 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
        </filter>
      </defs>
    `;
    document.body.appendChild(svg);
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();