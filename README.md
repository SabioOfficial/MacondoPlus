<div align="center">
  <img src="https://raw.githubusercontent.com/SabioOfficial/MacondoPlus/refs/heads/main/extension/images/icon-128.png">
</div>
<div align="center">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/SabioOfficial/MacondoPlus?style=for-the-badge">
  <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/w/SabioOfficial/MacondoPlus?style=for-the-badge">
</div>
<br>
<div align="center">
  Macondo+ <i>(or MacondoPlus)</i> is a QoL-focused browser extension for Chrome and Firefox that improves the Macondo website drastically. From dark mode to keyboard shortcuts, from shop goals to displaying your progress on securing your streak for the day, we've got you covered!
</div>
<br>
<h2>Table of contents</h2>
<ul>
  <li>
    <a href="#modules">Modules</a>
    <ul>
      <li>
        <a href="#qol">QoL</a>
        <ul>
          <li><a href="#better-page-titles">Better Page Titles</a></li>
          <li><a href="#hide-feedback">Hide Feedback</a></li>
          <li><a href="#hide-idea-generator">Hide Idea Generator</a></li>
          <li><a href="#keyboard-shortcuts">Keyboard Shortcuts</a></li>
          <li><a href="#persistent-filters">Persistent Filters</a></li>
          <li><a href="#streak-time-display">Streak Time Display</a></li>
        </ul>
      </li>
      <li>
        <a href="#core">Core</a>
      </li>
      <li>
        <a href="#appearance">Appearance</a>
        <ul>
          <li><a href="#dark-mode">Dark Mode</a></li>
          <li><a href="#streak-intensity">Streak Intensity</a></li>
          <li><a href="#styling-fixes">Styling Fixes</a></li>
        </ul>
      </li>
      <li>
        <a href="#tools">Tools</a>
        <ul>
          <li><a href="#achievements">Achievements</a></li>
          <li><a href="#additional-project-info">Additional Project Info</a></li>
          <li><a href="#shop-categories">Shop Categories</a></li>
          <li><a href="#shop-goals">Shop Goals</a></li>
          <li><a href="#styling-fixes">Styling Fixes</a></li>
          <li><a href="#shop-sort-enhanced">Shop Sort Enhanced</a></li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <a href="#installation">Installation</a>
    <ul>
      <li><a href="#from-source">From Source</a></li>
      <li><a href="#from-webstore">From Webstore</a></li>
    </ul>
  </li>
  <li>
    <a href="#developers-guide">Developer's Guide</a>
    <ul>
      <li><a href="#how-the-module-system-works">How the module system works</a></li>
      <li>
        <a href="#creating-a-module">Creating a module</a>
        <ul>
          <li><a href="#1-registering-your-module">(1) Registering your module</a></li>
          <li><a href="#2-creating-your-module-file">(2) Creating your module file</a></li>
          <li><a href="#3-registering-your-file-in-the-manifest">(3) Registering your file in the manifest</a></li>
        </ul>
      </li>
      <li>
        <a href="#using-the-core-modules">Using the core modules</a>
        <ul>
          <li><a href="#using-the-built-in-panel-macondoplus-panel">Using the built-in panel (macondoplus-panel)</a></li>
          <li><a href="#using-the-shared-styles-macondoplus-styles">Using the shared styles (macondoplus-styles)</a></li>
        </ul>
      </li>
      <li>
        <a href="#additional-information--tools">Additional Information & Tools</a>
        <ul>
          <li><a href="#what-makes-a-core-module-special">What makes a Core module special?</a></li>
          <li><a href="#quick-start-checklist">Quick-start Checklist</a></li>
        </ul>
      </li>
    </ul>
  </li>
</ul>

## Modules

Modules are the main focus of Macondo+. You can toggle on <i>(or off)</i> modules to your heart's content. For developer's, making a module is incredibily easy. You only need 3 lines of code for adding your script as a module!

As the sole developer of Macondo+, I provide frequently updated modules, and new ones almost every day. To stay up to date with new and updated modules, please join the #macondoplus slack channel.

### QoL

This is one of the three categories a module can be. This category is for modules that add quality of life improvements to the site.

#### Better Page Titles

Makes the page titles useful.

#### Hide Feedback

Hides the annoying NPS (feedback) button.

#### Hide Idea Generator

Hides the slop project idea generator.

#### Keyboard Shortcuts

Adds keyboard shortcuts to Macondo. E for Shop, R for Profile, 1-9 for Projects, Esc to exit the current menu you're in, / to search for projects.

#### Persistent Filters

Remembers your last used explore filters across sessions.

#### Streak Time Display

