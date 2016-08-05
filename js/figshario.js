(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global window */

var Figengine = function () {
  function Figengine(canvas) {
    _classCallCheck(this, Figengine);

    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.viewportWidth = 320;
    this.viewportHeight = 200;
    this.zoom = 2;
    this.maskOutExtents = true;
    this.running = false;
    this.cameraX = 0;
    this.cameraY = 0;
    this.cameraFollowX = 0;
    this.cameraFollowY = 0;
    this.cameraFollowRatio = 5;
    this.keys = {
      left: false,
      up: false,
      right: false,
      down: false,
      start: false,
      buttonA: false,
      buttonB: false,
      debug: false
    };
    this.oldTick = null;
    this.debugEnabled = false;
    this.debugTopLeftText = "";
    this.debugTopRightText = "";
    this.debugBottomLeftText = "";
    this.debugBottomRightText = "";
  }

  _createClass(Figengine, [{
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

      if (this.running && this.level) {
        if (this.oldTick == null) {
          this.oldTick = tick;
        }
        delta = (tick - this.oldTick) / 1000.0;
        this.moveCamera(delta);
        this.level.update(tick, delta);
        this.oldTick = tick;
      }
      if (this.running) {
        this.zoom = Math.min(this.canvas.width / this.viewportWidth, this.canvas.height / this.viewportHeight) | 0;
        setTimeout(function (newTick) {
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
          g.scale(this.zoom, this.zoom);
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
        this.debugTopLeftText += line + "\n";
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
      var reset = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      // TODO: make sure the camera doesn't make the viewport overflow
      this.cameraFollowX = x;
      this.cameraFollowY = y;
      if (reset) {
        this.cameraX = x;
        this.cameraY = y;
      }
    }
  }, {
    key: "keyDown",
    value: function keyDown(key) {
      this.keys[key] = true;
    }
  }, {
    key: "keyUp",
    value: function keyUp(key) {
      this.keys[key] = false;
      if (key === "debug") {
        this.debugEnabled = !this.debugEnabled;
      }
    }
  }, {
    key: "isPressed",
    value: function isPressed(key) {
      return this.keys[key];
    }
  }, {
    key: "moveCamera",
    value: function moveCamera(delta) {
      var dx = this.cameraX - this.cameraFollowX;
      var dy = this.cameraY - this.cameraFollowY;

      if (Math.sqrt(dx * dx + dy * dy) > 0.001) {
        this.cameraX = this.cameraX - dx * this.cameraFollowRatio * delta;
        this.cameraY = this.cameraY - dy * this.cameraFollowRatio * delta;
      } else {
        this.cameraX = this.cameraFollowX;
        this.cameraY = this.cameraFollowY;
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

  return Figengine;
}();

exports.default = Figengine;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Layer = function () {
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
          if (tile) {
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

exports.default = Layer;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _util = require("./util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _loadingSprite = null;

function _getLoadingSprite() {
  if (!_loadingSprite) {
    var ls = new Image();
    ls.src = "assets/images/progress.gif";
    _loadingSprite = ls;
  }

  return _loadingSprite;
}

var Level = function (_Loader) {
  _inherits(Level, _Loader);

  function Level(engine, fileName) {
    _classCallCheck(this, Level);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Level).call(this));

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

      var sy = 0;
      if (p === 0) {
        sy = 16;
      }
      g.drawImage(s, 0, sy, 8, 16, -cw * 4, -8, 8, 16);

      sy = 0;
      if (p < 100) {
        sy = 16;
      }
      g.drawImage(s, 16, sy, 8, 16, cw * 4, -8, 8, 16);

      for (var st = -(cw - 2) * 4, i = st, end = (cw - 2) * 4; i <= end; i += 8) {
        sy = 0;
        if (p < (i - st) / (end - st) * 100) {
          sy = 16;
        }
        g.drawImage(s, 8, sy, 8, 16, i, -8, 8, 16);
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
      _get(Object.getPrototypeOf(Level.prototype), "loadFile", this).call(this, fileName || this.levelFileName);
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
        var fCls = _util.FontBuilder;
        if (cfg.type === "smart") {
          fCls = _util.SmartFontBuilder;
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
}(_util2.default);

exports.default = Level;

},{"./util":8}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sprite = require("./sprite");

var _sprite2 = _interopRequireDefault(_sprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FontSprite = function (_Sprite) {
  _inherits(FontSprite, _Sprite);

  function FontSprite(engine, level, fontName) {
    _classCallCheck(this, FontSprite);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FontSprite).call(this, engine, level));

    _this.text = "";
    _this.textAlign = "left";
    _this.textBaseline = "bottom";

    var fc = level.getFontAsset(fontName);
    _this.charWidth = fc.charWidth || 8;
    _this.charHeight = fc.charHeight || 8;
    _this.charSpacing = fc.charSpacing || 0;

    _this.fontConfig = fc;
    return _this;
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

          g.drawImage(this.fontConfig.spriteSheet, sx, sy, cw, ch, x, y, cw, ch);
        }
      }
    }
  }]);

  return FontSprite;
}(_sprite2.default);

exports.default = FontSprite;

},{"./sprite":7}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
        g.translate(this.x, this.y);
        g.rotate(this.rotation);
        g.drawImage(this.spriteSheet, this.sprX, this.sprY, w, h, -w / 2, -h / 2, w, h);
        g.restore();
      }
    }
  }]);

  return FSObject;
}();

exports.default = FSObject;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fontSprite = require("./font-sprite");

var _fontSprite2 = _interopRequireDefault(_fontSprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SmartFontSprite = function (_FontSprite) {
  _inherits(SmartFontSprite, _FontSprite);

  function SmartFontSprite(engine, level, fontName) {
    _classCallCheck(this, SmartFontSprite);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SmartFontSprite).call(this, engine, level, fontName));

    var fc = _this.fontConfig;

    _this.charSpacing = fc.charSpacing || 0;
    _this.spaceWidth = fc.spaceWidth || 8;

    _this.charRanges = fc.ranges;
    return _this;
  }

  _createClass(SmartFontSprite, [{
    key: "draw",
    value: function draw(g) {
      var _this2 = this;

      var ch = this.charHeight;
      var x = this.x;
      var y = this.y - ch;

      if (this.textBaseline === "middle") {
        y += ch / 2;
      } else if (this.textBaseline === "top") {
        y += ch;
      }

      var _loop = function _loop(i, len) {
        var c = _this2.text[i].charCodeAt();

        var sx = -1;
        var sy = -1;
        var cw = void 0;

        Object.keys(_this2.charRanges).forEach(function (key) {
          var s = key[0].charCodeAt();
          var e = key[2].charCodeAt();
          if (c >= s && c <= e) {
            var o = _this2.charRanges[key][c - s];

            sx = o.x;
            sy = o.y;
            cw = o.w;
          }
        });

        if (sx >= 0 && sy >= 0) {
          g.drawImage(_this2.fontConfig.spriteSheet, sx, sy, cw, ch, x, y, cw, ch);
          x += cw + _this2.charSpacing;
        } else {
          x += _this2.spaceWidth + _this2.charSpacing;
        }
      };

      for (var i = 0, len = this.text.length; i < len; i += 1) {
        _loop(i, len);
      }
    }
  }]);

  return SmartFontSprite;
}(_fontSprite2.default);

exports.default = SmartFontSprite;

},{"./font-sprite":4}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _fsobject = require("./fsobject");

var _fsobject2 = _interopRequireDefault(_fsobject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sprite = function (_FSObject) {
  _inherits(Sprite, _FSObject);

  function Sprite(engine, level) {
    _classCallCheck(this, Sprite);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Sprite).call(this, engine, level));

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
      _get(Object.getPrototypeOf(Sprite.prototype), "update", this).call(this, tick, delta);
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
}(_fsobject2.default);

exports.default = Sprite;

},{"./fsobject":5}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loader = function () {
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

exports.default = Loader;

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

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SmartFontBuilder).call(this, level, config));
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

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _engine = require("../figengine/engine");

var _engine2 = _interopRequireDefault(_engine);

var _level = require("./level");

var _level2 = _interopRequireDefault(_level);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KONAMI_CODE = ["up", "up", "down", "down", "left", "right", "left", "right", "buttonB", "buttonA", "start"];

var Figshario = function (_Figengine) {
  _inherits(Figshario, _Figengine);

  function Figshario(canvas) {
    _classCallCheck(this, Figshario);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Figshario).call(this, canvas));

    _this.keyLog = [];
    return _this;
  }

  _createClass(Figshario, [{
    key: "loadLevel",
    value: function loadLevel(fileName) {
      this.level = new _level2.default(this, fileName);
    }
  }, {
    key: "drawOSD",
    value: function drawOSD(g) {
      if (this.score) {
        this.score.draw(g);
      }
    }
  }, {
    key: "update",
    value: function update(tick) {
      _get(Object.getPrototypeOf(Figshario.prototype), "update", this).call(this, tick);

      if (this.score) {
        this.score.update(tick);
      }
    }
  }, {
    key: "drawBackground",
    value: function drawBackground() {
      var c = this.canvas;
      var g = this.context;

      var gd = g.createLinearGradient(0, 0, 0, c.height);
      gd.addColorStop(0.00, "#888899");
      gd.addColorStop(0.75, "#aaccff");
      gd.addColorStop(1.00, "#9999bb");

      g.fillStyle = gd;
      g.fillRect(0, 0, c.width, c.height);
    }
  }, {
    key: "keyUp",
    value: function keyUp(key) {
      _get(Object.getPrototypeOf(Figshario.prototype), "keyUp", this).call(this, key);

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
}(_engine2.default);

exports.default = Figshario;

},{"../figengine/engine":1,"./level":10}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _coin = require("./objects/coin");

var _coin2 = _interopRequireDefault(_coin);

var _player = require("./objects/player");

var _player2 = _interopRequireDefault(_player);

var _score = require("./objects/score");

var _score2 = _interopRequireDefault(_score);

var _tiled = require("../tiled");

var _tiled2 = _interopRequireDefault(_tiled);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OBJ_CLASS_MAPPING = {
  "figplayer": _player2.default,
  "coin": _coin2.default,
  "scoin": _coin.StaticCoin
};

var FigsharioLevel = function (_TiledLevel) {
  _inherits(FigsharioLevel, _TiledLevel);

  function FigsharioLevel(engine, fileName) {
    _classCallCheck(this, FigsharioLevel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FigsharioLevel).call(this, engine, fileName));

    _this.lastCollectibleTick = null;
    _this.collectibleDelay = 0;
    _this.player = null;

    _this.loadAssets({
      images: {
        figplayer: "assets/images/figplayer.gif",
        "tiles-grassy": "assets/images/tiles-grassy.gif",
        coin: "assets/images/coin.gif",
        smallFont: "assets/images/small.gif",
        scoreFont: "assets/images/score.gif"
      },
      sounds: {
        "coin-ching": "assets/sounds/coin.wav",
        "boing": "assets/sounds/boing.wav"
      }
    }, function () {
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
            charWidth: 16,
            charHeight: 24,
            charSpacing: 1,
            ranges: [["0", "9"]]
          }
        }
      }, function () {
        _this.loadFile();
        _this.score = new _score2.default(_this.engine, _this);
      });
    });
    return _this;
  }

  _createClass(FigsharioLevel, [{
    key: "update",
    value: function update(tick, delta) {
      _get(Object.getPrototypeOf(FigsharioLevel.prototype), "update", this).call(this, tick, delta);

      if (this.lastCollectibleTick == null || tick - this.lastCollectibleTick >= this.collectibleDelay) {
        this.generateCollectible();
        this.lastCollectibleTick = tick;
      }

      if (this.player) {
        this.engine.addDebugLine("Player:");
        this.engine.addDebugLine("  .position: " + this.player.x + "×" + this.player.y);
        var hv = this.player.horizVel.toFixed(4);
        var vv = this.player.vertVel.toFixed(4);
        this.engine.addDebugLine("  .velocity: " + hv + "×" + vv);
      }
      this.engine.addDebugLine("Objects: " + this.objects.length);

      if (this.score) {
        this.score.update(tick, delta);
      }
    }
  }, {
    key: "draw",
    value: function draw(g) {
      _get(Object.getPrototypeOf(FigsharioLevel.prototype), "draw", this).call(this, g);

      if (this.score) {
        this.score.draw(g);
      }
    }
  }, {
    key: "generateCollectible",
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
        var c = new _coin2.default(this.engine, this);
        c.x = x + s.tileWidth / 2;
        c.y = y + s.tileHeight / 2;

        this.objects.push(c);
      }
      this.collectibleDelay = Math.random() * 500 + 500 | 0;
    }
  }, {
    key: "createObject",
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

},{"../tiled":17,"./objects/coin":11,"./objects/player":14,"./objects/score":15}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StaticCoin = undefined;

var _sprite = require("../../figengine/objects/sprite");

var _sprite2 = _interopRequireDefault(_sprite);

var _movingSprite = require("../../figshario/objects/moving-sprite");

var _movingSprite2 = _interopRequireDefault(_movingSprite);

var _floaty = require("./floaty");

var _floaty2 = _interopRequireDefault(_floaty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WORDS = "Good!, Nice!, Awesome!, Marvelous!, Superb!, Fantastic!, OK!, Bravo!, Bingo!, Ka Ching!, Grand!, Awoooga!,\n    Haha!, Yabba Dabba Doo!, Scooby Dooby Doo!, SuperCaliFragilisticExpalidocious!, WOW!, Groovy!, Eureka!, Hurray!,\n    Yahoo!, Yes!, Yeah!, Aha!, Abracadabra!, Alleluia!, Aloha!, Allright!, Amen!, Aright!, Yeaaaah!, Aye!,\n    Ba Da Bing Ba Da Boom!, Ba Dum Tss!, BANG!, Bazinga!, Bless You!, Blimey!, Boo Ya!, Bravissimo!, Bring It On!,\n    Bulls Eye!, Checkmate!, Cheers!, Congrats!, Congratulations!, Derp!, Diddly Doo!, Boing!, Doing!, Ermagerd!,\n    Felicitations!, Fire in the Hole!, Fo Real!, Fo Sho!, Geronimo!, Golly!, Golly Gee!, Goo Goo Ga Ga!, Goo Goo!,\n    Gratz!, Great!, Halleluiah!, Hell Yeah!, Heya!, Hocus Pocus!, Hoorah!, Ka Boom!, Ka Pow!, Meow!, Nyan-Nyan!,\n    Nice One!, Oh Yeah!, Oh My!, OMG!, OMFG!, ROTF!, ROTFLOL!, LMAO!, LMFAO!, Oompa Loompa!, Peace!, POW!, Rock On!,\n    The cake is a lie!, UUDDLRLRBA!, Ooh La La!, Ta Dah!, Viva!, Voila!, Way to Go!, Well Done!, Wazzup!, Woo Hoo!,\n    Woot!, W00T!, XOXO!, You Know It!, Yoopee!, Yummy!, ZOMG!, Zowie!, ZZZ!, XYZZY!\n".trim().split(/\s*,\s*/);

function makeCoinLike(obj) {
  obj.width = 8;
  obj.height = 8;
  obj.loadSpriteSheet("coin");
  obj.createAnimation("create", 0, 8, 8, 100, "default");
  obj.createAnimation("default", 0, 0, 4, 100);
  obj.createAnimation("destroy", 32, 0, 4, 100);
  obj.setAnimation("create");

  obj.hitbox = {
    left: -2,
    up: -2,
    right: 2,
    down: 2
  };

  obj.isCollectible = true;
  obj.destroy = function () {
    var floaty = new _floaty2.default(this.engine, this.level);
    floaty.x = this.x;
    floaty.y = this.y;
    floaty.text = WORDS[Math.random() * WORDS.length | 0];

    var sound = this.level.getSoundAsset("coin-ching");
    this.engine.playSound(sound);

    this.level.addObject(floaty);
    this.level.removeObject(this);
  };
}

var StaticCoin = exports.StaticCoin = function (_Sprite) {
  _inherits(StaticCoin, _Sprite);

  function StaticCoin(engine, level) {
    _classCallCheck(this, StaticCoin);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StaticCoin).call(this, engine, level));

    makeCoinLike(_this);
    return _this;
  }

  return StaticCoin;
}(_sprite2.default);

var Coin = function (_MovingSprite) {
  _inherits(Coin, _MovingSprite);

  function Coin(engine, level) {
    _classCallCheck(this, Coin);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Coin).call(this, engine, level));

    makeCoinLike(_this2);
    return _this2;
  }

  return Coin;
}(_movingSprite2.default);

exports.default = Coin;

},{"../../figengine/objects/sprite":7,"../../figshario/objects/moving-sprite":13,"./floaty":12}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _smartFontSprite = require("../../figengine/objects/smart-font-sprite");

var _smartFontSprite2 = _interopRequireDefault(_smartFontSprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Floaty = function (_SmartFontSprite) {
  _inherits(Floaty, _SmartFontSprite);

  function Floaty(engine, level) {
    _classCallCheck(this, Floaty);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Floaty).call(this, engine, level, "floaty"));

    _this.textAlign = "center";
    _this.textBaseline = "middle";

    _this.climbed = 0;
    _this.blinking = false;
    _this.drawMe = true;
    return _this;
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
        _get(Object.getPrototypeOf(Floaty.prototype), "draw", this).call(this, g);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.level.removeObject(this);
    }
  }]);

  return Floaty;
}(_smartFontSprite2.default);

exports.default = Floaty;

},{"../../figengine/objects/smart-font-sprite":6}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _sprite = require("../../figengine/objects/sprite");

