(() => {
  if (!window.MacondoPlus?.isEnabled("extra-fruity-badge")) return;

  const cache = new Map();

  function getProjectId(card) {
    const raw = card.dataset.cardId;
    if (!raw?.startsWith("p-")) return null;
    return raw.slice(2);
  }

  function addStar(card) {
    const thumbnail = card.querySelector(".aspect-\\[16\\/10\\]");
    if (!thumbnail || thumbnail.querySelector(".macondoplus-extra-fruity-star")) return;

    const star = document.createElement("div");
    star.className = "macondoplus-extra-fruity-star";
    star.style.cssText = `
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 32px;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(245, 230, 200, 0.95);
      border: 2px solid #b45309;
      border-radius: 2px;
    `;
    star.title = "Extra fruity!";
    star.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    `;
    thumbnail.appendChild(star);
  }

  async function processCard(card) {
    const id = getProjectId(card);
    if (!id) return;
    if (card.dataset.extraFruityChecked) return;
    card.dataset.extraFruityChecked = "1";

    if (cache.has(id)) {
      if (cache.get(id) === true) addStar(card);
      return;
    }

    cache.set(id, "pending");
    try {
      const res = await fetch(`https://macondo.hackclub.com/api/projects/${id}`);
      if (!res.ok) {
        cache.set(id, false);
        return;
      }
      const data = await res.json();
      cache.set(id, !!data.is_extra_fruity);
      if (data.is_extra_fruity) addStar(card);
    } catch {
      cache.set(id, false);
    }
  }

  function scanCards() {
    document.querySelectorAll("[data-card-id]").forEach(processCard);
  }

  scanCards();

  const observer = new MutationObserver(scanCards);
  observer.observe(document.documentElement, {childList: true, subtree: true});
})();