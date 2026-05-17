function init() {
  if (document.getElementById("macondoplus-styles")) return;
  const style = document.createElement("style");
  style.id = "macondoplus-styles";
  style.textContent = `
    div.px-4.py-2.text-center.text-sm.font-bold.text-ds-success {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    div > div.flex.flex-col.gap-2 > a.group.relative.min-h-20.overflow-hidden.border-2.px-4.py-3.transition-colors {
      min-height: 0 !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
}

function fixAvatar() {
  const avatar = document.querySelector("div.rounded-full.overflow-hidden[class*='border-ds-brown']");
  if (!avatar) return;

  Object.assign(avatar.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const img = avatar.querySelector("img");
  if (!img) return;

  Object.assign(img.style, {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    margin: "0",
  });
}

function fixLockedButtons() {
  document.querySelectorAll("button[disabled].w-full.py-3.px-4").forEach(btn => {
    const span = btn.querySelector("span");
    if (!span || span.querySelector(".macondoplus-label")) return;

    const img = span.querySelector("img[src*='starfruit']");
    if (!img) return;

    img.classList.remove("opacity-40");

    span.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = "";
    });

    const label = document.createElement("span");
    label.className = "macondoplus-label";
    label.textContent = "1 needed";
    span.appendChild(label);
  });
}

const observer = new MutationObserver(() => {
  observer.disconnect();
  fixLockedButtons();
  fixAvatar();
  observer.observe(document.body, {childList: true, subtree: true});
});

if (window.MacondoPlus?.isEnabled("styling-fixes")) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
      fixLockedButtons();
      fixAvatar();
      observer.observe(document.body, {childList: true, subtree: true});
    });
  } else {
    init();
    fixLockedButtons();
    fixAvatar();
    observer.observe(document.body, {childList: true, subtree: true});
  }
}