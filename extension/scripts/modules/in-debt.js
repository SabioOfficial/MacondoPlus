(() => {
  if (!window.MacondoPlus?.isEnabled("in-debt")) return;

  const FAKE_GOLD = String("-" + Math.floor(Math.random() * 5000));
  let rafId = null;

  function patch() {
    const el = document.querySelector("img[alt='Gold'] ~ span");
    if (el && el.textContent !== FAKE_GOLD) el.textContent = FAKE_GOLD;
    rafId = null;
  }

  new MutationObserver(() => {
    if (!rafId) rafId = requestAnimationFrame(patch);
  }).observe(document.documentElement, {childList: true, subtree: true});

  patch();
})();