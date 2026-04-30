const FRUIT_GOLD = {
  mango: 5,
  pineapple: 15,
  papaya: 25,
  cocoa: 60,
  guava: 5,
  coconut: 15,
  watermelon: 25,
  avocado: 60,
};

function getFruitFromImg(imgSrc) {
  const match = imgSrc.match(/\/fruits\/([^/]+)\//);
  return match ? match[1].toLowerCase() : null;
}

function getPendingCount(span) {
  const textSpan = [...span.querySelectorAll("span")].find(span => /^\d+\s+pending$/.test(span.textContent.trim()));
  if (!textSpan) return null;
  return parseInt(textSpan.textContent.trim(), 10);
}

function injectGoldEstimate(pendingSpan) {
  if (pendingSpan.dataset.goldInjected) return;

  const img = pendingSpan.querySelector("img");
  if (!img) return;

  const fruit = getFruitFromImg(img.src);
  const goldEach = fruit ? FRUIT_GOLD[fruit] : null;
  if (goldEach == null) return;

  const count = getPendingCount(pendingSpan);
  if (count == null) return;

  const totalGold = count * goldEach;

  pendingSpan.dataset.goldInjected = "true";

  const goldEstimatedLabel = document.createElement("span");
  goldEstimatedLabel.className = "macondoplus-gold-est-label";
  goldEstimatedLabel.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: 6px;
    padding: 0.5rem 0.75rem;
    background: rgb(252 239 207/var(--tw-bg-opacity,1));
    border: 3px solid #8f690a99;
    color: rgb(95 70 7/var(--tw-text-opacity,1));
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25rem;
    white-space: nowrap;
    pointer-events: none;
  `;
  goldEstimatedLabel.textContent = `${totalGold} gold`;

  pendingSpan.after(goldEstimatedLabel);
}

function scanForPendingSpans() {
  document.querySelectorAll("span[title^='If you ship now']").forEach(span => {
    injectGoldEstimate(span);
  });
}

function initGoldEstimator() {
  if (!window.MacondoPlus?.isEnabled("gold-estimator")) return;

  scanForPendingSpans();

  const observer = new MutationObserver(scanForPendingSpans);
  observer.observe(document.body, {childList: true, subtree: true});
}

document.addEventListener("DOMContentLoaded", initGoldEstimator);