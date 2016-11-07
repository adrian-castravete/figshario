/* global figshario */
(function() {
  let viewport = document.getElementById("viewport");
  let game = new figshario.Figshario(viewport);

  game.start();
  game.loadLevel("assets/maps/level1c.json");

  let KEY_TRANSLATIONS = {
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    13: "Return",
    17: "Control",
    32: " ",
    114: "F3"
  };
  let KEY_MAPPINGS = {
    ArrowLeft: "left",
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down",
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
}).call(this);
