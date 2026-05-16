(() => {
  const PREFIX = "macondoplus_module_";
  const MODULES = [
    {id: "better-page-titles", name: "Better Page Titles", description: "Makes the page titles useful", category: "QoL", defaultEnabled: true},
    {id: "dark-mode", name: "Dark Mode", description: "Adds dark mode to Macondo (WIP)", category: "Appearance", defaultEnabled: false},
    {id: "hide-feedback", name: "Hide Feedback", description: "Hides the annoying NPS (feedback) button", category: "QoL", defaultEnabled: true},
    {id: "keyboard-shortcuts", name: "Keyboard Shortcuts", description: "Adds keyboard shortcuts to Macondo. E for Shop, R for Profile, 1-9 for Projects, Esc to exit the current menu, Q for explore.", category: "QoL", defaultEnabled: true},
    {id: "middle-click-project", name: "Middle Click Project", description: "Middle clicking a project tile opens it on a new tab.", category: "QoL", defaultEnabled: true},
    {id: "hide-idea-generator", name: "Hide Idea Generator", description: "Hides the slop project idea generator.", category: "QoL", defaultEnabled: true},
    {id: "shop-goals", name: "Shop Goals", description: "Adds shop goals to the Shop.", category: "Tools", defaultEnabled: true},
    {id: "persistent-filters", name: "Persistent Filters", description: "Remembers your last used explore filters across sessions.", category: "QoL", defaultEnabled: true},
    {id: "streak-time-display", name: "Streak Time Display", description: "Display how much time is left until your streak is locked in for the day!", category: "QoL", defaultEnabled: true},
    {id: "styling-fixes", name: "Styling Fixes", description: "Fixes minor styling issues for Macondo that pisses you off.", category: "Appearance", defaultEnabled: true},
    {id: "streak-intensity", name: "Streak Intensity", description: "Adds appearance changes to the Streak Calendar: the more time you spent working on that day, the more darker and red the day gets!", category: "Appearance", defaultEnabled: true},
    {id: "macondoplus-styles", name: "Macondo+ Styles", description: "A core module that adds reusable Macondo+ styling.", category: "Core", defaultEnabled: true, coreModule: true},
    {id: "shop-categories", name: "Shop Categories", description: "Adds categories for shop items and a filter to narrow your search.", category: "Tools", defaultEnabled: true},
    {id: "macondoplus-panel", name: "Macondo+ Panel", description: "Core module providing the shared panel UI.", category: "Core", defaultEnabled: true, coreModule: true},
    {id: "achievements", name: "Achievements", description: "Adds achievements.", category: "Tools", defaultEnabled: true},
    {id: "shop-sort-enhanced", name: "Shop Sort Enhanced", description: "Adds extra sort options to the shop: A>Z, Z>A, etc.", category: "Tools", defaultEnabled: true},
    {id: "additional-project-info", name: "Additional Project Info", description: "Adds additional project metadata that the API exposes.", category: "Tools", defaultEnabled: true},
  ];
  
  function isEnabled(id) {
    const mod = MODULES.find(m => m.id === id);
    if (mod?.coreModule) return true;
    const stored = localStorage.getItem(PREFIX + id);
    if (stored !== null) return stored === "true";
    return mod ? mod.defaultEnabled : true;
  }

  function setEnabled(id, value) {
    localStorage.setItem(PREFIX + id, value);
  }

  window.MacondoPlus = {isEnabled, setEnabled, MODULES};
})();