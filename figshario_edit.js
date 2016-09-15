(function() {
  class KeyHandler {
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
  }

  class Stage {
    constructor(engine) {
      this.engine = engine;

      this.tileWidth = 32;
      this.tileHeight = 32;

      this.tiles = null;

      this._cbLoadAssets = null;
      this._imageAssets = {};
    }

    loadAssets(config, callback) {
      if (!config) {
        return;
      }

      this._cbLoadAssets = callback;
      if (config.images) {
        Object.keys(config.images).forEach((key) => {
          let path = config.images[key];
          let asset = {
            image: null,
            path,
            loaded: false
          };
          asset.image = this._loadImageAsset(path, asset);
          this._imageAssets[key] = asset;
        });
      }
    }

    loadTileSet(assetName) {
      let asset = this._imageAssets[assetName];

      if (!asset && console && console.warn) {
        console.warn(`Asset "${assetName}\ not found!`);
      }

      // WIP
    }

    update(/* tick */) {
      let [done, total] = this._calculateAssetTotals();

      if (done == total) {
        if (this._cbLoadAssets) {
          this._cbLoadAssets();
        }
      }

      if (!this.tiles) {
        this._tiles = this._generateDefaultTiles();
      }
    }

    draw(/* g */) {
    }

    _loadImageAsset(path, asset) {
      let img = new Image();

      img.onload = () => {
        asset.loaded = true;
      };
      img.src = path;

      return img;
    }

    _calculateAssetTotals() {
      let total = 0;
      let done = 0;

      let [cd, ct] = this._individualAssetTotals(this._imageAssets);
      done += cd;
      total += ct;

      return [done, total];
    }

    _individualAssetTotals(assets) {
      let total = 0;
      let done = 0;

      Object.keys(assets).forEach((key) => {
        let asset = assets[key];
        if (asset.loaded) {
          done += 1;
        }
        total += 1;
      });

      return [done, total];
    }

    _generateDefaultTiles() {
      let tiles = [];

      for (let j = 0; j < this.tileHeight; j += 1) {
        tiles.push([]);
        for (let i = 0; i < this.tileWidth; i += 1) {
          tiles[j].push({
            id: 0
          });
        }
      }

      return tiles;
    }
  }

  class Loader extends Stage {
    constructor(engine) {
      super(engine);

      this.loadAssets({
        images: {
          progress: "assets/images/progress.gif"
        }
      }, (evt) => {
        this._onReadyToLoad(evt);
      });
    }

    onReadyToLoad() {
    }

    update(tick) {
      super.update(tick);
    }

    draw(g) {
      super.draw(g);
    }

    _onReadyToLoad(/* evt */) {
      this.loadTileSet("progress");
      this.onReadyToLoad();
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
      this.stage = new Loader(this);

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

  class FigsharioMainMenu extends Loader {
    constructor(engine) {
      super(engine);
    }

    onReadyToLoad() {
      this.loadAssets({
        progress: "assets/images/progress.gif"
      }, () => {
        this.onLoad();
      });
    }

    onLoad() {
      this.engine.stage = new FigsharioMainMenu(this.engine);
    }
  }

  class FigsharioEditor extends Editor {
    constructor() {
      super();

      this.stage = new FigsharioMainMenu(this);
    }
  }

  this.fkfig = {
    Engine,
    Editor,
    FigsharioEditor
  };
}).call(this);
