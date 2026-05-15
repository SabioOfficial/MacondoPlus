const ext = typeof browser !== "undefined" ? browser : chrome;

document.getElementById("version").textContent = "v" + ext.runtime.getManifest().version;

document.getElementById("btn-macondo").addEventListener("click", () => {
  ext.tabs.create({url: "https://macondo.hackclub.com/projects/349"});
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