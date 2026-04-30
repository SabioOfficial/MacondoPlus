if (window.MacondoPlus?.isEnabled("better-page-titles")) {
  let desiredTitle = null;
  let titleObserver = null;

  function changePageTitle(title) {
    desiredTitle = title;
    document.title = title;

    const titleEl = document.querySelector("title");
    if (!titleEl) return;

    if (titleObserver) titleObserver.disconnect();

    titleObserver = new MutationObserver(() => {
      if (document.title != desiredTitle) {
        document.title = desiredTitle;
      }
    });

    titleObserver.observe(titleEl, {childList: true, characterData: true, subtree: true});
  }

  function updateTitle() {
    const path = window.location.pathname;
    if (path === "/dashboard") {
      changePageTitle("Macondo | Dashboard");
    } else if (path === "/shop") {
      changePageTitle("Macondo | Shop");
    } else if (path === "/profile") {
      changePageTitle("Macondo | Profile");
    } else if (/^\/projects\/\d+$/.test(path)) {
      const projectTitle = document.querySelector("h1.text-xl");
      if (projectTitle) {
        changePageTitle(`Macondo | ${projectTitle.textContent}`);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateTitle();
    const observer = new MutationObserver(updateTitle);
    observer.observe(document.body, {childList: true, subtree: true});
  });
}