Display how much time is left until your streak is logged in for the day!

### Core

Core modules are not features. It's the engines that make most modules work. This section is aimed at **developers** who want to build new modules for **Macondo+**.

Information for how to use Core Modules as a **developer** is available in <a href="#developers-guide">this section</a> of this readme.

### Appearance

This is one of the three categories a module can be. This category is for modules that add appearance changes to the website.

#### Dark Mode

Adds dark mode to Macondo (WIP)

#### Streak Intensity

Adds appearance changes to the Streak Calendar: the more time you spent working on that day, the more darker and red the day gets!

#### Styling Fixes

Fixes minor styling issues for Macondo that pisses you off.

### Tools

This is one of the three categories a module can be. This category is for modules that add additional tools to the website.

#### Achievements

Adds achievements.

#### Additional Project Info

Adds additional project metadata that the API exposes.

#### Shop Categories

Adds categories for shop items and a filter to narrow your search.

#### Shop Goals

Adds shop goals to the Shop.

#### Styling Fixes

Fixes minor styling issues for Macondo that pisses you off.

#### Shop Sort Enhanced

Adds extra sort options to the shop: A>Z, Z>A, etc.

## Installation

### From Source

> Unstable

Click on "Actions" on the Navigation bar, click on the first result (for Build Extension .zip), scroll down until you find "Artifacts". Download the "macondoplus-_(commit hash)_-unzip" and extract it. Then, it will create "macondoplus-use-this-in-extensions-page.zip". Now, follow the specific instructions on your respective browsers:

#### Chrome

> Please do the instructions above this browser-specific tutorial as it is requried.

Go to chrome://extensions/ on the URL bar. Unzip your zip once more to a folder (create one), and press the "Load unpacked" button on the top left of your screen in the Chrome Extensions tab. Choose the folder you just extracted your files to, which should have the images, scripts, manifest.json.

#### Firefox

> Please do the instructions under <a href="#from-source">"From Source"</a> as it is requried.

Go to about:addons on the URL bar. Press on the cogwheel which should be located in the top center-ish part of your screen (underneath the search bar). Press on it and click on "Install Add-on From File...". Select your zip.

### From Webstore

