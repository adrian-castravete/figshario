(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Level = exports.Layer = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _figengineUtil = require("./figengine-util");

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _loadingSprite = null;

function _getLoadingSprite() {
  if (!_loadingSprite) {
    var ls = new Image();
    ls.src = "assets/images/progress.gif";
    _loadingSprite = ls;
  }

  return _loadingSprite;
}

var Layer = exports.Layer = function () {
  function Layer(engine, tileWidth, tileHeight) {
    _classCallCheck(this, Layer);

    this.engine = engine;
    this.tiles = [];
    this.backScreen = null;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.width = 0;
    this.height = 0;
    this.isBackground = true;
    this.isSolid = false;
    this.tilesets = [];
    this.everythingLoaded = false;
  }

  _createClass(Layer, [{
    key: "buildBackground",
    value: function buildBackground() {
      var backScreen = document.createElement("canvas");
      backScreen.width = this.tileWidth * this.width;
      backScreen.height = this.tileHeight * this.height;

      var g = backScreen.getContext("2d");
      for (var j = 0; j < this.tiles.length; j += 1) {
        for (var i = 0; i < this.tiles[j].length; i += 1) {
          var tile = this.tiles[j][i];
          if (tile && tile.img) {
            g.drawImage(tile.img, tile.sx, tile.sy, tile.w, tile.h, i * this.tileWidth, j * this.tileHeight, tile.w, tile.h);
            // g.strokeStyle = "#000000";
            // g.strokeRect(i * this.tileWidth + 0.5, j * this.tileHeight + 0.5, 16, 16);
          }
        }
      }

      this.backScreen = backScreen;
    }
  }, {
    key: "draw",
    value: function draw(g) {
      if (!this.everythingLoaded) {
        var dorebuild = true;
        for (var i = 0; i < this.tilesets.length; i += 1) {
          if (!this.tilesets[i].loaded) {
            dorebuild = false;
          }
        }
        if (dorebuild) {
          this.buildBackground();
          this.everythingLoaded = true;
        }
      }
      var e = this.engine;
      var gw = e.viewportWidth;
      var gh = e.viewportHeight;
      var ox = e.cameraX - gw * 0.5 | 0;
      var oy = e.cameraY - gh * 0.5 | 0;
      g.drawImage(this.backScreen, ox, oy, gw, gh, ox, oy, gw, gh);
    }
  }, {
    key: "getAt",
    value: function getAt(x, y) {
      var cx = x / this.tileWidth | 0;
      var cy = y / this.tileHeight | 0;

      if (cx >= 0 && cy >= 0 && cy < this.tiles.length && cx < this.tiles[cy].length) {
        return this.tiles[cy][cx];
      }

      return null;
    }
  }]);

  return Layer;
}();

var Level = exports.Level = function (_Loader) {
  _inherits(Level, _Loader);

  function Level(engine, fileName) {
    _classCallCheck(this, Level);

    var _this = _possibleConstructorReturn(this, (Level.__proto__ || Object.getPrototypeOf(Level)).call(this));

    _this.engine = engine;
    _this.objects = [];
    _this.layers = [];
    _this.solidLayer = null;

    _this.assets = {};
    _this.isLoading = false;
    _this.loadingProgress = 0;
    _this.loadingCallback = null;
    _this.levelFileName = fileName;
    return _this;
  }

  _createClass(Level, [{
    key: "resetLevelData",
    value: function resetLevelData() {
      this.objects = [];
      this.layers = [];
    }
  }, {
    key: "update",
    value: function update(tick, delta) {
      if (this.isLoading) {
        this.updateLoading(tick, delta);
      } else {
        this.updateNormal(tick, delta);
      }
    }
  }, {
    key: "updateLoading",
    value: function updateLoading() {
      var done = 0;
      var total = 0;
      var images = this.assets.images || {};
      var fonts = this.assets.fonts || {};

      Object.keys(images).forEach(function (key) {
        total += 1;
        if (images[key].loaded) {
          done += 1;
        }
      });

      Object.keys(fonts).forEach(function (key) {
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
  }, {
    key: "updateNormal",
    value: function updateNormal(tick, delta) {
      for (var i = 0, len = this.objects.length; i < len; i += 1) {
        var obj = this.objects[i];

        if (obj) {
          obj.update(tick, delta);
        }
      }
    }
  }, {
    key: "draw",
    value: function draw(g) {
      if (this.isLoading) {
        this.drawLoading(g);
      } else {
        this.drawNormal(g);
      }
    }
  }, {
    key: "drawLoading",
    value: function drawLoading(g) {
      var s = _getLoadingSprite();
      var w = this.engine.viewportWidth;
      var cw = (w - 64) / 8 | 0;
      var p = this.loadingProgress;

      g.drawImage(s, 0, 16, 32, 8, -16, -8, 32, 8);

      var sy = 0;
      if (p === 0) {
        sy = 8;
      }
      g.drawImage(s, 0, sy, 8, 8, -cw * 4, 0, 8, 8);

      sy = 0;
      if (p < 100) {
        sy = 8;
      }
      g.drawImage(s, 16, sy, 8, 8, cw * 4, 0, 8, 8);

      for (var st = -(cw - 2) * 4, i = st, end = (cw - 2) * 4; i <= end; i += 8) {
        sy = 0;
        if (p < (i - st) / (end - st) * 100) {
          sy = 8;
        }
        g.drawImage(s, 8, sy, 8, 8, i, 0, 8, 8);
      }
    }
  }, {
    key: "drawNormal",
    value: function drawNormal(g) {
      var e = this.engine;
      var gw = e.viewportWidth;
      var gh = e.viewportHeight;
      var cx = e.cameraX - gw * 0.5 | 0;
      var cy = e.cameraY - gh * 0.5 | 0;

      g.save();
      g.translate(-this.engine.cameraX | 0, -this.engine.cameraY | 0);
      for (var i = 0, len = this.layers.length; i < len; i += 1) {
        var layer = this.layers[i];
        if (layer.isBackground) {
          layer.draw(g);
        }
      }

      for (var _i = 0, _len = this.objects.length; _i < _len; _i += 1) {
        var obj = this.objects[_i];
        if (obj.x >= cx - obj.width && obj.y >= cy - obj.height && obj.x < cx + gw && obj.y < cy + gh) {
          obj.draw(g);
        }
      }

      for (var _i2 = 0, _len2 = this.layers.length; _i2 < _len2; _i2 += 1) {
        var _layer = this.layers[_i2];
        if (!_layer.isBackground) {
          _layer.draw(g);
        }
      }
      g.restore();
    }
  }, {
    key: "onLoaded",
    value: function onLoaded(data) {
      data = JSON.parse(data);
      this.resetLevelData();
      this.loadLevelData(data);
    }
  }, {
    key: "createObject",
    value: function createObject() {/* objData */
    }
  }, {
    key: "loadLevelData",
    value: function loadLevelData() {/* levelData */
    }
  }, {
    key: "addObject",
    value: function addObject(obj) {
      this.objects.push(obj);
    }
  }, {
    key: "removeObject",
    value: function removeObject(obj) {
      var index = void 0;

      index = this.objects.indexOf(obj);

      if (index >= 0) {
        this.objects.splice(index, 1);
      }
    }
  }, {
    key: "loadAssets",
    value: function loadAssets(aCfg, callback) {
      this.isLoading = true;
      this.loadingProgress = 0;
      this.loadingCallback = callback;
      if (aCfg.images) {
        this._loadImageAssets(aCfg.images, aCfg.imageCallback);
      }
      if (aCfg.fonts) {
        this._loadFontAssets(aCfg.fonts);
      }
      if (aCfg.sounds) {
        this._loadSoundAssets(aCfg.sounds);
      }
    }
  }, {
    key: "getImageAsset",
    value: function getImageAsset(assetName) {
      var images = this.assets.images;

      if (!images) {
        return null;
      }

      return images[assetName].resource;
    }
  }, {
    key: "getFontAsset",
    value: function getFontAsset(assetName) {
      var fonts = this.assets.fonts;

      if (!fonts) {
        return null;
      }

      return fonts[assetName].resource;
    }
  }, {
    key: "getSoundAsset",
    value: function getSoundAsset(assetName) {
      var sounds = this.assets.sounds;

      if (!sounds) {
        return null;
      }

      return sounds[assetName].resource;
    }
  }, {
    key: "loadFile",
    value: function loadFile(fileName) {
      _get(Level.prototype.__proto__ || Object.getPrototypeOf(Level.prototype), "loadFile", this).call(this, fileName || this.levelFileName);
    }
  }, {
    key: "_loadImageAssets",
    value: function _loadImageAssets(assetConfig, assetCallback) {
      var _this2 = this;

      var images = {};
      var cbh = function cbh(key, callback) {
        return function (evt) {
          _this2.assets.images[key].loaded = true;
          if (callback) {
            callback(key, evt);
          }
        };
      };

      Object.keys(assetConfig).forEach(function (key) {
        var fileName = assetConfig[key];
        var img = new Image();
        img.onload = cbh(key, assetCallback);
        img.src = fileName;
        images[key] = {
          resource: img,
          loaded: false
        };
      });

      this.assets.images = images;
    }
  }, {
    key: "_loadFontAssets",
    value: function _loadFontAssets(assetConfig) {
      var _this3 = this;

      var fonts = {};

      Object.keys(assetConfig).forEach(function (key) {
        var cfg = assetConfig[key];
        var fCls = _figengineUtil.FontBuilder;
        if (cfg.type === "smart") {
          fCls = _figengineUtil.SmartFontBuilder;
        }

        var builder = new fCls(_this3, cfg);
        fonts[key] = {
          resource: builder.build(),
          loaded: true
        };
      });

      this.assets.fonts = fonts;
    }
  }, {
    key: "_loadSoundAssets",
    value: function _loadSoundAssets(assetConfig, assetCallback) {
      var _this4 = this;

      var sounds = {};
      var cbh = function cbh(key, callback) {
        return function (evt) {
          _this4.assets.sounds[key].loaded = true;
          if (callback) {
            callback(key, evt);
          }
        };
      };

      Object.keys(assetConfig).forEach(function (key) {
        var fileName = assetConfig[key];
        var snd = new Audio();
        snd.onload = cbh(key, assetCallback);
        snd.src = fileName;
        sounds[key] = {
          resource: snd,
          loaded: false
        };
      });

      this.assets.sounds = sounds;
    }
  }]);

  return Level;
}(_figengineUtil.Loader);

},{"./figengine-util":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FSObject = function () {
  function FSObject(engine, level) {
    _classCallCheck(this, FSObject);

    this.engine = engine;
    this.level = level;
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.width = 16;
    this.height = 16;
    this.spriteSheet = null;
    this.sprX = 0;
    this.sprY = 0;
    this.anchorX = 0;
    this.anchorY = 0;
  }

  _createClass(FSObject, [{
    key: "update",
    value: function update() {}
  }, {
    key: "draw",
    value: function draw(g) {
      if (this.spriteSheet) {
        var w = this.width;
        var h = this.height;
        g.save();
        g.translate(this.x | 0, this.y | 0);
        g.rotate(this.rotation);
        g.drawImage(this.spriteSheet, this.sprX, this.sprY, w, h, -w / 2 - this.anchorX, -h / 2 - this.anchorY, w, h);
        g.restore();
      }
    }
  }]);

  return FSObject;
}();

var Sprite = exports.Sprite = function (_FSObject) {
  _inherits(Sprite, _FSObject);

  function Sprite(engine, level) {
    _classCallCheck(this, Sprite);

    var _this = _possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).call(this, engine, level));

    _this.animations = {};
    _this.currentAnim = null;
    _this.frame = 0;
    _this.spriteOldTick = null;
    _this.spriteSheet = null;
    return _this;
  }

  _createClass(Sprite, [{
    key: "createAnimation",
    value: function createAnimation(name, x, y, length, delay, callback) {
      this.animations[name] = { x: x, y: y, length: length, delay: delay, callback: callback };
    }
  }, {
    key: "getAnimation",
    value: function getAnimation() {
      return this.currentAnim;
    }
  }, {
    key: "setAnimation",
    value: function setAnimation(name) {
      if (name !== this.currentAnim) {
        this.currentAnim = name;
        this.frame = 0;
        this.spriteOldTick = null;
      }
    }
  }, {
    key: "update",
    value: function update(tick, delta) {
      if (this.spriteOldTick == null) {
        this.spriteOldTick = tick;
      }
      _get(Sprite.prototype.__proto__ || Object.getPrototypeOf(Sprite.prototype), "update", this).call(this, tick, delta);
      var anim = this.animations[this.currentAnim];
      if (anim) {
        var otick = this.spriteOldTick;
        if (otick < tick - anim.delay) {
          this.frame += 1;
          this.resetFrame(anim);
          this.spriteOldTick = tick;
        }
        this.sprX = anim.x + this.frame * this.width;
        this.sprY = anim.y;
      }
    }
  }, {
    key: "resetFrame",
    value: function resetFrame(anim) {
      if (this.frame >= anim.length) {
        this.frame = 0;
        if (anim.callback) {
          if (typeof anim.callback === "function") {
            anim.callback();
          } else {
            this.setAnimation(anim.callback);
          }
        }
      }
    }
  }, {
    key: "loadSpriteSheet",
    value: function loadSpriteSheet(imageName) {
      this.spriteSheet = this.level.getImageAsset(imageName);
    }
  }]);

  return Sprite;
}(FSObject);

var FontSprite = exports.FontSprite = function (_Sprite) {
  _inherits(FontSprite, _Sprite);

  function FontSprite(engine, level, fontName) {
    _classCallCheck(this, FontSprite);

    var _this2 = _possibleConstructorReturn(this, (FontSprite.__proto__ || Object.getPrototypeOf(FontSprite)).call(this, engine, level));

    _this2.text = "";
    _this2.textAlign = "left";
    _this2.textBaseline = "bottom";

    var fc = level.getFontAsset(fontName);
    _this2.charWidth = fc.charWidth || 8;
    _this2.charHeight = fc.charHeight || 8;
    _this2.charSpacing = fc.charSpacing || 0;

    _this2.fontConfig = fc;
    return _this2;
  }

  _createClass(FontSprite, [{
    key: "draw",
    value: function draw(g) {
      var cw = this.charWidth;
      var ch = this.charHeight;
      var cs = this.charSpacing + cw;

      var y = this.y - ch;
      if (this.textBaseline === "middle") {
        y += ch / 2;
      } else if (this.textBaseline === "top") {
        y += ch;
      }
      y = y | 0;

      var len = this.text.length;
      var ox = this.x;
      if (this.textAlign === "center") {
        ox -= len * cs / 2 | 0;
      } else if (this.textAlign === "right") {
        ox -= len * cs | 0;
      }

      var ranges = this.fontConfig.ranges;
      for (var i = 0; i < len; i += 1) {
        var c = this.text[i].charCodeAt();

        for (var j = 0, rlen = ranges.length; j < rlen; j += 1) {
          var cf = ranges[j];

          var x = ox + i * cs | 0;

          var sx = 0;
          var sy = 0;

          if (c >= cf[0].charCodeAt() && c <= cf[1].charCodeAt()) {
            sx = (c - cf[0].charCodeAt()) * cw;
            sy = j * ch;
          }

          g.drawImage(this.fontConfig.spriteSheet, sx, sy, cw, ch, x | 0, y | 0, cw, ch);
        }
      }
    }
  }]);

  return FontSprite;
}(Sprite);

var SmartFontSprite = exports.SmartFontSprite = function (_FontSprite) {
  _inherits(SmartFontSprite, _FontSprite);

  function SmartFontSprite(engine, level, fontName) {
    _classCallCheck(this, SmartFontSprite);

    var _this3 = _possibleConstructorReturn(this, (SmartFontSprite.__proto__ || Object.getPrototypeOf(SmartFontSprite)).call(this, engine, level, fontName));

    var fc = _this3.fontConfig;

    _this3.charSpacing = fc.charSpacing || 0;
    _this3.spaceWidth = fc.spaceWidth || 8;

    _this3.charRanges = fc.ranges;
    return _this3;
  }

  _createClass(SmartFontSprite, [{
    key: "draw",
    value: function draw(g) {
      var _this4 = this;

      var ch = this.charHeight;
      var x = this.x;
      var y = this.y - ch;

      var w = 0;
      this._forCharDo(function (sx, sy, cw) {
        if (sx >= 0 && sy >= 0) {
          w += cw + _this4.charSpacing;
        } else {
          w += _this4.spaceWidth + _this4.charSpacing;
        }
      });

      if (this.textAlign === "center") {
        x -= w / 2;
      } else if (this.textAlign === "right") {
        x -= w;
      }
      if (this.textBaseline === "middle") {
        y += ch / 2;
      } else if (this.textBaseline === "top") {
        y += ch;
      }

      this._forCharDo(function (sx, sy, cw) {
        if (sx >= 0 && sy >= 0) {
          g.drawImage(_this4.fontConfig.spriteSheet, sx, sy, cw, ch, x | 0, y | 0, cw, ch);
          x += cw + _this4.charSpacing;
        } else {
          x += _this4.spaceWidth + _this4.charSpacing;
        }
      });
    }
  }, {
    key: "_forCharDo",
    value: function _forCharDo(callback) {
      var _this5 = this;

      var ch = this.charHeight;

      var _loop = function _loop(i, len) {
        var c = _this5.text[i].charCodeAt();

        var sx = -1;
        var sy = -1;
        var cw = void 0;

        Object.keys(_this5.charRanges).forEach(function (key) {
          var s = key[0].charCodeAt();
          var e = key[2].charCodeAt();
          if (c >= s && c <= e) {
            var o = _this5.charRanges[key][c - s];

            sx = o.x;
            sy = o.y;
            cw = o.w;
          }
        });

        callback(sx, sy, cw, ch);
      };

      for (var i = 0, len = this.text.length; i < len; i += 1) {
        _loop(i, len);
      }
    }
  }]);

  return SmartFontSprite;
}(FontSprite);

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loader = exports.Loader = function () {
  function Loader() {
    _classCallCheck(this, Loader);
  }

  _createClass(Loader, [{
    key: "loadFile",
    value: function loadFile(fileName) {
      var _this = this;

      var xhr = void 0;

      xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function (evt) {
        return _this.onxhr(evt);
      };
      xhr.open("GET", fileName);
      xhr.send();
    }
  }, {
    key: "onxhr",
    value: function onxhr(evt) {
      var xhr = void 0;

      xhr = evt.target;
      if (xhr.readyState === 4 && xhr.status < 400) {
        this.onLoaded(xhr.response);
      }
    }
  }]);

  return Loader;
}();

var FontBuilder = exports.FontBuilder = function () {
  function FontBuilder(level, config) {
    _classCallCheck(this, FontBuilder);

    this.level = level;
    this.config = config;
  }

  _createClass(FontBuilder, [{
    key: "build",
    value: function build() {
      var cfg = this.config;

      return {
        charSpacing: cfg.charSpacing,
        charWidth: cfg.charWidth,
        charHeight: cfg.charHeight,
        spriteSheet: this.level.getImageAsset(this.config.image),
        ranges: this.config.ranges
      };
    }
  }]);

  return FontBuilder;
}();

var SmartFontBuilder = exports.SmartFontBuilder = function (_FontBuilder) {
  _inherits(SmartFontBuilder, _FontBuilder);

  function SmartFontBuilder(level, config) {
    _classCallCheck(this, SmartFontBuilder);

    return _possibleConstructorReturn(this, (SmartFontBuilder.__proto__ || Object.getPrototypeOf(SmartFontBuilder)).call(this, level, config));
  }

  _createClass(SmartFontBuilder, [{
    key: "build",
    value: function build() {
      var cfg = this.config;
      var sheet = this.level.getImageAsset(cfg.image);
      var sheetImageData = this.getImageData(sheet);

      return {
        charSpacing: cfg.charSpacing,
        charHeight: cfg.charHeight,
        spaceWidth: cfg.spaceWidth,
        spriteSheet: sheet,
        spriteSheetImageData: sheetImageData,
        ranges: this.extractFontRanges(cfg, sheetImageData)
      };
    }
  }, {
    key: "getImageData",
    value: function getImageData(sheet) {
      var cvs = document.createElement("canvas");
      var ctx = cvs.getContext("2d");

      cvs.width = sheet.width;
      cvs.height = sheet.height;

      ctx.drawImage(sheet, 0, 0);

      return ctx.getImageData(0, 0, sheet.width, sheet.height);
    }
  }, {
    key: "extractFontRanges",
    value: function extractFontRanges(cfg, sheetImageData) {
      var chars = {};

      this.spaceWidth = cfg.spaceWidth || this.spaceWidth;
      this.charHeight = cfg.charHeight || this.charHeight;
      this.charSpacing = cfg.charSpacing || this.charSpacing;

      for (var i = 0, len = cfg.ranges.length; i < len; i += 1) {
        var range = cfg.ranges[i];

        chars[range] = this.extractFontRange(sheetImageData, range, i, len);
      }

      return chars;
    }
  }, {
    key: "extractFontRange",
    value: function extractFontRange(id, range, index) {
      var crange = [];
      var ch = this.charHeight;

      var x = 0;
      for (var i = range[0].charCodeAt(); i <= range[1].charCodeAt(); i += 1) {
        var c = {
          c: String.fromCharCode(i),
          x: x,
          y: index * ch
        };
        var empty = false;
        while (!empty) {
          empty = this.isLineEmpty(id, x, index * ch);
          x += 1;
        }
        c.w = x - 1 - c.x;
        while (empty) {
          empty = this.isLineEmpty(id, x, index * ch);
          x += 1;
        }
        x -= 1;
        crange.push(c);
      }

      return crange;
    }
  }, {
    key: "isLineEmpty",
    value: function isLineEmpty(id, x, y) {
      var empty = true;
      for (var j = 0; j < this.charHeight; j += 1) {
        if (!this.isEmptyAt(id, x, y + j)) {
          empty = false;
        }
      }

      return empty;
    }
  }, {
    key: "isEmptyAt",
    value: function isEmptyAt(id, x, y) {
      return id.data[(y * id.width + x) * 4 + 3] === 0;
    }
  }]);

  return SmartFontBuilder;
}(FontBuilder);

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FigEngine = function () {
  function FigEngine(canvas) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, FigEngine);

    if (!canvas) {
      canvas = document.createElement("canvas");
      document.body.appendChild(canvas);
    }

    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.viewportWidth = config.width || 256;
    this.viewportHeight = config.height || 256;
    this.viewportZoom = config.zoom || 2;
    this.maskOutExtents = config.mask || true;

    this.running = false;
    this.cameraX = 0;
    this.cameraY = 0;
    this.keys = {
      left: null,
      up: null,
      right: null,
      down: null,
      start: null,
      buttonA: null,
      buttonB: null,
      debug: null
    };
    this.currentTick = null;
    this.oldTick = null;
    this.debugEnabled = false;
    this.debugTopLeftText = "";
    this.debugTopRightText = "";
    this.debugBottomLeftText = "";
    this.debugBottomRightText = "";
  }

  _createClass(FigEngine, [{
    key: "start",
    value: function start() {
      this.startLoop();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.stopLoop();
    }
  }, {
    key: "startLoop",
    value: function startLoop() {
      this.running = true;
      this.update(0);
      this.draw(0);
    }
  }, {
    key: "stopLoop",
    value: function stopLoop() {
      this.running = false;
    }
  }, {
    key: "update",
    value: function update(tick) {
      var _this = this;

      var delta = void 0;

      this.currentTick = tick;
      if (this.running && this.level) {
        if (this.oldTick == null) {
          this.oldTick = tick;
        }
        delta = (tick - this.oldTick) / 1000.0;
        this.checkCamera();
        this.level.update(tick, delta);
        this.oldTick = tick;
      }
      if (this.running) {
        this.viewportZoom = Math.min(this.canvas.width / this.viewportWidth, this.canvas.height / this.viewportHeight) | 0;
        window.setTimeout(function (newTick) {
          return _this.update(newTick);
        }, 10, Date.now());
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this2 = this;

      var g = void 0;

      if (this.running) {
        g = this.context;
        this.drawBackground();
        if (this.level) {
          g.save();
          g.translate(this.canvas.width * 0.5 | 0, this.canvas.height * 0.5 | 0);
          g.scale(this.viewportZoom, this.viewportZoom);
          if (this.maskOutExtents) {
            this.clipExtents();
          }
          g.imageSmoothingEnabled = false;
          this.level.draw(g);
          g.restore();
          this.debugScreen(g);
        }
        window.requestAnimationFrame(function () {
          return _this2.draw();
        });
      }
    }
  }, {
    key: "clipExtents",
    value: function clipExtents() {
      var g = this.context;
      var gw = this.viewportWidth;
      var gh = this.viewportHeight;

      g.beginPath();
      g.rect(-gw * 0.5, -gh * 0.5, gw, gh);
      g.closePath();
      g.clip();
    }
  }, {
    key: "drawBackground",
    value: function drawBackground() {}
  }, {
    key: "debugScreen",
    value: function debugScreen(g) {
      if (this.debugEnabled) {
        this.debugTopLeftText = "Debug Screen\n" + this.debugTopLeftText;

        g.save();
        g.font = "bold 12px monospace";
        g.shadowColor = "#000000";
        g.shadowBlur = 2;
        g.fillStyle = "#ffffff";

        g.textBaseline = "top";
        g.textAlign = "left";
        var lines = this.debugTopLeftText.split("\n");
        for (var i = 0; i < lines.length; i += 1) {
          g.fillText(lines[i], 0, 12 * i);
        }

        g.textAlign = "right";
        lines = this.debugTopRightText.split("\n");
        for (var _i = 0; _i < lines.length; _i += 1) {
          g.fillText(lines[_i], window.innerWidth - 1, 12 * _i);
        }

        g.textBaseline = "bottom";
        lines = this.debugBottomRightText.split("\n");
        var offset = window.innerHeight - 1 - lines.length * 12;
        for (var _i2 = 0; _i2 < lines.length; _i2 += 1) {
          g.fillText(lines[_i2], window.innerWidth - 1, offset + 12 * _i2);
        }

        g.textAlign = "left";
        lines = this.debugBottomLeftText.split("\n");
        offset = window.innerHeight - 1 - lines.length * 12;
        for (var _i3 = 0; _i3 < lines.length; _i3 += 1) {
          g.fillText(lines[_i3], 0, offset + 12 * _i3);
        }

        g.restore();

        this.debugTopLeftText = "";
        this.debugTopRightText = "";
        this.debugBottomLeftText = "";
        this.debugBottomRightText = "";
      }
    }
  }, {
    key: "addDebugLine",
    value: function addDebugLine(line) {
      this.addTopLeftDebugLine(line);
    }
  }, {
    key: "addTopLeftDebugLine",
    value: function addTopLeftDebugLine(line) {
      if (this.debugEnabled) {
        this.debugTopLeftText += line + "\n";
      }
    }
  }, {
    key: "addTopRightDebugLine",
    value: function addTopRightDebugLine(line) {
      if (this.debugEnabled) {
        this.debugTopRightText += line + "\n";
      }
    }
  }, {
    key: "addBottomLeftDebugLine",
    value: function addBottomLeftDebugLine(line) {
      if (this.debugEnabled) {
        this.debugBottomLeftText += line + "\n";
      }
    }
  }, {
    key: "addBottomRightDebugLine",
    value: function addBottomRightDebugLine(line) {
      if (this.debugEnabled) {
        this.debugBottomRightText += line + "\n";
      }
    }
  }, {
    key: "resize",
    value: function resize(width, height) {
      var c = void 0;

      c = this.canvas;
      c.width = width;
      c.height = height;
    }
  }, {
    key: "setCamera",
    value: function setCamera(x, y) {
      this.cameraX = x;
      this.cameraY = y;
      this.checkCamera();
    }
  }, {
    key: "keyDown",
    value: function keyDown(key) {
      if (!this.keys[key]) {
        this.keys[key] = this.currentTick;
      }
    }
  }, {
    key: "keyUp",
    value: function keyUp(key) {
      this.keys[key] = null;
      if (key === "debug") {
        this.debugEnabled = !this.debugEnabled;
      }
    }
  }, {
    key: "isPressed",
    value: function isPressed(key) {
      return !!this.keys[key];
    }
  }, {
    key: "checkCamera",
    value: function checkCamera() {
      var ox = 0;
      var oy = 0;
      var vw = this.viewportWidth * 0.5;
      var vh = this.viewportHeight * 0.5;
      var sl = this.level.solidLayer;
      if (sl) {
        ox = sl.width * sl.tileWidth - vw - 1;
        oy = sl.height * sl.tileHeight - vh - 1;
      }
      if (this.cameraX > ox) {
        this.cameraX = ox;
      }
      if (this.cameraY > oy) {
        this.cameraY = oy;
      }
      if (this.cameraX < vw) {
        this.cameraX = vw;
      }
      if (this.cameraY < vh) {
        this.cameraY = vh;
      }
    }
  }, {
    key: "playSound",
    value: function playSound(sound) {
      if (sound.ended || !sound.playedAtLeastOnce) {
        sound.play();
        sound.playedAtLeastOnce = true;
      } else {
        sound.currentTime = 0;
      }
    }
  }]);

  return FigEngine;
}();

exports.default = FigEngine;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _figsharioObjects = require('./figshario-objects');

var _tiled = require('./tiled');

var _tiled2 = _interopRequireDefault(_tiled);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OBJ_CLASS_MAPPING = {
  figplayer: _figsharioObjects.Player,
  coin: _figsharioObjects.Coin,
  scoin: _figsharioObjects.StaticCoin,
  crate: _figsharioObjects.Crate,
  enemy: _figsharioObjects.Enemy
};

var FigsharioLevel = function (_TiledLevel) {
  _inherits(FigsharioLevel, _TiledLevel);

  function FigsharioLevel(engine, fileName) {
    _classCallCheck(this, FigsharioLevel);

    var _this = _possibleConstructorReturn(this, (FigsharioLevel.__proto__ || Object.getPrototypeOf(FigsharioLevel)).call(this, engine, fileName));

    _this.player = null;

    _this.letTheMoneyRain = false;
    _this.lastCollectibleTick = null;
    _this.collectibleDelay = 0;

    _this.loadAssets({
      images: {
        figplayer: "assets/images/figplayer.png",
        "tiles-grassy": "assets/images/tiles-grassy.png",
        coin: "assets/images/coin.png",
        smallFont: "assets/images/small.png",
        scoreFont: "assets/images/score.png",
        crate: "assets/images/crate.png",
        enemy: "assets/images/enemy.png"
      },
      sounds: {
        "coin-ching": "assets/sounds/coin.wav",
        "boing": "assets/sounds/boing.wav"
      }
    }, function () {
      // TODO: FIX THIS!!!!!
      _this.loadAssets({
        fonts: {
          floaty: {
            type: "smart",
            image: "smallFont",
            spaceWidth: 4,
            charHeight: 10,
            charSpacing: 1,
            ranges: [["!", "!"], ["0", "9"], ["A", "O"], ["P", "Z"], ["a", "o"], ["p", "z"]]
          },
          score: {
            type: "normal",
            image: "scoreFont",
            charWidth: 8,
            charHeight: 8,
            charSpacing: 0,
            ranges: [[" ", " "], ["0", "3"], ["4", "7"], ["8", "9"]]
          }
        }
      }, function () {
        _this.loadFile();
        _this.score = new _figsharioObjects.Score(_this.engine, _this);
      });
    });
    return _this;
  }

  _createClass(FigsharioLevel, [{
    key: 'update',
    value: function update(tick, delta) {
      _get(FigsharioLevel.prototype.__proto__ || Object.getPrototypeOf(FigsharioLevel.prototype), 'update', this).call(this, tick, delta);

      if (this.letTheMoneyRain && (this.lastCollectibleTick == null || tick - this.lastCollectibleTick >= this.collectibleDelay)) {
        this.generateCollectible();
        this.lastCollectibleTick = tick;
      }

      if (this.player) {
        this.engine.addDebugLine("Player:");
        this.engine.addDebugLine('  .position: ' + this.player.x + '\xD7' + this.player.y);
        var hv = this.player.horizVel.toFixed(4);
        var vv = this.player.vertVel.toFixed(4);
        this.engine.addDebugLine('  .velocity: ' + hv + '\xD7' + vv);
      }
      this.engine.addDebugLine('Objects: ' + this.objects.length);

      if (this.score) {
        this.score.update(tick, delta);
      }
    }
  }, {
    key: 'draw',
    value: function draw(g) {
      var w = this.engine.viewportWidth;
      var h = this.engine.viewportHeight;

      g.save();
      g.fillStyle = "#55aaff";
      g.fillRect(-w / 2, -h / 2, w, h);
      g.restore();

      _get(FigsharioLevel.prototype.__proto__ || Object.getPrototypeOf(FigsharioLevel.prototype), 'draw', this).call(this, g);

      if (this.score) {
        this.score.draw(g);
      }
    }
  }, {
    key: 'generateCollectible',
    value: function generateCollectible() {
      var s = this.solidLayer;
      if (!s) {
        return;
      }

      var w = s.width * s.tileWidth;
      var h = s.height * s.tileHeight;
      var x = Math.random() * w;
      var y = Math.random() * h;
      var tile = s.getAt(x, y);

      if (!tile || tile.ctype === "empty") {
        var c = new _figsharioObjects.Coin(this.engine, this);
        c.x = x + s.tileWidth / 2;
        c.y = y + s.tileHeight / 2;

        this.objects.push(c);
      }
      this.collectibleDelay = Math.random() * 500 + 500 | 0;
    }
  }, {
    key: 'createObject',
    value: function createObject(objData) {
      var oCls = OBJ_CLASS_MAPPING[objData.name];

      if (oCls) {
        var obj = new oCls(this.engine, this);
        obj.x = objData.x + objData.width / 2 | 0;
        obj.y = objData.y - objData.height / 2 | 0;

        if (objData.name === "figplayer") {
          this.engine.setCamera(obj.x, obj.y, true);
          this.player = obj;
        }

        this.objects.push(obj);
      }
    }
  }]);

  return FigsharioLevel;
}(_tiled2.default);

exports.default = FigsharioLevel;

},{"./figshario-objects":6,"./tiled":9}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Enemy = exports.Score = exports.Player = exports.Crate = exports.Coin = exports.StaticCoin = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _figengineObjects = require("./figengine-objects");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COLLECTION_PROXIMITY = 16;
var WORDS = "Good!, Nice!, Awesome!, Marvelous!, Superb!, Fantastic!, OK!, Bravo!, Bingo!,\n  Ka Ching!, Grand!, Awoooga!, Haha!, WOW!, Groovy!, Eureka!, Hurray!, Yahoo!, Yes!, Yeah!, Aha!,\n  Abracadabra!, Alleluia!, Aloha!, Allright!, Amen!, Aright!, Yeaaaah!, Aye!, Ba Dum Tss!, BANG!,\n  Bazinga!, Bravissimo!, Bring It On!, Bulls Eye!, Checkmate!, Cheers!, Congrats!, Congratulations!,\n  Derp!, Ermagerd!, Felicitations!, Gratz!, Great!, Halleluiah!, Hell Yeah!, Heya!, Hocus Pocus!,\n  Hoorah!, Ka Boom!, Ka Pow!, Meow!, Nyan-Nyan!, Nice One!, Oh Yeah!, Oh My!, OMG!, OMFG!, ROTF!,\n  ROTFLOL!, LMAO!, LMFAO!, Peace!, POW!, Rock On!, The cake is a lie!, UUDDLRLRBA!, Ooh La La!,\n  Ta Dah!, Voila!, Way to Go!, Well Done!, Woo Hoo!, Woot!, W00T!, XOXO!, You Know It!, Yoopee!,\n  Yummy!, ZOMG!, Zowie!, ZZZ!, XYZZY!".trim().split(/\s*,\s*/);

