if (window.MacondoPlus?.isEnabled("infinite-scroll")) {
  function getLoadMoreButton() {
    return [...document.querySelectorAll("button")].find(
      b => b.textContent.trim() === "Load more"
    );
  }

  let loading = false;

  const sentinel = new IntersectionObserver(entries => {
    if (loading) return;
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const btn = getLoadMoreButton();
        if (btn) {
          loading = true;
          btn.click();
          const mo = new MutationObserver(() => {
            loading = false;
            mo.disconnect();
          });
          mo.observe(document.body, {childList: true, subtree: true});
        }
      }
    }
  }, {rootMargin: "200px"});

  function attachSentinel() {
    const btn = getLoadMoreButton();
    if (!btn || btn.dataset.mpfSentinel) return;
    btn.dataset.mpfSentinel = "1";
    sentinel.observe(btn);
  }

  function init() {
    const mo = new MutationObserver(attachSentinel);
    mo.observe(document.body, {childList: true, subtree: true});
    attachSentinel();
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
}