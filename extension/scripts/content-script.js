(() => {
  const PREFIX = "macondoplus_module_";
  const MODULES = [
    {id: "better-page-titles", name: "Better Page Titles", description: "Temporary description: to be replaced", defaultEnabled: true},
    {id: "dark-mode", name: "Dark Mode", description: "Temporary description: to be replaced", defaultEnabled: false},
    {id: "hide-feedback", name: "Hide Feedback", description: "Temporary description: to be replaced", defaultEnabled: true},
    {id: "project-search", name: "Project Search", description: "Temporary description: to be replaced", defaultEnabled: true},
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