var MovingSprite = function (_Sprite) {
  _inherits(MovingSprite, _Sprite);

  function MovingSprite(engine, level) {
    _classCallCheck(this, MovingSprite);

    var _this = _possibleConstructorReturn(this, (MovingSprite.__proto__ || Object.getPrototypeOf(MovingSprite)).call(this, engine, level));

    _this.airborne = false;
    _this.solidBounceFactor = 0;
    _this.horizVel = 0;
    _this.vertVel = 0;
    _this.friction = 0.9;
    _this.hitbox = null;
    _this.fallSpeed = 5;
    return _this;
  }

  _createClass(MovingSprite, [{
    key: "update",
    value: function update(tick, delta) {
      _get(MovingSprite.prototype.__proto__ || Object.getPrototypeOf(MovingSprite.prototype), "update", this).call(this, tick, delta);

      this.handleMovement(delta);
      this.handleBounds();
      this.checkCollisions(delta);
    }
  }, {
    key: "handleMovement",
    value: function handleMovement(delta) {
      if (!this.level.solidLayer || !this.hitbox) {
        return;
      }

      this.x += this.horizVel * delta * 100;
      this.y += this.vertVel * delta * 100;

      this.horizVel *= this.friction;
      if (Math.abs(this.horizVel) < 0.1) {
        this.horizVel = 0;
      }
      if (!this.airborne) {
        if (!this.getSolidAt(this.x, this.y + this.hitbox.down)) {
          this.airborne = true;
        }
      }
      if (this.airborne) {
        this.vertVel = Math.min(this.level.solidLayer.tileHeight, this.vertVel + this.fallSpeed * delta);
      }
    }
  }, {
    key: "handleBounds",
    value: function handleBounds() {
      var sl = this.level.solidLayer;
      var hb = this.hitbox;
      if (!sl || !hb) {
        return;
      }

      var ox = sl.width * sl.tileWidth - 1;
      var oy = sl.height * sl.tileHeight - 1;
      if (this.x > ox - hb.right) {
        this.x = ox - hb.right;
      }
      if (this.y > oy - hb.down) {
        this.y = oy - hb.down;
      }
      if (this.x < -hb.left) {
        this.x = -hb.left;
      }
      if (this.y < -hb.up) {
        this.y = -hb.up;
      }
    }
  }, {
    key: "checkCollisions",
    value: function checkCollisions() {
      if (!this.level.solidLayer || !this.hitbox) {
        return;
      }

      // Under ceiling
      var tile = this.getSolidAt(this.x, this.y + this.hitbox.up + 1);
      if (tile && this.vertVel < 0) {
        this.vertVel = 0;
        this.positionUnderSolid(tile);
        this.collisionUp(tile);
      }

      // On ground
      tile = this.getSolidAt(this.x, this.y + this.hitbox.down - 1);
      if (this.airborne && tile) {
        this.airborne = false;
        if (this.vertVel >= 0) {
          this.vertVel = 0;
        }
        this.collisionDown(tile);
      }
      if (tile) {
        this.positionOnSolid(tile);
      }

      // Left wall
      tile = this.getSolidAt(this.x + this.hitbox.left + 1, this.y);
      if (tile && tile.ctype === "solid") {
        this.x = tile.x + tile.w + this.hitbox.right;
        this.collisionLeft(tile);
      }

      // Right wall
      tile = this.getSolidAt(this.x + this.hitbox.right - 1, this.y);
      if (tile) {
        this.x = tile.x + this.hitbox.left;
        this.collisionRight(tile);
      }

      // Inside wall
      if (this.getSolidAt(this.x, this.y)) {
        this.horizVel = 0;
        this.vertVel = 0;
      }
    }
  }, {
    key: "collisionLeft",
    value: function collisionLeft() {}
  }, {
    key: "collisionUp",
    value: function collisionUp() {}
  }, {
    key: "collisionRight",
    value: function collisionRight() {}
  }, {
    key: "collisionDown",
    value: function collisionDown() {}
  }, {
    key: "positionOnSolid",
    value: function positionOnSolid(tile) {
      var layer = this.level.solidLayer;
      var d = this.hitbox.down;

      if (!tile) {
        return;
      }

      var x = this.x - tile.x | 0;
      var w = layer.tileWidth;
      var c = tile.ctype;
      if (c === "solid") {
        this.y = tile.y - d | 0;
      } else if (c === "slopeRU") {
        this.y = tile.y + x - d | 0;
      } else if (c === "slopeLU") {
        this.y = tile.y + w - x - d | 0;
      } else if (c === "slopeRRU1") {
        this.y = tile.y + (w + x) / 2 - d | 0;
      } else if (c === "slopeRRU2") {
        this.y = tile.y + x / 2 - d | 0;
      } else if (c === "slopeRUU1") {
        this.y = tile.y + x * 2 - d | 0;
      } else if (c === "slopeRUU2") {
        this.y = tile.y + x * 2 - w - d | 0;
      } else if (c === "slopeLLU1") {
        this.y = tile.y + w - x / 2 - d | 0;
      } else if (c === "slopeLLU2") {
        this.y = tile.y + (w - x) / 2 - d | 0;
      } else if (c === "slopeLUU1") {
        this.y = tile.y + (w - x) * 2 - d | 0;
      } else if (c === "slopeLUU2") {
        this.y = tile.y + w - x * 2 - d | 0;
      }
      this.airborne = false;
    }
  }, {
    key: "positionUnderSolid",
    value: function positionUnderSolid(tile) {
      var layer = this.level.solidLayer;
      var u = layer.tileHeight - this.hitbox.up;

      if (!tile) {
        return;
      }

      var x = this.x - tile.x | 0;
      var w = layer.tileWidth;
      var c = tile.ctype;
      if (c === "solid") {
        this.y = tile.y + u | 0;
      } else if (c === "slopeLD") {
        this.y = tile.y + x + u | 0;
      } else if (c === "slopeRD") {
        this.y = tile.y + w - x + u | 0;
      } else if (c === "slopeLLD1") {
        this.y = tile.y + (w + x) / 2 + u | 0;
      } else if (c === "slopeLLD2") {
        this.y = tile.y + x / 2 + u | 0;
      } else if (c === "slopeLDD1") {
        this.y = tile.y + x * 2 + u | 0;
      } else if (c === "slopeLDD2") {
        this.y = tile.y + x * 2 - w + u | 0;
      } else if (c === "slopeRRD1") {
        this.y = tile.y + w - x / 2 + u | 0;
      } else if (c === "slopeRRD2") {
        this.y = tile.y + (w - x) / 2 + u | 0;
      } else if (c === "slopeRDD1") {
        this.y = tile.y + (w - x) * 2 + u | 0;
      } else if (c === "slopeRDD2") {
        this.y = tile.y + w - x * 2 + u | 0;
      }
      this.airborne = false;
    }
  }, {
    key: "getSolidAt",
    value: function getSolidAt(pointX, pointY) {
      var tile = this.level.solidLayer.getAt(pointX, pointY);

      if (tile) {
        var c = tile.ctype;
        var x = pointX - tile.x | 0;
        var y = pointY - tile.y | 0;
        var w = this.level.solidLayer.tileWidth;

        var conditions = [c === "solid", c === "slopeRU" && y >= x, c === "slopeLU" && y >= w - x, c === "slopeRRU1" && y >= (x + w) / 2, c === "slopeRRU2" && y >= x / 2, c === "slopeRUU1" && y >= x * 2, c === "slopeRUU2" && y >= x * 2 - w, c === "slopeLLU1" && y >= w - x / 2, c === "slopeLLU2" && y >= (w - x) / 2, c === "slopeLUU1" && y >= (w - x) * 2, c === "slopeLUU2" && y >= w - x * 2];

        for (var i = 0, len = conditions.length; i < len; i += 1) {
          if (conditions[i]) {
            return tile;
          }
        }
      }

      return false;
    }
  }]);

  return MovingSprite;
}(_figengineObjects.Sprite);