var _sprite2 = _interopRequireDefault(_sprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovingSprite = function (_Sprite) {
  _inherits(MovingSprite, _Sprite);

  function MovingSprite(engine, level) {
    _classCallCheck(this, MovingSprite);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MovingSprite).call(this, engine, level));

    _this.airborne = false;
    _this.solidBounceFactor = 0;
    _this.horizVel = 0;
    _this.vertVel = 0;
    _this.friction = 0.9;
    _this.hitbox = null;
    _this.fallSpeed = 15;
    return _this;
  }

  _createClass(MovingSprite, [{
    key: "update",
    value: function update(tick, delta) {
      _get(Object.getPrototypeOf(MovingSprite.prototype), "update", this).call(this, tick, delta);

      this.handleMovement(delta);
      this.checkCollisions(delta);
    }
  }, {
    key: "handleMovement",
    value: function handleMovement(delta) {
      if (!this.level.solidLayer || !this.hitbox) {
        return;
      }

      this.x += this.horizVel | 0;
      this.y += this.vertVel | 0;

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
      }

      // On ground
      tile = this.getSolidAt(this.x, this.y + this.hitbox.down - 1);
      if (this.airborne && tile) {
        this.airborne = false;
        if (this.vertVel >= 0) {
          this.vertVel = 0;
        }
      }
      if (tile) {
        this.positionOnSolid(tile);
      }

      // Left wall
      tile = this.getSolidAt(this.x + this.hitbox.left + 1, this.y);
      if (tile && tile.ctype === "solid") {
        this.x = tile.x + tile.w + this.hitbox.right;
      }

      // Right wall
      tile = this.getSolidAt(this.x + this.hitbox.right - 1, this.y);
      if (tile) {
        this.x = tile.x + this.hitbox.left;
      }

      // Inside wall
      if (this.getSolidAt(this.x, this.y)) {
        this.horizVel = 0;
        this.vertVel = 0;
      }
    }
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
}(_sprite2.default);

exports.default = MovingSprite;

},{"../../figengine/objects/sprite":7}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _movingSprite = require("./moving-sprite");

var _movingSprite2 = _interopRequireDefault(_movingSprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COLLECTION_PROXIMITY = 16;

var Player = function (_MovingSprite) {
  _inherits(Player, _MovingSprite);

  function Player(engine, level) {
    _classCallCheck(this, Player);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Player).call(this, engine, level));

    _this.width = 32;
    _this.height = 40;
    _this.hitbox = {
      left: -4,
      up: -12,
      right: 4,
      down: 12
    };

    _this.loadSpriteSheet("figplayer");
    _this.createAnimation("lookRight", 0, 0, 2, 250);
    _this.createAnimation("lookLeft", 0, 40, 2, 250);
    _this.createAnimation("walkRight", 64, 0, 4, 100);
    _this.createAnimation("walkLeft", 64, 40, 4, 100);
    _this.setAnimation("lookRight");

    _this.direction = "right";
    _this.airborne = false;
    _this.directionPressed = false;
    _this.jumpStillPressed = false;
    _this.horizVel = 0;
    _this.vertVel = 0;
    _this.flyMode = false;
    _this.coinCount = 0;
    _this.jumpSound = _this.level.getSoundAsset("boing");

    _this.toCollect = [];
    return _this;
  }

  _createClass(Player, [{
    key: "update",
    value: function update(tick, delta) {
      _get(Object.getPrototypeOf(Player.prototype), "update", this).call(this, tick, delta);

      if (this.flyMode) {
        this.handleFlyModeKeys(delta);
      } else {
        this.handleKeys(delta);
      }
      this.chooseAnimation();
      this.handleCollecting();

      this.updateCamera();
    }
  }, {
    key: "checkCollisions",
    value: function checkCollisions(delta) {
      if (!this.flyMode) {
        _get(Object.getPrototypeOf(Player.prototype), "checkCollisions", this).call(this, delta);
      }

      for (var i = 0, len = this.level.objects.length; i < len; i += 1) {
        var obj = this.level.objects[i];

        if (obj.isCollectible && this.closeTo(obj, COLLECTION_PROXIMITY) || obj.y > 10000) {
          this.collect(obj);
        }
      }
    }
  }, {
    key: "handleFlyModeKeys",
    value: function handleFlyModeKeys(delta) {
      this.directionPressed = false;
      if (this.engine.isPressed("right")) {
        this.direction = "right";
        this.directionPressed = true;
        this.horizVel += 80 * delta;
        this.horizVel = Math.min(Math.max(this.horizVel, 1), 8);
      }
      if (this.engine.isPressed("left")) {
        this.direction = "left";
        this.directionPressed = true;
        this.horizVel -= 80 * delta;
        this.horizVel = Math.max(Math.min(this.horizVel, -1), -8);
      }
      if (this.engine.isPressed("up")) {
        this.directionPressed = true;
        this.vertVel -= 80 * delta;
        this.vertVel = Math.max(Math.min(this.vertVel, -1), -8);
      }
      if (this.engine.isPressed("down")) {
        this.directionPressed = true;
        this.vertVel += 80 * delta;
        this.vertVel = Math.min(Math.max(this.vertVel, 1), 8);
      }
    }
  }, {
    key: "handleMovement",
    value: function handleMovement(delta) {
      if (this.flyMode) {
        this.x += this.horizVel | 0;
        this.y += this.vertVel | 0;
        if (Math.abs(this.horizVel) < 0.1) {
          this.horizVel = 0;
        }
        if (Math.abs(this.vertVel) < 0.1) {
          this.vertVel = 0;
        }
      } else {
        _get(Object.getPrototypeOf(Player.prototype), "handleMovement", this).call(this, delta);
      }
    }
  }, {
    key: "handleKeys",
    value: function handleKeys(delta) {
      this.directionPressed = false;
      if (this.engine.isPressed("right")) {
        this.direction = "right";
        this.directionPressed = true;

        this.horizVel += 20 * delta;
        this.horizVel = Math.min(this.horizVel, 8);
      } else if (this.engine.isPressed("left")) {
        this.direction = "left";
        this.directionPressed = true;

        this.horizVel -= 20 * delta;
        this.horizVel = Math.max(this.horizVel, -8);
      }

      if (this.engine.isPressed("buttonA") && !this.jumpStillPressed && !this.airborne) {
        this.vertVel = -5.5;
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
      return tile && (tile.ctype === "solid" || this.isOnSlantRight(tile) || this.isOnSlantLeft(tile));
    }
  }, {
    key: "isOnSlantRight",
    value: function isOnSlantRight(tile) {
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
    key: "isOnSlantLeft",
    value: function isOnSlantLeft(tile) {
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
      var offset = void 0;

      if (this.direction === "right") {
        offset = 40;
      } else {
        offset = -40;
      }

      this.engine.setCamera(this.x + this.width / 2 + offset, this.y + this.height / 2);
    }
  }, {
    key: "draw",
    value: function draw(g) {
      _get(Object.getPrototypeOf(Player.prototype), "draw", this).call(this, g);
      if (this.engine.debugEnabled) {
        this.engine.addTopRightDebugLine("Airborne: " + this.airborne);
        g.fillStyle = "rgba(255, 64, 192, 0.33)";
        g.fillRect(this.x + this.hitbox.left, this.y + this.hitbox.up, this.hitbox.right - this.hitbox.left, this.hitbox.down - this.hitbox.up);
      }
    }
  }]);

  return Player;
}(_movingSprite2.default);

exports.default = Player;

},{"./moving-sprite":13}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _fontSprite = require("../../figengine/objects/font-sprite");

var _fontSprite2 = _interopRequireDefault(_fontSprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Score = function (_FontSprite) {
  _inherits(Score, _FontSprite);

  function Score(engine, level) {
    _classCallCheck(this, Score);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Score).call(this, engine, level, "score"));

    _this.textAlign = "right";
    _this.textBaseline = "top";
    _this.x = _this.engine.viewportWidth / 2 - 8 | 0;
    _this.y = -_this.engine.viewportHeight / 2 + 8 | 0;
    _this.opacity = 1;
    _this.oldCoinCount = null;
    _this.changeTick = null;
    return _this;
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
      _get(Object.getPrototypeOf(Score.prototype), "draw", this).call(this, g);
      g.restore();
    }
  }]);

  return Score;
}(_fontSprite2.default);

exports.default = Score;

},{"../../figengine/objects/font-sprite":4}],16:[function(require,module,exports){
"use strict";

var _figshario = require("./figshario/figshario");

var _figshario2 = _interopRequireDefault(_figshario);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var viewport = document.getElementById("viewport");
var figshario = new _figshario2.default(viewport);

figshario.start();
figshario.loadLevel("assets/maps/level1b.json");

var KEY_TRANSLATIONS = {
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
window.addEventListener("keydown", function (evt) {
  var key = void 0;

  key = handleKey(evt);

  if (key) {
    figshario.keyDown(key);
    evt.preventDefault();
  }
});
window.addEventListener("keyup", function (evt) {
  var key = void 0;

  if (evt.keyCode === 121) {
    figshario.stop();
  }
  key = handleKey(evt);

  if (key) {
    figshario.keyUp(key);
    evt.preventDefault();
  }
});

},{"./figshario/figshario":9}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _layer = require("./figengine/layer");

var _layer2 = _interopRequireDefault(_layer);

var _level = require("./figengine/level");

var _level2 = _interopRequireDefault(_level);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TiledLayer = function (_Layer) {
  _inherits(TiledLayer, _Layer);

  function TiledLayer() {
    _classCallCheck(this, TiledLayer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TiledLayer).apply(this, arguments));
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
    value: function loadTiledLayerData(tilesets, layerData) {
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
          var tile = null;
          var tileIndex = layerData.data[y * this.width + x];
          var tileset = this.findTileset(tilesets, tileIndex);

          this.watchTileset(tileset);

          if (tileIndex && tileset) {
            var twidth = tileset.tilewidth;
            var theight = tileset.tileheight;

            var props = tileset.tileproperties[tileIndex - tileset.firstgid];
            var ctype = props ? props.ctype : null;
            var cellsX = tileset.imagewidth / twidth | 0;
            var offset = tileIndex - tileset.firstgid;

            tile = {
              x: x * twidth,
              y: y * theight,
              w: twidth,
              h: theight,
              sx: offset % cellsX * twidth,
              sy: (offset / cellsX | 0) * theight,
              img: tileset.image,
              ctype: ctype
            };
          }

          tiles[y][x] = tile;
        }
      }
      this.tiles = tiles;
      this.buildBackground();
    }
  }]);

  return TiledLayer;
}(_layer2.default);

var TiledLevel = function (_Level) {
  _inherits(TiledLevel, _Level);

  function TiledLevel() {
    _classCallCheck(this, TiledLevel);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TiledLevel).apply(this, arguments));
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
          layer.loadTiledLayerData(tilesets, layerData);
          if (layer.isSolid) {
            this.solidLayer = layer;
          }
          layers.push(layer);
        } else if (layerData.type === "objectgroup") {
          for (var _i = 0, _len = layerData.objects.length; _i < _len; _i += 1) {
            this.createObject(layerData.objects[_i]);
          }
        }
      }
      this.layers = layers;
    }
  }]);

  return TiledLevel;
}(_level2.default);

