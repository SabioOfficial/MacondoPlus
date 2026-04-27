// const meow = document.createElement("style");
// meow.textContent = `
//   
// `;
// (document.head || document.documentElement).appendChild(meow);

const DARK_MODE_KEY = "macondoplus_darkmode";
const DARK_STYLE_ID = "macondoplus-dark-style";

function isDarkMode() {
  return localStorage.getItem(DARK_MODE_KEY) === "true";
}

function applyDarkMode(enabled) {
  let styleEl = document.getElementById(DARK_STYLE_ID);
  if (enabled) {
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = DARK_STYLE_ID;
      (document.head || document.documentElement).appendChild(styleEl);
    }

    styleEl.textContent = `
      .game-world {
        background: url('https://i.ibb.co/CsPjKrY6/background-dark-real.webp') !important; 
      } 
      .game-world .palma,
      .donkey-area img,
      .house-area img {
        filter: brightness(0.6) !important; 
      }
      .donkey-area img:hover,
      .house-area img:hover {
        filter: brightness(0.8) !important;
      }
      .game-world .farm-area img,
      .plot-plus-iso {
        filter: brightness(0.45) !important;
      }
      div.flex.items-center.gap-2.ml-auto > button,
      div.flex.items-center.gap-2.ml-auto > div,
      div.flex.items-center.gap-2.ml-auto > div > button,
      div.flex.items-center.gap-2.ml-auto > a,
      div.fixed.bottom-5.left-5.z-50 > div.relative.inline-block > button,
      button.macondoplus-search-btn,
      div.fixed.inset-0.overflow-hidden.bg-parchment > div > button.fixed,
      div.project-panel > div > div.absolute.top-2.bottom-2.left-3.right-3.bg-parchment,
      div.project-panel div.panel-info > *,
      div.absolute.top-2.bottom-2.left-3.right-3.bg-parchment,
      div.flex.flex-col.-m-4.bg-parchment > button,
      div.bg-parchment.relative.overflow-hidden,
      div.bg-parchment.relative.overflow-hidden *,
      div.relative.flex-1.min-h-0.w-full.p-4.overflow-y-auto *,
      div.macondoplus-search-panel *,
      div.macondoplus-search-panel {
        background-color: rgb(104, 77, 58);
        color: #eacfb3e6;
        border-color: rgb(70, 46, 30);
      }
      div.flex.items-center.gap-2.ml-auto * {
        color: inherit;
      }
    `;
  } else {
    styleEl?.remove();
  }
}

function updateButton(btn, enabled) {
  btn.innerHTML = enabled ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun lucide w-4 h-4 md:w-5 md:h-5 w-4 h-4 md:w-5 md:h-5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon w-4 h-4 md:w-5 md:h-5 w-4 h-4 md:w-5 md:h-5"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`;
  btn.setAttribute("aria-label", enabled ? "Disable dark mode" : "Enable dark mode");
}

function injectDarkModeButton() {
  if (document.querySelector(".macondoplus-darkmode-btn")) return;

  const toolbar = document.querySelector("div.flex.items-center.gap-2.ml-auto");
  if (!toolbar) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "macondoplus-darkmode-btn flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 h-[34px] sm:h-[38px] md:h-[46px] bg-parchment/90 backdrop-blur-sm border-[3px] border-ds-brown text-ds-brown hover:bg-parchment transition-colors focus:outline-none focus:ring-2 focus:ring-ds-brown/40"

  const enabled = isDarkMode();
  updateButton(btn, enabled);
  applyDarkMode(enabled);

  btn.addEventListener("click", () => {
    const nowEnabled = !isDarkMode();
    localStorage.setItem(DARK_MODE_KEY, nowEnabled);
    applyDarkMode(nowEnabled);
    updateButton(btn, nowEnabled);
  });

  toolbar.insertBefore(btn, toolbar.firstChild);
}

applyDarkMode(isDarkMode());

document.addEventListener("DOMContentLoaded", () => {
  injectDarkModeButton();
  const observer = new MutationObserver(injectDarkModeButton);
  observer.observe(document.body, {childList: true, subtree: true});
});