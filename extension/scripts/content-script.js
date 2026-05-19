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
    {id: "streak-time-display", name: "Streak Time Display", description: "Display how much time is left until your streak is locked in for the day!", category: "QoL", defaultEnabled: true},
    {id: "styling-fixes", name: "Styling Fixes", description: "Fixes minor styling issues for Macondo that pisses you off.", category: "Appearance", defaultEnabled: true},
    {id: "streak-intensity", name: "Streak Intensity", description: "Adds appearance changes to the Streak Calendar: the more time you spent working on that day, the more darker and red the day gets!", category: "Appearance", defaultEnabled: true},
    {id: "macondoplus-styles", name: "Macondo+ Styles", description: "A core module that adds reusable Macondo+ styling.", category: "Core", defaultEnabled: true, coreModule: true},
    {id: "shop-categories", name: "Shop Categories", description: "Adds categories for shop items and a filter to narrow your search.", category: "Tools", defaultEnabled: true},
    {id: "macondoplus-panel", name: "Macondo+ Panel", description: "Core module providing the shared panel UI.", category: "Core", defaultEnabled: true, coreModule: true},
    {id: "achievements", name: "Achievements", description: "Adds achievements.", category: "Tools", defaultEnabled: true},
    {id: "shop-sort-enhanced", name: "Shop Sort Enhanced", description: "Adds extra sort options to the shop: A>Z, Z>A, etc.", category: "Tools", defaultEnabled: true},
    {id: "additional-project-info", name: "Additional Project Info", description: "Adds additional project metadata that the API exposes.", category: "Tools", defaultEnabled: true},
    {id: "deforestation", name: "Deforestation", description: "burn the earth!", category: "Silly", defaultEnabled: false},
    {id: "traditionalist", name: "Traditionalist", description: "disable the ability to create new projects", category: "Silly", defaultEnabled: false, conflicts: ["new-project-addict"]},
    {id: "rich-pretender", name: "Rich Pretender", description: "pretend to be rich", category: "Silly", defaultEnabled: false, conflicts: ["in-debt", "googentitys-module"]},
    {id: "in-debt", name: "In Debt", description: "free debt!", category: "Silly", defaultEnabled: false, conflicts: ["rich-pretender", "googentitys-module"]},
    {id: "extra-fruity-badge", name: "Extra Fruity Badge", description: "Shows a gold star on a project if the project is Extra Fruity!", category: "Tools", defaultEnabled: true},
    {id: "new-project-addict", name: "New Project Addict", description: "you cannot do anything except to create new projects", category: "Silly", defaultEnabled: false, conflicts: ["traditionalist"]},
    {id: "drunk", name: "Drunk", description: "please don't drive in these conditions! enable at your own risk.", category: "Silly", defaultEnabled: false},
    {id: "ads-please", name: "Ads, Please", description: "Brings forth an extensive range of lucrative premium monetisation possibilities encompassing the whole of the said website.", category: "Silly", defaultEnabled: false},
    {id: "googentitys-module", name: "Googentity's Module", description: "replaces all the text on the page with very inspirational words", category: "Silly", defaultEnabled: false, conflicts: ["in-debt", "rich-pretender"]},
    {id: "gambling", name: "Gambling", description: "10% chance of deleting a div.", category: "Silly", defaultEnabled: false},
    {id: "retro", name: "𝖱𝖾𝗍𝗋𝗈", description: "*𝖽𝗂𝗌𝖺𝖻𝗅𝖾𝗌 𝗒𝗈𝗎𝗋 𝖼𝗌𝗌*", category: "Silly", defaultEnabled: false, dangerous: true},
    {id: "module-manager", name: "Module Manager", description: "The UI to manage modules!", category: "Core", defaultEnabled: true, coreModule: true},
    {id: "streak-trends", name: "Streak Trends", description: "Analyzes your streak calendar and shows trends.", category: "Tools", defaultEnabled: true},
    {id: "25%-redder", name: "25% Redder", description: "Heavily inspired by hit Undertale mod 'Undertale 25% Redder'. As it says, it makes Macondo 25% redder.", category: "Silly", defaultEnabled: false, conflicts: ["25%-greener", "25%-bluer"]},
    {id: "25%-greener", name: "25% Greener", description: "Heavily inspired by hit Undertale mod 'Undertale 25% Greener'. As it says, it makes Macondo 25% greener.", category: "Silly", defaultEnabled: false, conflicts: ["25%-redder", "25%-bluer"]},
    {id: "25%-bluer", name: "25% Bluer", description: "Heavily inspired by hit Undertale mod 'Undertale 25% Bluer'. As it says, it makes Macondo 25% bluer.", category: "Silly", defaultEnabled: false, conflicts: ["25%-redder", "25%-greener"]},
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

  function getConflicts(id) {
    return MODULES.find(m => m.id === id)?.conflicts ?? [];
  }

  function canEnable(id) {
    return getConflicts(id).every(conflictId => !isEnabled(conflictId));
  }

  window.MacondoPlus = {isEnabled, setEnabled, canEnable, getConflicts, MODULES};
})();