exports.default = TiledLevel;

},{"./figengine/layer":2,"./figengine/level":3}]},{},[16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZmlnZW5naW5lL2VuZ2luZS5qcyIsInNyYy9maWdlbmdpbmUvbGF5ZXIuanMiLCJzcmMvZmlnZW5naW5lL2xldmVsLmpzIiwic3JjL2ZpZ2VuZ2luZS9vYmplY3RzL2ZvbnQtc3ByaXRlLmpzIiwic3JjL2ZpZ2VuZ2luZS9vYmplY3RzL2Zzb2JqZWN0LmpzIiwic3JjL2ZpZ2VuZ2luZS9vYmplY3RzL3NtYXJ0LWZvbnQtc3ByaXRlLmpzIiwic3JjL2ZpZ2VuZ2luZS9vYmplY3RzL3Nwcml0ZS5qcyIsInNyYy9maWdlbmdpbmUvdXRpbC5qcyIsInNyYy9maWdzaGFyaW8vZmlnc2hhcmlvLmpzIiwic3JjL2ZpZ3NoYXJpby9sZXZlbC5qcyIsInNyYy9maWdzaGFyaW8vb2JqZWN0cy9jb2luLmpzIiwic3JjL2ZpZ3NoYXJpby9vYmplY3RzL2Zsb2F0eS5qcyIsInNyYy9maWdzaGFyaW8vb2JqZWN0cy9tb3Zpbmctc3ByaXRlLmpzIiwic3JjL2ZpZ3NoYXJpby9vYmplY3RzL3BsYXllci5qcyIsInNyYy9maWdzaGFyaW8vb2JqZWN0cy9zY29yZS5qcyIsInNyYy9zdGFydGVyLmpzIiwic3JjL3RpbGVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O0lDRXFCLFM7QUFDbkIscUJBQVksTUFBWixFQUFvQjtBQUFBOztBQUNsQixTQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsU0FBSyxPQUFMLEdBQWUsT0FBTyxVQUFQLENBQWtCLElBQWxCLENBQWY7QUFDQSxTQUFLLGFBQUwsR0FBcUIsR0FBckI7QUFDQSxTQUFLLGNBQUwsR0FBc0IsR0FBdEI7QUFDQSxTQUFLLElBQUwsR0FBWSxDQUFaO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsU0FBSyxPQUFMLEdBQWUsS0FBZjtBQUNBLFNBQUssT0FBTCxHQUFlLENBQWY7QUFDQSxTQUFLLE9BQUws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WSxLQUFaO0FBQ0QsU0FQRCxNQU9PLElBQUksVUFBVSxJQUFWLEtBQW1CLGFBQXZCLEVBQXNDO0FBQzNDLGVBQUssSUFBSSxLQUFJLENBQVIsRUFBVyxPQUFNLFVBQVUsT0FBVixDQUFrQixNQUF4QyxFQUFnRCxLQUFJLElBQXBELEVBQXlELE1BQUssQ0FBOUQsRUFBaUU7QUFDL0QsaUJBQUssWUFBTCxDQUFrQixVQUFVLE9BQVYsQ0FBa0IsRUFBbEIsQ0FBbEI7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxXQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0Q7Ozs7OztrQkE5QmtCLFUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIHdpbmRvdyAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWdlbmdpbmUge1xuICBjb25zdHJ1Y3RvcihjYW52YXMpIHtcbiAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICB0aGlzLmNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIHRoaXMudmlld3BvcnRXaWR0aCA9IDMyMDtcbiAgICB0aGlzLnZpZXdwb3J0SGVpZ2h0ID0gMjAwO1xuICAgIHRoaXMuem9vbSA9IDI7XG4gICAgdGhpcy5tYXNrT3V0RXh0ZW50cyA9IHRydWU7XG4gICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy5jYW1lcmFYID0gMDtcbiAgICB0aGlzLmNhbWVyYVkgPSAwO1xuICAgIHRoaXMuY2FtZXJhRm9sbG93WCA9IDA7XG4gICAgdGhpcy5jYW1lcmFGb2xsb3dZID0gMDtcbiAgICB0aGlzLmNhbWVyYUZvbGxvd1JhdGlvID0gNTtcbiAgICB0aGlzLmtleXMgPSB7XG4gICAgICBsZWZ0OiBmYWxzZSxcbiAgICAgIHVwOiBmYWxzZSxcbiAgICAgIHJpZ2h0OiBmYWxzZSxcbiAgICAgIGRvd246IGZhbHNlLFxuICAgICAgc3RhcnQ6IGZhbHNlLFxuICAgICAgYnV0dG9uQTogZmFsc2UsXG4gICAgICBidXR0b25COiBmYWxzZSxcbiAgICAgIGRlYnVnOiBmYWxzZVxuICAgIH07XG4gICAgdGhpcy5vbGRUaWNrID0gbnVsbDtcbiAgICB0aGlzLmRlYnVnRW5hYmxlZCA9IGZhbHNlO1xuICAgIHRoaXMuZGVidWdUb3BMZWZ0VGV4dCA9IFwiXCI7XG4gICAgdGhpcy5kZWJ1Z1RvcFJpZ2h0VGV4dCA9IFwiXCI7XG4gICAgdGhpcy5kZWJ1Z0JvdHRvbUxlZnRUZXh0ID0gXCJcIjtcbiAgICB0aGlzLmRlYnVnQm90dG9tUmlnaHRUZXh0ID0gXCJcIjtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuc3RhcnRMb29wKCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuc3RvcExvb3AoKTtcbiAgfVxuXG4gIHN0YXJ0TG9vcCgpIHtcbiAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlKDApO1xuICAgIHRoaXMuZHJhdygwKTtcbiAgfVxuXG4gIHN0b3BMb29wKCkge1xuICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICB9XG5cbiAgdXBkYXRlKHRpY2spIHtcbiAgICBsZXQgZGVsdGE7XG5cbiAgICBpZiAodGhpcy5ydW5uaW5nICYmIHRoaXMubGV2ZWwpIHtcbiAgICAgIGlmICh0aGlzLm9sZFRpY2sgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLm9sZFRpY2sgPSB0aWNrO1xuICAgICAgfVxuICAgICAgZGVsdGEgPSAodGljayAtIHRoaXMub2xkVGljaykgLyAxMDAwLjA7XG4gICAgICB0aGlzLm1vdmVDYW1lcmEoZGVsdGEpO1xuICAgICAgdGhpcy5sZXZlbC51cGRhdGUodGljaywgZGVsdGEpO1xuICAgICAgdGhpcy5vbGRUaWNrID0gdGljaztcbiAgICB9XG4gICAgaWYgKHRoaXMucnVubmluZykge1xuICAgICAgdGhpcy56b29tID0gTWF0aC5taW4odGhpcy5jYW52YXMud2lkdGggLyB0aGlzLnZpZXdwb3J0V2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCAvIHRoaXMudmlld3BvcnRIZWlnaHQpIHwgMDtcbiAgICAgIHNldFRpbWVvdXQoKG5ld1RpY2spID0+IHRoaXMudXBkYXRlKG5ld1RpY2spLCAxMCwgRGF0ZS5ub3coKSk7XG4gICAgfVxuICB9XG5cbiAgZHJhdygpIHtcbiAgICBsZXQgZztcblxuICAgIGlmICh0aGlzLnJ1bm5pbmcpIHtcbiAgICAgIGcgPSB0aGlzLmNvbnRleHQ7XG4gICAgICB0aGlzLmRyYXdCYWNrZ3JvdW5kKCk7XG4gICAgICBpZiAodGhpcy5sZXZlbCkge1xuICAgICAgICBnLnNhdmUoKTtcbiAgICAgICAgZy50cmFuc2xhdGUodGhpcy5jYW52YXMud2lkdGggKiAwLjUgfCAwLCB0aGlzLmNhbnZhcy5oZWlnaHQgKiAwLjUgfCAwKTtcbiAgICAgICAgZy5zY2FsZSh0aGlzLnpvb20sIHRoaXMuem9vbSk7XG4gICAgICAgIGlmICh0aGlzLm1hc2tPdXRFeHRlbnRzKSB7XG4gICAgICAgICAgdGhpcy5jbGlwRXh0ZW50cygpO1xuICAgICAgICB9XG4gICAgICAgIGcuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMubGV2ZWwuZHJhdyhnKTtcbiAgICAgICAgZy5yZXN0b3JlKCk7XG4gICAgICAgIHRoaXMuZGVidWdTY3JlZW4oZyk7XG4gICAgICB9XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZHJhdygpKTtcbiAgICB9XG4gIH1cblxuICBjbGlwRXh0ZW50cygpIHtcbiAgICBsZXQgZyA9IHRoaXMuY29udGV4dDtcbiAgICBsZXQgZ3cgPSB0aGlzLnZpZXdwb3J0V2lkdGg7XG4gICAgbGV0IGdoID0gdGhpcy52aWV3cG9ydEhlaWdodDtcblxuICAgIGcuYmVnaW5QYXRoKCk7XG4gICAgZy5yZWN0KC1ndyAqIDAuNSwgLWdoICogMC41LCBndywgZ2gpO1xuICAgIGcuY2xvc2VQYXRoKCk7XG4gICAgZy5jbGlwKCk7XG4gIH1cblxuICBkcmF3QmFja2dyb3VuZCgpIHtcbiAgfVxuXG4gIGRlYnVnU2NyZWVuKGcpIHtcbiAgICBpZiAodGhpcy5kZWJ1Z0VuYWJsZWQpIHtcbiAgICAgIHRoaXMuZGVidWdUb3BMZWZ0VGV4dCA9IGBEZWJ1ZyBTY3JlZW5cXG4ke3RoaXMuZGVidWdUb3BMZWZ0VGV4dH1gO1xuXG4gICAgICBnLnNhdmUoKTtcbiAgICAgIGcuZm9udCA9IFwiYm9sZCAxMnB4IG1vbm9zcGFjZVwiO1xuICAgICAgZy5zaGFkb3dDb2xvciA9IFwiIzAwMDAwMFwiO1xuICAgICAgZy5zaGFkb3dCbHVyID0gMjtcbiAgICAgIGcuZmlsbFN0eWxlID0gXCIjZmZmZmZmXCI7XG5cbiAgICAgIGcudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcbiAgICAgIGcudGV4dEFsaWduID0gXCJsZWZ0XCI7XG4gICAgICBsZXQgbGluZXMgPSB0aGlzLmRlYnVnVG9wTGVmdFRleHQuc3BsaXQoXCJcXG5cIik7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGcuZmlsbFRleHQobGluZXNbaV0sIDAsIDEyICogaSk7XG4gICAgICB9XG5cbiAgICAgIGcudGV4dEFsaWduID0gXCJyaWdodFwiO1xuICAgICAgbGluZXMgPSB0aGlzLmRlYnVnVG9wUmlnaHRUZXh0LnNwbGl0KFwiXFxuXCIpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBnLmZpbGxUZXh0KGxpbmVzW2ldLCB3aW5kb3cuaW5uZXJXaWR0aCAtIDEsIDEyICogaSk7XG4gICAgICB9XG5cbiAgICAgIGcudGV4dEJhc2VsaW5lID0gXCJib3R0b21cIjtcbiAgICAgIGxpbmVzID0gdGhpcy5kZWJ1Z0JvdHRvbVJpZ2h0VGV4dC5zcGxpdChcIlxcblwiKTtcbiAgICAgIGxldCBvZmZzZXQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSAxIC0gbGluZXMubGVuZ3RoICogMTI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGcuZmlsbFRleHQobGluZXNbaV0sIHdpbmRvdy5pbm5lcldpZHRoIC0gMSwgb2Zmc2V0ICsgMTIgKiBpKTtcbiAgICAgIH1cblxuICAgICAgZy50ZXh0QWxpZ24gPSBcImxlZnRcIjtcbiAgICAgIGxpbmVzID0gdGhpcy5kZWJ1Z0JvdHRvbUxlZnRUZXh0LnNwbGl0KFwiXFxuXCIpO1xuICAgICAgb2Zmc2V0ID0gd2luZG93LmlubmVySGVpZ2h0IC0gMSAtIGxpbmVzLmxlbmd0aCAqIDEyO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBnLmZpbGxUZXh0KGxpbmVzW2ldLCAwLCBvZmZzZXQgKyAxMiAqIGkpO1xuICAgICAgfVxuXG4gICAgICBnLnJlc3RvcmUoKTtcblxuICAgICAgdGhpcy5kZWJ1Z1RvcExlZnRUZXh0ID0gXCJcIjtcbiAgICAgIHRoaXMuZGVidWdUb3BSaWdodFRleHQgPSBcIlwiO1xuICAgICAgdGhpcy5kZWJ1Z0JvdHRvbUxlZnRUZXh0ID0gXCJcIjtcbiAgICAgIHRoaXMuZGVidWdCb3R0b21SaWdodFRleHQgPSBcIlwiO1xuICAgIH1cbiAgfVxuXG4gIGFkZERlYnVnTGluZShsaW5lKSB7XG4gICAgdGhpcy5hZGRUb3BMZWZ0RGVidWdMaW5lKGxpbmUpO1xuICB9XG5cbiAgYWRkVG9wTGVmdERlYnVnTGluZShsaW5lKSB7XG4gICAgaWYgKHRoaXMuZGVidWdFbmFibGVkKSB7XG4gICAgICB0aGlzLmRlYnVnVG9wTGVmdFRleHQgKz0gYCR7bGluZX1cXG5gO1xuICAgIH1cbiAgfVxuXG4gIGFkZFRvcFJpZ2h0RGVidWdMaW5lKGxpbmUpIHtcbiAgICBpZiAodGhpcy5kZWJ1Z0VuYWJsZWQpIHtcbiAgICAgIHRoaXMuZGVidWdUb3BSaWdodFRleHQgKz0gYCR7bGluZX1cXG5gO1xuICAgIH1cbiAgfVxuXG4gIGFkZEJvdHRvbUxlZnREZWJ1Z0xpbmUobGluZSkge1xuICAgIGlmICh0aGlzLmRlYnVnRW5hYmxlZCkge1xuICAgICAgdGhpcy5kZWJ1Z0JvdHRvbUxlZnRUZXh0ICs9IGAke2xpbmV9XFxuYDtcbiAgICB9XG4gIH1cblxuICBhZGRCb3R0b21SaWdodERlYnVnTGluZShsaW5lKSB7XG4gICAgaWYgKHRoaXMuZGVidWdFbmFibGVkKSB7XG4gICAgICB0aGlzLmRlYnVnVG9wTGVmdFRleHQgKz0gYCR7bGluZX1cXG5gO1xuICAgIH1cbiAgfVxuXG4gIHJlc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgbGV0IGM7XG5cbiAgICBjID0gdGhpcy5jYW52YXM7XG4gICAgYy53aWR0aCA9IHdpZHRoO1xuICAgIGMuaGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgc2V0Q2FtZXJhKHgsIHksIHJlc2V0ID0gZmFsc2UpIHtcbiAgICAvLyBUT0RPOiBtYWtlIHN1cmUgdGhlIGNhbWVyYSBkb2Vzbid0IG1ha2UgdGhlIHZpZXdwb3J0IG92ZXJmbG93XG4gICAgdGhpcy5jYW1lcmFGb2xsb3dYID0geDtcbiAgICB0aGlzLmNhbWVyYUZvbGxvd1kgPSB5O1xuICAgIGlmIChyZXNldCkge1xuICAgICAgdGhpcy5jYW1lcmFYID0geDtcbiAgICAgIHRoaXMuY2FtZXJhWSA9IHk7XG4gICAgfVxuICB9XG5cbiAga2V5RG93bihrZXkpIHtcbiAgICB0aGlzLmtleXNba2V5XSA9IHRydWU7XG4gIH1cblxuICBrZXlVcChrZXkpIHtcbiAgICB0aGlzLmtleXNba2V5XSA9IGZhbHNlO1xuICAgIGlmIChrZXkgPT09IFwiZGVidWdcIikge1xuICAgICAgdGhpcy5kZWJ1Z0VuYWJsZWQgPSAhdGhpcy5kZWJ1Z0VuYWJsZWQ7XG4gICAgfVxuICB9XG5cbiAgaXNQcmVzc2VkKGtleSkge1xuICAgIHJldHVybiB0aGlzLmtleXNba2V5XTtcbiAgfVxuXG4gIG1vdmVDYW1lcmEoZGVsdGEpIHtcbiAgICBsZXQgZHggPSB0aGlzLmNhbWVyYVggLSB0aGlzLmNhbWVyYUZvbGxvd1g7XG4gICAgbGV0IGR5ID0gdGhpcy5jYW1lcmFZIC0gdGhpcy5jYW1lcmFGb2xsb3dZO1xuXG4gICAgaWYgKE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSkgPiAwLjAwMSkge1xuICAgICAgdGhpcy5jYW1lcmFYID0gdGhpcy5jYW1lcmFYIC0gZHggKiB0aGlzLmNhbWVyYUZvbGxvd1JhdGlvICogZGVsdGE7XG4gICAgICB0aGlzLmNhbWVyYVkgPSB0aGlzLmNhbWVyYVkgLSBkeSAqIHRoaXMuY2FtZXJhRm9sbG93UmF0aW8gKiBkZWx0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jYW1lcmFYID0gdGhpcy5jYW1lcmFGb2xsb3dYO1xuICAgICAgdGhpcy5jYW1lcmFZID0gdGhpcy5jYW1lcmFGb2xsb3dZO1xuICAgIH1cbiAgfVxuXG4gIHBsYXlTb3VuZChzb3VuZCkge1xuICAgIGlmIChzb3VuZC5lbmRlZCB8fCAhc291bmQucGxheWVkQXRMZWFzdE9uY2UpIHtcbiAgICAgIHNvdW5kLnBsYXkoKTtcbiAgICAgIHNvdW5kLnBsYXllZEF0TGVhc3RPbmNlID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc291bmQuY3VycmVudFRpbWUgPSAwO1xuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCkge1xuICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xuICAgIHRoaXMudGlsZXMgPSBbXTtcbiAgICB0aGlzLmJhY2tTY3JlZW4gPSBudWxsO1xuICAgIHRoaXMudGlsZVdpZHRoID0gdGlsZVdpZHRoO1xuICAgIHRoaXMudGlsZUhlaWdodCA9IHRpbGVIZWlnaHQ7XG4gICAgdGhpcy53aWR0aCA9IDA7XG4gICAgdGhpcy5oZWlnaHQgPSAwO1xuICAgIHRoaXMuaXNCYWNrZ3JvdW5kID0gdHJ1ZTtcbiAgICB0aGlzLmlzU29saWQgPSBmYWxzZTtcbiAgICB0aGlzLnRpbGVzZXRzID0gW107XG4gICAgdGhpcy5ldmVyeXRoaW5nTG9hZGVkID0gZmFsc2U7XG4gIH1cblxuICBidWlsZEJhY2tncm91bmQoKSB7XG4gICAgbGV0IGJhY2tTY3JlZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIGJhY2tTY3JlZW4ud2lkdGggPSB0aGlzLnRpbGVXaWR0aCAqIHRoaXMud2lkdGg7XG4gICAgYmFja1NjcmVlbi5oZWlnaHQgPSB0aGlzLnRpbGVIZWlnaHQgKiB0aGlzLmhlaWdodDtcblxuICAgIGxldCBnID0gYmFja1NjcmVlbi5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnRpbGVzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGlsZXNbal0ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgbGV0IHRpbGUgPSB0aGlzLnRpbGVzW2pdW2ldO1xuICAgICAgICBpZiAodGlsZSkge1xuICAgICAgICAgIGcuZHJhd0ltYWdlKHRpbGUuaW1nLCB0aWxlLnN4LCB0aWxlLnN5LCB0aWxlLncsIHRpbGUuaCxcbiAgICAgICAgICAgICAgICAgICAgICBpICogdGhpcy50aWxlV2lkdGgsIGogKiB0aGlzLnRpbGVIZWlnaHQsIHRpbGUudywgdGlsZS5oKTtcbiAgICAgICAgICAvLyBnLnN0cm9rZVN0eWxlID0gXCIjMDAwMDAwXCI7XG4gICAgICAgICAgLy8gZy5zdHJva2VSZWN0KGkgKiB0aGlzLnRpbGVXaWR0aCArIDAuNSwgaiAqIHRoaXMudGlsZUhlaWdodCArIDAuNSwgMTYsIDE2KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYmFja1NjcmVlbiA9IGJhY2tTY3JlZW47XG4gIH1cblxuICBkcmF3KGcpIHtcbiAgICBpZiAoIXRoaXMuZXZlcnl0aGluZ0xvYWRlZCkge1xuICAgICAgbGV0IGRvcmVidWlsZCA9IHRydWU7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGlsZXNldHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRpbGVzZXRzW2ldLmxvYWRlZCkge1xuICAgICAgICAgIGRvcmVidWlsZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZG9yZWJ1aWxkKSB7XG4gICAgICAgIHRoaXMuYnVpbGRCYWNrZ3JvdW5kKCk7XG4gICAgICAgIHRoaXMuZXZlcnl0aGluZ0xvYWRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBlID0gdGhpcy5lbmdpbmU7XG4gICAgbGV0IGd3ID0gZS52aWV3cG9ydFdpZHRoO1xuICAgIGxldCBnaCA9IGUudmlld3BvcnRIZWlnaHQ7XG4gICAgbGV0IG94ID0gZS5jYW1lcmFYIC0gZ3cgKiAwLjUgfCAwO1xuICAgIGxldCBveSA9IGUuY2FtZXJhWSAtIGdoICogMC41IHwgMDtcbiAgICBnLmRyYXdJbWFnZSh0aGlzLmJhY2tTY3JlZW4sIG94LCBveSwgZ3csIGdoLCBveCwgb3ksIGd3LCBnaCk7XG4gIH1cblxuICBnZXRBdCh4LCB5KSB7XG4gICAgbGV0IGN4ID0geCAvIHRoaXMudGlsZVdpZHRoIHwgMDtcbiAgICBsZXQgY3kgPSB5IC8gdGhpcy50aWxlSGVpZ2h0IHwgMDtcblxuICAgIGlmIChjeCA+PSAwICYmIGN5ID49IDAgJiZcbiAgICAgICAgY3kgPCB0aGlzLnRpbGVzLmxlbmd0aCAmJiBjeCA8IHRoaXMudGlsZXNbY3ldLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMudGlsZXNbY3ldW2N4XTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IExvYWRlciwgeyBGb250QnVpbGRlciwgU21hcnRGb250QnVpbGRlciB9IGZyb20gXCIuL3V0aWxcIjtcblxubGV0IF9sb2FkaW5nU3ByaXRlID0gbnVsbDtcblxuZnVuY3Rpb24gX2dldExvYWRpbmdTcHJpdGUoKSB7XG4gIGlmICghX2xvYWRpbmdTcHJpdGUpIHtcbiAgICBsZXQgbHMgPSBuZXcgSW1hZ2UoKTtcbiAgICBscy5zcmMgPSBcImFzc2V0cy9pbWFnZXMvcHJvZ3Jlc3MuZ2lmXCI7XG4gICAgX2xvYWRpbmdTcHJpdGUgPSBscztcbiAgfVxuXG4gIHJldHVybiBfbG9hZGluZ1Nwcml0ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGV2ZWwgZXh0ZW5kcyBMb2FkZXIge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUsIGZpbGVOYW1lKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xuICAgIHRoaXMub2JqZWN0cyA9IFtdO1xuICAgIHRoaXMubGF5ZXJzID0gW107XG4gICAgdGhpcy5zb2xpZExheWVyID0gbnVsbDtcblxuICAgIHRoaXMuYXNzZXRzID0ge307XG4gICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmxvYWRpbmdQcm9ncmVzcyA9IDA7XG4gICAgdGhpcy5sb2FkaW5nQ2FsbGJhY2sgPSBudWxsO1xuICAgIHRoaXMubGV2ZWxGaWxlTmFtZSA9IGZpbGVOYW1lO1xuICB9XG5cbiAgcmVzZXRMZXZlbERhdGEoKSB7XG4gICAgdGhpcy5vYmplY3RzID0gW107XG4gICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgfVxuXG4gIHVwZGF0ZSh0aWNrLCBkZWx0YSkge1xuICAgIGlmICh0aGlzLmlzTG9hZGluZykge1xuICAgICAgdGhpcy51cGRhdGVMb2FkaW5nKHRpY2ssIGRlbHRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cGRhdGVOb3JtYWwodGljaywgZGVsdGEpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUxvYWRpbmcoKSB7XG4gICAgbGV0IGRvbmUgPSAwO1xuICAgIGxldCB0b3RhbCA9IDA7XG4gICAgbGV0IGltYWdlcyA9IHRoaXMuYXNzZXRzLmltYWdlcyB8fCB7fTtcbiAgICBsZXQgZm9udHMgPSB0aGlzLmFzc2V0cy5mb250cyB8fCB7fTtcblxuICAgIE9iamVjdC5rZXlzKGltYWdlcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICB0b3RhbCArPSAxO1xuICAgICAgaWYgKGltYWdlc1trZXldLmxvYWRlZCkge1xuICAgICAgICBkb25lICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBPYmplY3Qua2V5cyhmb250cykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICB0b3RhbCArPSAxO1xuICAgICAgaWYgKGZvbnRzW2tleV0ubG9hZGVkKSB7XG4gICAgICAgIGRvbmUgKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMubG9hZGluZ1Byb2dyZXNzID0gZG9uZSAvIHRvdGFsICogMTAwIHwgMDtcblxuICAgIGlmIChkb25lID09PSB0b3RhbCkge1xuICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLmxvYWRpbmdDYWxsYmFjaykge1xuICAgICAgICB0aGlzLmxvYWRpbmdDYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZU5vcm1hbCh0aWNrLCBkZWx0YSkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLm9iamVjdHMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGxldCBvYmogPSB0aGlzLm9iamVjdHNbaV07XG5cbiAgICAgIGlmIChvYmopIHtcbiAgICAgICAgb2JqLnVwZGF0ZSh0aWNrLCBkZWx0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZHJhdyhnKSB7XG4gICAgaWYgKHRoaXMuaXNMb2FkaW5nKSB7XG4gICAgICB0aGlzLmRyYXdMb2FkaW5nKGcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRyYXdOb3JtYWwoZyk7XG4gICAgfVxuICB9XG5cbiAgZHJhd0xvYWRpbmcoZykge1xuICAgIGxldCBzID0gX2dldExvYWRpbmdTcHJpdGUoKTtcbiAgICBsZXQgdyA9IHRoaXMuZW5naW5lLnZpZXdwb3J0V2lkdGg7XG4gICAgbGV0IGN3ID0gKHcgLSA2NCkgLyA4IHwgMDtcbiAgICBsZXQgcCA9IHRoaXMubG9hZGluZ1Byb2dyZXNzO1xuXG4gICAgbGV0IHN5ID0gMDtcbiAgICBpZiAocCA9PT0gMCkge1xuICAgICAgc3kgPSAxNjtcbiAgICB9XG4gICAgZy5kcmF3SW1hZ2UocywgMCwgc3ksIDgsIDE2LCAtY3cgKiA0LCAtOCwgOCwgMTYpO1xuXG4gICAgc3kgPSAwO1xuICAgIGlmIChwIDwgMTAwKSB7XG4gICAgICBzeSA9IDE2O1xuICAgIH1cbiAgICBnLmRyYXdJbWFnZShzLCAxNiwgc3ksIDgsIDE2LCBjdyAqIDQsIC04LCA4LCAxNik7XG5cbiAgICBmb3IgKGxldCBzdCA9IC0oY3cgLSAyKSAqIDQsIGkgPSBzdCwgZW5kID0gKGN3IC0gMikgKiA0OyBpIDw9IGVuZDsgaSArPSA4KSB7XG4gICAgICBzeSA9IDA7XG4gICAgICBpZiAocCA8IChpIC0gc3QpIC8gKGVuZCAtIHN0KSAqIDEwMCkge1xuICAgICAgICBzeSA9IDE2O1xuICAgICAgfVxuICAgICAgZy5kcmF3SW1hZ2UocywgOCwgc3ksIDgsIDE2LCBpLCAtOCwgOCwgMTYpO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdOb3JtYWwoZykge1xuICAgIGxldCBlID0gdGhpcy5lbmdpbmU7XG4gICAgbGV0IGd3ID0gZS52aWV3cG9ydFdpZHRoO1xuICAgIGxldCBnaCA9IGUudmlld3BvcnRIZWlnaHQ7XG4gICAgbGV0IGN4ID0gZS5jYW1lcmFYIC0gZ3cgKiAwLjUgfCAwO1xuICAgIGxldCBjeSA9IGUuY2FtZXJhWSAtIGdoICogMC41IHwgMDtcblxuICAgIGcuc2F2ZSgpO1xuICAgIGcudHJhbnNsYXRlKC10aGlzLmVuZ2luZS5jYW1lcmFYIHwgMCwgLXRoaXMuZW5naW5lLmNhbWVyYVkgfCAwKTtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5sYXllcnMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGxldCBsYXllciA9IHRoaXMubGF5ZXJzW2ldO1xuICAgICAgaWYgKGxheWVyLmlzQmFja2dyb3VuZCkge1xuICAgICAgICBsYXllci5kcmF3KGcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLm9iamVjdHMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGxldCBvYmogPSB0aGlzLm9iamVjdHNbaV07XG4gICAgICBpZiAob2JqLnggPj0gY3ggLSBvYmoud2lkdGggJiYgb2JqLnkgPj0gY3kgLSBvYmouaGVpZ2h0ICYmXG4gICAgICAgICAgb2JqLnggPCBjeCArIGd3ICYmIG9iai55IDwgY3kgKyBnaCkge1xuICAgICAgICBvYmouZHJhdyhnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5sYXllcnMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGxldCBsYXllciA9IHRoaXMubGF5ZXJzW2ldO1xuICAgICAgaWYgKCFsYXllci5pc0JhY2tncm91bmQpIHtcbiAgICAgICAgbGF5ZXIuZHJhdyhnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZy5yZXN0b3JlKCk7XG4gIH1cblxuICBvbkxvYWRlZChkYXRhKSB7XG4gICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgdGhpcy5yZXNldExldmVsRGF0YSgpO1xuICAgIHRoaXMubG9hZExldmVsRGF0YShkYXRhKTtcbiAgfVxuXG4gIGNyZWF0ZU9iamVjdCgpIHsgIC8qIG9iakRhdGEgKi9cbiAgfVxuXG4gIGxvYWRMZXZlbERhdGEoKSB7ICAvKiBsZXZlbERhdGEgKi9cbiAgfVxuXG4gIGFkZE9iamVjdChvYmopIHtcbiAgICB0aGlzLm9iamVjdHMucHVzaChvYmopO1xuICB9XG5cbiAgcmVtb3ZlT2JqZWN0KG9iaikge1xuICAgIGxldCBpbmRleDtcblxuICAgIGluZGV4ID0gdGhpcy5vYmplY3RzLmluZGV4T2Yob2JqKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB0aGlzLm9iamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICBsb2FkQXNzZXRzKGFDZmcsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMubG9hZGluZ1Byb2dyZXNzID0gMDtcbiAgICB0aGlzLmxvYWRpbmdDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIGlmIChhQ2ZnLmltYWdlcykge1xuICAgICAgdGhpcy5fbG9hZEltYWdlQXNzZXRzKGFDZmcuaW1hZ2VzLCBhQ2ZnLmltYWdlQ2FsbGJhY2spO1xuICAgIH1cbiAgICBpZiAoYUNmZy5mb250cykge1xuICAgICAgdGhpcy5fbG9hZEZvbnRBc3NldHMoYUNmZy5mb250cyk7XG4gICAgfVxuICAgIGlmIChhQ2ZnLnNvdW5kcykge1xuICAgICAgdGhpcy5fbG9hZFNvdW5kQXNzZXRzKGFDZmcuc291bmRzKTtcbiAgICB9XG4gIH1cblxuICBnZXRJbWFnZUFzc2V0KGFzc2V0TmFtZSkge1xuICAgIGxldCBpbWFnZXMgPSB0aGlzLmFzc2V0cy5pbWFnZXM7XG5cbiAgICBpZiAoIWltYWdlcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGltYWdlc1thc3NldE5hbWVdLnJlc291cmNlO1xuICB9XG5cbiAgZ2V0Rm9udEFzc2V0KGFzc2V0TmFtZSkge1xuICAgIGxldCBmb250cyA9IHRoaXMuYXNzZXRzLmZvbnRzO1xuXG4gICAgaWYgKCFmb250cykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvbnRzW2Fzc2V0TmFtZV0ucmVzb3VyY2U7XG4gIH1cblxuICBnZXRTb3VuZEFzc2V0KGFzc2V0TmFtZSkge1xuICAgIGxldCBzb3VuZHMgPSB0aGlzLmFzc2V0cy5zb3VuZHM7XG5cbiAgICBpZiAoIXNvdW5kcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNvdW5kc1thc3NldE5hbWVdLnJlc291cmNlO1xuICB9XG5cbiAgbG9hZEZpbGUoZmlsZU5hbWUpIHtcbiAgICBzdXBlci5sb2FkRmlsZShmaWxlTmFtZSB8fCB0aGlzLmxldmVsRmlsZU5hbWUpO1xuICB9XG5cbiAgX2xvYWRJbWFnZUFzc2V0cyhhc3NldENvbmZpZywgYXNzZXRDYWxsYmFjaykge1xuICAgIGxldCBpbWFnZXMgPSB7fTtcbiAgICBsZXQgY2JoID0gKGtleSwgY2FsbGJhY2spID0+IHtcbiAgICAgIHJldHVybiAoZXZ0KSA9PiB7XG4gICAgICAgIHRoaXMuYXNzZXRzLmltYWdlc1trZXldLmxvYWRlZCA9IHRydWU7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrKGtleSwgZXZ0KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgT2JqZWN0LmtleXMoYXNzZXRDb25maWcpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgbGV0IGZpbGVOYW1lID0gYXNzZXRDb25maWdba2V5XTtcbiAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGltZy5vbmxvYWQgPSBjYmgoa2V5LCBhc3NldENhbGxiYWNrKTtcbiAgICAgIGltZy5zcmMgPSBmaWxlTmFtZTtcbiAgICAgIGltYWdlc1trZXldID0ge1xuICAgICAgICByZXNvdXJjZTogaW1nLFxuICAgICAgICBsb2FkZWQ6IGZhbHNlXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgdGhpcy5hc3NldHMuaW1hZ2VzID0gaW1hZ2VzO1xuICB9XG5cbiAgX2xvYWRGb250QXNzZXRzKGFzc2V0Q29uZmlnKSB7XG4gICAgbGV0IGZvbnRzID0ge307XG5cbiAgICBPYmplY3Qua2V5cyhhc3NldENvbmZpZykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBsZXQgY2ZnID0gYXNzZXRDb25maWdba2V5XTtcbiAgICAgIGxldCBmQ2xzID0gRm9udEJ1aWxkZXI7XG4gICAgICBpZiAoY2ZnLnR5cGUgPT09IFwic21hcnRcIikge1xuICAgICAgICBmQ2xzID0gU21hcnRGb250QnVpbGRlcjtcbiAgICAgIH1cblxuICAgICAgbGV0IGJ1aWxkZXIgPSBuZXcgZkNscyh0aGlzLCBjZmcpO1xuICAgICAgZm9udHNba2V5XSA9IHtcbiAgICAgICAgcmVzb3VyY2U6IGJ1aWxkZXIuYnVpbGQoKSxcbiAgICAgICAgbG9hZGVkOiB0cnVlXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgdGhpcy5hc3NldHMuZm9udHMgPSBmb250cztcbiAgfVxuXG4gIF9sb2FkU291bmRBc3NldHMoYXNzZXRDb25maWcsIGFzc2V0Q2FsbGJhY2spIHtcbiAgICBsZXQgc291bmRzID0ge307XG4gICAgbGV0IGNiaCA9IChrZXksIGNhbGxiYWNrKSA9PiB7XG4gICAgICByZXR1cm4gKGV2dCkgPT4ge1xuICAgICAgICB0aGlzLmFzc2V0cy5zb3VuZHNba2V5XS5sb2FkZWQgPSB0cnVlO1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjayhrZXksIGV2dCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKGFzc2V0Q29uZmlnKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGxldCBmaWxlTmFtZSA9IGFzc2V0Q29uZmlnW2tleV07XG4gICAgICBsZXQgc25kID0gbmV3IEF1ZGlvKCk7XG4gICAgICBzbmQub25sb2FkID0gY2JoKGtleSwgYXNzZXRDYWxsYmFjayk7XG4gICAgICBzbmQuc3JjID0gZmlsZU5hbWU7XG4gICAgICBzb3VuZHNba2V5XSA9IHtcbiAgICAgICAgcmVzb3VyY2U6IHNuZCxcbiAgICAgICAgbG9hZGVkOiBmYWxzZVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHRoaXMuYXNzZXRzLnNvdW5kcyA9IHNvdW5kcztcbiAgfVxufVxuIiwiaW1wb3J0IFNwcml0ZSBmcm9tIFwiLi9zcHJpdGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9udFNwcml0ZSBleHRlbmRzIFNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKGVuZ2luZSwgbGV2ZWwsIGZvbnROYW1lKSB7XG4gICAgc3VwZXIoZW5naW5lLCBsZXZlbCk7XG5cbiAgICB0aGlzLnRleHQgPSBcIlwiO1xuICAgIHRoaXMudGV4dEFsaWduID0gXCJsZWZ0XCI7XG4gICAgdGhpcy50ZXh0QmFzZWxpbmUgPSBcImJvdHRvbVwiO1xuXG4gICAgbGV0IGZjID0gbGV2ZWwuZ2V0Rm9udEFzc2V0KGZvbnROYW1lKTtcbiAgICB0aGlzLmNoYXJXaWR0aCA9IGZjLmNoYXJXaWR0aCB8fCA4O1xuICAgIHRoaXMuY2hhckhlaWdodCA9IGZjLmNoYXJIZWlnaHQgfHwgODtcbiAgICB0aGlzLmNoYXJTcGFjaW5nID0gZmMuY2hhclNwYWNpbmcgfHwgMDtcblxuICAgIHRoaXMuZm9udENvbmZpZyA9IGZjO1xuICB9XG5cbiAgZHJhdyhnKSB7XG4gICAgbGV0IGN3ID0gdGhpcy5jaGFyV2lkdGg7XG4gICAgbGV0IGNoID0gdGhpcy5jaGFySGVpZ2h0O1xuICAgIGxldCBjcyA9IHRoaXMuY2hhclNwYWNpbmcgKyBjdztcblxuICAgIGxldCB5ID0gdGhpcy55IC0gY2g7XG4gICAgaWYgKHRoaXMudGV4dEJhc2VsaW5lID09PSBcIm1pZGRsZVwiKSB7XG4gICAgICB5ICs9IGNoIC8gMjtcbiAgICB9IGVsc2UgaWYgKHRoaXMudGV4dEJhc2VsaW5lID09PSBcInRvcFwiKSB7XG4gICAgICB5ICs9IGNoO1xuICAgIH1cbiAgICB5ID0geSB8IDA7XG5cbiAgICBsZXQgbGVuID0gdGhpcy50ZXh0Lmxlbmd0aDtcbiAgICBsZXQgb3ggPSB0aGlzLng7XG4gICAgaWYgKHRoaXMudGV4dEFsaWduID09PSBcImNlbnRlclwiKSB7XG4gICAgICBveCAtPSBsZW4gKiBjcyAvIDIgfCAwO1xuICAgIH0gZWxzZSBpZiAodGhpcy50ZXh0QWxpZ24gPT09IFwicmlnaHRcIikge1xuICAgICAgb3ggLT0gbGVuICogY3MgfCAwO1xuICAgIH1cblxuICAgIGxldCByYW5nZXMgPSB0aGlzLmZvbnRDb25maWcucmFuZ2VzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGxldCBjID0gdGhpcy50ZXh0W2ldLmNoYXJDb2RlQXQoKTtcblxuICAgICAgZm9yIChsZXQgaiA9IDAsIHJsZW4gPSByYW5nZXMubGVuZ3RoOyBqIDwgcmxlbjsgaiArPSAxKSB7XG4gICAgICAgIGxldCBjZiA9IHJhbmdlc1tqXTtcblxuICAgICAgICBsZXQgeCA9IG94ICsgaSAqIGNzIHwgMDtcblxuICAgICAgICBsZXQgc3ggPSAwO1xuICAgICAgICBsZXQgc3kgPSAwO1xuXG4gICAgICAgIGlmIChjID49IGNmWzBdLmNoYXJDb2RlQXQoKSAmJiBjIDw9IGNmWzFdLmNoYXJDb2RlQXQoKSkge1xuICAgICAgICAgIHN4ID0gKGMgLSBjZlswXS5jaGFyQ29kZUF0KCkpICogY3c7XG4gICAgICAgICAgc3kgPSBqICogY2g7XG4gICAgICAgIH1cblxuICAgICAgICBnLmRyYXdJbWFnZSh0aGlzLmZvbnRDb25maWcuc3ByaXRlU2hlZXQsIHN4LCBzeSwgY3csIGNoLFxuICAgICAgICAgICAgICAgICAgICB4LCB5LCBjdywgY2gpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRlNPYmplY3Qge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUsIGxldmVsKSB7XG4gICAgdGhpcy5lbmdpbmUgPSBlbmdpbmU7XG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgICB0aGlzLnJvdGF0aW9uID0gMDtcbiAgICB0aGlzLndpZHRoID0gMTY7XG4gICAgdGhpcy5oZWlnaHQgPSAxNjtcbiAgICB0aGlzLnNwcml0ZVNoZWV0ID0gbnVsbDtcbiAgICB0aGlzLnNwclggPSAwO1xuICAgIHRoaXMuc3ByWSA9IDA7XG4gIH1cblxuICB1cGRhdGUoKSB7fVxuXG4gIGRyYXcoZykge1xuICAgIGlmICh0aGlzLnNwcml0ZVNoZWV0KSB7XG4gICAgICBsZXQgdyA9IHRoaXMud2lkdGg7XG4gICAgICBsZXQgaCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgZy5zYXZlKCk7XG4gICAgICBnLnRyYW5zbGF0ZSh0aGlzLngsIHRoaXMueSk7XG4gICAgICBnLnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcbiAgICAgIGcuZHJhd0ltYWdlKHRoaXMuc3ByaXRlU2hlZXQsIHRoaXMuc3ByWCwgdGhpcy5zcHJZLCB3LCBoLCAtdyAvIDIsIC1oIC8gMiwgdywgaCk7XG4gICAgICBnLnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBGb250U3ByaXRlIGZyb20gXCIuL2ZvbnQtc3ByaXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNtYXJ0Rm9udFNwcml0ZSBleHRlbmRzIEZvbnRTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUsIGxldmVsLCBmb250TmFtZSkge1xuICAgIHN1cGVyKGVuZ2luZSwgbGV2ZWwsIGZvbnROYW1lKTtcblxuICAgIGxldCBmYyA9IHRoaXMuZm9udENvbmZpZztcblxuICAgIHRoaXMuY2hhclNwYWNpbmcgPSBmYy5jaGFyU3BhY2luZyB8fCAwO1xuICAgIHRoaXMuc3BhY2VXaWR0aCA9IGZjLnNwYWNlV2lkdGggfHwgODtcblxuICAgIHRoaXMuY2hhclJhbmdlcyA9IGZjLnJhbmdlcztcbiAgfVxuXG4gIGRyYXcoZykge1xuICAgIGxldCBjaCA9IHRoaXMuY2hhckhlaWdodDtcbiAgICBsZXQgeCA9IHRoaXMueDtcbiAgICBsZXQgeSA9IHRoaXMueSAtIGNoO1xuXG4gICAgaWYgKHRoaXMudGV4dEJhc2VsaW5lID09PSBcIm1pZGRsZVwiKSB7XG4gICAgICB5ICs9IGNoIC8gMjtcbiAgICB9IGVsc2UgaWYgKHRoaXMudGV4dEJhc2VsaW5lID09PSBcInRvcFwiKSB7XG4gICAgICB5ICs9IGNoO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLnRleHQubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGxldCBjID0gdGhpcy50ZXh0W2ldLmNoYXJDb2RlQXQoKTtcblxuICAgICAgbGV0IHN4ID0gLTE7XG4gICAgICBsZXQgc3kgPSAtMTtcbiAgICAgIGxldCBjdztcblxuICAgICAgT2JqZWN0LmtleXModGhpcy5jaGFyUmFuZ2VzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgbGV0IHMgPSBrZXlbMF0uY2hhckNvZGVBdCgpO1xuICAgICAgICBsZXQgZSA9IGtleVsyXS5jaGFyQ29kZUF0KCk7XG4gICAgICAgIGlmIChjID49IHMgJiYgYyA8PSBlKSB7XG4gICAgICAgICAgbGV0IG8gPSB0aGlzLmNoYXJSYW5nZXNba2V5XVtjIC0gc107XG5cbiAgICAgICAgICBzeCA9IG8ueDtcbiAgICAgICAgICBzeSA9IG8ueTtcbiAgICAgICAgICBjdyA9IG8udztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChzeCA+PSAwICYmIHN5ID49IDApIHtcbiAgICAgICAgZy5kcmF3SW1hZ2UodGhpcy5mb250Q29uZmlnLnNwcml0ZVNoZWV0LCBzeCwgc3ksIGN3LCBjaCwgeCwgeSwgY3csIGNoKTtcbiAgICAgICAgeCArPSBjdyArIHRoaXMuY2hhclNwYWNpbmc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4ICs9IHRoaXMuc3BhY2VXaWR0aCArIHRoaXMuY2hhclNwYWNpbmc7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgRlNPYmplY3QgZnJvbSBcIi4vZnNvYmplY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ByaXRlIGV4dGVuZHMgRlNPYmplY3Qge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUsIGxldmVsKSB7XG4gICAgc3VwZXIoZW5naW5lLCBsZXZlbCk7XG5cbiAgICB0aGlzLmFuaW1hdGlvbnMgPSB7fTtcbiAgICB0aGlzLmN1cnJlbnRBbmltID0gbnVsbDtcbiAgICB0aGlzLmZyYW1lID0gMDtcbiAgICB0aGlzLnNwcml0ZU9sZFRpY2sgPSBudWxsO1xuICAgIHRoaXMuc3ByaXRlU2hlZXQgPSBudWxsO1xuICB9XG5cbiAgY3JlYXRlQW5pbWF0aW9uKG5hbWUsIHgsIHksIGxlbmd0aCwgZGVsYXksIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5hbmltYXRpb25zW25hbWVdID0ge3gsIHksIGxlbmd0aCwgZGVsYXksIGNhbGxiYWNrfTtcbiAgfVxuXG4gIHNldEFuaW1hdGlvbihuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09IHRoaXMuY3VycmVudEFuaW0pIHtcbiAgICAgIHRoaXMuY3VycmVudEFuaW0gPSBuYW1lO1xuICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgICB0aGlzLnNwcml0ZU9sZFRpY2sgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSh0aWNrLCBkZWx0YSkge1xuICAgIGlmICh0aGlzLnNwcml0ZU9sZFRpY2sgPT0gbnVsbCkge1xuICAgICAgdGhpcy5zcHJpdGVPbGRUaWNrID0gdGljaztcbiAgICB9XG4gICAgc3VwZXIudXBkYXRlKHRpY2ssIGRlbHRhKTtcbiAgICBsZXQgYW5pbSA9IHRoaXMuYW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltXTtcbiAgICBpZiAoYW5pbSkge1xuICAgICAgbGV0IG90aWNrID0gdGhpcy5zcHJpdGVPbGRUaWNrO1xuICAgICAgaWYgKG90aWNrIDwgdGljayAtIGFuaW0uZGVsYXkpIHtcbiAgICAgICAgdGhpcy5mcmFtZSArPSAxO1xuICAgICAgICB0aGlzLnJlc2V0RnJhbWUoYW5pbSk7XG4gICAgICAgIHRoaXMuc3ByaXRlT2xkVGljayA9IHRpY2s7XG4gICAgICB9XG4gICAgICB0aGlzLnNwclggPSBhbmltLnggKyB0aGlzLmZyYW1lICogdGhpcy53aWR0aDtcbiAgICAgIHRoaXMuc3ByWSA9IGFuaW0ueTtcbiAgICB9XG4gIH1cblxuICByZXNldEZyYW1lKGFuaW0pIHtcbiAgICBpZiAodGhpcy5mcmFtZSA+PSBhbmltLmxlbmd0aCkge1xuICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgICBpZiAoYW5pbS5jYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIGFuaW0uY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGFuaW0uY2FsbGJhY2soKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbihhbmltLmNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxvYWRTcHJpdGVTaGVldChpbWFnZU5hbWUpIHtcbiAgICB0aGlzLnNwcml0ZVNoZWV0ID0gdGhpcy5sZXZlbC5nZXRJbWFnZUFzc2V0KGltYWdlTmFtZSk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRlciB7XG4gIGxvYWRGaWxlKGZpbGVOYW1lKSB7XG4gICAgbGV0IHhocjtcblxuICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoZXZ0KSA9PiB0aGlzLm9ueGhyKGV2dCk7XG4gICAgeGhyLm9wZW4oXCJHRVRcIiwgZmlsZU5hbWUpO1xuICAgIHhoci5zZW5kKCk7XG4gIH1cblxuICBvbnhocihldnQpIHtcbiAgICBsZXQgeGhyO1xuXG4gICAgeGhyID0gZXZ0LnRhcmdldDtcbiAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyA8IDQwMCkge1xuICAgICAgdGhpcy5vbkxvYWRlZCh4aHIucmVzcG9uc2UpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRm9udEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcihsZXZlbCwgY29uZmlnKSB7XG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICB9XG5cbiAgYnVpbGQoKSB7XG4gICAgbGV0IGNmZyA9IHRoaXMuY29uZmlnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNoYXJTcGFjaW5nOiBjZmcuY2hhclNwYWNpbmcsXG4gICAgICBjaGFyV2lkdGg6IGNmZy5jaGFyV2lkdGgsXG4gICAgICBjaGFySGVpZ2h0OiBjZmcuY2hhckhlaWdodCxcbiAgICAgIHNwcml0ZVNoZWV0OiB0aGlzLmxldmVsLmdldEltYWdlQXNzZXQodGhpcy5jb25maWcuaW1hZ2UpLFxuICAgICAgcmFuZ2VzOiB0aGlzLmNvbmZpZy5yYW5nZXNcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTbWFydEZvbnRCdWlsZGVyIGV4dGVuZHMgRm9udEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcihsZXZlbCwgY29uZmlnKSB7XG4gICAgc3VwZXIobGV2ZWwsIGNvbmZpZyk7XG4gIH1cblxuICBidWlsZCgpIHtcbiAgICBsZXQgY2ZnID0gdGhpcy5jb25maWc7XG4gICAgbGV0IHNoZWV0ID0gdGhpcy5sZXZlbC5nZXRJbWFnZUFzc2V0KGNmZy5pbWFnZSk7XG4gICAgbGV0IHNoZWV0SW1hZ2VEYXRhID0gdGhpcy5nZXRJbWFnZURhdGEoc2hlZXQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNoYXJTcGFjaW5nOiBjZmcuY2hhclNwYWNpbmcsXG4gICAgICBjaGFySGVpZ2h0OiBjZmcuY2hhckhlaWdodCxcbiAgICAgIHNwYWNlV2lkdGg6IGNmZy5zcGFjZVdpZHRoLFxuICAgICAgc3ByaXRlU2hlZXQ6IHNoZWV0LFxuICAgICAgc3ByaXRlU2hlZXRJbWFnZURhdGE6IHNoZWV0SW1hZ2VEYXRhLFxuICAgICAgcmFuZ2VzOiB0aGlzLmV4dHJhY3RGb250UmFuZ2VzKGNmZywgc2hlZXRJbWFnZURhdGEpXG4gICAgfTtcbiAgfVxuXG4gIGdldEltYWdlRGF0YShzaGVldCkge1xuICAgIGxldCBjdnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIGxldCBjdHggPSBjdnMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgY3ZzLndpZHRoID0gc2hlZXQud2lkdGg7XG4gICAgY3ZzLmhlaWdodCA9IHNoZWV0LmhlaWdodDtcblxuICAgIGN0eC5kcmF3SW1hZ2Uoc2hlZXQsIDAsIDApO1xuXG4gICAgcmV0dXJuIGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgc2hlZXQud2lkdGgsIHNoZWV0LmhlaWdodCk7XG4gIH1cblxuICBleHRyYWN0Rm9udFJhbmdlcyhjZmcsIHNoZWV0SW1hZ2VEYXRhKSB7XG4gICAgbGV0IGNoYXJzID0ge307XG5cbiAgICB0aGlzLnNwYWNlV2lkdGggPSBjZmcuc3BhY2VXaWR0aCB8fCB0aGlzLnNwYWNlV2lkdGg7XG4gICAgdGhpcy5jaGFySGVpZ2h0ID0gY2ZnLmNoYXJIZWlnaHQgfHwgdGhpcy5jaGFySGVpZ2h0O1xuICAgIHRoaXMuY2hhclNwYWNpbmcgPSBjZmcuY2hhclNwYWNpbmcgfHwgdGhpcy5jaGFyU3BhY2luZztcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjZmcucmFuZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBsZXQgcmFuZ2UgPSBjZmcucmFuZ2VzW2ldO1xuXG4gICAgICBjaGFyc1tyYW5nZV0gPSB0aGlzLmV4dHJhY3RGb250UmFuZ2Uoc2hlZXRJbWFnZURhdGEsIHJhbmdlLCBpLCBsZW4pO1xuICAgIH1cblxuICAgIHJldHVybiBjaGFycztcbiAgfVxuXG4gIGV4dHJhY3RGb250UmFuZ2UoaWQsIHJhbmdlLCBpbmRleCkge1xuICAgIGxldCBjcmFuZ2UgPSBbXTtcbiAgICBsZXQgY2ggPSB0aGlzLmNoYXJIZWlnaHQ7XG5cbiAgICBsZXQgeCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IHJhbmdlWzBdLmNoYXJDb2RlQXQoKTsgaSA8PSByYW5nZVsxXS5jaGFyQ29kZUF0KCk7IGkgKz0gMSkge1xuICAgICAgbGV0IGMgPSB7XG4gICAgICAgIGM6IFN0cmluZy5mcm9tQ2hhckNvZGUoaSksXG4gICAgICAgIHgsXG4gICAgICAgIHk6IGluZGV4ICogY2hcbiAgICAgIH07XG4gICAgICBsZXQgZW1wdHkgPSBmYWxzZTtcbiAgICAgIHdoaWxlICghZW1wdHkpIHtcbiAgICAgICAgZW1wdHkgPSB0aGlzLmlzTGluZUVtcHR5KGlkLCB4LCBpbmRleCAqIGNoKTtcbiAgICAgICAgeCArPSAxO1xuICAgICAgfVxuICAgICAgYy53ID0geCAtIDEgLSBjLng7XG4gICAgICB3aGlsZSAoZW1wdHkpIHtcbiAgICAgICAgZW1wdHkgPSB0aGlzLmlzTGluZUVtcHR5KGlkLCB4LCBpbmRleCAqIGNoKTtcbiAgICAgICAgeCArPSAxO1xuICAgICAgfVxuICAgICAgeCAtPSAxO1xuICAgICAgY3JhbmdlLnB1c2goYyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyYW5nZTtcbiAgfVxuXG4gIGlzTGluZUVtcHR5KGlkLCB4LCB5KSB7XG4gICAgbGV0IGVtcHR5ID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY2hhckhlaWdodDsgaiArPSAxKSB7XG4gICAgICBpZiAoIXRoaXMuaXNFbXB0eUF0KGlkLCB4LCB5ICsgaikpIHtcbiAgICAgICAgZW1wdHkgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZW1wdHk7XG4gIH1cblxuICBpc0VtcHR5QXQoaWQsIHgsIHkpIHtcbiAgICByZXR1cm4gaWQuZGF0YVsoeSAqIGlkLndpZHRoICsgeCkgKiA0ICsgM10gPT09IDA7XG4gIH1cbn1cbiIsImltcG9ydCBGaWdlbmdpbmUgZnJvbSBcIi4uL2ZpZ2VuZ2luZS9lbmdpbmVcIjtcbmltcG9ydCBGaWdzaGFyaW9MZXZlbCBmcm9tIFwiLi9sZXZlbFwiO1xuXG5sZXQgS09OQU1JX0NPREUgPSBbXCJ1cFwiLCBcInVwXCIsIFwiZG93blwiLCBcImRvd25cIiwgXCJsZWZ0XCIsIFwicmlnaHRcIiwgXCJsZWZ0XCIsIFwicmlnaHRcIiwgXCJidXR0b25CXCIsIFwiYnV0dG9uQVwiLCBcInN0YXJ0XCJdO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWdzaGFyaW8gZXh0ZW5kcyBGaWdlbmdpbmUge1xuICBjb25zdHJ1Y3RvcihjYW52YXMpIHtcbiAgICBzdXBlcihjYW52YXMpO1xuXG4gICAgdGhpcy5rZXlMb2cgPSBbXTtcbiAgfVxuXG4gIGxvYWRMZXZlbChmaWxlTmFtZSkge1xuICAgIHRoaXMubGV2ZWwgPSBuZXcgRmlnc2hhcmlvTGV2ZWwodGhpcywgZmlsZU5hbWUpO1xuICB9XG5cbiAgZHJhd09TRChnKSB7XG4gICAgaWYgKHRoaXMuc2NvcmUpIHtcbiAgICAgIHRoaXMuc2NvcmUuZHJhdyhnKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUodGljaykge1xuICAgIHN1cGVyLnVwZGF0ZSh0aWNrKTtcblxuICAgIGlmICh0aGlzLnNjb3JlKSB7XG4gICAgICB0aGlzLnNjb3JlLnVwZGF0ZSh0aWNrKTtcbiAgICB9XG4gIH1cblxuICBkcmF3QmFja2dyb3VuZCgpIHtcbiAgICBsZXQgYyA9IHRoaXMuY2FudmFzO1xuICAgIGxldCBnID0gdGhpcy5jb250ZXh0O1xuXG4gICAgbGV0IGdkID0gZy5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCBjLmhlaWdodCk7XG4gICAgZ2QuYWRkQ29sb3JTdG9wKDAuMDAsIFwiIzg4ODg5OVwiKTtcbiAgICBnZC5hZGRDb2xvclN0b3AoMC43NSwgXCIjYWFjY2ZmXCIpO1xuICAgIGdkLmFkZENvbG9yU3RvcCgxLjAwLCBcIiM5OTk5YmJcIik7XG5cbiAgICBnLmZpbGxTdHlsZSA9IGdkO1xuICAgIGcuZmlsbFJlY3QoMCwgMCwgYy53aWR0aCwgYy5oZWlnaHQpO1xuICB9XG5cbiAga2V5VXAoa2V5KSB7XG4gICAgc3VwZXIua2V5VXAoa2V5KTtcblxuICAgIGlmICghdGhpcy5sZXZlbC5wbGF5ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmtleUxvZy5wdXNoKGtleSk7XG5cbiAgICBpZiAodGhpcy5rZXlMb2cubGVuZ3RoIDwgMTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmtleUxvZyA9IHRoaXMua2V5TG9nLnNwbGljZSgtMTEsIDExKTtcblxuICAgIGxldCBvayA9IHRydWU7XG4gICAgZm9yIChsZXQgaSA9IDA7IG9rICYmIGkgPCAxMTsgaSArPSAxKSB7XG4gICAgICBpZiAodGhpcy5rZXlMb2dbaV0gIT09IEtPTkFNSV9DT0RFW2ldKSB7XG4gICAgICAgIG9rID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9rKSB7XG4gICAgICB0aGlzLmxldmVsLnBsYXllci5mbHlNb2RlID0gIXRoaXMubGV2ZWwucGxheWVyLmZseU1vZGU7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQ29pbiwgeyBTdGF0aWNDb2luIH0gZnJvbSBcIi4vb2JqZWN0cy9jb2luXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL29iamVjdHMvcGxheWVyXCI7XG5pbXBvcnQgU2NvcmUgZnJvbSBcIi4vb2JqZWN0cy9zY29yZVwiO1xuaW1wb3J0IFRpbGVkTGV2ZWwgZnJvbSBcIi4uL3RpbGVkXCI7XG5cbmxldCBPQkpfQ0xBU1NfTUFQUElORyA9IHtcbiAgXCJmaWdwbGF5ZXJcIjogUGxheWVyLFxuICBcImNvaW5cIjogQ29pbixcbiAgXCJzY29pblwiOiBTdGF0aWNDb2luXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWdzaGFyaW9MZXZlbCBleHRlbmRzIFRpbGVkTGV2ZWwge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUsIGZpbGVOYW1lKSB7XG4gICAgc3VwZXIoZW5naW5lLCBmaWxlTmFtZSk7XG5cbiAgICB0aGlzLmxhc3RDb2xsZWN0aWJsZVRpY2sgPSBudWxsO1xuICAgIHRoaXMuY29sbGVjdGlibGVEZWxheSA9IDA7XG4gICAgdGhpcy5wbGF5ZXIgPSBudWxsO1xuXG4gICAgdGhpcy5sb2FkQXNzZXRzKHtcbiAgICAgIGltYWdlczoge1xuICAgICAgICBmaWdwbGF5ZXI6IFwiYXNzZXRzL2ltYWdlcy9maWdwbGF5ZXIuZ2lmXCIsXG4gICAgICAgIFwidGlsZXMtZ3Jhc3N5XCI6IFwiYXNzZXRzL2ltYWdlcy90aWxlcy1ncmFzc3kuZ2lmXCIsXG4gICAgICAgIGNvaW46IFwiYXNzZXRzL2ltYWdlcy9jb2luLmdpZlwiLFxuICAgICAgICBzbWFsbEZvbnQ6IFwiYXNzZXRzL2ltYWdlcy9zbWFsbC5naWZcIixcbiAgICAgICAgc2NvcmVGb250OiBcImFzc2V0cy9pbWFnZXMvc2NvcmUuZ2lmXCJcbiAgICAgIH0sXG4gICAgICBzb3VuZHM6IHtcbiAgICAgICAgXCJjb2luLWNoaW5nXCI6IFwiYXNzZXRzL3NvdW5kcy9jb2luLndhdlwiLFxuICAgICAgICBcImJvaW5nXCI6IFwiYXNzZXRzL3NvdW5kcy9ib2luZy53YXZcIlxuICAgICAgfVxuICAgIH0sICgpID0+IHtcbiAgICAgIHRoaXMubG9hZEFzc2V0cyh7XG4gICAgICAgIGZvbnRzOiB7XG4gICAgICAgICAgZmxvYXR5OiB7XG4gICAgICAgICAgICB0eXBlOiBcInNtYXJ0XCIsXG4gICAgICAgICAgICBpbWFnZTogXCJzbWFsbEZvbnRcIixcbiAgICAgICAgICAgIHNwYWNlV2lkdGg6IDQsXG4gICAgICAgICAgICBjaGFySGVpZ2h0OiAxMCxcbiAgICAgICAgICAgIGNoYXJTcGFjaW5nOiAxLFxuICAgICAgICAgICAgcmFuZ2VzOiBbXG4gICAgICAgICAgICAgIFtcIiFcIiwgXCIhXCJdLFxuICAgICAgICAgICAgICBbXCIwXCIsIFwiOVwiXSxcbiAgICAgICAgICAgICAgW1wiQVwiLCBcIk9cIl0sXG4gICAgICAgICAgICAgIFtcIlBcIiwgXCJaXCJdLFxuICAgICAgICAgICAgICBbXCJhXCIsIFwib1wiXSxcbiAgICAgICAgICAgICAgW1wicFwiLCBcInpcIl1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNjb3JlOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm5vcm1hbFwiLFxuICAgICAgICAgICAgaW1hZ2U6IFwic2NvcmVGb250XCIsXG4gICAgICAgICAgICBjaGFyV2lkdGg6IDE2LFxuICAgICAgICAgICAgY2hhckhlaWdodDogMjQsXG4gICAgICAgICAgICBjaGFyU3BhY2luZzogMSxcbiAgICAgICAgICAgIHJhbmdlczogW1xuICAgICAgICAgICAgICBbXCIwXCIsIFwiOVwiXVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmxvYWRGaWxlKCk7XG4gICAgICAgIHRoaXMuc2NvcmUgPSBuZXcgU2NvcmUodGhpcy5lbmdpbmUsIHRoaXMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGUodGljaywgZGVsdGEpIHtcbiAgICBzdXBlci51cGRhdGUodGljaywgZGVsdGEpO1xuXG4gICAgaWYgKHRoaXMubGFzdENvbGxlY3RpYmxlVGljayA9PSBudWxsIHx8IHRpY2sgLSB0aGlzLmxhc3RDb2xsZWN0aWJsZVRpY2sgPj0gdGhpcy5jb2xsZWN0aWJsZURlbGF5KSB7XG4gICAgICB0aGlzLmdlbmVyYXRlQ29sbGVjdGlibGUoKTtcbiAgICAgIHRoaXMubGFzdENvbGxlY3RpYmxlVGljayA9IHRpY2s7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGxheWVyKSB7XG4gICAgICB0aGlzLmVuZ2luZS5hZGREZWJ1Z0xpbmUoXCJQbGF5ZXI6XCIpO1xuICAgICAgdGhpcy5lbmdpbmUuYWRkRGVidWdMaW5lKGAgIC5wb3NpdGlvbjogJHt0aGlzLnBsYXllci54fcOXJHt0aGlzLnBsYXllci55fWApO1xuICAgICAgbGV0IGh2ID0gdGhpcy5wbGF5ZXIuaG9yaXpWZWwudG9GaXhlZCg0KTtcbiAgICAgIGxldCB2diA9IHRoaXMucGxheWVyLnZlcnRWZWwudG9GaXhlZCg0KTtcbiAgICAgIHRoaXMuZW5naW5lLmFkZERlYnVnTGluZShgICAudmVsb2NpdHk6ICR7aHZ9w5cke3Z2fWApO1xuICAgIH1cbiAgICB0aGlzLmVuZ2luZS5hZGREZWJ1Z0xpbmUoYE9iamVjdHM6ICR7dGhpcy5vYmplY3RzLmxlbmd0aH1gKTtcblxuICAgIGlmICh0aGlzLnNjb3JlKSB7XG4gICAgICB0aGlzLnNjb3JlLnVwZGF0ZSh0aWNrLCBkZWx0YSk7XG4gICAgfVxuICB9XG5cbiAgZHJhdyhnKSB7XG4gICAgc3VwZXIuZHJhdyhnKTtcblxuICAgIGlmICh0aGlzLnNjb3JlKSB7XG4gICAgICB0aGlzLnNjb3JlLmRyYXcoZyk7XG4gICAgfVxuICB9XG5cbiAgZ2VuZXJhdGVDb2xsZWN0aWJsZSgpIHtcbiAgICBsZXQgcyA9IHRoaXMuc29saWRMYXllcjtcbiAgICBpZiAoIXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdyA9IHMud2lkdGggKiBzLnRpbGVXaWR0aDtcbiAgICBsZXQgaCA9IHMuaGVpZ2h0ICogcy50aWxlSGVpZ2h0O1xuICAgIGxldCB4ID0gTWF0aC5yYW5kb20oKSAqIHc7XG4gICAgbGV0IHkgPSBNYXRoLnJhbmRvbSgpICogaDtcbiAgICBsZXQgdGlsZSA9IHMuZ2V0QXQoeCwgeSk7XG5cbiAgICBpZiAoIXRpbGUgfHwgdGlsZS5jdHlwZSA9PT0gXCJlbXB0eVwiKSB7XG4gICAgICBsZXQgYyA9IG5ldyBDb2luKHRoaXMuZW5naW5lLCB0aGlzKTtcbiAgICAgIGMueCA9IHggKyBzLnRpbGVXaWR0aCAvIDI7XG4gICAgICBjLnkgPSB5ICsgcy50aWxlSGVpZ2h0IC8gMjtcblxuICAgICAgdGhpcy5vYmplY3RzLnB1c2goYyk7XG4gICAgfVxuICAgIHRoaXMuY29sbGVjdGlibGVEZWxheSA9IE1hdGgucmFuZG9tKCkgKiA1MDAgKyA1MDAgfCAwO1xuICB9XG5cbiAgY3JlYXRlT2JqZWN0KG9iakRhdGEpIHtcbiAgICBsZXQgb0NscyA9IE9CSl9DTEFTU19NQVBQSU5HW29iakRhdGEubmFtZV07XG5cbiAgICBpZiAob0Nscykge1xuICAgICAgbGV0IG9iaiA9IG5ldyBvQ2xzKHRoaXMuZW5naW5lLCB0aGlzKTtcbiAgICAgIG9iai54ID0gb2JqRGF0YS54ICsgb2JqRGF0YS53aWR0aCAvIDIgfCAwO1xuICAgICAgb2JqLnkgPSBvYmpEYXRhLnkgLSBvYmpEYXRhLmhlaWdodCAvIDIgfCAwO1xuXG4gICAgICBpZiAob2JqRGF0YS5uYW1lID09PSBcImZpZ3BsYXllclwiKSB7XG4gICAgICAgIHRoaXMuZW5naW5lLnNldENhbWVyYShvYmoueCwgb2JqLnksIHRydWUpO1xuICAgICAgICB0aGlzLnBsYXllciA9IG9iajtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vYmplY3RzLnB1c2gob2JqKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTcHJpdGUgZnJvbSBcIi4uLy4uL2ZpZ2VuZ2luZS9vYmplY3RzL3Nwcml0ZVwiO1xuaW1wb3J0IE1vdmluZ1Nwcml0ZSBmcm9tIFwiLi4vLi4vZmlnc2hhcmlvL29iamVjdHMvbW92aW5nLXNwcml0ZVwiO1xuaW1wb3J0IEZsb2F0eSBmcm9tIFwiLi9mbG9hdHlcIjtcblxubGV0IFdPUkRTID0gYEdvb2QhLCBOaWNlISwgQXdlc29tZSEsIE1hcnZlbG91cyEsIFN1cGVyYiEsIEZhbnRhc3RpYyEsIE9LISwgQnJhdm8hLCBCaW5nbyEsIEthIENoaW5nISwgR3JhbmQhLCBBd29vb2dhISxcbiAgICBIYWhhISwgWWFiYmEgRGFiYmEgRG9vISwgU2Nvb2J5IERvb2J5IERvbyEsIFN1cGVyQ2FsaUZyYWdpbGlzdGljRXhwYWxpZG9jaW91cyEsIFdPVyEsIEdyb292eSEsIEV1cmVrYSEsIEh1cnJheSEsXG4gICAgWWFob28hLCBZZXMhLCBZZWFoISwgQWhhISwgQWJyYWNhZGFicmEhLCBBbGxlbHVpYSEsIEFsb2hhISwgQWxscmlnaHQhLCBBbWVuISwgQXJpZ2h0ISwgWWVhYWFhaCEsIEF5ZSEsXG4gICAgQmEgRGEgQmluZyBCYSBEYSBCb29tISwgQmEgRHVtIFRzcyEsIEJBTkchLCBCYXppbmdhISwgQmxlc3MgWW91ISwgQmxpbWV5ISwgQm9vIFlhISwgQnJhdmlzc2ltbyEsIEJyaW5nIEl0IE9uISxcbiAgICBCdWxscyBFeWUhLCBDaGVja21hdGUhLCBDaGVlcnMhLCBDb25ncmF0cyEsIENvbmdyYXR1bGF0aW9ucyEsIERlcnAhLCBEaWRkbHkgRG9vISwgQm9pbmchLCBEb2luZyEsIEVybWFnZXJkISxcbiAgICBGZWxpY2l0YXRpb25zISwgRmlyZSBpbiB0aGUgSG9sZSEsIEZvIFJlYWwhLCBGbyBTaG8hLCBHZXJvbmltbyEsIEdvbGx5ISwgR29sbHkgR2VlISwgR29vIEdvbyBHYSBHYSEsIEdvbyBHb28hLFxuICAgIEdyYXR6ISwgR3JlYXQhLCBIYWxsZWx1aWFoISwgSGVsbCBZZWFoISwgSGV5YSEsIEhvY3VzIFBvY3VzISwgSG9vcmFoISwgS2EgQm9vbSEsIEthIFBvdyEsIE1lb3chLCBOeWFuLU55YW4hLFxuICAgIE5pY2UgT25lISwgT2ggWWVhaCEsIE9oIE15ISwgT01HISwgT01GRyEsIFJPVEYhLCBST1RGTE9MISwgTE1BTyEsIExNRkFPISwgT29tcGEgTG9vbXBhISwgUGVhY2UhLCBQT1chLCBSb2NrIE9uISxcbiAgICBUaGUgY2FrZSBpcyBhIGxpZSEsIFVVRERMUkxSQkEhLCBPb2ggTGEgTGEhLCBUYSBEYWghLCBWaXZhISwgVm9pbGEhLCBXYXkgdG8gR28hLCBXZWxsIERvbmUhLCBXYXp6dXAhLCBXb28gSG9vISxcbiAgICBXb290ISwgVzAwVCEsIFhPWE8hLCBZb3UgS25vdyBJdCEsIFlvb3BlZSEsIFl1bW15ISwgWk9NRyEsIFpvd2llISwgWlpaISwgWFlaWlkhXG5gLnRyaW0oKS5zcGxpdCgvXFxzKixcXHMqLyk7XG5cbmZ1bmN0aW9uIG1ha2VDb2luTGlrZShvYmopIHtcbiAgb2JqLndpZHRoID0gODtcbiAgb2JqLmhlaWdodCA9IDg7XG4gIG9iai5sb2FkU3ByaXRlU2hlZXQoXCJjb2luXCIpO1xuICBvYmouY3JlYXRlQW5pbWF0aW9uKFwiY3JlYXRlXCIsIDAsIDgsIDgsIDEwMCwgXCJkZWZhdWx0XCIpO1xuICBvYmouY3JlYXRlQW5pbWF0aW9uKFwiZGVmYXVsdFwiLCAwLCAwLCA0LCAxMDApO1xuICBvYmouY3JlYXRlQW5pbWF0aW9uKFwiZGVzdHJveVwiLCAzMiwgMCwgNCwgMTAwKTtcbiAgb2JqLnNldEFuaW1hdGlvbihcImNyZWF0ZVwiKTtcblxuICBvYmouaGl0Ym94ID0ge1xuICAgIGxlZnQ6IC0yLFxuICAgIHVwOiAtMixcbiAgICByaWdodDogMixcbiAgICBkb3duOiAyXG4gIH07XG5cbiAgb2JqLmlzQ29sbGVjdGlibGUgPSB0cnVlO1xuICBvYmouZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBmbG9hdHkgPSBuZXcgRmxvYXR5KHRoaXMuZW5naW5lLCB0aGlzLmxldmVsKTtcbiAgICBmbG9hdHkueCA9IHRoaXMueDtcbiAgICBmbG9hdHkueSA9IHRoaXMueTtcbiAgICBmbG9hdHkudGV4dCA9IFdPUkRTW01hdGgucmFuZG9tKCkgKiBXT1JEUy5sZW5ndGggfCAwXTtcblxuICAgIGxldCBzb3VuZCA9IHRoaXMubGV2ZWwuZ2V0U291bmRBc3NldChcImNvaW4tY2hpbmdcIik7XG4gICAgdGhpcy5lbmdpbmUucGxheVNvdW5kKHNvdW5kKTtcblxuICAgIHRoaXMubGV2ZWwuYWRkT2JqZWN0KGZsb2F0eSk7XG4gICAgdGhpcy5sZXZlbC5yZW1vdmVPYmplY3QodGhpcyk7XG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBTdGF0aWNDb2luIGV4dGVuZHMgU3ByaXRlIHtcbiAgY29uc3RydWN0b3IoZW5naW5lLCBsZXZlbCkge1xuICAgIHN1cGVyKGVuZ2luZSwgbGV2ZWwpO1xuXG4gICAgbWFrZUNvaW5MaWtlKHRoaXMpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvaW4gZXh0ZW5kcyBNb3ZpbmdTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUsIGxldmVsKSB7XG4gICAgc3VwZXIoZW5naW5lLCBsZXZlbCk7XG5cbiAgICBtYWtlQ29pbkxpa2UodGhpcyk7XG4gIH1cbn1cbiIsImltcG9ydCBTbWFydEZvbnRTcHJpdGUgZnJvbSBcIi4uLy4uL2ZpZ2VuZ2luZS9vYmplY3RzL3NtYXJ0LWZvbnQtc3ByaXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb2F0eSBleHRlbmRzIFNtYXJ0Rm9udFNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKGVuZ2luZSwgbGV2ZWwpIHtcbiAgICBzdXBlcihlbmdpbmUsIGxldmVsLCBcImZsb2F0eVwiKTtcblxuICAgIHRoaXMudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcbiAgICB0aGlzLnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG5cbiAgICB0aGlzLmNsaW1iZWQgPSAwO1xuICAgIHRoaXMuYmxpbmtpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmRyYXdNZSA9IHRydWU7XG4gIH1cblxuICB1cGRhdGUodGljaywgZGVsdGEpIHtcbiAgICBsZXQgY2xpbWIgPSBkZWx0YSAqIDI1O1xuICAgIHRoaXMuY2xpbWJlZCArPSBjbGltYjtcbiAgICB0aGlzLnkgLT0gY2xpbWI7XG5cbiAgICBpZiAodGhpcy5jbGltYmVkID4gMzIpIHtcbiAgICAgIHRoaXMuYmxpbmtpbmcgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5jbGltYmVkID49IDQ4KSB7XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICBkcmF3KGcpIHtcbiAgICBpZiAodGhpcy5ibGlua2luZykge1xuICAgICAgdGhpcy5kcmF3TWUgPSAhdGhpcy5kcmF3TWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZHJhd01lKSB7XG4gICAgICBzdXBlci5kcmF3KGcpO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5sZXZlbC5yZW1vdmVPYmplY3QodGhpcyk7XG4gIH1cbn1cbiIsImltcG9ydCBTcHJpdGUgZnJvbSBcIi4uLy4uL2ZpZ2VuZ2luZS9vYmplY3RzL3Nwcml0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3ZpbmdTcHJpdGUgZXh0ZW5kcyBTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUsIGxldmVsKSB7XG4gICAgc3VwZXIoZW5naW5lLCBsZXZlbCk7XG5cbiAgICB0aGlzLmFpcmJvcm5lID0gZmFsc2U7XG4gICAgdGhpcy5zb2xpZEJvdW5jZUZhY3RvciA9IDA7XG4gICAgdGhpcy5ob3JpelZlbCA9IDA7XG4gICAgdGhpcy52ZXJ0VmVsID0gMDtcbiAgICB0aGlzLmZyaWN0aW9uID0gMC45O1xuICAgIHRoaXMuaGl0Ym94ID0gbnVsbDtcbiAgICB0aGlzLmZhbGxTcGVlZCA9IDE1O1xuICB9XG5cbiAgdXBkYXRlKHRpY2ssIGRlbHRhKSB7XG4gICAgc3VwZXIudXBkYXRlKHRpY2ssIGRlbHRhKTtcblxuICAgIHRoaXMuaGFuZGxlTW92ZW1lbnQoZGVsdGEpO1xuICAgIHRoaXMuY2hlY2tDb2xsaXNpb25zKGRlbHRhKTtcbiAgfVxuXG4gIGhhbmRsZU1vdmVtZW50KGRlbHRhKSB7XG4gICAgaWYgKCF0aGlzLmxldmVsLnNvbGlkTGF5ZXIgfHwgIXRoaXMuaGl0Ym94KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy54ICs9IHRoaXMuaG9yaXpWZWwgfCAwO1xuICAgIHRoaXMueSArPSB0aGlzLnZlcnRWZWwgfCAwO1xuXG4gICAgdGhpcy5ob3JpelZlbCAqPSB0aGlzLmZyaWN0aW9uO1xuICAgIGlmIChNYXRoLmFicyh0aGlzLmhvcml6VmVsKSA8IDAuMSkge1xuICAgICAgdGhpcy5ob3JpelZlbCA9IDA7XG4gICAgfVxuICAgIGlmICghdGhpcy5haXJib3JuZSkge1xuICAgICAgaWYgKCF0aGlzLmdldFNvbGlkQXQodGhpcy54LCB0aGlzLnkgKyB0aGlzLmhpdGJveC5kb3duKSkge1xuICAgICAgICB0aGlzLmFpcmJvcm5lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYWlyYm9ybmUpIHtcbiAgICAgIHRoaXMudmVydFZlbCA9IE1hdGgubWluKHRoaXMubGV2ZWwuc29saWRMYXllci50aWxlSGVpZ2h0LCB0aGlzLnZlcnRWZWwgKyB0aGlzLmZhbGxTcGVlZCAqIGRlbHRhKTtcbiAgICB9XG4gIH1cblxuICBjaGVja0NvbGxpc2lvbnMoKSB7XG4gICAgaWYgKCF0aGlzLmxldmVsLnNvbGlkTGF5ZXIgfHwgIXRoaXMuaGl0Ym94KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVW5kZXIgY2VpbGluZ1xuICAgIGxldCB0aWxlID0gdGhpcy5nZXRTb2xpZEF0KHRoaXMueCwgdGhpcy55ICsgdGhpcy5oaXRib3gudXAgKyAxKTtcbiAgICBpZiAodGlsZSAmJiB0aGlzLnZlcnRWZWwgPCAwKSB7XG4gICAgICB0aGlzLnZlcnRWZWwgPSAwO1xuICAgICAgdGhpcy5wb3NpdGlvblVuZGVyU29saWQodGlsZSk7XG4gICAgfVxuXG4gICAgLy8gT24gZ3JvdW5kXG4gICAgdGlsZSA9IHRoaXMuZ2V0U29saWRBdCh0aGlzLngsIHRoaXMueSArIHRoaXMuaGl0Ym94LmRvd24gLSAxKTtcbiAgICBpZiAodGhpcy5haXJib3JuZSAmJiB0aWxlKSB7XG4gICAgICB0aGlzLmFpcmJvcm5lID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy52ZXJ0VmVsID49IDApIHtcbiAgICAgICAgdGhpcy52ZXJ0VmVsID0gMDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbGUpIHtcbiAgICAgIHRoaXMucG9zaXRpb25PblNvbGlkKHRpbGUpO1xuICAgIH1cblxuICAgIC8vIExlZnQgd2FsbFxuICAgIHRpbGUgPSB0aGlzLmdldFNvbGlkQXQodGhpcy54ICsgdGhpcy5oaXRib3gubGVmdCArIDEsIHRoaXMueSk7XG4gICAgaWYgKHRpbGUgJiYgdGlsZS5jdHlwZSA9PT0gXCJzb2xpZFwiKSB7XG4gICAgICB0aGlzLnggPSB0aWxlLnggKyB0aWxlLncgKyB0aGlzLmhpdGJveC5yaWdodDtcbiAgICB9XG5cbiAgICAvLyBSaWdodCB3YWxsXG4gICAgdGlsZSA9IHRoaXMuZ2V0U29saWRBdCh0aGlzLnggKyB0aGlzLmhpdGJveC5yaWdodCAtIDEsIHRoaXMueSk7XG4gICAgaWYgKHRpbGUpIHtcbiAgICAgIHRoaXMueCA9IHRpbGUueCArIHRoaXMuaGl0Ym94LmxlZnQ7XG4gICAgfVxuXG4gICAgLy8gSW5zaWRlIHdhbGxcbiAgICBpZiAodGhpcy5nZXRTb2xpZEF0KHRoaXMueCwgdGhpcy55KSkge1xuICAgICAgdGhpcy5ob3JpelZlbCA9IDA7XG4gICAgICB0aGlzLnZlcnRWZWwgPSAwO1xuICAgIH1cbiAgfVxuXG4gIHBvc2l0aW9uT25Tb2xpZCh0aWxlKSB7XG4gICAgbGV0IGxheWVyID0gdGhpcy5sZXZlbC5zb2xpZExheWVyO1xuICAgIGxldCBkID0gdGhpcy5oaXRib3guZG93bjtcblxuICAgIGlmICghdGlsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB4ID0gdGhpcy54IC0gdGlsZS54IHwgMDtcbiAgICBsZXQgdyA9IGxheWVyLnRpbGVXaWR0aDtcbiAgICBsZXQgYyA9IHRpbGUuY3R5cGU7XG4gICAgaWYgKGMgPT09IFwic29saWRcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55IC0gZCB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlUlVcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55ICsgeCAtIGQgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZUxVXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArIHcgLSB4IC0gZCB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlUlJVMVwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyAodyArIHgpIC8gMiAtIGQgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZVJSVTJcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55ICsgeCAvIDIgLSBkIHwgMDtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFwic2xvcGVSVVUxXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArIHggKiAyIC0gZCB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlUlVVMlwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyB4ICogMiAtIHcgLSBkIHwgMDtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFwic2xvcGVMTFUxXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArIHcgLSB4IC8gMiAtIGQgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZUxMVTJcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55ICsgKHcgLSB4KSAvIDIgLSBkIHwgMDtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFwic2xvcGVMVVUxXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArICh3IC0geCkgKiAyIC0gZCB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlTFVVMlwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyB3IC0geCAqIDIgLSBkIHwgMDtcbiAgICB9XG4gICAgdGhpcy5haXJib3JuZSA9IGZhbHNlO1xuICB9XG5cbiAgcG9zaXRpb25VbmRlclNvbGlkKHRpbGUpIHtcbiAgICBsZXQgbGF5ZXIgPSB0aGlzLmxldmVsLnNvbGlkTGF5ZXI7XG4gICAgbGV0IHUgPSBsYXllci50aWxlSGVpZ2h0IC0gdGhpcy5oaXRib3gudXA7XG5cbiAgICBpZiAoIXRpbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgeCA9IHRoaXMueCAtIHRpbGUueCB8IDA7XG4gICAgbGV0IHcgPSBsYXllci50aWxlV2lkdGg7XG4gICAgbGV0IGMgPSB0aWxlLmN0eXBlO1xuICAgIGlmIChjID09PSBcInNvbGlkXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArIHUgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZUxEXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArIHggKyB1IHwgMDtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFwic2xvcGVSRFwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyB3IC0geCArIHUgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZUxMRDFcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55ICsgKHcgKyB4KSAvIDIgKyB1IHwgMDtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFwic2xvcGVMTEQyXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArIHggLyAyICsgdSB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlTEREMVwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyB4ICogMiArIHUgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZUxERDJcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55ICsgeCAqIDIgLSB3ICsgdSB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlUlJEMVwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyB3IC0geCAvIDIgKyB1IHwgMDtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFwic2xvcGVSUkQyXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArICh3IC0geCkgLyAyICsgdSB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlUkREMVwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyAodyAtIHgpICogMiArIHUgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZVJERDJcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55ICsgdyAtIHggKiAyICsgdSB8IDA7XG4gICAgfVxuICAgIHRoaXMuYWlyYm9ybmUgPSBmYWxzZTtcbiAgfVxuXG4gIGdldFNvbGlkQXQocG9pbnRYLCBwb2ludFkpIHtcbiAgICBsZXQgdGlsZSA9IHRoaXMubGV2ZWwuc29saWRMYXllci5nZXRBdChwb2ludFgsIHBvaW50WSk7XG5cbiAgICBpZiAodGlsZSkge1xuICAgICAgbGV0IGMgPSB0aWxlLmN0eXBlO1xuICAgICAgbGV0IHggPSBwb2ludFggLSB0aWxlLnggfCAwO1xuICAgICAgbGV0IHkgPSBwb2ludFkgLSB0aWxlLnkgfCAwO1xuICAgICAgbGV0IHcgPSB0aGlzLmxldmVsLnNvbGlkTGF5ZXIudGlsZVdpZHRoO1xuXG4gICAgICBsZXQgY29uZGl0aW9ucyA9IFtjID09PSBcInNvbGlkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjID09PSBcInNsb3BlUlVcIiAmJiB5ID49IHgsXG4gICAgICAgICAgICAgICAgICAgICAgICBjID09PSBcInNsb3BlTFVcIiAmJiB5ID49IHcgLSB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9PT0gXCJzbG9wZVJSVTFcIiAmJiB5ID49ICh4ICsgdykgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9PT0gXCJzbG9wZVJSVTJcIiAmJiB5ID49IHggLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9PT0gXCJzbG9wZVJVVTFcIiAmJiB5ID49IHggKiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9PT0gXCJzbG9wZVJVVTJcIiAmJiB5ID49IHggKiAyIC0gdyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPT09IFwic2xvcGVMTFUxXCIgJiYgeSA+PSB3IC0geCAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjID09PSBcInNsb3BlTExVMlwiICYmIHkgPj0gKHcgLSB4KSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjID09PSBcInNsb3BlTFVVMVwiICYmIHkgPj0gKHcgLSB4KSAqIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjID09PSBcInNsb3BlTFVVMlwiICYmIHkgPj0gdyAtIHggKiAyXTtcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNvbmRpdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGNvbmRpdGlvbnNbaV0pIHtcbiAgICAgICAgICByZXR1cm4gdGlsZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IE1vdmluZ1Nwcml0ZSBmcm9tIFwiLi9tb3Zpbmctc3ByaXRlXCI7XG5cbmxldCBDT0xMRUNUSU9OX1BST1hJTUlUWSA9IDE2O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBNb3ZpbmdTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUsIGxldmVsKSB7XG4gICAgc3VwZXIoZW5naW5lLCBsZXZlbCk7XG5cbiAgICB0aGlzLndpZHRoID0gMzI7XG4gICAgdGhpcy5oZWlnaHQgPSA0MDtcbiAgICB0aGlzLmhpdGJveCA9IHtcbiAgICAgIGxlZnQ6IC00LFxuICAgICAgdXA6IC0xMixcbiAgICAgIHJpZ2h0OiA0LFxuICAgICAgZG93bjogMTJcbiAgICB9O1xuXG4gICAgdGhpcy5sb2FkU3ByaXRlU2hlZXQoXCJmaWdwbGF5ZXJcIik7XG4gICAgdGhpcy5jcmVhdGVBbmltYXRpb24oXCJsb29rUmlnaHRcIiwgMCwgMCwgMiwgMjUwKTtcbiAgICB0aGlzLmNyZWF0ZUFuaW1hdGlvbihcImxvb2tMZWZ0XCIsIDAsIDQwLCAyLCAyNTApO1xuICAgIHRoaXMuY3JlYXRlQW5pbWF0aW9uKFwid2Fsa1JpZ2h0XCIsIDY0LCAwLCA0LCAxMDApO1xuICAgIHRoaXMuY3JlYXRlQW5pbWF0aW9uKFwid2Fsa0xlZnRcIiwgNjQsIDQwLCA0LCAxMDApO1xuICAgIHRoaXMuc2V0QW5pbWF0aW9uKFwibG9va1JpZ2h0XCIpO1xuXG4gICAgdGhpcy5kaXJlY3Rpb24gPSBcInJpZ2h0XCI7XG4gICAgdGhpcy5haXJib3JuZSA9IGZhbHNlO1xuICAgIHRoaXMuZGlyZWN0aW9uUHJlc3NlZCA9IGZhbHNlO1xuICAgIHRoaXMuanVtcFN0aWxsUHJlc3NlZCA9IGZhbHNlO1xuICAgIHRoaXMuaG9yaXpWZWwgPSAwO1xuICAgIHRoaXMudmVydFZlbCA9IDA7XG4gICAgdGhpcy5mbHlNb2RlID0gZmFsc2U7XG4gICAgdGhpcy5jb2luQ291bnQgPSAwO1xuICAgIHRoaXMuanVtcFNvdW5kID0gdGhpcy5sZXZlbC5nZXRTb3VuZEFzc2V0KFwiYm9pbmdcIik7XG5cbiAgICB0aGlzLnRvQ29sbGVjdCA9IFtdO1xuICB9XG5cbiAgdXBkYXRlKHRpY2ssIGRlbHRhKSB7XG4gICAgc3VwZXIudXBkYXRlKHRpY2ssIGRlbHRhKTtcblxuICAgIGlmICh0aGlzLmZseU1vZGUpIHtcbiAgICAgIHRoaXMuaGFuZGxlRmx5TW9kZUtleXMoZGVsdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhbmRsZUtleXMoZGVsdGEpO1xuICAgIH1cbiAgICB0aGlzLmNob29zZUFuaW1hdGlvbigpO1xuICAgIHRoaXMuaGFuZGxlQ29sbGVjdGluZygpO1xuXG4gICAgdGhpcy51cGRhdGVDYW1lcmEoKTtcbiAgfVxuXG4gIGNoZWNrQ29sbGlzaW9ucyhkZWx0YSkge1xuICAgIGlmICghdGhpcy5mbHlNb2RlKSB7XG4gICAgICBzdXBlci5jaGVja0NvbGxpc2lvbnMoZGVsdGEpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxldmVsLm9iamVjdHMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGxldCBvYmogPSB0aGlzLmxldmVsLm9iamVjdHNbaV07XG5cbiAgICAgIGlmIChvYmouaXNDb2xsZWN0aWJsZSAmJiB0aGlzLmNsb3NlVG8ob2JqLCBDT0xMRUNUSU9OX1BST1hJTUlUWSkgfHwgb2JqLnkgPiAxMDAwMCkge1xuICAgICAgICB0aGlzLmNvbGxlY3Qob2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVGbHlNb2RlS2V5cyhkZWx0YSkge1xuICAgIHRoaXMuZGlyZWN0aW9uUHJlc3NlZCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmVuZ2luZS5pc1ByZXNzZWQoXCJyaWdodFwiKSkge1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSBcInJpZ2h0XCI7XG4gICAgICB0aGlzLmRpcmVjdGlvblByZXNzZWQgPSB0cnVlO1xuICAgICAgdGhpcy5ob3JpelZlbCArPSA4MCAqIGRlbHRhO1xuICAgICAgdGhpcy5ob3JpelZlbCA9IE1hdGgubWluKE1hdGgubWF4KHRoaXMuaG9yaXpWZWwsIDEpLCA4KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZW5naW5lLmlzUHJlc3NlZChcImxlZnRcIikpIHtcbiAgICAgIHRoaXMuZGlyZWN0aW9uID0gXCJsZWZ0XCI7XG4gICAgICB0aGlzLmRpcmVjdGlvblByZXNzZWQgPSB0cnVlO1xuICAgICAgdGhpcy5ob3JpelZlbCAtPSA4MCAqIGRlbHRhO1xuICAgICAgdGhpcy5ob3JpelZlbCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuaG9yaXpWZWwsIC0xKSwgLTgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5lbmdpbmUuaXNQcmVzc2VkKFwidXBcIikpIHtcbiAgICAgIHRoaXMuZGlyZWN0aW9uUHJlc3NlZCA9IHRydWU7XG4gICAgICB0aGlzLnZlcnRWZWwgLT0gODAgKiBkZWx0YTtcbiAgICAgIHRoaXMudmVydFZlbCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMudmVydFZlbCwgLTEpLCAtOCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmVuZ2luZS5pc1ByZXNzZWQoXCJkb3duXCIpKSB7XG4gICAgICB0aGlzLmRpcmVjdGlvblByZXNzZWQgPSB0cnVlO1xuICAgICAgdGhpcy52ZXJ0VmVsICs9IDgwICogZGVsdGE7XG4gICAgICB0aGlzLnZlcnRWZWwgPSBNYXRoLm1pbihNYXRoLm1heCh0aGlzLnZlcnRWZWwsIDEpLCA4KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVNb3ZlbWVudChkZWx0YSkge1xuICAgIGlmICh0aGlzLmZseU1vZGUpIHtcbiAgICAgIHRoaXMueCArPSB0aGlzLmhvcml6VmVsIHwgMDtcbiAgICAgIHRoaXMueSArPSB0aGlzLnZlcnRWZWwgfCAwO1xuICAgICAgaWYgKE1hdGguYWJzKHRoaXMuaG9yaXpWZWwpIDwgMC4xKSB7XG4gICAgICAgIHRoaXMuaG9yaXpWZWwgPSAwO1xuICAgICAgfVxuICAgICAgaWYgKE1hdGguYWJzKHRoaXMudmVydFZlbCkgPCAwLjEpIHtcbiAgICAgICAgdGhpcy52ZXJ0VmVsID0gMDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3VwZXIuaGFuZGxlTW92ZW1lbnQoZGVsdGEpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleXMoZGVsdGEpIHtcbiAgICB0aGlzLmRpcmVjdGlvblByZXNzZWQgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5lbmdpbmUuaXNQcmVzc2VkKFwicmlnaHRcIikpIHtcbiAgICAgIHRoaXMuZGlyZWN0aW9uID0gXCJyaWdodFwiO1xuICAgICAgdGhpcy5kaXJlY3Rpb25QcmVzc2VkID0gdHJ1ZTtcblxuICAgICAgdGhpcy5ob3JpelZlbCArPSAyMCAqIGRlbHRhO1xuICAgICAgdGhpcy5ob3JpelZlbCA9IE1hdGgubWluKHRoaXMuaG9yaXpWZWwsIDgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lbmdpbmUuaXNQcmVzc2VkKFwibGVmdFwiKSkge1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSBcImxlZnRcIjtcbiAgICAgIHRoaXMuZGlyZWN0aW9uUHJlc3NlZCA9IHRydWU7XG5cbiAgICAgIHRoaXMuaG9yaXpWZWwgLT0gMjAgKiBkZWx0YTtcbiAgICAgIHRoaXMuaG9yaXpWZWwgPSBNYXRoLm1heCh0aGlzLmhvcml6VmVsLCAtOCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZW5naW5lLmlzUHJlc3NlZChcImJ1dHRvbkFcIikgJiYgIXRoaXMuanVtcFN0aWxsUHJlc3NlZCAmJiAhdGhpcy5haXJib3JuZSkge1xuICAgICAgdGhpcy52ZXJ0VmVsID0gLTUuNTtcbiAgICAgIHRoaXMuYWlyYm9ybmUgPSB0cnVlO1xuICAgICAgdGhpcy5qdW1wU3RpbGxQcmVzc2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuZW5naW5lLnBsYXlTb3VuZCh0aGlzLmp1bXBTb3VuZCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmVuZ2luZS5pc1ByZXNzZWQoXCJidXR0b25BXCIpKSB7XG4gICAgICB0aGlzLmp1bXBTdGlsbFByZXNzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjaG9vc2VBbmltYXRpb24oKSB7XG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uUHJlc3NlZCkge1xuICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oXCJ3YWxrUmlnaHRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldEFuaW1hdGlvbihcIndhbGtMZWZ0XCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFwicmlnaHRcIikge1xuICAgICAgICB0aGlzLnNldEFuaW1hdGlvbihcImxvb2tSaWdodFwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKFwibG9va0xlZnRcIik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvc2VUbyhpdGVtLCBkaXN0YW5jZSkge1xuICAgIGlmIChpdGVtID09PSB0aGlzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgZHggPSBpdGVtLnggLSB0aGlzLng7XG4gICAgbGV0IGR5ID0gaXRlbS55IC0gdGhpcy55O1xuXG4gICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSkgPD0gZGlzdGFuY2U7XG4gIH1cblxuICBjb2xsZWN0KGl0ZW0pIHtcbiAgICBpdGVtLmlzQ29sbGVjdGlibGUgPSBmYWxzZTtcbiAgICB0aGlzLnRvQ29sbGVjdC5wdXNoKGl0ZW0pO1xuICAgIGl0ZW0udmVydFZlbCA9IDA7XG4gICAgaXRlbS5zZXRBbmltYXRpb24oXCJkZXN0cm95XCIpO1xuICAgIHRoaXMuY29pbkNvdW50ICs9IDE7XG4gIH1cblxuICBpc09uQW55U29saWQodGlsZSkge1xuICAgIHJldHVybiB0aWxlICYmICh0aWxlLmN0eXBlID09PSBcInNvbGlkXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc09uU2xhbnRSaWdodCh0aWxlKSB8fFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzT25TbGFudExlZnQodGlsZSkpO1xuICB9XG5cbiAgaXNPblNsYW50UmlnaHQodGlsZSkge1xuICAgIGlmICh0aWxlLmN0eXBlID09PSBcInNsb3BlUlVcIikge1xuICAgICAgbGV0IHggPSB0aGlzLnggKyAxNiAtIHRpbGUueCB8IDA7XG4gICAgICBsZXQgeSA9IHRoaXMueSArIDMyIC0gdGlsZS55IHwgMDtcblxuICAgICAgaWYgKHkgPj0geCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc09uU2xhbnRMZWZ0KHRpbGUpIHtcbiAgICBpZiAodGlsZS5jdHlwZSA9PT0gXCJzbG9wZUxVXCIpIHtcbiAgICAgIGxldCB4ID0gdGhpcy54ICsgMTYgLSB0aWxlLnggfCAwO1xuICAgICAgbGV0IHkgPSB0aGlzLnkgKyAzMiAtIHRpbGUueSB8IDA7XG5cbiAgICAgIGlmICh5ID49IDE1IC0geCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBoYW5kbGVDb2xsZWN0aW5nKCkge1xuICAgIGxldCByYXRpbyA9IDAuMjtcbiAgICBsZXQgdG9SZW1vdmUgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b0NvbGxlY3QubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGxldCBvYmogPSB0aGlzLnRvQ29sbGVjdFtpXTtcblxuICAgICAgb2JqLnggLT0gKG9iai54IC0gdGhpcy54KSAqIHJhdGlvO1xuICAgICAgb2JqLnkgLT0gKG9iai55IC0gdGhpcy55KSAqIHJhdGlvO1xuXG4gICAgICBpZiAodGhpcy5jbG9zZVRvKG9iaiwgOCkpIHtcbiAgICAgICAgb2JqLmRlc3Ryb3koKTtcbiAgICAgICAgdG9SZW1vdmUucHVzaChvYmopO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9SZW1vdmUubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIHRoaXMudG9Db2xsZWN0LnNwbGljZSh0aGlzLnRvQ29sbGVjdC5pbmRleE9mKHRvUmVtb3ZlW2ldKSwgMSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ2FtZXJhKCkge1xuICAgIGxldCBvZmZzZXQ7XG5cbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFwicmlnaHRcIikge1xuICAgICAgb2Zmc2V0ID0gNDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9mZnNldCA9IC00MDtcbiAgICB9XG5cbiAgICB0aGlzLmVuZ2luZS5zZXRDYW1lcmEodGhpcy54ICsgdGhpcy53aWR0aCAvIDIgKyBvZmZzZXQsIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMik7XG4gIH1cblxuICBkcmF3KGcpIHtcbiAgICBzdXBlci5kcmF3KGcpO1xuICAgIGlmICh0aGlzLmVuZ2luZS5kZWJ1Z0VuYWJsZWQpIHtcbiAgICAgIHRoaXMuZW5naW5lLmFkZFRvcFJpZ2h0RGVidWdMaW5lKGBBaXJib3JuZTogJHt0aGlzLmFpcmJvcm5lfWApO1xuICAgICAgZy5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCA2NCwgMTkyLCAwLjMzKVwiO1xuICAgICAgZy5maWxsUmVjdCh0aGlzLnggKyB0aGlzLmhpdGJveC5sZWZ0LCB0aGlzLnkgKyB0aGlzLmhpdGJveC51cCxcbiAgICAgICAgICAgICAgICAgdGhpcy5oaXRib3gucmlnaHQgLSB0aGlzLmhpdGJveC5sZWZ0LCB0aGlzLmhpdGJveC5kb3duIC0gdGhpcy5oaXRib3gudXApO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IEZvbnRTcHJpdGUgZnJvbSBcIi4uLy4uL2ZpZ2VuZ2luZS9vYmplY3RzL2ZvbnQtc3ByaXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JlIGV4dGVuZHMgRm9udFNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKGVuZ2luZSwgbGV2ZWwpIHtcbiAgICBzdXBlcihlbmdpbmUsIGxldmVsLCBcInNjb3JlXCIpO1xuXG4gICAgdGhpcy50ZXh0QWxpZ24gPSBcInJpZ2h0XCI7XG4gICAgdGhpcy50ZXh0QmFzZWxpbmUgPSBcInRvcFwiO1xuICAgIHRoaXMueCA9IHRoaXMuZW5naW5lLnZpZXdwb3J0V2lkdGggLyAyIC0gOCB8IDA7XG4gICAgdGhpcy55ID0gLXRoaXMuZW5naW5lLnZpZXdwb3J0SGVpZ2h0IC8gMiArIDggfCAwO1xuICAgIHRoaXMub3BhY2l0eSA9IDE7XG4gICAgdGhpcy5vbGRDb2luQ291bnQgPSBudWxsO1xuICAgIHRoaXMuY2hhbmdlVGljayA9IG51bGw7XG4gIH1cblxuICB1cGRhdGUodGljaykge1xuICAgIGlmICghdGhpcy5lbmdpbmUubGV2ZWwgfHwgIXRoaXMuZW5naW5lLmxldmVsLnBsYXllcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjb2luQ291bnQgPSB0aGlzLmxldmVsLnBsYXllci5jb2luQ291bnQ7XG4gICAgaWYgKGNvaW5Db3VudCAhPSB0aGlzLm9sZENvaW5Db3VudCB8fCB0aGlzLmNoYW5nZVRpY2sgPT0gbnVsbCkge1xuICAgICAgdGhpcy50ZXh0ID0gYCR7Y29pbkNvdW50ICogMTAwfWA7XG4gICAgICB0aGlzLmNoYW5nZVRpY2sgPSB0aWNrO1xuICAgICAgdGhpcy5vcGFjaXR5ID0gMTtcbiAgICAgIHRoaXMub2xkQ29pbkNvdW50ID0gY29pbkNvdW50O1xuICAgIH1cblxuICAgIGlmICh0aWNrID49IHRoaXMuY2hhbmdlVGljayArIDMwMDApIHtcbiAgICAgIGlmICh0aGlzLm9wYWNpdHkgPiAwLjUpIHtcbiAgICAgICAgdGhpcy5vcGFjaXR5IC09IDAuMDE7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZHJhdyhnKSB7XG4gICAgZy5zYXZlKCk7XG4gICAgZy5nbG9iYWxBbHBoYSA9IHRoaXMub3BhY2l0eTtcbiAgICBzdXBlci5kcmF3KGcpO1xuICAgIGcucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgRmlnc2hhcmlvIGZyb20gXCIuL2ZpZ3NoYXJpby9maWdzaGFyaW9cIjtcblxubGV0IHZpZXdwb3J0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWV3cG9ydFwiKTtcbmxldCBmaWdzaGFyaW8gPSBuZXcgRmlnc2hhcmlvKHZpZXdwb3J0KTtcblxuZmlnc2hhcmlvLnN0YXJ0KCk7XG5maWdzaGFyaW8ubG9hZExldmVsKFwiYXNzZXRzL21hcHMvbGV2ZWwxYi5qc29uXCIpO1xuXG5sZXQgS0VZX1RSQU5TTEFUSU9OUyA9IHtcbiAgMzc6IFwibGVmdFwiLFxuICAzODogXCJ1cFwiLFxuICAzOTogXCJyaWdodFwiLFxuICA0MDogXCJkb3duXCIsXG4gIDEzOiBcInN0YXJ0XCIsXG4gIDE3OiBcImJ1dHRvbkJcIixcbiAgMzI6IFwiYnV0dG9uQVwiLFxuICAxMTQ6IFwiZGVidWdcIlxufTtcblxuZnVuY3Rpb24gaGFuZGxlS2V5KGV2dCkge1xuICByZXR1cm4gS0VZX1RSQU5TTEFUSU9OU1tldnQua2V5Q29kZV07XG59XG5cbmZ1bmN0aW9uIHJlc2l6ZSgpIHtcbiAgZmlnc2hhcmlvLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxucmVzaXplKCk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCByZXNpemUpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldnQpID0+IHtcbiAgbGV0IGtleTtcblxuICBrZXkgPSBoYW5kbGVLZXkoZXZ0KTtcblxuICBpZiAoa2V5KSB7XG4gICAgZmlnc2hhcmlvLmtleURvd24oa2V5KTtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxufSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChldnQpID0+IHtcbiAgbGV0IGtleTtcblxuICBpZiAoZXZ0LmtleUNvZGUgPT09IDEyMSkge1xuICAgIGZpZ3NoYXJpby5zdG9wKCk7XG4gIH1cbiAga2V5ID0gaGFuZGxlS2V5KGV2dCk7XG5cbiAgaWYgKGtleSkge1xuICAgIGZpZ3NoYXJpby5rZXlVcChrZXkpO1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG59KTtcbiIsImltcG9ydCBMYXllciBmcm9tIFwiLi9maWdlbmdpbmUvbGF5ZXJcIjtcbmltcG9ydCBMZXZlbCBmcm9tIFwiLi9maWdlbmdpbmUvbGV2ZWxcIjtcblxuY2xhc3MgVGlsZWRMYXllciBleHRlbmRzIExheWVyIHtcbiAgZmluZFRpbGVzZXQodGlsZXNldHMsIHRpbGVJbmRleCkge1xuICAgIGxldCBvdXRwdXQgPSBudWxsO1xuICAgIGxldCB0b3BHaWQgPSBudWxsO1xuICAgIGlmICh0aWxlSW5kZXggPiAwKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGlsZXNldHMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgbGV0IHRpbGVzZXQgPSB0aWxlc2V0c1tpXTtcbiAgICAgICAgaWYgKHRpbGVJbmRleCA+PSB0aWxlc2V0LmZpcnN0Z2lkICYmICghdG9wR2lkIHx8IHRpbGVzZXQuZmlyc3RnaWQgPiB0b3BHaWQpKSB7XG4gICAgICAgICAgb3V0cHV0ID0gdGlsZXNldDtcbiAgICAgICAgICB0b3BHaWQgPSB0aWxlc2V0LmZpcnN0Z2lkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIHdhdGNoVGlsZXNldCh0aWxlc2V0KSB7XG4gICAgaWYgKCF0aWxlc2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMudGlsZXNldHMubGVuZ3RoOyAhZm91bmQgJiYgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBpZiAodGlsZXNldCA9PT0gdGhpcy50aWxlc2V0c1tpXSkge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZm91bmQpIHtcbiAgICAgIHRoaXMudGlsZXNldHMucHVzaCh0aWxlc2V0KTtcbiAgICB9XG4gIH1cblxuICBsb2FkVGlsZWRMYXllckRhdGEodGlsZXNldHMsIGxheWVyRGF0YSkge1xuICAgIHRoaXMud2lkdGggPSBsYXllckRhdGEud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBsYXllckRhdGEuaGVpZ2h0O1xuICAgIGlmIChsYXllckRhdGEucHJvcGVydGllcyAmJiBsYXllckRhdGEucHJvcGVydGllcy50eXBlID09PSBcInBsYXlmaWVsZFwiKSB7XG4gICAgICB0aGlzLmlzU29saWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMudGlsZXNldHMgPSBbXTtcbiAgICBsZXQgdGlsZXMgPSBbXTtcbiAgICBmb3IgKGxldCB5ID0gMCwgeWxlbiA9IHRoaXMuaGVpZ2h0OyB5IDwgeWxlbjsgeSArPSAxKSB7XG4gICAgICB0aWxlcy5wdXNoKFtdKTtcbiAgICAgIGZvciAobGV0IHggPSAwLCB4bGVuID0gdGhpcy53aWR0aDsgeCA8IHhsZW47IHggKz0gMSkge1xuICAgICAgICBsZXQgdGlsZSA9IG51bGw7XG4gICAgICAgIGxldCB0aWxlSW5kZXggPSBsYXllckRhdGEuZGF0YVt5ICogdGhpcy53aWR0aCArIHhdO1xuICAgICAgICBsZXQgdGlsZXNldCA9IHRoaXMuZmluZFRpbGVzZXQodGlsZXNldHMsIHRpbGVJbmRleCk7XG5cbiAgICAgICAgdGhpcy53YXRjaFRpbGVzZXQodGlsZXNldCk7XG5cbiAgICAgICAgaWYgKHRpbGVJbmRleCAmJiB0aWxlc2V0KSB7XG4gICAgICAgICAgbGV0IHR3aWR0aCA9IHRpbGVzZXQudGlsZXdpZHRoO1xuICAgICAgICAgIGxldCB0aGVpZ2h0ID0gdGlsZXNldC50aWxlaGVpZ2h0O1xuXG4gICAgICAgICAgbGV0IHByb3BzID0gdGlsZXNldC50aWxlcHJvcGVydGllc1t0aWxlSW5kZXggLSB0aWxlc2V0LmZpcnN0Z2lkXTtcbiAgICAgICAgICBsZXQgY3R5cGUgPSBwcm9wcyA/IHByb3BzLmN0eXBlIDogbnVsbDtcbiAgICAgICAgICBsZXQgY2VsbHNYID0gdGlsZXNldC5pbWFnZXdpZHRoIC8gdHdpZHRoIHwgMDtcbiAgICAgICAgICBsZXQgb2Zmc2V0ID0gdGlsZUluZGV4IC0gdGlsZXNldC5maXJzdGdpZDtcblxuICAgICAgICAgIHRpbGUgPSB7XG4gICAgICAgICAgICB4OiB4ICogdHdpZHRoLFxuICAgICAgICAgICAgeTogeSAqIHRoZWlnaHQsXG4gICAgICAgICAgICB3OiB0d2lkdGgsXG4gICAgICAgICAgICBoOiB0aGVpZ2h0LFxuICAgICAgICAgICAgc3g6IG9mZnNldCAlIGNlbGxzWCAqIHR3aWR0aCxcbiAgICAgICAgICAgIHN5OiAob2Zmc2V0IC8gY2VsbHNYIHwgMCkgKiB0aGVpZ2h0LFxuICAgICAgICAgICAgaW1nOiB0aWxlc2V0LmltYWdlLFxuICAgICAgICAgICAgY3R5cGVcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdGlsZXNbeV1beF0gPSB0aWxlO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnRpbGVzID0gdGlsZXM7XG4gICAgdGhpcy5idWlsZEJhY2tncm91bmQoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWxlZExldmVsIGV4dGVuZHMgTGV2ZWwge1xuICBsb2FkTGV2ZWxEYXRhKGRhdGEpIHtcbiAgICBjb25zb2xlLmRlYnVnKGRhdGEpO1xuICAgIGxldCB0aWxlc2V0cyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBkYXRhLnRpbGVzZXRzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBsZXQgdGlsZXNldCA9IGRhdGEudGlsZXNldHNbaV07XG4gICAgICBsZXQgaW1hZ2VTcmMgPSB0aWxlc2V0LmltYWdlO1xuICAgICAgdGlsZXNldC5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgdGlsZXNldC5pbWFnZS5vbmxvYWQgPSAoKSA9PiBkYXRhLnRpbGVzZXRzW2ldLmxvYWRlZCA9IHRydWU7XG4gICAgICB0aWxlc2V0LmltYWdlLnNyYyA9IGltYWdlU3JjO1xuICAgICAgdGlsZXNldHMucHVzaCh0aWxlc2V0KTtcbiAgICB9XG5cbiAgICBsZXQgbGF5ZXJzID0gW107XG4gICAgZm9yIChsZXQgaiA9IDAsIGpsZW4gPSBkYXRhLmxheWVycy5sZW5ndGg7IGogPCBqbGVuOyBqICs9IDEpIHtcbiAgICAgIGxldCBsYXllckRhdGEgPSBkYXRhLmxheWVyc1tqXTtcbiAgICAgIGlmIChsYXllckRhdGEudHlwZSA9PT0gXCJ0aWxlbGF5ZXJcIikge1xuICAgICAgICBsZXQgbGF5ZXIgPSBuZXcgVGlsZWRMYXllcih0aGlzLmVuZ2luZSwgZGF0YS50aWxld2lkdGgsIGRhdGEudGlsZWhlaWdodCk7XG4gICAgICAgIGxheWVyLmxvYWRUaWxlZExheWVyRGF0YSh0aWxlc2V0cywgbGF5ZXJEYXRhKTtcbiAgICAgICAgaWYgKGxheWVyLmlzU29saWQpIHtcbiAgICAgICAgICB0aGlzLnNvbGlkTGF5ZXIgPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgICBsYXllcnMucHVzaChsYXllcik7XG4gICAgICB9IGVsc2UgaWYgKGxheWVyRGF0YS50eXBlID09PSBcIm9iamVjdGdyb3VwXCIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxheWVyRGF0YS5vYmplY3RzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVPYmplY3QobGF5ZXJEYXRhLm9iamVjdHNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubGF5ZXJzID0gbGF5ZXJzO1xuICB9XG59XG4iXX0=
