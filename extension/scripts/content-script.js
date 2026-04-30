(() => {
  const PREFIX = "macondoplus_module_";
  const MODULES = [
    {id: "better-page-titles", name: "Better Page Titles", description: "Makes the page titles useful", defaultEnabled: true},
    {id: "dark-mode", name: "Dark Mode", description: "Adds dark mode to Macondo (WIP)", defaultEnabled: false},
    {id: "hide-feedback", name: "Hide Feedback", description: "Hides the annoying NPS (feedback) button", defaultEnabled: true},
    {id: "project-search", name: "Project Search", description: "Adds a way to search for projects", defaultEnabled: true},
    {id: "gold-estimator", name: "Gold Estimator", description: "Shows estimated gold value of pending fruits on project pages.", defaultEnabled: true},
    {id: "keyboard-shortcuts", name: "Keyboard Shortcuts", description: "Adds keyboard shortcuts to Macondo. E for Shop, R for Profile, 1-9 for Projects, Esc to exit the current menu you're in, / to search for projects.", defaultEnabled: true},
  ];
  
  function isEnabled(id) {
    const stored = localStorage.getItem(PREFIX + id);
    if (stored !== null) return stored === "true";
    const mod = MODULES.find(m => m.id === id);
    return mod ? mod.defaultEnabled : true;
  }

  function setEnabled(id, value) {
    localStorage.setItem(PREFIX + id, value);
  }

  window.MacondoPlus = {isEnabled, setEnabled, MODULES};
})();