var Floaty = function (_SmartFontSprite) {
  _inherits(Floaty, _SmartFontSprite);

  function Floaty(engine, level) {
    _classCallCheck(this, Floaty);

    var _this2 = _possibleConstructorReturn(this, (Floaty.__proto__ || Object.getPrototypeOf(Floaty)).call(this, engine, level, "floaty"));

    _this2.textAlign = "center";
    _this2.textBaseline = "middle";

    _this2.climbed = 0;
    _this2.blinking = false;
    _this2.drawMe = true;
    return _this2;
  }

  _createClass(Floaty, [{
    key: "update",
    value: function update(tick, delta) {
      var climb = delta * 25;
      this.climbed += climb;
      this.y -= climb;

      if (this.climbed > 32) {
        this.blinking = true;
      }
      if (this.climbed >= 48) {
        this.destroy();
      }
    }
  }, {
    key: "draw",
    value: function draw(g) {
      if (this.blinking) {
        this.drawMe = !this.drawMe;
      }

      if (this.drawMe) {
        _get(Floaty.prototype.__proto__ || Object.getPrototypeOf(Floaty.prototype), "draw", this).call(this, g);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.level.removeObject(this);
    }
  }]);

  return Floaty;
}(_figengineObjects.SmartFontSprite);

function makeCoinLike(obj) {
  obj.width = 8;
  obj.height = 8;
  obj.loadSpriteSheet("coin");
  obj.createAnimation("create", 0, 16, 4, 100, "create1");
  obj.createAnimation("create1", 0, 24, 4, 100, "default");
  obj.createAnimation("default", 0, 0, 4, 100);
  obj.createAnimation("destroy", 0, 8, 4, 100);
  obj.setAnimation("create");

  obj.hitbox = {
    left: -2,
    up: -2,
    right: 2,
    down: 2
  };

  obj.isCollectible = true;
  obj.destroy = function () {
    var floaty = new Floaty(this.engine, this.level);
    floaty.x = this.x;
    floaty.y = this.y;
    floaty.text = WORDS[Math.random() * WORDS.length | 0];

    var sound = this.level.getSoundAsset("coin-ching");
    this.engine.playSound(sound);

    this.level.addObject(floaty);
    this.level.removeObject(this);
  };
}

var StaticCoin = exports.StaticCoin = function (_Sprite2) {
  _inherits(StaticCoin, _Sprite2);

  function StaticCoin(engine, level) {
    _classCallCheck(this, StaticCoin);

    var _this3 = _possibleConstructorReturn(this, (StaticCoin.__proto__ || Object.getPrototypeOf(StaticCoin)).call(this, engine, level));

    makeCoinLike(_this3);
    return _this3;
  }

  return StaticCoin;
}(_figengineObjects.Sprite);

var Coin = exports.Coin = function (_MovingSprite) {
  _inherits(Coin, _MovingSprite);

  function Coin(engine, level) {
    _classCallCheck(this, Coin);

    var _this4 = _possibleConstructorReturn(this, (Coin.__proto__ || Object.getPrototypeOf(Coin)).call(this, engine, level));

    makeCoinLike(_this4);
    return _this4;
  }

  return Coin;
}(MovingSprite);

var Crate = exports.Crate = function (_Sprite3) {
  _inherits(Crate, _Sprite3);

  function Crate(engine, level) {
    _classCallCheck(this, Crate);

    var _this5 = _possibleConstructorReturn(this, (Crate.__proto__ || Object.getPrototypeOf(Crate)).call(this, engine, level));

    _this5.width = 32;
    _this5.height = 32;
    _this5.anchorY = 8;

    _this5.shineThreshold = 0.01;
    _this5.unshineDelay = 2000;

    _this5.oldShine = 0;
    _this5.crateType = "simple";

    _this5.loadSpriteSheet("crate");
    _this5.createAnimation("default", 0, 0, 1);
    _this5.createAnimation("shine", 32, 0, 7, 100, "default");
    _this5.createAnimation("bump", 0, 32, 8, 50, "default");
    _this5.createAnimation("destroy", 32, 64, 7, 50);
    _this5.createAnimation("block", 0, 64, 1);
    _this5.setAnimation("default");

    _this5.isSolid = false;
    return _this5;
  }

  _createClass(Crate, [{
    key: "update",
    value: function update(tick, delta) {
      _get(Crate.prototype.__proto__ || Object.getPrototypeOf(Crate.prototype), "update", this).call(this, tick, delta);

      if (!this.isSolid) {
        var cell = this.level.solidLayer.getAt(this.x, this.y);
        if (cell) {
          cell.ctype = "solid";
          cell.crate = this;
          this.isSolid = true;
        }
      }

      if (this.getAnimation() === "default" && Math.random() < this.shineThreshold && tick > this.unshineDelay + this.oldShine) {
        this.setAnimation("shine");
        this.oldShine = tick;
      }
    }
  }, {
    key: "takeHit",
    value: function takeHit() {
      this.setAnimation("bump");
      this.generateCoin();
    }
  }, {
    key: "generateCoin",
    value: function generateCoin() {
      var c = new Coin(this.engine, this.level);

      c.x = this.x;
      c.y = this.y - this.height / 2 - c.height / 2;
      c.vertVel = -1.5;
      this.level.objects.push(c);
    }
  }]);

  return Crate;
}(_figengineObjects.Sprite);

var Player = exports.Player = function (_MovingSprite2) {
  _inherits(Player, _MovingSprite2);

  function Player(engine, level) {
    _classCallCheck(this, Player);

    var _this6 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, engine, level));

    _this6.width = 32;
    _this6.height = 40;
    _this6.hitbox = {
      left: -4,
      up: -12,
      right: 4,
      down: 12
    };

    _this6.loadSpriteSheet("figplayer");
    _this6.createAnimation("lookRight", 0, 0, 2, 250);
    _this6.createAnimation("lookLeft", 0, 40, 2, 250);
    _this6.createAnimation("walkRight", 64, 0, 4, 200);
    _this6.createAnimation("walkLeft", 64, 40, 4, 200);
    _this6.setAnimation("lookRight");

    _this6.direction = "right";
    _this6.airborne = false;
    _this6.directionPressed = false;
    _this6.jumpStillPressed = false;
    _this6.horizVel = 0;
    _this6.vertVel = 0;
    _this6.flyMode = false;
    _this6.coinCount = 0;
    _this6.jumpSound = _this6.level.getSoundAsset("boing");

    _this6.toCollect = [];
    return _this6;
  }

  _createClass(Player, [{
    key: "update",
    value: function update(tick, delta) {
      _get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), "update", this).call(this, tick, delta);

      if (this.flyMode) {
        this.handleFlyModeKeys(delta);
      } else {
        this.handleKeys(tick, delta);
        this.handleBounds();
      }
      this.chooseAnimation();
      this.handleCollecting();

      this.updateCamera();
    }
  }, {
    key: "checkCollisions",
    value: function checkCollisions(delta) {
      if (!this.flyMode) {
        _get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), "checkCollisions", this).call(this, delta);
      }

      for (var i = 0, len = this.level.objects.length; i < len; i += 1) {
        var obj = this.level.objects[i];

        if (obj.isCollectible && (this.closeTo(obj, COLLECTION_PROXIMITY) || obj.y > 10000)) {
          this.collect(obj);
        }
      }
    }
  }, {
    key: "handleFlyModeKeys",
    value: function handleFlyModeKeys(delta) {
      this.directionPressed = false;
      this.horizVel = 0;
      this.vertVel = 0;
      if (this.engine.isPressed("right")) {
        this.direction = "right";
        this.directionPressed = true;
        this.horizVel = 100 * delta;
      }
      if (this.engine.isPressed("left")) {
        this.direction = "left";
        this.directionPressed = true;
        this.horizVel = -100 * delta;
      }
      if (this.engine.isPressed("up")) {
        this.directionPressed = true;
        this.vertVel = -100 * delta;
      }
      if (this.engine.isPressed("down")) {
        this.directionPressed = true;
        this.vertVel = 100 * delta;
      }
    }
  }, {
    key: "handleMovement",
    value: function handleMovement(delta) {
      if (this.flyMode) {
        this.x += this.horizVel;
        this.y += this.vertVel;
        if (Math.abs(this.horizVel) < 0.1) {
          this.horizVel = 0;
        }
        if (Math.abs(this.vertVel) < 0.1) {
          this.vertVel = 0;
        }
      } else {
        _get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), "handleMovement", this).call(this, delta);
      }
    }
  }, {
    key: "handleKeys",
    value: function handleKeys(tick) {
      this.directionPressed = false;
      if (this.engine.isPressed("right")) {
        this.direction = "right";
        this.directionPressed = true;

        var d = tick - this.engine.keys.right;
        this.horizVel = Math.min(d / 250, 1);
      } else if (this.engine.isPressed("left")) {
        this.direction = "left";
        this.directionPressed = true;

        var _d = tick - this.engine.keys.left;
        this.horizVel = Math.max(-_d / 250, -1);
      }

      if (this.engine.isPressed("buttonA") && !this.jumpStillPressed && !this.airborne) {
        this.vertVel = -2.4;
        this.airborne = true;
        this.jumpStillPressed = true;
        this.engine.playSound(this.jumpSound);
      }

      if (!this.engine.isPressed("buttonA")) {
        this.jumpStillPressed = false;
      }
    }
  }, {
    key: "chooseAnimation",
    value: function chooseAnimation() {
      if (this.directionPressed) {
        if (this.direction === "right") {
          this.setAnimation("walkRight");
        } else {
          this.setAnimation("walkLeft");
        }
      } else {
        if (this.direction === "right") {
          this.setAnimation("lookRight");
        } else {
          this.setAnimation("lookLeft");
        }
      }
    }
  }, {
    key: "closeTo",
    value: function closeTo(item, distance) {
      if (item === this) {
        return null;
      }

      var dx = item.x - this.x;
      var dy = item.y - this.y;

      return Math.sqrt(dx * dx + dy * dy) <= distance;
    }
  }, {
    key: "collect",
    value: function collect(item) {
      item.isCollectible = false;
      this.toCollect.push(item);
      item.vertVel = 0;
      item.setAnimation("destroy");
      this.coinCount += 1;
    }
  }, {
    key: "isOnAnySolid",
    value: function isOnAnySolid(tile) {
      return tile && (tile.ctype === "solid" || this.isOnSlopeRight(tile) || this.isOnSlopeLeft(tile));
    }
  }, {
    key: "isOnSlopeRight",
    value: function isOnSlopeRight(tile) {
      if (tile.ctype === "slopeRU") {
        var x = this.x + 16 - tile.x | 0;
        var y = this.y + 32 - tile.y | 0;

        if (y >= x) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "isOnSlopeLeft",
    value: function isOnSlopeLeft(tile) {
      if (tile.ctype === "slopeLU") {
        var x = this.x + 16 - tile.x | 0;
        var y = this.y + 32 - tile.y | 0;

        if (y >= 15 - x) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "handleCollecting",
    value: function handleCollecting() {
      var ratio = 0.2;
      var toRemove = [];

      for (var i = 0; i < this.toCollect.length; i += 1) {
        var obj = this.toCollect[i];

        obj.x -= (obj.x - this.x) * ratio;
        obj.y -= (obj.y - this.y) * ratio;

        if (this.closeTo(obj, 8)) {
          obj.destroy();
          toRemove.push(obj);
        }
      }

      for (var _i = 0; _i < toRemove.length; _i += 1) {
        this.toCollect.splice(this.toCollect.indexOf(toRemove[_i]), 1);
      }
    }
  }, {
    key: "updateCamera",
    value: function updateCamera() {
      var e = this.engine;
      var hvw = e.viewportWidth * 0.15;
      var hvh = e.viewportHeight * 0.15;

      if (this.x > e.cameraX + hvw - 0.1) {
        e.cameraX = this.x - hvw;
      }
      if (this.x < e.cameraX - hvw + 0.1) {
        e.cameraX = this.x + hvw;
      }

      if (this.y > e.cameraY + hvh - 0.1) {
        e.cameraY = this.y - hvh;
      }
      if (this.y < e.cameraY - hvh + 0.1) {
        e.cameraY = this.y + hvh;
      }
      e.checkCamera();
    }
  }, {
    key: "draw",
    value: function draw(g) {
      _get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), "draw", this).call(this, g);
      if (this.engine.debugEnabled) {
        this.engine.addTopRightDebugLine("Airborne: " + this.airborne);
        g.fillStyle = "rgba(255, 64, 192, 0.33)";
        g.fillRect(this.x + this.hitbox.left, this.y + this.hitbox.up, this.hitbox.right - this.hitbox.left, this.hitbox.down - this.hitbox.up);
      }
    }
  }, {
    key: "collisionUp",
    value: function collisionUp(tile) {
      if (tile.crate) {
        tile.crate.takeHit(this);
      }
    }
  }]);

  return Player;
}(MovingSprite);

