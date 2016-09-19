(function() {
  class KeyHandler { // {{{
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
  } // }}}

  class Asset { // {{{
    constructor(path) {
      this.path = path;
      this.loaded = false;
    }

    load() {
      if (console && console.warn) {
        console.warn(`Generic asset for ${this.path}`);
      }
      this.loaded = true;
    }
  } // }}}

  class ImageAsset extends Asset { // {{{
    constructor(path) {
      super(path);
      this.image = null;
    }

    load() {
      this.image = new Image();
      this.image.onload = () => {
        this.loaded = true;
      };
      this.image.src = this.path;
    }
  } // }}}

  class CHRAsset extends Asset { // {{{
    constructor(path, cellsX, cellsY) {
      super(path);

      this.cellsX = cellsX;
      this.cellsY = cellsY;
      this.image = null;
    }

    load() {
      let c = document.createElement("canvas");
      c.width = this.cellsX * 8;
      c.height = this.cellsY * 8;

      this.image = c;
    }
  } // }}}

  class ProgressImageAsset extends CHRAsset { // {{{
    constructor() {
      super("assets/images/progress.chr");
      this.load();
    }

    load() {
      if (ProgressImageAsset._progressImg) {
        this.image = ProgressImageAsset._progressImg;
        this.loaded = true;
      } else {
        super.load();
        ProgressImageAsset._progressImg = this.image;
      }
    }
  } // }}}

  class Stage { // {{{
    constructor(engine) {
      this.engine = engine;

      this.tiles = null;
      this.tilesX = 32;
      this.tilesY = 32;
      this.offsetX = 0;
      this.offsetY = 0;
      this.tileSet = null;

      this._isLoading = false;
      this._wasLoading = false;
      this._cbLoadAssets = null;
      this._imageAssets = {
        progress: new ProgressImageAsset()
      };
    }

    loadAssets(config, callback) {
      if (!config) {
        return;
      }

      this._isLoading = true;
      this._cbLoadAssets = callback;
      if (config.images) {
        Object.keys(config.images).forEach((key) => {
          let asset = new ImageAsset(config.images[key]);
          asset.load();
          this._imageAssets[key] = asset;
        });
      }
    }

    loadTileSet(assetName) {
      let asset = this._imageAssets[assetName];

      if (!asset && console && console.warn) {
        console.warn(`Asset "${assetName}" not found!`);
      }

      this._compileTileSet(asset);
    }

    getTile(x, y) {
      return this.tiles[y * this.tilesY + x];
    }

    setTile(x, y, value) {
      this.tiles[y * this.tilesY + x] = value;
    }

    repaint() {
    }

    update(tick) {
      if (this._isLoading) {
        if (!this._wasLoading) {
          this._firstPaintLoading();
        }
        this.updateLoading(tick);
      } else if (this._wasLoading) {
        this.repaint();
      }

      if (!this.tiles) {
        this._tiles = this._generateDefaultTiles();
      }
      this._wasLoading = this._isLoading;
    }

    updateLoading(/* tick */) {
      let [done, total] = this._calculateAssetTotals();

      if (done == total) {
        if (this._cbLoadAssets) {
          this._isLoading = false;
          this._cbLoadAssets();
        }
      } else {
        // pass
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
      let p = this.tilesX * this.tilesY;
      let tiles = new Uint16Array(p);

      for (let i = 0; i < p; i += 1) {
        tiles[i] = 0;
      }

      return tiles;
    }

    _firstPaintLoading() {
      this.loadTileSet("progress");
      this.setPalette(0, 0b0111111001000000, 0b0100101111100000, 0b0010011011000000, 0b0001001001000000);
      this.setPalette(1, 0b0111111001000000, 0b0100000010100000, 0b0110100010000000, 0b0111110001101010);
      this.setPalette(2, 0b0000000000000000, 0b0001110101010000, 0b0100111010010111, 0b0111111111111111);

      this.offsetX = 0;
      this.offsetY = 0;
      for (let j = 0; j < 18; j += 1) {
        for (let i = 0; i < 20; i += 1) {
          this.setTile(i, j, 0);
        }
      }

      this.setTile(8, 7, 8 + 2 << 10);
      this.setTile(9, 7, 9 + 2 << 10);
      this.setTile(10, 7, 10 + 2 << 10);
      this.setTile(11, 7, 11 + 2 << 10);
      for (let i = 2; i < 18; i += 1) {
        this.setTile(i, 8, 5 + 1 << 10);
      }
      this.setTile(1, 8, 4 + 1 << 10);
      this.setTile(18, 8, 6 + 1 << 10);
    }
  } // }}}

  class Engine { // {{{
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

      this.stage = null;
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
  } // }}}

  class Editor extends Engine { // {{{
  } // }}}

  this.fkfig = {
    Engine,
    Editor,
    Stage
  };
}).call(this);