|                **Browser**                |     **Link**    |
|:-----------------------------------------:|:---------------:|
| Chromium (Chrome, Arc, Brave, Edge, etc.) | [Chrome Web Store](https://chromewebstore.google.com/detail/macondo+/ldhbamehlholbmcfmihlhagjpdkmjlgo) |
| Firefox (Firefox, Zen Browser, etc.)      | [Firefox Addons](https://addons.mozilla.org/en-US/firefox/addon/macondo/) |

## Developer's Guide

> You should have a basic understanding of Javascript and browser extensions before creating a module.

Want to create your **very own** custom modules for **Macondo+**? Well, it's simple. Here's a guide on how **you** can get it up and running!

---

### How the module system works

When the extension loads, it runs `content-script.js` first. That script creates a global object called `window.MacondoPlus` that every module can talk to. Think of it as a shared noticeboard that any module can read from.

```
content-script.js    -> sets up window.MacondoPlus
     👀 ↓
each module file     -> checks window.MacondoPlus, then does its purpose
```

The three properties `window.MacondoPlus` gives you:

| Property | What it is |
|---|---|
| `MODULES` | The full list of every registered module (an array of objects) |
| `isEnabled(id)` | A function. Pass a module's id, get back `true` or `false`. This is heavily used to disable the module if it is not enabled. You will likely need to use this. |
| `setEnabled(id, value)` | A function. Turn a module on or off and save the choice. |

---

### Creating a module

Let's create a custom module you will be making yourself. This will teach you basically everything you need. Good luck!

#### (1) Registering your module

Open `extension/scripts/content-script.js`. Inside the `MODULES` array near the top, add a new entry for your module:

> If your module is a WIP or is a silly/troll module, please enter `false` for `defaultEnabled`.

```js
{
  id: "my-peak-module",        // a unique --> kebab-case <-- id
  name: "My PEAK Module",      // the grammatically accurate name shown in the module manager
  description: "This is PEAK", // shown under the name in the manager
  category: "QoL",             // "QoL", "Tools", or "Appearance"
  defaultEnabled: true         // is it on by default when someone first installs a version with your module?
}
```

##### Categories

| Category | Use it when your module... |
|---|---|
| `"QoL"` | Makes the site easier or nicer to use |
| `"Appearance"` | Changes how something looks |
| `"Tools"` | Adds a brand-new tool or panel |
| `"Core"` | Powers other modules (only for internal infrastructure; you probably don't need this)

#### (2) Creating your module file

Create a new file at `extension/scripts/modules/my-peak-module.js`.

Every module follows the same (or similar, for older modules) three-line skeleton.

```js
(() => {
  if (window.MacondoPlus?.isEnabled("my-peak-module")) return;

  // your code goes after the if statement
})();
```

Alternatively, this is what was used for older modules: (and some newer modules) This is not used since nesting if statements are bad programming practices.

> Not recommended for general use. This is documented for archival purposes.

```js
if (window.MacondoPlus?.isEnabled("my-peak-module")) {
  // your code goes here
}
```

The `?.` after `MacondoPlus` is JavaScript's way of saying "only try to call `isEnabled` if `window.MacondoPlus` actually exists". It keeps things safe.

##### (Example) Hiding an element

> You should understand basic CSS and how to get a CSS selector for an element first.

```js
(() => {
  if (window.MacondoPlus?.isEnabled("my-peak-module")) return;
  const style = document.createElement("style");
  style.textContent = `
    .element {
      display: none !important;
    }
  `;
})();
```

##### (Example) Turning every H1 into custom text

```js
(() => {
  if (window.MacondoPlus?.isEnabled("my-peak-module")) return;
  document.addEventListener("DOMContentLoaded", () => {
    const heading = document.querySelector("h1");
    if (heading) {
      heading.textContent = "Hello Macondo!";
    }
  });
})();
```

#### (3) Registering your file in the manifest

Open `extension/manifest.json`. Find the `"js"` array inside `"content_scripts"` and add your file to the list:

> ⚠️ `content-script.js` **must** always be **first** in this list. It sets up `window.MacondoPlus` before any module file runs.

```json
"js": [
  "scripts/content-script.js",
  ...
  "scripts/modules/my-peak-module.js"
]
```

**Congratulations, your module is now live!**

---

### Using the core modules

A set of tutorials on how to use the core modules.

#### Using the built-in panel (macondoplus-panel)

The `macondoplus-panel` core module gives modules that need panels that look like the base website so you don't have to build it from scratch.

##### (Example) Basic panel

```js
(() => {
  if (window.MacondoPlus?.isEnabled("my-peak-module")) return;
  document.addEventListener("DOMContentLoaded", () => {
    // Create a new panel
    const {open, close, content} = window.MacondoPlus.newPanel();

    // Put whatever HTML you want inside of the panel
    content.innerHTML = `
      <h2>My Module</h2>
      <p>Ts peak!</p>
    `;

    // You can set it to open however you like; here, we use a button click
    const myButton = document.querySelector(".my-trigger-button");
    myButton.addEventListener("click", open);
  });
})();
```

`newPanel()` returns three things:

| | What it does |
|---|---|
| `open()` | Shows the panel |
| `close()` | Hides the panel |
| `content` | The DOM Content; put your HTML inside this |

#### Using the shared styles (macondoplus-styles)

The `macondoplus-styles` core module injects a small set of reusable CSS animations and utility classes that all modules share. You can use these CSS classes in any HTML your module creates:

| Class | What it does |
|---|---|
| `macondoplus-panel-open` | Fades an element in like the Macondo panel. |
| `macondoplus-panel-close` | Fades an element out like the Macondo panel. |
| `macondoplus-panel-open-with-scale` | Fades in *and* zooms in. |
| `macondoplus-panel-close-with-scale` | Fades out *and* zooms out. |

There are already used by the panel system internally, so you normally don't need to touch them. But if you're building a custom popup or toast notification, they're here for you to freely use.

---

### Additional Information & Tools

#### What makes a Core module special?

If you look at the module list in `content-script.js`, you'll see two modules with `coreModule: true`;

```js
{id: "macondoplus-styles", ..., coreModule: true},
{id: "macondoplus-panel", ..., coreModule: true},
```

`coreModule: true` does two things:
- Make sure the module is **always** enabled. `isEnabled()` returns `true` no matter what the user has modified.
- The toggle button in the module manager UI is **disabled** so the user can't accidentally turn it off and break functionality.

> ⚠️ You should **never** set `coreModule: true` on your own module. Only use it if your module provides something that other modules actively depend on to work at all.

#### Quick-start Checklist

When building a new module, run through this list:

- [ ] Added an entry to the `MODULES` array in `content-script.js`
- [ ] Created `extension/scripts/modules/your-id.js`
- [ ] Used the [basic skeleton](#2-creating-your-module-file) to check for if the module is toggled on/off.
- [ ] Added the file path to the `"js"` array in `manifest.json`
- [ ] Reloaded the extension in your browser to test