var Score = exports.Score = function (_FontSprite) {
  _inherits(Score, _FontSprite);

  function Score(engine, level) {
    _classCallCheck(this, Score);

    var _this7 = _possibleConstructorReturn(this, (Score.__proto__ || Object.getPrototypeOf(Score)).call(this, engine, level, "score"));

    _this7.textAlign = "right";
    _this7.textBaseline = "top";
    _this7.x = _this7.engine.viewportWidth / 2 - 8 | 0;
    _this7.y = -_this7.engine.viewportHeight / 2 + 8 | 0;
    _this7.opacity = 1;
    _this7.oldCoinCount = null;
    _this7.changeTick = null;
    return _this7;
  }

  _createClass(Score, [{
    key: "update",
    value: function update(tick) {
      if (!this.engine.level || !this.engine.level.player) {
        return;
      }

      var coinCount = this.level.player.coinCount;
      if (coinCount != this.oldCoinCount || this.changeTick == null) {
        this.text = "" + coinCount * 100;
        this.changeTick = tick;
        this.opacity = 1;
        this.oldCoinCount = coinCount;
      }

      if (tick >= this.changeTick + 3000) {
        if (this.opacity > 0.5) {
          this.opacity -= 0.01;
        }
      }
    }
  }, {
    key: "draw",
    value: function draw(g) {
      g.save();
      g.globalAlpha = this.opacity;
      _get(Score.prototype.__proto__ || Object.getPrototypeOf(Score.prototype), "draw", this).call(this, g);
      g.restore();
    }
  }]);

  return Score;
}(_figengineObjects.FontSprite);

