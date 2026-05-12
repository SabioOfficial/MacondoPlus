(function () {
  if (!window.MacondoPlus) return;
  if (window.MacondoPlus.newPanel) return;

  function newPanel() {
    const backdrop = document.createElement("div");
    backdrop.className = "fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm";
    backdrop.style.display = "none";

    const outer = document.createElement("div");
    outer.className = "fixed inset-0 z-[201] flex items-center justify-center pointer-events-none";
    outer.style.display = "none";

    const frame = document.createElement("div");
    frame.className = "relative pl-5 pt-4 pr-6 pb-6 flex flex-col modal-frame w-full max-w-6xl mx-4 pointer-events-auto max-h-[90vh]";

    const bg = document.createElement("div");
    bg.className = "absolute top-2 bottom-2 left-3 right-3 bg-parchment";

    const content = document.createElement("div");
    content.className = "relative z-[1] flex-1 min-h-0 w-full p-4 overflow-y-auto";

    [
      ["top_left_2.webp", "absolute top-0 left-0 w-24 h-24 pointer-events-none z-[2]"],
      ["top_right_2.webp", "absolute top-0 right-0 w-24 h-24 pointer-events-none z-[2]"],
      ["bottom_left_2.webp", "absolute bottom-0 left-0 w-24 h-24 pointer-events-none z-[2]"],
      ["bottom_right_2.webp", "absolute bottom-0 right-0 w-24 h-24 pointer-events-none z-[2]"],
    ].forEach(([file, cls]) => {
      const img = document.createElement("img");
      img.src = `/images/borders/${file}`;
      img.className = cls;
      img.alt = "";
      img.draggable = false;
      frame.appendChild(img);
    });

    [
      ["left", "absolute top-24 left-[8px] bottom-24 w-24 pointer-events-none z-[1]", "96px 96px", "no-repeat round"],
      ["right", "absolute top-24 right-[8px] bottom-24 w-24 pointer-events-none z-[1]", "96px 96px", "no-repeat round"],
    ].forEach(([file, cls, size, repeat]) => {
      const div = document.createElement("div");
      div.className = cls;
      div.style.backgroundImage = `url("/images/borders/${file}.webp")`;
      div.style.backgroundSize = size;
      div.style.backgroundRepeat = repeat;
      frame.appendChild(div);
    });

    [
      ["top", "absolute top-0 left-24 right-24 h-24 pointer-events-none z-[1]"],
      ["bottom", "absolute bottom-0 left-24 right-24 h-24 pointer-events-none z-[1]"],
    ].forEach(([file, cls]) => {
      const div = document.createElement("div");
      div.className = cls;
      div.style.backgroundImage = `url("/images/borders/${file}.webp")`;
      div.style.backgroundSize = "100% 100%";
      frame.appendChild(div);
    });

    frame.appendChild(bg);
    frame.appendChild(content);
    outer.appendChild(frame);
    document.body.appendChild(backdrop);
    document.body.appendChild(outer);

    const close = () => {
      backdrop.classList.remove("macondoplus-panel-open");
      outer.classList.remove("macondoplus-panel-open-with-scale");
      backdrop.classList.add("macondoplus-panel-close");
      outer.classList.add("macondoplus-panel-close");
      setTimeout(() => {
        backdrop.style.display = "none";
        outer.style.display = "none";
        backdrop.classList.remove("macondoplus-panel-close");
        outer.classList.remove("macondoplus-panel-close");
      }, 200);
    };

    const open = () => {
      backdrop.style.display = "";
      outer.style.display = "";
      backdrop.classList.remove("macondoplus-panel-close");
      outer.classList.remove("macondoplus-panel-close-with-scale");
      backdrop.classList.add("macondoplus-panel-open");
      outer.classList.add("macondoplus-panel-open-with-scale");
    };

    backdrop.addEventListener("click", close);

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && outer.style.display !== "none") close();
    });

    return {open, close, content};
  }

  window.MacondoPlus.newPanel = newPanel;
})();