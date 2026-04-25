function injectShopLink() {
  if (document.querySelector(".macondoplus-shop-link")) return;
  if (!document.querySelector('button[aria-label="How does currency work?"]')) return;

  const backBtn = document.querySelector("button.self-start");
  if (!backBtn || !backBtn.textContent.trim().includes("Back to farm")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "flex items-center justify-between";

  const a = document.createElement("a");
  a.href = "https://macondo.hackclub.com/shop";
  a.target = "_blank";
  a.className = "text-sm text-ds-brown flex items-center gap-1 hover:opacity-70 transition-opacity";
  a.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M15 3h6v6"/>
      <path d="M10 14 21 3"/>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    </svg> open in new tab
  `;
  backBtn.parentElement.insertBefore(wrapper, backBtn);
  wrapper.appendChild(backBtn);
  wrapper.appendChild(a);
  backBtn.classList.remove("self-start");
}

document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver(injectShopLink);
  observer.observe(document.body, {childList: true, subtree: true});
});