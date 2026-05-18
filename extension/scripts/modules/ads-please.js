(() => {
  if (!window.MacondoPlus?.isEnabled("ads-please")) return;

  const AD_FILES = [
    "ad1.png",
    "ad2.png",
    "ad3.png",
    "ad4.png",
    "ad5.png",
    "ad6.png"
  ];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function adUrl(file) {
    return chrome.runtime.getURL(`images/${file}`);
  }

  function randomPosition() {
    const maxTop = window.innerHeight - 600;
    const maxLeft = window.innerWidth - 120;
    return {
      top: Math.round(rand(0, Math.max(0, maxTop))),
      left: Math.round(rand(0, Math.max(0, maxLeft))),
    };
  }

  function spawnAd(file) {
    const ad = document.createElement("div");
    ad.className = "macondoplus-ad";

    const {top, left} = randomPosition();
    const tilt = rand(-2.5, 2.5);

    ad.style.cssText = `
      position: fixed;
      top: ${top}px;
      left: ${left}px;
      width: 120px;
      height: 600px;
      z-index: 999999;
      transform: rotate(${tilt.toFixed(2)}deg);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
      border: 2px solid rgba(0, 0, 0, 0.15);
      overflow: hidden;
      background: #eee;
      animation: macondoplus-fadein 250ms ease-out;
    `;

    const img = document.createElement("img");
    img.src = adUrl(file);
    img.draggable = false;
    img.alt = "Advertisement";
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      cursor: pointer;
    `;
    img.addEventListener("click", () => {
      window.open("https://macondoplus.sabiothedev.xyz/", "_blank").focus();
    });

    const label = document.createElement("div");
    label.textContent = "Ad";
    label.style.cssText = `
      position: absolute;
      bottom: 3px;
      left: 3px;
      font-size: 9px;
      font-family: sans-serif;
      font-weight: 700;
      color: rgba(0, 0, 0, .35);
      letter-spacing: 0.05em;
      pointer-events: none;
    `;  

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.textContent = "✖";
    closeBtn.title = "Close ad";
    closeBtn.style.cssText = `
      position: absolute;
      top: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    `;

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      ad.remove();
      const delay = rand(1000, 4000);
      setTimeout(() => document.body.appendChild(spawnAd(AD_FILES[Math.floor(Math.random() * AD_FILES.length)])), delay)
    });

    ad.appendChild(img);
    ad.appendChild(label);
    ad.appendChild(closeBtn);
    return ad;
  }

  function placeAds() {
    const shuffled = [...AD_FILES].sort(() => Math.random() - 0.5);
    const count = Math.min(10, shuffled.length);
    for (let i = 0; i < count; i++) {
      document.body.appendChild(spawnAd(shuffled[i]));
    }
  }

  if (document.body) placeAds();
  else document.addEventListener("DOMContentLoaded", placeAds);
})();