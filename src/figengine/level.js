import Loader, { FontBuilder, SmartFontBuilder } from "./util";

let _loadingSprite = null;

function _getLoadingSprite() {
  if (!_loadingSprite) {
    let ls = new Image();
    ls.src = "assets/images/progress.gif";
    _loadingSprite = ls;
  }

  return _loadingSprite;
}

export default class Level extends Loader {
  constructor(engine, fileName) {
    super();

    this.engine = engine;
    this.objects = [];
    this.layers = [];
    this.solidLayer = null;

    this.assets = {};
    this.isLoading = false;
    this.loadingProgress = 0;
    this.loadingCallback = null;
    this.levelFileName = fileName;
  }

  resetLevelData() {
    this.objects = [];
    this.layers = [];
  }

  update(tick, delta) {
    if (this.isLoading) {
      this.updateLoading(tick, delta);
    } else {
      this.updateNormal(tick, delta);
    }
  }

  updateLoading() {
    let done = 0;
    let total = 0;
    let images = this.assets.images || {};
    let fonts = this.assets.fonts || {};

    Object.keys(images).forEach((key) => {
      total += 1;
      if (images[key].loaded) {
        done += 1;
      }
    });

    Object.keys(fonts).forEach((key) => {
      total += 1;
      if (fonts[key].loaded) {
        done += 1;
      }
    });

    this.loadingProgress = done / total * 100 | 0;

    if (done === total) {
      this.isLoading = false;
      if (this.loadingCallback) {
        this.loadingCallback();
      }
    }
  }

  updateNormal(tick, delta) {
    for (let i = 0, len = this.objects.length; i < len; i += 1) {
      let obj = this.objects[i];

      if (obj) {
        obj.update(tick, delta);
      }
    }
  }

  draw(g) {
    if (this.isLoading) {
      this.drawLoading(g);
    } else {
      this.drawNormal(g);
    }
  }

  drawLoading(g) {
    let s = _getLoadingSprite();
    let w = this.engine.viewportWidth;
    let cw = (w - 64) / 8 | 0;
    let p = this.loadingProgress;

    let sy = 0;
    if (p === 0) {
      sy = 16;
    }
    g.drawImage(s, 0, sy, 8, 16, -cw * 4, -8, 8, 16);

    sy = 0;
    if (p < 100) {
      sy = 16;
    }
    g.drawImage(s, 16, sy, 8, 16, cw * 4, -8, 8, 16);

    for (let st = -(cw - 2) * 4, i = st, end = (cw - 2) * 4; i <= end; i += 8) {
      sy = 0;
      if (p < (i - st) / (end - st) * 100) {
        sy = 16;
      }
      g.drawImage(s, 8, sy, 8, 16, i, -8, 8, 16);
    }
  }

  drawNormal(g) {
    let e = this.engine;
    let gw = e.viewportWidth;
    let gh = e.viewportHeight;
    let cx = e.cameraX - gw * 0.5 | 0;
    let cy = e.cameraY - gh * 0.5 | 0;

    g.save();
    g.translate(-this.engine.cameraX | 0, -this.engine.cameraY | 0);
    for (let i = 0, len = this.layers.length; i < len; i += 1) {
      let layer = this.layers[i];
      if (layer.isBackground) {
        layer.draw(g);
      }
    }

    for (let i = 0, len = this.objects.length; i < len; i += 1) {
      let obj = this.objects[i];
      if (obj.x >= cx - obj.width && obj.y >= cy - obj.height &&
          obj.x < cx + gw && obj.y < cy + gh) {
        obj.draw(g);
      }
    }

    for (let i = 0, len = this.layers.length; i < len; i += 1) {
      let layer = this.layers[i];
      if (!layer.isBackground) {
        layer.draw(g);
      }
    }
    g.restore();
  }

  onLoaded(data) {
    data = JSON.parse(data);
    this.resetLevelData();
    this.loadLevelData(data);
  }

  createObject() {  /* objData */
  }

  loadLevelData() {  /* levelData */
  }

  addObject(obj) {
    this.objects.push(obj);
  }

  removeObject(obj) {
    let index;

    index = this.objects.indexOf(obj);

    if (index >= 0) {
      this.objects.splice(index, 1);
    }
  }

  loadAssets(aCfg, callback) {
    this.isLoading = true;
    this.loadingProgress = 0;
    this.loadingCallback = callback;
    if (aCfg.images) {
      this._loadImageAssets(aCfg.images, aCfg.imageCallback);
    }
    if (aCfg.fonts) {
      this._loadFontAssets(aCfg.fonts);
    }
  }

  getImageAsset(assetName) {
    let images = this.assets.images;

    if (!images) {
      return null;
    }

    return images[assetName].resource;
  }

  getFontAsset(assetName) {
    let fonts = this.assets.fonts;

    if (!fonts) {
      return null;
    }

    return fonts[assetName].resource;
  }

  loadFile(fileName) {
    super.loadFile(fileName || this.levelFileName);
  }

  _loadImageAssets(assetConfig, assetCallback) {
    let images = {};
    let cbh = (key, callback) => {
      return (evt) => {
        this.assets.images[key].loaded = true;
        if (callback) {
          callback(key, evt);
        }
      };
    };

    Object.keys(assetConfig).forEach((key) => {
      let fileName = assetConfig[key];
      let img = new Image();
      img.onload = cbh(key, assetCallback);
      img.src = fileName;
      images[key] = {
        resource: img,
        loaded: false
      };
    });

    this.assets.images = images;
  }

  _loadFontAssets(assetConfig) {
    let fonts = {};

    Object.keys(assetConfig).forEach((key) => {
      let cfg = assetConfig[key];
      let fCls = FontBuilder;
      if (cfg.type === "smart") {
        fCls = SmartFontBuilder;
      }

      let builder = new fCls(this, cfg);
      fonts[key] = {
        resource: builder.build(),
        loaded: true
      };
    });

    this.assets.fonts = fonts;
  }
}
