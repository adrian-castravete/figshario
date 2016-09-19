(function() {
  let fkfig = this.fkfig || {};

  // Engine {{{
  class KeyHandler {  // {{{
    constructor() {
      this._keyDown = this._keyDown.bind(this);
      this._keyUp = this._keyUp.bind(this);

      this.buttons = {
        start: false,
        select: false,
        left: false,
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
  }  // }}}

  class Graphics {  // {{{
    constructor() {
      this.tilesX = 32;
      this.tilesY = 32;

      this.videoRam = new Uint8Array(16 * 1024);
      this.tileRam = null;
      this.palettesBackground = new Uint16Array(32);
      this.palettesSprites = new Uint16Array(32);
    }

    resetTileRam() {
      let total = this.tilesX * this.tilesY;
      let tileRam = new Uint16Array(total);

      for (let i = 0; i < total; i += 1) {
        // fhvpppnnnnnnnnnn
        // f -> foreground / background
        // h -> horizontal flip
        // v -> vertical flip
        // p -> palette number
        // n -> position in videoRam
        tileRam[i] = 0;
      }

      this.tileRam = tileRam;
      this.tileStatus = tileStatus;
    }

    resetPalettes() {
      let pbg = this.palettesBackground;
      let pspr = this.palettesSprites;
      for (let i = 0; i < 8; i += 1) {
        let o = i * 4;
        pbg[o + 0] = pspr[o + 0] = 0x7396;  // 0b0111001110010110;
        pbg[o + 1] = pspr[o + 1] = 0x4ecd;  // 0b0100111011001101;
        pbg[o + 2] = pspr[o + 2] = 0x2a0a;  // 0b0010101000001010;
        pbg[o + 3] = pspr[o + 3] = 0x08c8;  // 0b0000100011001000;
      }
      console.debug(pbg);
    }

    update() {
      if (!this.tileRam) {
        this.resetTileRam();
      }
      if (!this.palettesBackground || !this.palettesSprites) {
        this.resetPalettes();
      }
    }
  }  // }}}

  class Engine {  // {{{
    constructor(config = {}) {
      this.resize = this.resize.bind(this);

      let width = 160 | 0;
      let height = 144 | 0;
      let zoom = +2;

      let cvs = config.canvas;
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

      this.graphics = new Graphics();
      this.keys = new KeyHandler();

      this.resize();
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
      self.levelFileName = levelFileName;
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

    update(tick) {
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


        g.restore();
      }
      if (this.running) {
        window.requestAnimationFrame(() => {
          this.draw();
        });
      }
    }
  }  // }}}
  // }}}

  // Debugger {{{
  class Debugger {  // {{{
  }  // }}}
  // }}}

  // Editor {{{
  class Editor extends Engine {  // {{{

  }  // }}}
  // }}}

  fkfig.Engine = Engine;
  fkfig.Editor = Editor;
  fkfig.Debugger = Debugger;
  this.fkfig = fkfig;
}).call(this);
