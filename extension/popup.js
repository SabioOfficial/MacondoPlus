const ext = typeof browser !== "undefined" ? browser : chrome;
const IS_FIREFOX = navigator.userAgent.toLowerCase().includes("firefox");
const CHROME_STORE_URL = `https://chromewebstore.google.com/detail/macondo+/ldhbamehlholbmcfmihlhagjpdkmjlgo`;
const FIREFOX_STORE_URL = `https://addons.mozilla.org/en-US/firefox/addon/macondo/`;
const STORE_URL = IS_FIREFOX ? FIREFOX_STORE_URL : CHROME_STORE_URL;

function isNewer(localVersion, storeVersion) {
  const parse = v => v.replace(/^v/, "").split(".").map(n => { const x = parseInt(n, 10); return isNaN(x) ? 0 : x; });
  const [lMaj, lMin, lPat] = parse(localVersion);
  const [sMaj, sMin, sPat] = parse(storeVersion);
  if (sMaj !== lMaj) return sMaj > lMaj;
  if (sMin !== lMin) return sMin > lMin;
  return sPat > lPat;
}

async function fetchStoreVersion() {
  if (IS_FIREFOX) {
    const res = await fetch(`https://addons.mozilla.org/api/v5/addons/addon/macondo/`);
    if (!res.ok) throw new Error(`AMO ${res.status}`);
    const json = await res.json();
    const version = json?.current_version?.version;
    if (!version) throw new Error("AMO version field missing or unexpected shape");
    return version;
  } else {
    const res = await fetch("https://api.github.com/repos/SabioOfficial/MacondoPlus/releases/latest");
    if (!res.ok) throw new Error(`GitHub releases ${res.status}`);
    const json = await res.json();
    const version = json?.tag_name;
    if (!version) throw new Error("GitHub release tag missing");
    return version;
  }
}

async function checkForUpdate() {
  const localVersion = ext.runtime.getManifest().version;
  const cacheKey = "mp_version_cache";
  const cached = await ext.storage.local.get(cacheKey);
  const entry = cached[cacheKey];

  let storeVersion;
  if (entry && Date.now() - entry.timestamp < 3_600_000) {
    storeVersion = entry.version;
  } else {
    storeVersion = await fetchStoreVersion();
    await ext.storage.local.set({[cacheKey]: {timestamp: Date.now(), version: storeVersion}});
  }

  const banner = document.getElementById("update-banner");
  const bannerVersions = document.getElementById("update-banner-versions");
  const bannerBtn = document.getElementById("update-banner-btn");

  if (isNewer(localVersion, storeVersion)) {
    bannerVersions.textContent = `A new version (${storeVersion}) is available!`;
    bannerBtn.addEventListener("click", () => {
      ext.tabs.create({url: STORE_URL});
      window.close();
    });
    banner.classList.add("visible");
  }
}

document.getElementById("version").textContent = "v" + ext.runtime.getManifest().version;

document.getElementById("btn-macondo").addEventListener("click", () => {
  ext.tabs.create({url: "https://macondoplus.sabiothedev.xyz/"});
  window.close();
});
document.getElementById("btn-github").addEventListener("click", () => {
  ext.tabs.create({url: "https://github.com/SabioOfficial/MacondoPlus"});
  window.close();
});

async function getCommits() {
  const cached = await ext.storage.local.get("mp_commits_cache");
  const entry = cached["mp_commits_cache"];
  if (entry && Date.now() - entry.timestamp < 900000) return entry.commits;

  const res = await fetch("https://api.github.com/repos/SabioOfficial/MacondoPlus/commits?per_page=15");
  if (!res.ok) throw new Error(`Github ${res.status}`);
  const list = await res.json();

  const commits = list.map(c => ({
    sha: c.sha.slice(0, 7),
    url: c.html_url,
    message: c.commit.message.split("\n")[0],
    author: c.commit.author.name,
    date: c.commit.author.date.slice(0, 10),
  }));

  await ext.storage.local.set({
    "mp_commits_cache": {
      timestamp: Date.now(),
      commits
    }
  });

  return commits;
}

function renderCommits(commits) {
  const container = document.getElementById("commits");
  container.innerHTML = "";

  for (const c of commits) {
    const row = document.createElement("div");
    row.className = "commit";
    row.title = c.message;
    row.addEventListener("click", () => {
      ext.tabs.create({url: c.url});
      window.close();
    });

    row.innerHTML = `
      <div class="commit-top">
        <span class="commit-msg">${escHtml(c.message)}</span>
      </div>
      <div class="commit-meta">
        <span class="commit-sha">${c.sha}</span>
        <span>${escHtml(c.author)}</span>
        <span>${c.date}</span>
      </div>
    `;

    container.appendChild(row);
  }
}

function escHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function showError(msg) {
  document.getElementById("commits").innerHTML = `
    <div class="state state-error">${msg}</div>
  `;
}

getCommits()
  .then(renderCommits)
  .catch(err => {
    console.error(err);
    showError(err.message.includes("404") ? "Repo not found." : "Couldn't load commits.");
  });

checkForUpdate().catch(err => console.warn("[Macondo+] Version check failed:", err));