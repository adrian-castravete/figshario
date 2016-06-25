import Figshario from "./figshario/figshario";

let viewport = document.getElementById("viewport");
let figshario = new Figshario(viewport);

figshario.start();
figshario.loadLevel("assets/maps/level1b.json");

let KEY_TRANSLATIONS = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  13: "start",
  17: "buttonB",
  32: "buttonA",
  114: "debug"
};

function handleKey(evt) {
  return KEY_TRANSLATIONS[evt.keyCode];
}

function resize() {
  figshario.resize(window.innerWidth, window.innerHeight);
}

resize();
window.addEventListener("resize", resize);
window.addEventListener("keydown", (evt) => {
  let key;

  key = handleKey(evt);

  if (key) {
    figshario.keyDown(key);
    evt.preventDefault();
  }
});
window.addEventListener("keyup", (evt) => {
  let key;

  if (evt.keyCode === 121) {
    figshario.stop();
  }
  key = handleKey(evt);

  if (key) {
    figshario.keyUp(key);
    evt.preventDefault();
  }
});
