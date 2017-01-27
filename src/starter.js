import Figshario from './figshario';

let viewport = document.getElementById("viewport");
let game = new Figshario(viewport);

game.start();
game.loadLevel("assets/maps/level1b.json");

let KEY_TRANSLATIONS = {
  13: "Enter",
  17: "Control",
  18: "Alt",
  32: " ",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  114: "F3"
};
let KEY_MAPPINGS = {
  ArrowLeft: "left",
  ArrowUp: "up",
  ArrowRight: "right",
  ArrowDown: "down",
  Enter: "start",
  Return: "start",
  Control: "buttonB",
  " ": "buttonA",
  F3: "debug"
};

function handleKey(evt) {
  let action = null;
  let key = evt.key;
  if (key == null) {
    key = KEY_TRANSLATIONS[evt.keyCode];
  }
  if (key) {
    action = KEY_MAPPINGS[key];
  }
  return action;
}

function resize() {
  game.resize(window.innerWidth, window.innerHeight);
}

resize();
window.addEventListener("resize", resize);
window.addEventListener("keydown", (evt) => {
  let key;

  key = handleKey(evt);

  if (key) {
    game.keyDown(key);
    evt.preventDefault();
  }
});
window.addEventListener("keyup", (evt) => {
  let key;

  if (evt.key === "F10" || evt.keyCode === 121) {
    game.stop();
  }
  key = handleKey(evt);

  if (key) {
    game.keyUp(key);
    evt.preventDefault();
  }
});