var Enemy = exports.Enemy = function (_MovingSprite3) {
  _inherits(Enemy, _MovingSprite3);

  function Enemy(engine, level) {
    _classCallCheck(this, Enemy);

    var _this8 = _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, engine, level));

    _this8.width = 32;
    _this8.height = 32;
    _this8.hitbox = {
      left: -10,
      up: -4,
      right: 10,
      down: 16
    };

    _this8.direction = "right";
    _this8.speed = 25;

    _this8.loadSpriteSheet("enemy");
    _this8.createAnimation("right", 0, 0, 2, 300);
    _this8.createAnimation("left", 0, 32, 2, 300);
    _this8.setAnimation("right");
    return _this8;
  }

  _createClass(Enemy, [{
    key: "update",
    value: function update(tick, delta) {
      this.horizVel = delta * this.speed;

      if (this.direction === "left") {
        this.horizVel = -this.horizVel;
      }

      _get(Enemy.prototype.__proto__ || Object.getPrototypeOf(Enemy.prototype), "update", this).call(this, tick, delta);
    }
  }, {
    key: "collisionLeft",
    value: function collisionLeft() {
      this.switchDirection();
    }
  }, {
    key: "collisionRight",
    value: function collisionRight() {
      this.switchDirection();
    }
  }, {
    key: "switchDirection",
    value: function switchDirection() {
      if (this.direction === "right") {
        this.setAnimation("left");
        this.direction = "left";
      } else {
        this.setAnimation("right");
        this.direction = "right";
      }
    }
  }]);

  return Enemy;
}(MovingSprite);

},{"./figengine-objects":2}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _figengine = require('./figengine');

