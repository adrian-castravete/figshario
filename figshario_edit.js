(function() {
  class KeyHandler {
    constructor() {
      this._keyDown = this._keyDown.bind(this);
      this._keyUp = this._keyUp.bind(this);

      this.buttons = {start: false, select: false, left: false,
        up: false,
        right: false,
        down: false,
        a: false,
        b: false,
        reset: false
      };
      this.configuredButtons = {
        "Enter": "start",
        "Shift": "select",
        "ArrowLeft": "left",
        "ArrowUp": "up",
        "ArrowRight": "right",
        "ArrowDown": "down",
        "Control": "a",
        " ": "b",
        "Escape": "reset"
      };
      this.knownChromeKeys = {
        0x0a: "Enter",
        0x0d: "Enter",
        0x10: "Shift",
        0x11: "Control",
        0x12: "Alt",
        0x13: "Pause",
        0x1b: "Escape",
        0x20: " ",
        0x25: "ArrowLeft",
        0x26: "ArrowUp",
        0x27: "ArrowRight",
        0x28: "ArrowDown",
        0x2c: "PrintScreen"
      };
    }

    attachEvents() {
      window.addEventListener("keydown", this._keyDown);
      window.addEventListener("keyup", this._keyUp);
    }

    detachEvents() {
      window.removeEventListener("keydown", this._keyDown);
      window.removeEventListener("keyup", this._keyUp);
    }

    handleKeys(evt) {
      let code = evt.keyCode;
      let key = evt.key || this.knownChromeKeys[code];

      if (key && key !== "F5" && key !== "F12") {
        evt.stopPropagation();  // Cancel bubbling through hierarchy.
        evt.preventDefault();   // Prevent default actions for keys (for example, Backspace -> Back).
      }

      return key;
    }

    keyDown(/* key */) {
      // console.debug(key, "down");
    }

    keyUp(/* key */) {
      // console.debug(key, "up");
    }

    _keyDown(evt) {
      let key = this.handleKeys(evt);
      if (key) {
        let but = this.configuredButtons[key];
        if (but) {
          this.buttons[but] = true;
        }
        this.keyDown(key);
      }
    }

    _keyUp(evt) {
      let key = this.handleKeys(evt);
      if (key) {
        let but = this.configuredButtons[key];
        if (but) {
          this.buttons[but] = false;
        }
        this.keyUp(key);
      }
    }
  }

  class Stage {
    constructor(engine) {
      this.engine = engine;
    }

    update(/* tick */) {
    }

    draw(/* g */) {
    }
  }

  class Bootup extends Stage {
    update(/* tick */) {
    }

    draw(/* g */) {
    }
  }

  class Engine {
    constructor(canvas) {
      this.resize = this.resize.bind(this);

      let width = 160 | 0;
      let height = 144 | 0;
      let zoom = +2;

      let cvs = canvas;
      if (!cvs) {
        cvs = document.createElement("canvas");
        document.body.appendChild(cvs);
      }
      let ctx = cvs.getContext("2d");

      this.canvas = cvs;
      this.context = ctx;
      this.width = width;
      this.height = height;
      this.zoom = zoom;
      this.running = false;
      this.stage = new Bootup(this);

      this.keys = new KeyHandler();

      this.resize();
    }

    update(tick) {
      if (this.running) {
        if (this.stage) {
          this.stage.update(tick);
        }
      }
      if (this.running) {
        window.setTimeout((newTick) => {
          this.update(newTick);
        }, 10, Date.now());
      }
    }

    draw() {
      if (this.running) {
        let cvs = this.canvas;
        let g = this.context;
        g.fillStyle = "#000000";
        g.fillRect(0, 0, cvs.width, cvs.height);
        g.save();
        g.translate((cvs.width - this.width * this.zoom) / 2, (cvs.height - this.height * this.zoom) / 2);
        g.scale(this.zoom, this.zoom);
        if (this.stage) {
          this.stage.draw(g);
        }
        g.restore();
      }
      if (this.running) {
        window.requestAnimationFrame(() => {
          this.draw();
        });
      }
    }

    resize() {
      let cvs = this.canvas;

      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
    }

    attachEvents() {
      window.addEventListener("resize", this.resize);
      this.keys.attachEvents();
    }

    detachEvents() {
      window.removeEventListener("resize", this.resize);
      this.keys.detachEvents();
    }

    loadLevel(levelFileName) {
      levelFileName = levelFileName;
    }

    start(levelFileName) {
      this.loadLevel(levelFileName);
      this.attachEvents();
      this.running = true;
      this.update(0);
      this.draw();
    }

    stop() {
      this.running = false;
      this.detachEvents();
    }
  }

  class Editor extends Engine {
  }

  this.fkfig = {
    Engine,
    Editor
  };
}).call(this);
