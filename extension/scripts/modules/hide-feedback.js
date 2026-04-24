// use style since the button might not have appended yet.
const style = document.createElement("style");
style.textContent = ".nps-trigger {display: none !important;}";
(document.head || document.documentElement).appendChild(style);