var _figengine2 = _interopRequireDefault(_figengine);

var _figsharioLevel = require('./figshario-level');

var _figsharioLevel2 = _interopRequireDefault(_figsharioLevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KONAMI_CODE = ["up", "up", "down", "down", "left", "right", "left", "right", "buttonB", "buttonA", "start"];

var Figshario = function (_FigEngine) {
  _inherits(Figshario, _FigEngine);

  function Figshario(canvas, config) {
    _classCallCheck(this, Figshario);

    var _this = _possibleConstructorReturn(this, (Figshario.__proto__ || Object.getPrototypeOf(Figshario)).call(this, canvas, config));

    _this.viewportWidth = 320;
    _this.viewportHeight = 200;

    _this.keyLog = [];
    return _this;
  }

  _createClass(Figshario, [{
    key: 'loadLevel',
    value: function loadLevel(fileName) {
      this.level = new _figsharioLevel2.default(this, fileName);
    }
  }, {
    key: 'drawOSD',
    value: function drawOSD(g) {
      if (this.score) {
        this.score.draw(g);
      }
    }
  }, {
    key: 'update',
    value: function update(tick) {
      _get(Figshario.prototype.__proto__ || Object.getPrototypeOf(Figshario.prototype), 'update', this).call(this, tick);

      if (this.score) {
        this.score.update(tick);
      }

      this.addBottomRightDebugLine(this.keyLog);
    }
  }, {
    key: 'drawBackground',
    value: function drawBackground() {
      var c = this.canvas;
      var g = this.context;

      g.fillStyle = "#000000";
      g.fillRect(0, 0, c.width, c.height);
    }
  }, {
    key: 'keyUp',
    value: function keyUp(key) {
      _get(Figshario.prototype.__proto__ || Object.getPrototypeOf(Figshario.prototype), 'keyUp', this).call(this, key);

      if (!this.level.player) {
        return;
      }

      this.keyLog.push(key);

      if (this.keyLog.length < 11) {
        return;
      }

      this.keyLog = this.keyLog.splice(-11, 11);

      var ok = true;
      for (var i = 0; ok && i < 11; i += 1) {
        if (this.keyLog[i] !== KONAMI_CODE[i]) {
          ok = false;
        }
      }

      if (ok) {
        this.level.player.flyMode = !this.level.player.flyMode;
      }
    }
  }]);

  return Figshario;
}(_figengine2.default);

exports.default = Figshario;

},{"./figengine":4,"./figshario-level":5}],8:[function(require,module,exports){
"use strict";

var _figshario = require("./figshario");

var _figshario2 = _interopRequireDefault(_figshario);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var viewport = document.getElementById("viewport");
var game = new _figshario2.default(viewport);

game.start();
game.loadLevel("assets/maps/level1b.json");

var KEY_TRANSLATIONS = {
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
var KEY_MAPPINGS = {
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
  var action = null;
  var key = evt.key;
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
window.addEventListener("keydown", function (evt) {
  var key = void 0;

  key = handleKey(evt);

  if (key) {
    game.keyDown(key);
    evt.preventDefault();
  }
});
window.addEventListener("keyup", function (evt) {
  var key = void 0;

  if (evt.key === "F10" || evt.keyCode === 121) {
    game.stop();
  }
  key = handleKey(evt);

  if (key) {
    game.keyUp(key);
    evt.preventDefault();
  }
});

},{"./figshario":7}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _figengineLevel = require("./figengine-level");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TiledLayer = function (_Layer) {
  _inherits(TiledLayer, _Layer);

  function TiledLayer() {
    _classCallCheck(this, TiledLayer);

    return _possibleConstructorReturn(this, (TiledLayer.__proto__ || Object.getPrototypeOf(TiledLayer)).apply(this, arguments));
  }

  _createClass(TiledLayer, [{
    key: "findTileset",
    value: function findTileset(tilesets, tileIndex) {
      var output = null;
      var topGid = null;
      if (tileIndex > 0) {
        for (var i = 0, len = tilesets.length; i < len; i += 1) {
          var tileset = tilesets[i];
          if (tileIndex >= tileset.firstgid && (!topGid || tileset.firstgid > topGid)) {
            output = tileset;
            topGid = tileset.firstgid;
          }
        }
      }

      return output;
    }
  }, {
    key: "watchTileset",
    value: function watchTileset(tileset) {
      if (!tileset) {
        return;
      }

      var found = false;
      for (var i = 0, len = this.tilesets.length; !found && i < len; i += 1) {
        if (tileset === this.tilesets[i]) {
          found = true;
        }
      }
      if (!found) {
        this.tilesets.push(tileset);
      }
    }
  }, {
    key: "loadTiledLayerData",
    value: function loadTiledLayerData(tilesets, layerData, tileWidth, tileHeight) {
      this.width = layerData.width;
      this.height = layerData.height;
      if (layerData.properties && layerData.properties.type === "playfield") {
        this.isSolid = true;
      }

      this.tilesets = [];
      var tiles = [];
      for (var y = 0, ylen = this.height; y < ylen; y += 1) {
        tiles.push([]);
        for (var x = 0, xlen = this.width; x < xlen; x += 1) {
          var tileIndex = layerData.data[y * this.width + x];
          var tileset = this.findTileset(tilesets, tileIndex);

          this.watchTileset(tileset);

          var ctype = "empty";
          var sx = -tileWidth;
          var sy = -tileHeight;
          var img = null;

          if (tileIndex && tileset) {
            var props = tileset.tileproperties[tileIndex - tileset.firstgid];
            ctype = props ? props.ctype : "empty";
            var cellsX = tileset.imagewidth / tileWidth | 0;
            var offset = tileIndex - tileset.firstgid;

            sx = offset % cellsX * tileWidth;
            sy = (offset / cellsX | 0) * tileHeight;

            img = tileset.image;
          }

          tiles[y][x] = {
            x: x * tileWidth,
            y: y * tileHeight,
            w: tileWidth,
            h: tileHeight,
            sx: sx,
            sy: sy,
            img: img,
            ctype: ctype
          };
        }
      }
      this.tiles = tiles;
      this.buildBackground();
    }
  }]);

  return TiledLayer;
}(_figengineLevel.Layer);

var TiledLevel = function (_Level) {
  _inherits(TiledLevel, _Level);

  function TiledLevel() {
    _classCallCheck(this, TiledLevel);

    return _possibleConstructorReturn(this, (TiledLevel.__proto__ || Object.getPrototypeOf(TiledLevel)).apply(this, arguments));
  }

  _createClass(TiledLevel, [{
    key: "loadLevelData",
    value: function loadLevelData(data) {
      console.debug(data);
      var tilesets = [];

      var _loop = function _loop(i, len) {
        var tileset = data.tilesets[i];
        var imageSrc = tileset.image;
        tileset.image = new Image();
        tileset.image.onload = function () {
          return data.tilesets[i].loaded = true;
        };
        tileset.image.src = imageSrc;
        tilesets.push(tileset);
      };

      for (var i = 0, len = data.tilesets.length; i < len; i += 1) {
        _loop(i, len);
      }

      var layers = [];
      for (var j = 0, jlen = data.layers.length; j < jlen; j += 1) {
        var layerData = data.layers[j];
        if (layerData.type === "tilelayer") {
          var layer = new TiledLayer(this.engine, data.tilewidth, data.tileheight);
          layer.loadTiledLayerData(tilesets, layerData, data.tilewidth, data.tileheight);
          if (layer.isSolid) {
            this.solidLayer = layer;
          }
          layers.push(layer);
        } else if (layerData.type === "objectgroup") {
          for (var i = 0, len = layerData.objects.length; i < len; i += 1) {
            this.createObject(layerData.objects[i]);
          }
        }
      }
      this.layers = layers;
    }
  }]);

  return TiledLevel;
}(_figengineLevel.Level);

exports.default = TiledLevel;

},{"./figengine-level":1}]},{},[8]);
