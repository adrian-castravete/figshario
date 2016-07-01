(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

      var delta = undefined;

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

      var g = undefined;

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
        for (var i = 0; i < lines.length; i += 1) {
          g.fillText(lines[i], window.innerWidth - 1, 12 * i);
        }

        g.textBaseline = "bottom";
        lines = this.debugBottomRightText.split("\n");
        var offset = window.innerHeight - 1 - lines.length * 12;
        for (var i = 0; i < lines.length; i += 1) {
          g.fillText(lines[i], window.innerWidth - 1, offset + 12 * i);
        }

        g.textAlign = "left";
        lines = this.debugBottomLeftText.split("\n");
        offset = window.innerHeight - 1 - lines.length * 12;
        for (var i = 0; i < lines.length; i += 1) {
          g.fillText(lines[i], 0, offset + 12 * i);
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
      var c = undefined;

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
  }]);

  return Figengine;
}();

exports.default = Figengine;

},{}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

      for (var i = 0, len = this.objects.length; i < len; i += 1) {
        var obj = this.objects[i];
        if (obj.x >= cx - obj.width && obj.y >= cy - obj.height && obj.x < cx + gw && obj.y < cy + gh) {
          obj.draw(g);
        }
      }

      for (var i = 0, len = this.layers.length; i < len; i += 1) {
        var layer = this.layers[i];
        if (!layer.isBackground) {
          layer.draw(g);
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
      var index = undefined;

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
  }]);

  return Level;
}(_util2.default);

exports.default = Level;

},{"./util":8}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
        var cw = undefined;

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

      var xhr = undefined;

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
      var xhr = undefined;

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _engine = require("../figengine/engine");

var _engine2 = _interopRequireDefault(_engine);

var _level = require("./level");

var _level2 = _interopRequireDefault(_level);

var _score = require("./objects/score");

var _score2 = _interopRequireDefault(_score);

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

},{"../figengine/engine":1,"./level":10,"./objects/score":15}],10:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

      for (var i = 0; i < toRemove.length; i += 1) {
        this.toCollect.splice(this.toCollect.indexOf(toRemove[i]), 1);
      }
    }
  }, {
    key: "updateCamera",
    value: function updateCamera() {
      var offset = undefined;

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
  var key = undefined;

  key = handleKey(evt);

  if (key) {
    figshario.keyDown(key);
    evt.preventDefault();
  }
});
window.addEventListener("keyup", function (evt) {
  var key = undefined;

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
          for (var i = 0, len = layerData.objects.length; i < len; i += 1) {
            this.createObject(layerData.objects[i]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZmlnZW5naW5lL2VuZ2luZS5qcyIsInNyYy9maWdlbmdpbmUvbGF5ZXIuanMiLCJzcmMvZmlnZW5naW5lL2xldmVsLmpzIiwic3JjL2ZpZ2VuZ2luZS9vYmplY3RzL2ZvbnQtc3ByaXRlLmpzIiwic3JjL2ZpZ2VuZ2luZS9vYmplY3RzL2Zzb2JqZWN0LmpzIiwic3JjL2ZpZ2VuZ2luZS9vYmplY3RzL3NtYXJ0LWZvbnQtc3ByaXRlLmpzIiwic3JjL2ZpZ2VuZ2luZS9vYmplY3RzL3Nwcml0ZS5qcyIsInNyYy9maWdlbmdpbmUvdXRpbC5qcyIsInNyYy9maWdzaGFyaW8vZmlnc2hhcmlvLmpzIiwic3JjL2ZpZ3NoYXJpby9sZXZlbC5qcyIsInNyYy9maWdzaGFyaW8vb2JqZWN0cy9jb2luLmpzIiwic3JjL2ZpZ3NoYXJpby9vYmplY3RzL2Zsb2F0eS5qcyIsInNyYy9maWdzaGFyaW8vb2JqZWN0cy9tb3Zpbmctc3ByaXRlLmpzIiwic3JjL2ZpZ3NoYXJpby9vYmplY3RzL3BsYXllci5qcyIsInNyYy9maWdzaGFyaW8vb2JqZWN0cy9zY29yZS5qcyIsInNyYy9zdGFydGVyLmpzIiwic3JjL3RpbGVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O0lDRXFCLFNBQVM7QUFDNUIsV0FEbUIsU0FBUyxDQUNoQixNQUFNLEVBQUU7MEJBREQsU0FBUzs7QUFFMUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO0FBQzFCLFFBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsUUFBSSxDQUFDLGNBQWMs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LFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDekUsZUFBSyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM5QyxjQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDakIsZ0JBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1dBQ3pCO0FBQ0QsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFFO0FBQzNDLGVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDL0QsZ0JBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1dBQ3pDO1NBQ0Y7T0FDRjtBQUNELFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0tBQ3RCOzs7U0E5QmtCLFVBQVU7OztrQkFBVixVQUFVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCB3aW5kb3cgKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlnZW5naW5lIHtcbiAgY29uc3RydWN0b3IoY2FudmFzKSB7XG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgdGhpcy5jb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICB0aGlzLnZpZXdwb3J0V2lkdGggPSAzMjA7XG4gICAgdGhpcy52aWV3cG9ydEhlaWdodCA9IDIwMDtcbiAgICB0aGlzLnpvb20gPSAyO1xuICAgIHRoaXMubWFza091dEV4dGVudHMgPSB0cnVlO1xuICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgIHRoaXMuY2FtZXJhWCA9IDA7XG4gICAgdGhpcy5jYW1lcmFZID0gMDtcbiAgICB0aGlzLmNhbWVyYUZvbGxvd1ggPSAwO1xuICAgIHRoaXMuY2FtZXJhRm9sbG93WSA9IDA7XG4gICAgdGhpcy5jYW1lcmFGb2xsb3dSYXRpbyA9IDU7XG4gICAgdGhpcy5rZXlzID0ge1xuICAgICAgbGVmdDogZmFsc2UsXG4gICAgICB1cDogZmFsc2UsXG4gICAgICByaWdodDogZmFsc2UsXG4gICAgICBkb3duOiBmYWxzZSxcbiAgICAgIHN0YXJ0OiBmYWxzZSxcbiAgICAgIGJ1dHRvbkE6IGZhbHNlLFxuICAgICAgYnV0dG9uQjogZmFsc2UsXG4gICAgICBkZWJ1ZzogZmFsc2VcbiAgICB9O1xuICAgIHRoaXMub2xkVGljayA9IG51bGw7XG4gICAgdGhpcy5kZWJ1Z0VuYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmRlYnVnVG9wTGVmdFRleHQgPSBcIlwiO1xuICAgIHRoaXMuZGVidWdUb3BSaWdodFRleHQgPSBcIlwiO1xuICAgIHRoaXMuZGVidWdCb3R0b21MZWZ0VGV4dCA9IFwiXCI7XG4gICAgdGhpcy5kZWJ1Z0JvdHRvbVJpZ2h0VGV4dCA9IFwiXCI7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLnN0YXJ0TG9vcCgpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnN0b3BMb29wKCk7XG4gIH1cblxuICBzdGFydExvb3AoKSB7XG4gICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZSgwKTtcbiAgICB0aGlzLmRyYXcoMCk7XG4gIH1cblxuICBzdG9wTG9vcCgpIHtcbiAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHVwZGF0ZSh0aWNrKSB7XG4gICAgbGV0IGRlbHRhO1xuXG4gICAgaWYgKHRoaXMucnVubmluZyAmJiB0aGlzLmxldmVsKSB7XG4gICAgICBpZiAodGhpcy5vbGRUaWNrID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5vbGRUaWNrID0gdGljaztcbiAgICAgIH1cbiAgICAgIGRlbHRhID0gKHRpY2sgLSB0aGlzLm9sZFRpY2spIC8gMTAwMC4wO1xuICAgICAgdGhpcy5tb3ZlQ2FtZXJhKGRlbHRhKTtcbiAgICAgIHRoaXMubGV2ZWwudXBkYXRlKHRpY2ssIGRlbHRhKTtcbiAgICAgIHRoaXMub2xkVGljayA9IHRpY2s7XG4gICAgfVxuICAgIGlmICh0aGlzLnJ1bm5pbmcpIHtcbiAgICAgIHRoaXMuem9vbSA9IE1hdGgubWluKHRoaXMuY2FudmFzLndpZHRoIC8gdGhpcy52aWV3cG9ydFdpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQgLyB0aGlzLnZpZXdwb3J0SGVpZ2h0KSB8IDA7XG4gICAgICBzZXRUaW1lb3V0KChuZXdUaWNrKSA9PiB0aGlzLnVwZGF0ZShuZXdUaWNrKSwgMTAsIERhdGUubm93KCkpO1xuICAgIH1cbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgbGV0IGc7XG5cbiAgICBpZiAodGhpcy5ydW5uaW5nKSB7XG4gICAgICBnID0gdGhpcy5jb250ZXh0O1xuICAgICAgdGhpcy5kcmF3QmFja2dyb3VuZCgpO1xuICAgICAgaWYgKHRoaXMubGV2ZWwpIHtcbiAgICAgICAgZy5zYXZlKCk7XG4gICAgICAgIGcudHJhbnNsYXRlKHRoaXMuY2FudmFzLndpZHRoICogMC41IHwgMCwgdGhpcy5jYW52YXMuaGVpZ2h0ICogMC41IHwgMCk7XG4gICAgICAgIGcuc2NhbGUodGhpcy56b29tLCB0aGlzLnpvb20pO1xuICAgICAgICBpZiAodGhpcy5tYXNrT3V0RXh0ZW50cykge1xuICAgICAgICAgIHRoaXMuY2xpcEV4dGVudHMoKTtcbiAgICAgICAgfVxuICAgICAgICBnLmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxldmVsLmRyYXcoZyk7XG4gICAgICAgIGcucmVzdG9yZSgpO1xuICAgICAgICB0aGlzLmRlYnVnU2NyZWVuKGcpO1xuICAgICAgfVxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmRyYXcoKSk7XG4gICAgfVxuICB9XG5cbiAgY2xpcEV4dGVudHMoKSB7XG4gICAgbGV0IGcgPSB0aGlzLmNvbnRleHQ7XG4gICAgbGV0IGd3ID0gdGhpcy52aWV3cG9ydFdpZHRoO1xuICAgIGxldCBnaCA9IHRoaXMudmlld3BvcnRIZWlnaHQ7XG5cbiAgICBnLmJlZ2luUGF0aCgpO1xuICAgIGcucmVjdCgtZ3cgKiAwLjUsIC1naCAqIDAuNSwgZ3csIGdoKTtcbiAgICBnLmNsb3NlUGF0aCgpO1xuICAgIGcuY2xpcCgpO1xuICB9XG5cbiAgZHJhd0JhY2tncm91bmQoKSB7XG4gIH1cblxuICBkZWJ1Z1NjcmVlbihnKSB7XG4gICAgaWYgKHRoaXMuZGVidWdFbmFibGVkKSB7XG4gICAgICB0aGlzLmRlYnVnVG9wTGVmdFRleHQgPSBgRGVidWcgU2NyZWVuXFxuJHt0aGlzLmRlYnVnVG9wTGVmdFRleHR9YDtcblxuICAgICAgZy5zYXZlKCk7XG4gICAgICBnLmZvbnQgPSBcImJvbGQgMTJweCBtb25vc3BhY2VcIjtcbiAgICAgIGcuc2hhZG93Q29sb3IgPSBcIiMwMDAwMDBcIjtcbiAgICAgIGcuc2hhZG93Qmx1ciA9IDI7XG4gICAgICBnLmZpbGxTdHlsZSA9IFwiI2ZmZmZmZlwiO1xuXG4gICAgICBnLnRleHRCYXNlbGluZSA9IFwidG9wXCI7XG4gICAgICBnLnRleHRBbGlnbiA9IFwibGVmdFwiO1xuICAgICAgbGV0IGxpbmVzID0gdGhpcy5kZWJ1Z1RvcExlZnRUZXh0LnNwbGl0KFwiXFxuXCIpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBnLmZpbGxUZXh0KGxpbmVzW2ldLCAwLCAxMiAqIGkpO1xuICAgICAgfVxuXG4gICAgICBnLnRleHRBbGlnbiA9IFwicmlnaHRcIjtcbiAgICAgIGxpbmVzID0gdGhpcy5kZWJ1Z1RvcFJpZ2h0VGV4dC5zcGxpdChcIlxcblwiKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgZy5maWxsVGV4dChsaW5lc1tpXSwgd2luZG93LmlubmVyV2lkdGggLSAxLCAxMiAqIGkpO1xuICAgICAgfVxuXG4gICAgICBnLnRleHRCYXNlbGluZSA9IFwiYm90dG9tXCI7XG4gICAgICBsaW5lcyA9IHRoaXMuZGVidWdCb3R0b21SaWdodFRleHQuc3BsaXQoXCJcXG5cIik7XG4gICAgICBsZXQgb2Zmc2V0ID0gd2luZG93LmlubmVySGVpZ2h0IC0gMSAtIGxpbmVzLmxlbmd0aCAqIDEyO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBnLmZpbGxUZXh0KGxpbmVzW2ldLCB3aW5kb3cuaW5uZXJXaWR0aCAtIDEsIG9mZnNldCArIDEyICogaSk7XG4gICAgICB9XG5cbiAgICAgIGcudGV4dEFsaWduID0gXCJsZWZ0XCI7XG4gICAgICBsaW5lcyA9IHRoaXMuZGVidWdCb3R0b21MZWZ0VGV4dC5zcGxpdChcIlxcblwiKTtcbiAgICAgIG9mZnNldCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDEgLSBsaW5lcy5sZW5ndGggKiAxMjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgZy5maWxsVGV4dChsaW5lc1tpXSwgMCwgb2Zmc2V0ICsgMTIgKiBpKTtcbiAgICAgIH1cblxuICAgICAgZy5yZXN0b3JlKCk7XG5cbiAgICAgIHRoaXMuZGVidWdUb3BMZWZ0VGV4dCA9IFwiXCI7XG4gICAgICB0aGlzLmRlYnVnVG9wUmlnaHRUZXh0ID0gXCJcIjtcbiAgICAgIHRoaXMuZGVidWdCb3R0b21MZWZ0VGV4dCA9IFwiXCI7XG4gICAgICB0aGlzLmRlYnVnQm90dG9tUmlnaHRUZXh0ID0gXCJcIjtcbiAgICB9XG4gIH1cblxuICBhZGREZWJ1Z0xpbmUobGluZSkge1xuICAgIHRoaXMuYWRkVG9wTGVmdERlYnVnTGluZShsaW5lKTtcbiAgfVxuXG4gIGFkZFRvcExlZnREZWJ1Z0xpbmUobGluZSkge1xuICAgIGlmICh0aGlzLmRlYnVnRW5hYmxlZCkge1xuICAgICAgdGhpcy5kZWJ1Z1RvcExlZnRUZXh0ICs9IGAke2xpbmV9XFxuYDtcbiAgICB9XG4gIH1cblxuICBhZGRUb3BSaWdodERlYnVnTGluZShsaW5lKSB7XG4gICAgaWYgKHRoaXMuZGVidWdFbmFibGVkKSB7XG4gICAgICB0aGlzLmRlYnVnVG9wUmlnaHRUZXh0ICs9IGAke2xpbmV9XFxuYDtcbiAgICB9XG4gIH1cblxuICBhZGRCb3R0b21MZWZ0RGVidWdMaW5lKGxpbmUpIHtcbiAgICBpZiAodGhpcy5kZWJ1Z0VuYWJsZWQpIHtcbiAgICAgIHRoaXMuZGVidWdCb3R0b21MZWZ0VGV4dCArPSBgJHtsaW5lfVxcbmA7XG4gICAgfVxuICB9XG5cbiAgYWRkQm90dG9tUmlnaHREZWJ1Z0xpbmUobGluZSkge1xuICAgIGlmICh0aGlzLmRlYnVnRW5hYmxlZCkge1xuICAgICAgdGhpcy5kZWJ1Z1RvcExlZnRUZXh0ICs9IGAke2xpbmV9XFxuYDtcbiAgICB9XG4gIH1cblxuICByZXNpemUod2lkdGgsIGhlaWdodCkge1xuICAgIGxldCBjO1xuXG4gICAgYyA9IHRoaXMuY2FudmFzO1xuICAgIGMud2lkdGggPSB3aWR0aDtcbiAgICBjLmhlaWdodCA9IGhlaWdodDtcbiAgfVxuXG4gIHNldENhbWVyYSh4LCB5LCByZXNldCA9IGZhbHNlKSB7XG4gICAgLy8gVE9ETzogbWFrZSBzdXJlIHRoZSBjYW1lcmEgZG9lc24ndCBtYWtlIHRoZSB2aWV3cG9ydCBvdmVyZmxvd1xuICAgIHRoaXMuY2FtZXJhRm9sbG93WCA9IHg7XG4gICAgdGhpcy5jYW1lcmFGb2xsb3dZID0geTtcbiAgICBpZiAocmVzZXQpIHtcbiAgICAgIHRoaXMuY2FtZXJhWCA9IHg7XG4gICAgICB0aGlzLmNhbWVyYVkgPSB5O1xuICAgIH1cbiAgfVxuXG4gIGtleURvd24oa2V5KSB7XG4gICAgdGhpcy5rZXlzW2tleV0gPSB0cnVlO1xuICB9XG5cbiAga2V5VXAoa2V5KSB7XG4gICAgdGhpcy5rZXlzW2tleV0gPSBmYWxzZTtcbiAgICBpZiAoa2V5ID09PSBcImRlYnVnXCIpIHtcbiAgICAgIHRoaXMuZGVidWdFbmFibGVkID0gIXRoaXMuZGVidWdFbmFibGVkO1xuICAgIH1cbiAgfVxuXG4gIGlzUHJlc3NlZChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5rZXlzW2tleV07XG4gIH1cblxuICBtb3ZlQ2FtZXJhKGRlbHRhKSB7XG4gICAgbGV0IGR4ID0gdGhpcy5jYW1lcmFYIC0gdGhpcy5jYW1lcmFGb2xsb3dYO1xuICAgIGxldCBkeSA9IHRoaXMuY2FtZXJhWSAtIHRoaXMuY2FtZXJhRm9sbG93WTtcblxuICAgIGlmIChNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpID4gMC4wMDEpIHtcbiAgICAgIHRoaXMuY2FtZXJhWCA9IHRoaXMuY2FtZXJhWCAtIGR4ICogdGhpcy5jYW1lcmFGb2xsb3dSYXRpbyAqIGRlbHRhO1xuICAgICAgdGhpcy5jYW1lcmFZID0gdGhpcy5jYW1lcmFZIC0gZHkgKiB0aGlzLmNhbWVyYUZvbGxvd1JhdGlvICogZGVsdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FtZXJhWCA9IHRoaXMuY2FtZXJhRm9sbG93WDtcbiAgICAgIHRoaXMuY2FtZXJhWSA9IHRoaXMuY2FtZXJhRm9sbG93WTtcbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyIHtcbiAgY29uc3RydWN0b3IoZW5naW5lLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpIHtcbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgICB0aGlzLnRpbGVzID0gW107XG4gICAgdGhpcy5iYWNrU2NyZWVuID0gbnVsbDtcbiAgICB0aGlzLnRpbGVXaWR0aCA9IHRpbGVXaWR0aDtcbiAgICB0aGlzLnRpbGVIZWlnaHQgPSB0aWxlSGVpZ2h0O1xuICAgIHRoaXMud2lkdGggPSAwO1xuICAgIHRoaXMuaGVpZ2h0ID0gMDtcbiAgICB0aGlzLmlzQmFja2dyb3VuZCA9IHRydWU7XG4gICAgdGhpcy5pc1NvbGlkID0gZmFsc2U7XG4gICAgdGhpcy50aWxlc2V0cyA9IFtdO1xuICAgIHRoaXMuZXZlcnl0aGluZ0xvYWRlZCA9IGZhbHNlO1xuICB9XG5cbiAgYnVpbGRCYWNrZ3JvdW5kKCkge1xuICAgIGxldCBiYWNrU2NyZWVuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICBiYWNrU2NyZWVuLndpZHRoID0gdGhpcy50aWxlV2lkdGggKiB0aGlzLndpZHRoO1xuICAgIGJhY2tTY3JlZW4uaGVpZ2h0ID0gdGhpcy50aWxlSGVpZ2h0ICogdGhpcy5oZWlnaHQ7XG5cbiAgICBsZXQgZyA9IGJhY2tTY3JlZW4uZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy50aWxlcy5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbGVzW2pdLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGxldCB0aWxlID0gdGhpcy50aWxlc1tqXVtpXTtcbiAgICAgICAgaWYgKHRpbGUpIHtcbiAgICAgICAgICBnLmRyYXdJbWFnZSh0aWxlLmltZywgdGlsZS5zeCwgdGlsZS5zeSwgdGlsZS53LCB0aWxlLmgsXG4gICAgICAgICAgICAgICAgICAgICAgaSAqIHRoaXMudGlsZVdpZHRoLCBqICogdGhpcy50aWxlSGVpZ2h0LCB0aWxlLncsIHRpbGUuaCk7XG4gICAgICAgICAgLy8gZy5zdHJva2VTdHlsZSA9IFwiIzAwMDAwMFwiO1xuICAgICAgICAgIC8vIGcuc3Ryb2tlUmVjdChpICogdGhpcy50aWxlV2lkdGggKyAwLjUsIGogKiB0aGlzLnRpbGVIZWlnaHQgKyAwLjUsIDE2LCAxNik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmJhY2tTY3JlZW4gPSBiYWNrU2NyZWVuO1xuICB9XG5cbiAgZHJhdyhnKSB7XG4gICAgaWYgKCF0aGlzLmV2ZXJ5dGhpbmdMb2FkZWQpIHtcbiAgICAgIGxldCBkb3JlYnVpbGQgPSB0cnVlO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbGVzZXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmICghdGhpcy50aWxlc2V0c1tpXS5sb2FkZWQpIHtcbiAgICAgICAgICBkb3JlYnVpbGQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRvcmVidWlsZCkge1xuICAgICAgICB0aGlzLmJ1aWxkQmFja2dyb3VuZCgpO1xuICAgICAgICB0aGlzLmV2ZXJ5dGhpbmdMb2FkZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgZSA9IHRoaXMuZW5naW5lO1xuICAgIGxldCBndyA9IGUudmlld3BvcnRXaWR0aDtcbiAgICBsZXQgZ2ggPSBlLnZpZXdwb3J0SGVpZ2h0O1xuICAgIGxldCBveCA9IGUuY2FtZXJhWCAtIGd3ICogMC41IHwgMDtcbiAgICBsZXQgb3kgPSBlLmNhbWVyYVkgLSBnaCAqIDAuNSB8IDA7XG4gICAgZy5kcmF3SW1hZ2UodGhpcy5iYWNrU2NyZWVuLCBveCwgb3ksIGd3LCBnaCwgb3gsIG95LCBndywgZ2gpO1xuICB9XG5cbiAgZ2V0QXQoeCwgeSkge1xuICAgIGxldCBjeCA9IHggLyB0aGlzLnRpbGVXaWR0aCB8IDA7XG4gICAgbGV0IGN5ID0geSAvIHRoaXMudGlsZUhlaWdodCB8IDA7XG5cbiAgICBpZiAoY3ggPj0gMCAmJiBjeSA+PSAwICYmXG4gICAgICAgIGN5IDwgdGhpcy50aWxlcy5sZW5ndGggJiYgY3ggPCB0aGlzLnRpbGVzW2N5XS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLnRpbGVzW2N5XVtjeF07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCBMb2FkZXIsIHsgRm9udEJ1aWxkZXIsIFNtYXJ0Rm9udEJ1aWxkZXIgfSBmcm9tIFwiLi91dGlsXCI7XG5cbmxldCBfbG9hZGluZ1Nwcml0ZSA9IG51bGw7XG5cbmZ1bmN0aW9uIF9nZXRMb2FkaW5nU3ByaXRlKCkge1xuICBpZiAoIV9sb2FkaW5nU3ByaXRlKSB7XG4gICAgbGV0IGxzID0gbmV3IEltYWdlKCk7XG4gICAgbHMuc3JjID0gXCJhc3NldHMvaW1hZ2VzL3Byb2dyZXNzLmdpZlwiO1xuICAgIF9sb2FkaW5nU3ByaXRlID0gbHM7XG4gIH1cblxuICByZXR1cm4gX2xvYWRpbmdTcHJpdGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExldmVsIGV4dGVuZHMgTG9hZGVyIHtcbiAgY29uc3RydWN0b3IoZW5naW5lLCBmaWxlTmFtZSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgICB0aGlzLm9iamVjdHMgPSBbXTtcbiAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgIHRoaXMuc29saWRMYXllciA9IG51bGw7XG5cbiAgICB0aGlzLmFzc2V0cyA9IHt9O1xuICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5sb2FkaW5nUHJvZ3Jlc3MgPSAwO1xuICAgIHRoaXMubG9hZGluZ0NhbGxiYWNrID0gbnVsbDtcbiAgICB0aGlzLmxldmVsRmlsZU5hbWUgPSBmaWxlTmFtZTtcbiAgfVxuXG4gIHJlc2V0TGV2ZWxEYXRhKCkge1xuICAgIHRoaXMub2JqZWN0cyA9IFtdO1xuICAgIHRoaXMubGF5ZXJzID0gW107XG4gIH1cblxuICB1cGRhdGUodGljaywgZGVsdGEpIHtcbiAgICBpZiAodGhpcy5pc0xvYWRpbmcpIHtcbiAgICAgIHRoaXMudXBkYXRlTG9hZGluZyh0aWNrLCBkZWx0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXBkYXRlTm9ybWFsKHRpY2ssIGRlbHRhKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVMb2FkaW5nKCkge1xuICAgIGxldCBkb25lID0gMDtcbiAgICBsZXQgdG90YWwgPSAwO1xuICAgIGxldCBpbWFnZXMgPSB0aGlzLmFzc2V0cy5pbWFnZXMgfHwge307XG4gICAgbGV0IGZvbnRzID0gdGhpcy5hc3NldHMuZm9udHMgfHwge307XG5cbiAgICBPYmplY3Qua2V5cyhpbWFnZXMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdG90YWwgKz0gMTtcbiAgICAgIGlmIChpbWFnZXNba2V5XS5sb2FkZWQpIHtcbiAgICAgICAgZG9uZSArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmtleXMoZm9udHMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdG90YWwgKz0gMTtcbiAgICAgIGlmIChmb250c1trZXldLmxvYWRlZCkge1xuICAgICAgICBkb25lICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmxvYWRpbmdQcm9ncmVzcyA9IGRvbmUgLyB0b3RhbCAqIDEwMCB8IDA7XG5cbiAgICBpZiAoZG9uZSA9PT0gdG90YWwpIHtcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5sb2FkaW5nQ2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVOb3JtYWwodGljaywgZGVsdGEpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5vYmplY3RzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBsZXQgb2JqID0gdGhpcy5vYmplY3RzW2ldO1xuXG4gICAgICBpZiAob2JqKSB7XG4gICAgICAgIG9iai51cGRhdGUodGljaywgZGVsdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRyYXcoZykge1xuICAgIGlmICh0aGlzLmlzTG9hZGluZykge1xuICAgICAgdGhpcy5kcmF3TG9hZGluZyhnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kcmF3Tm9ybWFsKGcpO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdMb2FkaW5nKGcpIHtcbiAgICBsZXQgcyA9IF9nZXRMb2FkaW5nU3ByaXRlKCk7XG4gICAgbGV0IHcgPSB0aGlzLmVuZ2luZS52aWV3cG9ydFdpZHRoO1xuICAgIGxldCBjdyA9ICh3IC0gNjQpIC8gOCB8IDA7XG4gICAgbGV0IHAgPSB0aGlzLmxvYWRpbmdQcm9ncmVzcztcblxuICAgIGxldCBzeSA9IDA7XG4gICAgaWYgKHAgPT09IDApIHtcbiAgICAgIHN5ID0gMTY7XG4gICAgfVxuICAgIGcuZHJhd0ltYWdlKHMsIDAsIHN5LCA4LCAxNiwgLWN3ICogNCwgLTgsIDgsIDE2KTtcblxuICAgIHN5ID0gMDtcbiAgICBpZiAocCA8IDEwMCkge1xuICAgICAgc3kgPSAxNjtcbiAgICB9XG4gICAgZy5kcmF3SW1hZ2UocywgMTYsIHN5LCA4LCAxNiwgY3cgKiA0LCAtOCwgOCwgMTYpO1xuXG4gICAgZm9yIChsZXQgc3QgPSAtKGN3IC0gMikgKiA0LCBpID0gc3QsIGVuZCA9IChjdyAtIDIpICogNDsgaSA8PSBlbmQ7IGkgKz0gOCkge1xuICAgICAgc3kgPSAwO1xuICAgICAgaWYgKHAgPCAoaSAtIHN0KSAvIChlbmQgLSBzdCkgKiAxMDApIHtcbiAgICAgICAgc3kgPSAxNjtcbiAgICAgIH1cbiAgICAgIGcuZHJhd0ltYWdlKHMsIDgsIHN5LCA4LCAxNiwgaSwgLTgsIDgsIDE2KTtcbiAgICB9XG4gIH1cblxuICBkcmF3Tm9ybWFsKGcpIHtcbiAgICBsZXQgZSA9IHRoaXMuZW5naW5lO1xuICAgIGxldCBndyA9IGUudmlld3BvcnRXaWR0aDtcbiAgICBsZXQgZ2ggPSBlLnZpZXdwb3J0SGVpZ2h0O1xuICAgIGxldCBjeCA9IGUuY2FtZXJhWCAtIGd3ICogMC41IHwgMDtcbiAgICBsZXQgY3kgPSBlLmNhbWVyYVkgLSBnaCAqIDAuNSB8IDA7XG5cbiAgICBnLnNhdmUoKTtcbiAgICBnLnRyYW5zbGF0ZSgtdGhpcy5lbmdpbmUuY2FtZXJhWCB8IDAsIC10aGlzLmVuZ2luZS5jYW1lcmFZIHwgMCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGF5ZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBsZXQgbGF5ZXIgPSB0aGlzLmxheWVyc1tpXTtcbiAgICAgIGlmIChsYXllci5pc0JhY2tncm91bmQpIHtcbiAgICAgICAgbGF5ZXIuZHJhdyhnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5vYmplY3RzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBsZXQgb2JqID0gdGhpcy5vYmplY3RzW2ldO1xuICAgICAgaWYgKG9iai54ID49IGN4IC0gb2JqLndpZHRoICYmIG9iai55ID49IGN5IC0gb2JqLmhlaWdodCAmJlxuICAgICAgICAgIG9iai54IDwgY3ggKyBndyAmJiBvYmoueSA8IGN5ICsgZ2gpIHtcbiAgICAgICAgb2JqLmRyYXcoZyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGF5ZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBsZXQgbGF5ZXIgPSB0aGlzLmxheWVyc1tpXTtcbiAgICAgIGlmICghbGF5ZXIuaXNCYWNrZ3JvdW5kKSB7XG4gICAgICAgIGxheWVyLmRyYXcoZyk7XG4gICAgICB9XG4gICAgfVxuICAgIGcucmVzdG9yZSgpO1xuICB9XG5cbiAgb25Mb2FkZWQoZGF0YSkge1xuICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgIHRoaXMucmVzZXRMZXZlbERhdGEoKTtcbiAgICB0aGlzLmxvYWRMZXZlbERhdGEoZGF0YSk7XG4gIH1cblxuICBjcmVhdGVPYmplY3QoKSB7ICAvKiBvYmpEYXRhICovXG4gIH1cblxuICBsb2FkTGV2ZWxEYXRhKCkgeyAgLyogbGV2ZWxEYXRhICovXG4gIH1cblxuICBhZGRPYmplY3Qob2JqKSB7XG4gICAgdGhpcy5vYmplY3RzLnB1c2gob2JqKTtcbiAgfVxuXG4gIHJlbW92ZU9iamVjdChvYmopIHtcbiAgICBsZXQgaW5kZXg7XG5cbiAgICBpbmRleCA9IHRoaXMub2JqZWN0cy5pbmRleE9mKG9iaik7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy5vYmplY3RzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgbG9hZEFzc2V0cyhhQ2ZnLCBjYWxsYmFjaykge1xuICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmxvYWRpbmdQcm9ncmVzcyA9IDA7XG4gICAgdGhpcy5sb2FkaW5nQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICBpZiAoYUNmZy5pbWFnZXMpIHtcbiAgICAgIHRoaXMuX2xvYWRJbWFnZUFzc2V0cyhhQ2ZnLmltYWdlcywgYUNmZy5pbWFnZUNhbGxiYWNrKTtcbiAgICB9XG4gICAgaWYgKGFDZmcuZm9udHMpIHtcbiAgICAgIHRoaXMuX2xvYWRGb250QXNzZXRzKGFDZmcuZm9udHMpO1xuICAgIH1cbiAgfVxuXG4gIGdldEltYWdlQXNzZXQoYXNzZXROYW1lKSB7XG4gICAgbGV0IGltYWdlcyA9IHRoaXMuYXNzZXRzLmltYWdlcztcblxuICAgIGlmICghaW1hZ2VzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gaW1hZ2VzW2Fzc2V0TmFtZV0ucmVzb3VyY2U7XG4gIH1cblxuICBnZXRGb250QXNzZXQoYXNzZXROYW1lKSB7XG4gICAgbGV0IGZvbnRzID0gdGhpcy5hc3NldHMuZm9udHM7XG5cbiAgICBpZiAoIWZvbnRzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9udHNbYXNzZXROYW1lXS5yZXNvdXJjZTtcbiAgfVxuXG4gIGxvYWRGaWxlKGZpbGVOYW1lKSB7XG4gICAgc3VwZXIubG9hZEZpbGUoZmlsZU5hbWUgfHwgdGhpcy5sZXZlbEZpbGVOYW1lKTtcbiAgfVxuXG4gIF9sb2FkSW1hZ2VBc3NldHMoYXNzZXRDb25maWcsIGFzc2V0Q2FsbGJhY2spIHtcbiAgICBsZXQgaW1hZ2VzID0ge307XG4gICAgbGV0IGNiaCA9IChrZXksIGNhbGxiYWNrKSA9PiB7XG4gICAgICByZXR1cm4gKGV2dCkgPT4ge1xuICAgICAgICB0aGlzLmFzc2V0cy5pbWFnZXNba2V5XS5sb2FkZWQgPSB0cnVlO1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjayhrZXksIGV2dCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKGFzc2V0Q29uZmlnKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGxldCBmaWxlTmFtZSA9IGFzc2V0Q29uZmlnW2tleV07XG4gICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICBpbWcub25sb2FkID0gY2JoKGtleSwgYXNzZXRDYWxsYmFjayk7XG4gICAgICBpbWcuc3JjID0gZmlsZU5hbWU7XG4gICAgICBpbWFnZXNba2V5XSA9IHtcbiAgICAgICAgcmVzb3VyY2U6IGltZyxcbiAgICAgICAgbG9hZGVkOiBmYWxzZVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHRoaXMuYXNzZXRzLmltYWdlcyA9IGltYWdlcztcbiAgfVxuXG4gIF9sb2FkRm9udEFzc2V0cyhhc3NldENvbmZpZykge1xuICAgIGxldCBmb250cyA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMoYXNzZXRDb25maWcpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgbGV0IGNmZyA9IGFzc2V0Q29uZmlnW2tleV07XG4gICAgICBsZXQgZkNscyA9IEZvbnRCdWlsZGVyO1xuICAgICAgaWYgKGNmZy50eXBlID09PSBcInNtYXJ0XCIpIHtcbiAgICAgICAgZkNscyA9IFNtYXJ0Rm9udEJ1aWxkZXI7XG4gICAgICB9XG5cbiAgICAgIGxldCBidWlsZGVyID0gbmV3IGZDbHModGhpcywgY2ZnKTtcbiAgICAgIGZvbnRzW2tleV0gPSB7XG4gICAgICAgIHJlc291cmNlOiBidWlsZGVyLmJ1aWxkKCksXG4gICAgICAgIGxvYWRlZDogdHJ1ZVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHRoaXMuYXNzZXRzLmZvbnRzID0gZm9udHM7XG4gIH1cbn1cbiIsImltcG9ydCBTcHJpdGUgZnJvbSBcIi4vc3ByaXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvbnRTcHJpdGUgZXh0ZW5kcyBTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUsIGxldmVsLCBmb250TmFtZSkge1xuICAgIHN1cGVyKGVuZ2luZSwgbGV2ZWwpO1xuXG4gICAgdGhpcy50ZXh0ID0gXCJcIjtcbiAgICB0aGlzLnRleHRBbGlnbiA9IFwibGVmdFwiO1xuICAgIHRoaXMudGV4dEJhc2VsaW5lID0gXCJib3R0b21cIjtcblxuICAgIGxldCBmYyA9IGxldmVsLmdldEZvbnRBc3NldChmb250TmFtZSk7XG4gICAgdGhpcy5jaGFyV2lkdGggPSBmYy5jaGFyV2lkdGggfHwgODtcbiAgICB0aGlzLmNoYXJIZWlnaHQgPSBmYy5jaGFySGVpZ2h0IHx8IDg7XG4gICAgdGhpcy5jaGFyU3BhY2luZyA9IGZjLmNoYXJTcGFjaW5nIHx8IDA7XG5cbiAgICB0aGlzLmZvbnRDb25maWcgPSBmYztcbiAgfVxuXG4gIGRyYXcoZykge1xuICAgIGxldCBjdyA9IHRoaXMuY2hhcldpZHRoO1xuICAgIGxldCBjaCA9IHRoaXMuY2hhckhlaWdodDtcbiAgICBsZXQgY3MgPSB0aGlzLmNoYXJTcGFjaW5nICsgY3c7XG5cbiAgICBsZXQgeSA9IHRoaXMueSAtIGNoO1xuICAgIGlmICh0aGlzLnRleHRCYXNlbGluZSA9PT0gXCJtaWRkbGVcIikge1xuICAgICAgeSArPSBjaCAvIDI7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRleHRCYXNlbGluZSA9PT0gXCJ0b3BcIikge1xuICAgICAgeSArPSBjaDtcbiAgICB9XG4gICAgeSA9IHkgfCAwO1xuXG4gICAgbGV0IGxlbiA9IHRoaXMudGV4dC5sZW5ndGg7XG4gICAgbGV0IG94ID0gdGhpcy54O1xuICAgIGlmICh0aGlzLnRleHRBbGlnbiA9PT0gXCJjZW50ZXJcIikge1xuICAgICAgb3ggLT0gbGVuICogY3MgLyAyIHwgMDtcbiAgICB9IGVsc2UgaWYgKHRoaXMudGV4dEFsaWduID09PSBcInJpZ2h0XCIpIHtcbiAgICAgIG94IC09IGxlbiAqIGNzIHwgMDtcbiAgICB9XG5cbiAgICBsZXQgcmFuZ2VzID0gdGhpcy5mb250Q29uZmlnLnJhbmdlcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBsZXQgYyA9IHRoaXMudGV4dFtpXS5jaGFyQ29kZUF0KCk7XG5cbiAgICAgIGZvciAobGV0IGogPSAwLCBybGVuID0gcmFuZ2VzLmxlbmd0aDsgaiA8IHJsZW47IGogKz0gMSkge1xuICAgICAgICBsZXQgY2YgPSByYW5nZXNbal07XG5cbiAgICAgICAgbGV0IHggPSBveCArIGkgKiBjcyB8IDA7XG5cbiAgICAgICAgbGV0IHN4ID0gMDtcbiAgICAgICAgbGV0IHN5ID0gMDtcblxuICAgICAgICBpZiAoYyA+PSBjZlswXS5jaGFyQ29kZUF0KCkgJiYgYyA8PSBjZlsxXS5jaGFyQ29kZUF0KCkpIHtcbiAgICAgICAgICBzeCA9IChjIC0gY2ZbMF0uY2hhckNvZGVBdCgpKSAqIGN3O1xuICAgICAgICAgIHN5ID0gaiAqIGNoO1xuICAgICAgICB9XG5cbiAgICAgICAgZy5kcmF3SW1hZ2UodGhpcy5mb250Q29uZmlnLnNwcml0ZVNoZWV0LCBzeCwgc3ksIGN3LCBjaCxcbiAgICAgICAgICAgICAgICAgICAgeCwgeSwgY3csIGNoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEZTT2JqZWN0IHtcbiAgY29uc3RydWN0b3IoZW5naW5lLCBsZXZlbCkge1xuICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xuICAgIHRoaXMubGV2ZWwgPSBsZXZlbDtcbiAgICB0aGlzLnggPSAwO1xuICAgIHRoaXMueSA9IDA7XG4gICAgdGhpcy5yb3RhdGlvbiA9IDA7XG4gICAgdGhpcy53aWR0aCA9IDE2O1xuICAgIHRoaXMuaGVpZ2h0ID0gMTY7XG4gICAgdGhpcy5zcHJpdGVTaGVldCA9IG51bGw7XG4gICAgdGhpcy5zcHJYID0gMDtcbiAgICB0aGlzLnNwclkgPSAwO1xuICB9XG5cbiAgdXBkYXRlKCkge31cblxuICBkcmF3KGcpIHtcbiAgICBpZiAodGhpcy5zcHJpdGVTaGVldCkge1xuICAgICAgbGV0IHcgPSB0aGlzLndpZHRoO1xuICAgICAgbGV0IGggPSB0aGlzLmhlaWdodDtcbiAgICAgIGcuc2F2ZSgpO1xuICAgICAgZy50cmFuc2xhdGUodGhpcy54LCB0aGlzLnkpO1xuICAgICAgZy5yb3RhdGUodGhpcy5yb3RhdGlvbik7XG4gICAgICBnLmRyYXdJbWFnZSh0aGlzLnNwcml0ZVNoZWV0LCB0aGlzLnNwclgsIHRoaXMuc3ByWSwgdywgaCwgLXcgLyAyLCAtaCAvIDIsIHcsIGgpO1xuICAgICAgZy5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgRm9udFNwcml0ZSBmcm9tIFwiLi9mb250LXNwcml0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTbWFydEZvbnRTcHJpdGUgZXh0ZW5kcyBGb250U3ByaXRlIHtcbiAgY29uc3RydWN0b3IoZW5naW5lLCBsZXZlbCwgZm9udE5hbWUpIHtcbiAgICBzdXBlcihlbmdpbmUsIGxldmVsLCBmb250TmFtZSk7XG5cbiAgICBsZXQgZmMgPSB0aGlzLmZvbnRDb25maWc7XG5cbiAgICB0aGlzLmNoYXJTcGFjaW5nID0gZmMuY2hhclNwYWNpbmcgfHwgMDtcbiAgICB0aGlzLnNwYWNlV2lkdGggPSBmYy5zcGFjZVdpZHRoIHx8IDg7XG5cbiAgICB0aGlzLmNoYXJSYW5nZXMgPSBmYy5yYW5nZXM7XG4gIH1cblxuICBkcmF3KGcpIHtcbiAgICBsZXQgY2ggPSB0aGlzLmNoYXJIZWlnaHQ7XG4gICAgbGV0IHggPSB0aGlzLng7XG4gICAgbGV0IHkgPSB0aGlzLnkgLSBjaDtcblxuICAgIGlmICh0aGlzLnRleHRCYXNlbGluZSA9PT0gXCJtaWRkbGVcIikge1xuICAgICAgeSArPSBjaCAvIDI7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRleHRCYXNlbGluZSA9PT0gXCJ0b3BcIikge1xuICAgICAgeSArPSBjaDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy50ZXh0Lmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBsZXQgYyA9IHRoaXMudGV4dFtpXS5jaGFyQ29kZUF0KCk7XG5cbiAgICAgIGxldCBzeCA9IC0xO1xuICAgICAgbGV0IHN5ID0gLTE7XG4gICAgICBsZXQgY3c7XG5cbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuY2hhclJhbmdlcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGxldCBzID0ga2V5WzBdLmNoYXJDb2RlQXQoKTtcbiAgICAgICAgbGV0IGUgPSBrZXlbMl0uY2hhckNvZGVBdCgpO1xuICAgICAgICBpZiAoYyA+PSBzICYmIGMgPD0gZSkge1xuICAgICAgICAgIGxldCBvID0gdGhpcy5jaGFyUmFuZ2VzW2tleV1bYyAtIHNdO1xuXG4gICAgICAgICAgc3ggPSBvLng7XG4gICAgICAgICAgc3kgPSBvLnk7XG4gICAgICAgICAgY3cgPSBvLnc7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoc3ggPj0gMCAmJiBzeSA+PSAwKSB7XG4gICAgICAgIGcuZHJhd0ltYWdlKHRoaXMuZm9udENvbmZpZy5zcHJpdGVTaGVldCwgc3gsIHN5LCBjdywgY2gsIHgsIHksIGN3LCBjaCk7XG4gICAgICAgIHggKz0gY3cgKyB0aGlzLmNoYXJTcGFjaW5nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeCArPSB0aGlzLnNwYWNlV2lkdGggKyB0aGlzLmNoYXJTcGFjaW5nO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IEZTT2JqZWN0IGZyb20gXCIuL2Zzb2JqZWN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwcml0ZSBleHRlbmRzIEZTT2JqZWN0IHtcbiAgY29uc3RydWN0b3IoZW5naW5lLCBsZXZlbCkge1xuICAgIHN1cGVyKGVuZ2luZSwgbGV2ZWwpO1xuXG4gICAgdGhpcy5hbmltYXRpb25zID0ge307XG4gICAgdGhpcy5jdXJyZW50QW5pbSA9IG51bGw7XG4gICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgdGhpcy5zcHJpdGVPbGRUaWNrID0gbnVsbDtcbiAgICB0aGlzLnNwcml0ZVNoZWV0ID0gbnVsbDtcbiAgfVxuXG4gIGNyZWF0ZUFuaW1hdGlvbihuYW1lLCB4LCB5LCBsZW5ndGgsIGRlbGF5LCBjYWxsYmFjaykge1xuICAgIHRoaXMuYW5pbWF0aW9uc1tuYW1lXSA9IHt4LCB5LCBsZW5ndGgsIGRlbGF5LCBjYWxsYmFja307XG4gIH1cblxuICBzZXRBbmltYXRpb24obmFtZSkge1xuICAgIGlmIChuYW1lICE9PSB0aGlzLmN1cnJlbnRBbmltKSB7XG4gICAgICB0aGlzLmN1cnJlbnRBbmltID0gbmFtZTtcbiAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgICAgdGhpcy5zcHJpdGVPbGRUaWNrID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUodGljaywgZGVsdGEpIHtcbiAgICBpZiAodGhpcy5zcHJpdGVPbGRUaWNrID09IG51bGwpIHtcbiAgICAgIHRoaXMuc3ByaXRlT2xkVGljayA9IHRpY2s7XG4gICAgfVxuICAgIHN1cGVyLnVwZGF0ZSh0aWNrLCBkZWx0YSk7XG4gICAgbGV0IGFuaW0gPSB0aGlzLmFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbV07XG4gICAgaWYgKGFuaW0pIHtcbiAgICAgIGxldCBvdGljayA9IHRoaXMuc3ByaXRlT2xkVGljaztcbiAgICAgIGlmIChvdGljayA8IHRpY2sgLSBhbmltLmRlbGF5KSB7XG4gICAgICAgIHRoaXMuZnJhbWUgKz0gMTtcbiAgICAgICAgdGhpcy5yZXNldEZyYW1lKGFuaW0pO1xuICAgICAgICB0aGlzLnNwcml0ZU9sZFRpY2sgPSB0aWNrO1xuICAgICAgfVxuICAgICAgdGhpcy5zcHJYID0gYW5pbS54ICsgdGhpcy5mcmFtZSAqIHRoaXMud2lkdGg7XG4gICAgICB0aGlzLnNwclkgPSBhbmltLnk7XG4gICAgfVxuICB9XG5cbiAgcmVzZXRGcmFtZShhbmltKSB7XG4gICAgaWYgKHRoaXMuZnJhbWUgPj0gYW5pbS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgICAgaWYgKGFuaW0uY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhbmltLmNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBhbmltLmNhbGxiYWNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oYW5pbS5jYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsb2FkU3ByaXRlU2hlZXQoaW1hZ2VOYW1lKSB7XG4gICAgdGhpcy5zcHJpdGVTaGVldCA9IHRoaXMubGV2ZWwuZ2V0SW1hZ2VBc3NldChpbWFnZU5hbWUpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkZXIge1xuICBsb2FkRmlsZShmaWxlTmFtZSkge1xuICAgIGxldCB4aHI7XG5cbiAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKGV2dCkgPT4gdGhpcy5vbnhocihldnQpO1xuICAgIHhoci5vcGVuKFwiR0VUXCIsIGZpbGVOYW1lKTtcbiAgICB4aHIuc2VuZCgpO1xuICB9XG5cbiAgb254aHIoZXZ0KSB7XG4gICAgbGV0IHhocjtcblxuICAgIHhociA9IGV2dC50YXJnZXQ7XG4gICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgPCA0MDApIHtcbiAgICAgIHRoaXMub25Mb2FkZWQoeGhyLnJlc3BvbnNlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZvbnRCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IobGV2ZWwsIGNvbmZpZykge1xuICAgIHRoaXMubGV2ZWwgPSBsZXZlbDtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgfVxuXG4gIGJ1aWxkKCkge1xuICAgIGxldCBjZmcgPSB0aGlzLmNvbmZpZztcblxuICAgIHJldHVybiB7XG4gICAgICBjaGFyU3BhY2luZzogY2ZnLmNoYXJTcGFjaW5nLFxuICAgICAgY2hhcldpZHRoOiBjZmcuY2hhcldpZHRoLFxuICAgICAgY2hhckhlaWdodDogY2ZnLmNoYXJIZWlnaHQsXG4gICAgICBzcHJpdGVTaGVldDogdGhpcy5sZXZlbC5nZXRJbWFnZUFzc2V0KHRoaXMuY29uZmlnLmltYWdlKSxcbiAgICAgIHJhbmdlczogdGhpcy5jb25maWcucmFuZ2VzXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU21hcnRGb250QnVpbGRlciBleHRlbmRzIEZvbnRCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IobGV2ZWwsIGNvbmZpZykge1xuICAgIHN1cGVyKGxldmVsLCBjb25maWcpO1xuICB9XG5cbiAgYnVpbGQoKSB7XG4gICAgbGV0IGNmZyA9IHRoaXMuY29uZmlnO1xuICAgIGxldCBzaGVldCA9IHRoaXMubGV2ZWwuZ2V0SW1hZ2VBc3NldChjZmcuaW1hZ2UpO1xuICAgIGxldCBzaGVldEltYWdlRGF0YSA9IHRoaXMuZ2V0SW1hZ2VEYXRhKHNoZWV0KTtcblxuICAgIHJldHVybiB7XG4gICAgICBjaGFyU3BhY2luZzogY2ZnLmNoYXJTcGFjaW5nLFxuICAgICAgY2hhckhlaWdodDogY2ZnLmNoYXJIZWlnaHQsXG4gICAgICBzcGFjZVdpZHRoOiBjZmcuc3BhY2VXaWR0aCxcbiAgICAgIHNwcml0ZVNoZWV0OiBzaGVldCxcbiAgICAgIHNwcml0ZVNoZWV0SW1hZ2VEYXRhOiBzaGVldEltYWdlRGF0YSxcbiAgICAgIHJhbmdlczogdGhpcy5leHRyYWN0Rm9udFJhbmdlcyhjZmcsIHNoZWV0SW1hZ2VEYXRhKVxuICAgIH07XG4gIH1cblxuICBnZXRJbWFnZURhdGEoc2hlZXQpIHtcbiAgICBsZXQgY3ZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICBsZXQgY3R4ID0gY3ZzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgIGN2cy53aWR0aCA9IHNoZWV0LndpZHRoO1xuICAgIGN2cy5oZWlnaHQgPSBzaGVldC5oZWlnaHQ7XG5cbiAgICBjdHguZHJhd0ltYWdlKHNoZWV0LCAwLCAwKTtcblxuICAgIHJldHVybiBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIHNoZWV0LndpZHRoLCBzaGVldC5oZWlnaHQpO1xuICB9XG5cbiAgZXh0cmFjdEZvbnRSYW5nZXMoY2ZnLCBzaGVldEltYWdlRGF0YSkge1xuICAgIGxldCBjaGFycyA9IHt9O1xuXG4gICAgdGhpcy5zcGFjZVdpZHRoID0gY2ZnLnNwYWNlV2lkdGggfHwgdGhpcy5zcGFjZVdpZHRoO1xuICAgIHRoaXMuY2hhckhlaWdodCA9IGNmZy5jaGFySGVpZ2h0IHx8IHRoaXMuY2hhckhlaWdodDtcbiAgICB0aGlzLmNoYXJTcGFjaW5nID0gY2ZnLmNoYXJTcGFjaW5nIHx8IHRoaXMuY2hhclNwYWNpbmc7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2ZnLnJhbmdlcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgbGV0IHJhbmdlID0gY2ZnLnJhbmdlc1tpXTtcblxuICAgICAgY2hhcnNbcmFuZ2VdID0gdGhpcy5leHRyYWN0Rm9udFJhbmdlKHNoZWV0SW1hZ2VEYXRhLCByYW5nZSwgaSwgbGVuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhcnM7XG4gIH1cblxuICBleHRyYWN0Rm9udFJhbmdlKGlkLCByYW5nZSwgaW5kZXgpIHtcbiAgICBsZXQgY3JhbmdlID0gW107XG4gICAgbGV0IGNoID0gdGhpcy5jaGFySGVpZ2h0O1xuXG4gICAgbGV0IHggPSAwO1xuICAgIGZvciAobGV0IGkgPSByYW5nZVswXS5jaGFyQ29kZUF0KCk7IGkgPD0gcmFuZ2VbMV0uY2hhckNvZGVBdCgpOyBpICs9IDEpIHtcbiAgICAgIGxldCBjID0ge1xuICAgICAgICBjOiBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpLFxuICAgICAgICB4LFxuICAgICAgICB5OiBpbmRleCAqIGNoXG4gICAgICB9O1xuICAgICAgbGV0IGVtcHR5ID0gZmFsc2U7XG4gICAgICB3aGlsZSAoIWVtcHR5KSB7XG4gICAgICAgIGVtcHR5ID0gdGhpcy5pc0xpbmVFbXB0eShpZCwgeCwgaW5kZXggKiBjaCk7XG4gICAgICAgIHggKz0gMTtcbiAgICAgIH1cbiAgICAgIGMudyA9IHggLSAxIC0gYy54O1xuICAgICAgd2hpbGUgKGVtcHR5KSB7XG4gICAgICAgIGVtcHR5ID0gdGhpcy5pc0xpbmVFbXB0eShpZCwgeCwgaW5kZXggKiBjaCk7XG4gICAgICAgIHggKz0gMTtcbiAgICAgIH1cbiAgICAgIHggLT0gMTtcbiAgICAgIGNyYW5nZS5wdXNoKGMpO1xuICAgIH1cblxuICAgIHJldHVybiBjcmFuZ2U7XG4gIH1cblxuICBpc0xpbmVFbXB0eShpZCwgeCwgeSkge1xuICAgIGxldCBlbXB0eSA9IHRydWU7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNoYXJIZWlnaHQ7IGogKz0gMSkge1xuICAgICAgaWYgKCF0aGlzLmlzRW1wdHlBdChpZCwgeCwgeSArIGopKSB7XG4gICAgICAgIGVtcHR5ID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGVtcHR5O1xuICB9XG5cbiAgaXNFbXB0eUF0KGlkLCB4LCB5KSB7XG4gICAgcmV0dXJuIGlkLmRhdGFbKHkgKiBpZC53aWR0aCArIHgpICogNCArIDNdID09PSAwO1xuICB9XG59XG4iLCJpbXBvcnQgRmlnZW5naW5lIGZyb20gXCIuLi9maWdlbmdpbmUvZW5naW5lXCI7XG5pbXBvcnQgRmlnc2hhcmlvTGV2ZWwgZnJvbSBcIi4vbGV2ZWxcIjtcbmltcG9ydCBTY29yZSBmcm9tIFwiLi9vYmplY3RzL3Njb3JlXCI7XG5cbmxldCBLT05BTUlfQ09ERSA9IFtcInVwXCIsIFwidXBcIiwgXCJkb3duXCIsIFwiZG93blwiLCBcImxlZnRcIiwgXCJyaWdodFwiLCBcImxlZnRcIiwgXCJyaWdodFwiLCBcImJ1dHRvbkJcIiwgXCJidXR0b25BXCIsIFwic3RhcnRcIl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpZ3NoYXJpbyBleHRlbmRzIEZpZ2VuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKGNhbnZhcykge1xuICAgIHN1cGVyKGNhbnZhcyk7XG5cbiAgICB0aGlzLmtleUxvZyA9IFtdO1xuICB9XG5cbiAgbG9hZExldmVsKGZpbGVOYW1lKSB7XG4gICAgdGhpcy5sZXZlbCA9IG5ldyBGaWdzaGFyaW9MZXZlbCh0aGlzLCBmaWxlTmFtZSk7XG4gIH1cblxuICBkcmF3T1NEKGcpIHtcbiAgICBpZiAodGhpcy5zY29yZSkge1xuICAgICAgdGhpcy5zY29yZS5kcmF3KGcpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSh0aWNrKSB7XG4gICAgc3VwZXIudXBkYXRlKHRpY2spO1xuXG4gICAgaWYgKHRoaXMuc2NvcmUpIHtcbiAgICAgIHRoaXMuc2NvcmUudXBkYXRlKHRpY2spO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdCYWNrZ3JvdW5kKCkge1xuICAgIGxldCBjID0gdGhpcy5jYW52YXM7XG4gICAgbGV0IGcgPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBsZXQgZ2QgPSBnLmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIGMuaGVpZ2h0KTtcbiAgICBnZC5hZGRDb2xvclN0b3AoMC4wMCwgXCIjODg4ODk5XCIpO1xuICAgIGdkLmFkZENvbG9yU3RvcCgwLjc1LCBcIiNhYWNjZmZcIik7XG4gICAgZ2QuYWRkQ29sb3JTdG9wKDEuMDAsIFwiIzk5OTliYlwiKTtcblxuICAgIGcuZmlsbFN0eWxlID0gZ2Q7XG4gICAgZy5maWxsUmVjdCgwLCAwLCBjLndpZHRoLCBjLmhlaWdodCk7XG4gIH1cblxuICBrZXlVcChrZXkpIHtcbiAgICBzdXBlci5rZXlVcChrZXkpO1xuXG4gICAgaWYgKCF0aGlzLmxldmVsLnBsYXllcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMua2V5TG9nLnB1c2goa2V5KTtcblxuICAgIGlmICh0aGlzLmtleUxvZy5sZW5ndGggPCAxMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMua2V5TG9nID0gdGhpcy5rZXlMb2cuc3BsaWNlKC0xMSwgMTEpO1xuXG4gICAgbGV0IG9rID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgb2sgJiYgaSA8IDExOyBpICs9IDEpIHtcbiAgICAgIGlmICh0aGlzLmtleUxvZ1tpXSAhPT0gS09OQU1JX0NPREVbaV0pIHtcbiAgICAgICAgb2sgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob2spIHtcbiAgICAgIHRoaXMubGV2ZWwucGxheWVyLmZseU1vZGUgPSAhdGhpcy5sZXZlbC5wbGF5ZXIuZmx5TW9kZTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBDb2luLCB7IFN0YXRpY0NvaW4gfSBmcm9tIFwiLi9vYmplY3RzL2NvaW5cIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vb2JqZWN0cy9wbGF5ZXJcIjtcbmltcG9ydCBTY29yZSBmcm9tIFwiLi9vYmplY3RzL3Njb3JlXCI7XG5pbXBvcnQgVGlsZWRMZXZlbCBmcm9tIFwiLi4vdGlsZWRcIjtcblxubGV0IE9CSl9DTEFTU19NQVBQSU5HID0ge1xuICBcImZpZ3BsYXllclwiOiBQbGF5ZXIsXG4gIFwiY29pblwiOiBDb2luLFxuICBcInNjb2luXCI6IFN0YXRpY0NvaW5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpZ3NoYXJpb0xldmVsIGV4dGVuZHMgVGlsZWRMZXZlbCB7XG4gIGNvbnN0cnVjdG9yKGVuZ2luZSwgZmlsZU5hbWUpIHtcbiAgICBzdXBlcihlbmdpbmUsIGZpbGVOYW1lKTtcblxuICAgIHRoaXMubGFzdENvbGxlY3RpYmxlVGljayA9IG51bGw7XG4gICAgdGhpcy5jb2xsZWN0aWJsZURlbGF5ID0gMDtcbiAgICB0aGlzLnBsYXllciA9IG51bGw7XG5cbiAgICB0aGlzLmxvYWRBc3NldHMoe1xuICAgICAgaW1hZ2VzOiB7XG4gICAgICAgIGZpZ3BsYXllcjogXCJhc3NldHMvaW1hZ2VzL2ZpZ3BsYXllci5naWZcIixcbiAgICAgICAgXCJ0aWxlcy1ncmFzc3lcIjogXCJhc3NldHMvaW1hZ2VzL3RpbGVzLWdyYXNzeS5naWZcIixcbiAgICAgICAgY29pbjogXCJhc3NldHMvaW1hZ2VzL2NvaW4uZ2lmXCIsXG4gICAgICAgIHNtYWxsRm9udDogXCJhc3NldHMvaW1hZ2VzL3NtYWxsLmdpZlwiLFxuICAgICAgICBzY29yZUZvbnQ6IFwiYXNzZXRzL2ltYWdlcy9zY29yZS5naWZcIlxuICAgICAgfVxuICAgIH0sICgpID0+IHtcbiAgICAgIHRoaXMubG9hZEFzc2V0cyh7XG4gICAgICAgIGZvbnRzOiB7XG4gICAgICAgICAgZmxvYXR5OiB7XG4gICAgICAgICAgICB0eXBlOiBcInNtYXJ0XCIsXG4gICAgICAgICAgICBpbWFnZTogXCJzbWFsbEZvbnRcIixcbiAgICAgICAgICAgIHNwYWNlV2lkdGg6IDQsXG4gICAgICAgICAgICBjaGFySGVpZ2h0OiAxMCxcbiAgICAgICAgICAgIGNoYXJTcGFjaW5nOiAxLFxuICAgICAgICAgICAgcmFuZ2VzOiBbXG4gICAgICAgICAgICAgIFtcIiFcIiwgXCIhXCJdLFxuICAgICAgICAgICAgICBbXCIwXCIsIFwiOVwiXSxcbiAgICAgICAgICAgICAgW1wiQVwiLCBcIk9cIl0sXG4gICAgICAgICAgICAgIFtcIlBcIiwgXCJaXCJdLFxuICAgICAgICAgICAgICBbXCJhXCIsIFwib1wiXSxcbiAgICAgICAgICAgICAgW1wicFwiLCBcInpcIl1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNjb3JlOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm5vcm1hbFwiLFxuICAgICAgICAgICAgaW1hZ2U6IFwic2NvcmVGb250XCIsXG4gICAgICAgICAgICBjaGFyV2lkdGg6IDE2LFxuICAgICAgICAgICAgY2hhckhlaWdodDogMjQsXG4gICAgICAgICAgICBjaGFyU3BhY2luZzogMSxcbiAgICAgICAgICAgIHJhbmdlczogW1xuICAgICAgICAgICAgICBbXCIwXCIsIFwiOVwiXVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmxvYWRGaWxlKCk7XG4gICAgICAgIHRoaXMuc2NvcmUgPSBuZXcgU2NvcmUodGhpcy5lbmdpbmUsIHRoaXMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGUodGljaywgZGVsdGEpIHtcbiAgICBzdXBlci51cGRhdGUodGljaywgZGVsdGEpO1xuXG4gICAgaWYgKHRoaXMubGFzdENvbGxlY3RpYmxlVGljayA9PSBudWxsIHx8IHRpY2sgLSB0aGlzLmxhc3RDb2xsZWN0aWJsZVRpY2sgPj0gdGhpcy5jb2xsZWN0aWJsZURlbGF5KSB7XG4gICAgICB0aGlzLmdlbmVyYXRlQ29sbGVjdGlibGUoKTtcbiAgICAgIHRoaXMubGFzdENvbGxlY3RpYmxlVGljayA9IHRpY2s7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGxheWVyKSB7XG4gICAgICB0aGlzLmVuZ2luZS5hZGREZWJ1Z0xpbmUoXCJQbGF5ZXI6XCIpO1xuICAgICAgdGhpcy5lbmdpbmUuYWRkRGVidWdMaW5lKGAgIC5wb3NpdGlvbjogJHt0aGlzLnBsYXllci54fcOXJHt0aGlzLnBsYXllci55fWApO1xuICAgICAgbGV0IGh2ID0gdGhpcy5wbGF5ZXIuaG9yaXpWZWwudG9GaXhlZCg0KTtcbiAgICAgIGxldCB2diA9IHRoaXMucGxheWVyLnZlcnRWZWwudG9GaXhlZCg0KTtcbiAgICAgIHRoaXMuZW5naW5lLmFkZERlYnVnTGluZShgICAudmVsb2NpdHk6ICR7aHZ9w5cke3Z2fWApO1xuICAgIH1cbiAgICB0aGlzLmVuZ2luZS5hZGREZWJ1Z0xpbmUoYE9iamVjdHM6ICR7dGhpcy5vYmplY3RzLmxlbmd0aH1gKTtcblxuICAgIGlmICh0aGlzLnNjb3JlKSB7XG4gICAgICB0aGlzLnNjb3JlLnVwZGF0ZSh0aWNrLCBkZWx0YSk7XG4gICAgfVxuICB9XG5cbiAgZHJhdyhnKSB7XG4gICAgc3VwZXIuZHJhdyhnKTtcblxuICAgIGlmICh0aGlzLnNjb3JlKSB7XG4gICAgICB0aGlzLnNjb3JlLmRyYXcoZyk7XG4gICAgfVxuICB9XG5cbiAgZ2VuZXJhdGVDb2xsZWN0aWJsZSgpIHtcbiAgICBsZXQgcyA9IHRoaXMuc29saWRMYXllcjtcbiAgICBpZiAoIXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdyA9IHMud2lkdGggKiBzLnRpbGVXaWR0aDtcbiAgICBsZXQgaCA9IHMuaGVpZ2h0ICogcy50aWxlSGVpZ2h0O1xuICAgIGxldCB4ID0gTWF0aC5yYW5kb20oKSAqIHc7XG4gICAgbGV0IHkgPSBNYXRoLnJhbmRvbSgpICogaDtcbiAgICBsZXQgdGlsZSA9IHMuZ2V0QXQoeCwgeSk7XG5cbiAgICBpZiAoIXRpbGUgfHwgdGlsZS5jdHlwZSA9PT0gXCJlbXB0eVwiKSB7XG4gICAgICBsZXQgYyA9IG5ldyBDb2luKHRoaXMuZW5naW5lLCB0aGlzKTtcbiAgICAgIGMueCA9IHggKyBzLnRpbGVXaWR0aCAvIDI7XG4gICAgICBjLnkgPSB5ICsgcy50aWxlSGVpZ2h0IC8gMjtcblxuICAgICAgdGhpcy5vYmplY3RzLnB1c2goYyk7XG4gICAgfVxuICAgIHRoaXMuY29sbGVjdGlibGVEZWxheSA9IE1hdGgucmFuZG9tKCkgKiA1MDAgKyA1MDAgfCAwO1xuICB9XG5cbiAgY3JlYXRlT2JqZWN0KG9iakRhdGEpIHtcbiAgICBsZXQgb0NscyA9IE9CSl9DTEFTU19NQVBQSU5HW29iakRhdGEubmFtZV07XG5cbiAgICBpZiAob0Nscykge1xuICAgICAgbGV0IG9iaiA9IG5ldyBvQ2xzKHRoaXMuZW5naW5lLCB0aGlzKTtcbiAgICAgIG9iai54ID0gb2JqRGF0YS54ICsgb2JqRGF0YS53aWR0aCAvIDIgfCAwO1xuICAgICAgb2JqLnkgPSBvYmpEYXRhLnkgLSBvYmpEYXRhLmhlaWdodCAvIDIgfCAwO1xuXG4gICAgICBpZiAob2JqRGF0YS5uYW1lID09PSBcImZpZ3BsYXllclwiKSB7XG4gICAgICAgIHRoaXMuZW5naW5lLnNldENhbWVyYShvYmoueCwgb2JqLnksIHRydWUpO1xuICAgICAgICB0aGlzLnBsYXllciA9IG9iajtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vYmplY3RzLnB1c2gob2JqKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBTcHJpdGUgZnJvbSBcIi4uLy4uL2ZpZ2VuZ2luZS9vYmplY3RzL3Nwcml0ZVwiO1xuaW1wb3J0IE1vdmluZ1Nwcml0ZSBmcm9tIFwiLi4vLi4vZmlnc2hhcmlvL29iamVjdHMvbW92aW5nLXNwcml0ZVwiO1xuaW1wb3J0IEZsb2F0eSBmcm9tIFwiLi9mbG9hdHlcIjtcblxubGV0IFdPUkRTID0gYEdvb2QhLCBOaWNlISwgQXdlc29tZSEsIE1hcnZlbG91cyEsIFN1cGVyYiEsIEZhbnRhc3RpYyEsIE9LISwgQnJhdm8hLCBCaW5nbyEsIEthIENoaW5nISwgR3JhbmQhLCBBd29vb2dhISxcbiAgICBIYWhhISwgWWFiYmEgRGFiYmEgRG9vISwgU2Nvb2J5IERvb2J5IERvbyEsIFN1cGVyQ2FsaUZyYWdpbGlzdGljRXhwYWxpZG9jaW91cyEsIFdPVyEsIEdyb292eSEsIEV1cmVrYSEsIEh1cnJheSEsXG4gICAgWWFob28hLCBZZXMhLCBZZWFoISwgQWhhISwgQWJyYWNhZGFicmEhLCBBbGxlbHVpYSEsIEFsb2hhISwgQWxscmlnaHQhLCBBbWVuISwgQXJpZ2h0ISwgWWVhYWFhaCEsIEF5ZSEsXG4gICAgQmEgRGEgQmluZyBCYSBEYSBCb29tISwgQmEgRHVtIFRzcyEsIEJBTkchLCBCYXppbmdhISwgQmxlc3MgWW91ISwgQmxpbWV5ISwgQm9vIFlhISwgQnJhdmlzc2ltbyEsIEJyaW5nIEl0IE9uISxcbiAgICBCdWxscyBFeWUhLCBDaGVja21hdGUhLCBDaGVlcnMhLCBDb25ncmF0cyEsIENvbmdyYXR1bGF0aW9ucyEsIERlcnAhLCBEaWRkbHkgRG9vISwgQm9pbmchLCBEb2luZyEsIEVybWFnZXJkISxcbiAgICBGZWxpY2l0YXRpb25zISwgRmlyZSBpbiB0aGUgSG9sZSEsIEZvIFJlYWwhLCBGbyBTaG8hLCBHZXJvbmltbyEsIEdvbGx5ISwgR29sbHkgR2VlISwgR29vIEdvbyBHYSBHYSEsIEdvbyBHb28hLFxuICAgIEdyYXR6ISwgR3JlYXQhLCBIYWxsZWx1aWFoISwgSGVsbCBZZWFoISwgSGV5YSEsIEhvY3VzIFBvY3VzISwgSG9vcmFoISwgS2EgQm9vbSEsIEthIFBvdyEsIE1lb3chLCBOeWFuLU55YW4hLFxuICAgIE5pY2UgT25lISwgT2ggWWVhaCEsIE9oIE15ISwgT01HISwgT01GRyEsIFJPVEYhLCBST1RGTE9MISwgTE1BTyEsIExNRkFPISwgT29tcGEgTG9vbXBhISwgUGVhY2UhLCBQT1chLCBSb2NrIE9uISxcbiAgICBUaGUgY2FrZSBpcyBhIGxpZSEsIFVVRERMUkxSQkEhLCBPb2ggTGEgTGEhLCBUYSBEYWghLCBWaXZhISwgVm9pbGEhLCBXYXkgdG8gR28hLCBXZWxsIERvbmUhLCBXYXp6dXAhLCBXb28gSG9vISxcbiAgICBXb290ISwgVzAwVCEsIFhPWE8hLCBZb3UgS25vdyBJdCEsIFlvb3BlZSEsIFl1bW15ISwgWk9NRyEsIFpvd2llISwgWlpaISwgWFlaWlkhXG5gLnRyaW0oKS5zcGxpdCgvXFxzKixcXHMqLyk7XG5cbmZ1bmN0aW9uIG1ha2VDb2luTGlrZShvYmopIHtcbiAgb2JqLndpZHRoID0gODtcbiAgb2JqLmhlaWdodCA9IDg7XG4gIG9iai5sb2FkU3ByaXRlU2hlZXQoXCJjb2luXCIpO1xuICBvYmouY3JlYXRlQW5pbWF0aW9uKFwiY3JlYXRlXCIsIDAsIDgsIDgsIDEwMCwgXCJkZWZhdWx0XCIpO1xuICBvYmouY3JlYXRlQW5pbWF0aW9uKFwiZGVmYXVsdFwiLCAwLCAwLCA0LCAxMDApO1xuICBvYmouY3JlYXRlQW5pbWF0aW9uKFwiZGVzdHJveVwiLCAzMiwgMCwgNCwgMTAwKTtcbiAgb2JqLnNldEFuaW1hdGlvbihcImNyZWF0ZVwiKTtcblxuICBvYmouaGl0Ym94ID0ge1xuICAgIGxlZnQ6IC0yLFxuICAgIHVwOiAtMixcbiAgICByaWdodDogMixcbiAgICBkb3duOiAyXG4gIH07XG5cbiAgb2JqLmlzQ29sbGVjdGlibGUgPSB0cnVlO1xuICBvYmouZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBmbG9hdHkgPSBuZXcgRmxvYXR5KHRoaXMuZW5naW5lLCB0aGlzLmxldmVsKTtcbiAgICBmbG9hdHkueCA9IHRoaXMueDtcbiAgICBmbG9hdHkueSA9IHRoaXMueTtcbiAgICBmbG9hdHkudGV4dCA9IFdPUkRTW01hdGgucmFuZG9tKCkgKiBXT1JEUy5sZW5ndGggfCAwXTtcblxuICAgIHRoaXMubGV2ZWwuYWRkT2JqZWN0KGZsb2F0eSk7XG4gICAgdGhpcy5sZXZlbC5yZW1vdmVPYmplY3QodGhpcyk7XG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBTdGF0aWNDb2luIGV4dGVuZHMgU3ByaXRlIHtcbiAgY29uc3RydWN0b3IoZW5naW5lLCBsZXZlbCkge1xuICAgIHN1cGVyKGVuZ2luZSwgbGV2ZWwpO1xuXG4gICAgbWFrZUNvaW5MaWtlKHRoaXMpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvaW4gZXh0ZW5kcyBNb3ZpbmdTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUsIGxldmVsKSB7XG4gICAgc3VwZXIoZW5naW5lLCBsZXZlbCk7XG5cbiAgICBtYWtlQ29pbkxpa2UodGhpcyk7XG4gIH1cbn1cbiIsImltcG9ydCBTbWFydEZvbnRTcHJpdGUgZnJvbSBcIi4uLy4uL2ZpZ2VuZ2luZS9vYmplY3RzL3NtYXJ0LWZvbnQtc3ByaXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb2F0eSBleHRlbmRzIFNtYXJ0Rm9udFNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKGVuZ2luZSwgbGV2ZWwpIHtcbiAgICBzdXBlcihlbmdpbmUsIGxldmVsLCBcImZsb2F0eVwiKTtcblxuICAgIHRoaXMudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcbiAgICB0aGlzLnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG5cbiAgICB0aGlzLmNsaW1iZWQgPSAwO1xuICAgIHRoaXMuYmxpbmtpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmRyYXdNZSA9IHRydWU7XG4gIH1cblxuICB1cGRhdGUodGljaywgZGVsdGEpIHtcbiAgICBsZXQgY2xpbWIgPSBkZWx0YSAqIDI1O1xuICAgIHRoaXMuY2xpbWJlZCArPSBjbGltYjtcbiAgICB0aGlzLnkgLT0gY2xpbWI7XG5cbiAgICBpZiAodGhpcy5jbGltYmVkID4gMzIpIHtcbiAgICAgIHRoaXMuYmxpbmtpbmcgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5jbGltYmVkID49IDQ4KSB7XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICBkcmF3KGcpIHtcbiAgICBpZiAodGhpcy5ibGlua2luZykge1xuICAgICAgdGhpcy5kcmF3TWUgPSAhdGhpcy5kcmF3TWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZHJhd01lKSB7XG4gICAgICBzdXBlci5kcmF3KGcpO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5sZXZlbC5yZW1vdmVPYmplY3QodGhpcyk7XG4gIH1cbn1cbiIsImltcG9ydCBTcHJpdGUgZnJvbSBcIi4uLy4uL2ZpZ2VuZ2luZS9vYmplY3RzL3Nwcml0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3ZpbmdTcHJpdGUgZXh0ZW5kcyBTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUsIGxldmVsKSB7XG4gICAgc3VwZXIoZW5naW5lLCBsZXZlbCk7XG5cbiAgICB0aGlzLmFpcmJvcm5lID0gZmFsc2U7XG4gICAgdGhpcy5zb2xpZEJvdW5jZUZhY3RvciA9IDA7XG4gICAgdGhpcy5ob3JpelZlbCA9IDA7XG4gICAgdGhpcy52ZXJ0VmVsID0gMDtcbiAgICB0aGlzLmZyaWN0aW9uID0gMC45O1xuICAgIHRoaXMuaGl0Ym94ID0gbnVsbDtcbiAgICB0aGlzLmZhbGxTcGVlZCA9IDE1O1xuICB9XG5cbiAgdXBkYXRlKHRpY2ssIGRlbHRhKSB7XG4gICAgc3VwZXIudXBkYXRlKHRpY2ssIGRlbHRhKTtcblxuICAgIHRoaXMuaGFuZGxlTW92ZW1lbnQoZGVsdGEpO1xuICAgIHRoaXMuY2hlY2tDb2xsaXNpb25zKGRlbHRhKTtcbiAgfVxuXG4gIGhhbmRsZU1vdmVtZW50KGRlbHRhKSB7XG4gICAgaWYgKCF0aGlzLmxldmVsLnNvbGlkTGF5ZXIgfHwgIXRoaXMuaGl0Ym94KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy54ICs9IHRoaXMuaG9yaXpWZWwgfCAwO1xuICAgIHRoaXMueSArPSB0aGlzLnZlcnRWZWwgfCAwO1xuXG4gICAgdGhpcy5ob3JpelZlbCAqPSB0aGlzLmZyaWN0aW9uO1xuICAgIGlmIChNYXRoLmFicyh0aGlzLmhvcml6VmVsKSA8IDAuMSkge1xuICAgICAgdGhpcy5ob3JpelZlbCA9IDA7XG4gICAgfVxuICAgIGlmICghdGhpcy5haXJib3JuZSkge1xuICAgICAgaWYgKCF0aGlzLmdldFNvbGlkQXQodGhpcy54LCB0aGlzLnkgKyB0aGlzLmhpdGJveC5kb3duKSkge1xuICAgICAgICB0aGlzLmFpcmJvcm5lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYWlyYm9ybmUpIHtcbiAgICAgIHRoaXMudmVydFZlbCA9IE1hdGgubWluKHRoaXMubGV2ZWwuc29saWRMYXllci50aWxlSGVpZ2h0LCB0aGlzLnZlcnRWZWwgKyB0aGlzLmZhbGxTcGVlZCAqIGRlbHRhKTtcbiAgICB9XG4gIH1cblxuICBjaGVja0NvbGxpc2lvbnMoKSB7XG4gICAgaWYgKCF0aGlzLmxldmVsLnNvbGlkTGF5ZXIgfHwgIXRoaXMuaGl0Ym94KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVW5kZXIgY2VpbGluZ1xuICAgIGxldCB0aWxlID0gdGhpcy5nZXRTb2xpZEF0KHRoaXMueCwgdGhpcy55ICsgdGhpcy5oaXRib3gudXAgKyAxKTtcbiAgICBpZiAodGlsZSAmJiB0aGlzLnZlcnRWZWwgPCAwKSB7XG4gICAgICB0aGlzLnZlcnRWZWwgPSAwO1xuICAgICAgdGhpcy5wb3NpdGlvblVuZGVyU29saWQodGlsZSk7XG4gICAgfVxuXG4gICAgLy8gT24gZ3JvdW5kXG4gICAgdGlsZSA9IHRoaXMuZ2V0U29saWRBdCh0aGlzLngsIHRoaXMueSArIHRoaXMuaGl0Ym94LmRvd24gLSAxKTtcbiAgICBpZiAodGhpcy5haXJib3JuZSAmJiB0aWxlKSB7XG4gICAgICB0aGlzLmFpcmJvcm5lID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy52ZXJ0VmVsID49IDApIHtcbiAgICAgICAgdGhpcy52ZXJ0VmVsID0gMDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbGUpIHtcbiAgICAgIHRoaXMucG9zaXRpb25PblNvbGlkKHRpbGUpO1xuICAgIH1cblxuICAgIC8vIExlZnQgd2FsbFxuICAgIHRpbGUgPSB0aGlzLmdldFNvbGlkQXQodGhpcy54ICsgdGhpcy5oaXRib3gubGVmdCArIDEsIHRoaXMueSk7XG4gICAgaWYgKHRpbGUgJiYgdGlsZS5jdHlwZSA9PT0gXCJzb2xpZFwiKSB7XG4gICAgICB0aGlzLnggPSB0aWxlLnggKyB0aWxlLncgKyB0aGlzLmhpdGJveC5yaWdodDtcbiAgICB9XG5cbiAgICAvLyBSaWdodCB3YWxsXG4gICAgdGlsZSA9IHRoaXMuZ2V0U29saWRBdCh0aGlzLnggKyB0aGlzLmhpdGJveC5yaWdodCAtIDEsIHRoaXMueSk7XG4gICAgaWYgKHRpbGUpIHtcbiAgICAgIHRoaXMueCA9IHRpbGUueCArIHRoaXMuaGl0Ym94LmxlZnQ7XG4gICAgfVxuXG4gICAgLy8gSW5zaWRlIHdhbGxcbiAgICBpZiAodGhpcy5nZXRTb2xpZEF0KHRoaXMueCwgdGhpcy55KSkge1xuICAgICAgdGhpcy5ob3JpelZlbCA9IDA7XG4gICAgICB0aGlzLnZlcnRWZWwgPSAwO1xuICAgIH1cbiAgfVxuXG4gIHBvc2l0aW9uT25Tb2xpZCh0aWxlKSB7XG4gICAgbGV0IGxheWVyID0gdGhpcy5sZXZlbC5zb2xpZExheWVyO1xuICAgIGxldCBkID0gdGhpcy5oaXRib3guZG93bjtcblxuICAgIGlmICghdGlsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB4ID0gdGhpcy54IC0gdGlsZS54IHwgMDtcbiAgICBsZXQgdyA9IGxheWVyLnRpbGVXaWR0aDtcbiAgICBsZXQgYyA9IHRpbGUuY3R5cGU7XG4gICAgaWYgKGMgPT09IFwic29saWRcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55IC0gZCB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlUlVcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55ICsgeCAtIGQgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZUxVXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArIHcgLSB4IC0gZCB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlUlJVMVwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyAodyArIHgpIC8gMiAtIGQgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZVJSVTJcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55ICsgeCAvIDIgLSBkIHwgMDtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFwic2xvcGVSVVUxXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArIHggKiAyIC0gZCB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlUlVVMlwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyB4ICogMiAtIHcgLSBkIHwgMDtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFwic2xvcGVMTFUxXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArIHcgLSB4IC8gMiAtIGQgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZUxMVTJcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55ICsgKHcgLSB4KSAvIDIgLSBkIHwgMDtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFwic2xvcGVMVVUxXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArICh3IC0geCkgKiAyIC0gZCB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlTFVVMlwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyB3IC0geCAqIDIgLSBkIHwgMDtcbiAgICB9XG4gICAgdGhpcy5haXJib3JuZSA9IGZhbHNlO1xuICB9XG5cbiAgcG9zaXRpb25VbmRlclNvbGlkKHRpbGUpIHtcbiAgICBsZXQgbGF5ZXIgPSB0aGlzLmxldmVsLnNvbGlkTGF5ZXI7XG4gICAgbGV0IHUgPSBsYXllci50aWxlSGVpZ2h0IC0gdGhpcy5oaXRib3gudXA7XG5cbiAgICBpZiAoIXRpbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgeCA9IHRoaXMueCAtIHRpbGUueCB8IDA7XG4gICAgbGV0IHcgPSBsYXllci50aWxlV2lkdGg7XG4gICAgbGV0IGMgPSB0aWxlLmN0eXBlO1xuICAgIGlmIChjID09PSBcInNvbGlkXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArIHUgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZUxEXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArIHggKyB1IHwgMDtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFwic2xvcGVSRFwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyB3IC0geCArIHUgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZUxMRDFcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55ICsgKHcgKyB4KSAvIDIgKyB1IHwgMDtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFwic2xvcGVMTEQyXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArIHggLyAyICsgdSB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlTEREMVwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyB4ICogMiArIHUgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZUxERDJcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55ICsgeCAqIDIgLSB3ICsgdSB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlUlJEMVwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyB3IC0geCAvIDIgKyB1IHwgMDtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFwic2xvcGVSUkQyXCIpIHtcbiAgICAgIHRoaXMueSA9IHRpbGUueSArICh3IC0geCkgLyAyICsgdSB8IDA7XG4gICAgfSBlbHNlIGlmIChjID09PSBcInNsb3BlUkREMVwiKSB7XG4gICAgICB0aGlzLnkgPSB0aWxlLnkgKyAodyAtIHgpICogMiArIHUgfCAwO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJzbG9wZVJERDJcIikge1xuICAgICAgdGhpcy55ID0gdGlsZS55ICsgdyAtIHggKiAyICsgdSB8IDA7XG4gICAgfVxuICAgIHRoaXMuYWlyYm9ybmUgPSBmYWxzZTtcbiAgfVxuXG4gIGdldFNvbGlkQXQocG9pbnRYLCBwb2ludFkpIHtcbiAgICBsZXQgdGlsZSA9IHRoaXMubGV2ZWwuc29saWRMYXllci5nZXRBdChwb2ludFgsIHBvaW50WSk7XG5cbiAgICBpZiAodGlsZSkge1xuICAgICAgbGV0IGMgPSB0aWxlLmN0eXBlO1xuICAgICAgbGV0IHggPSBwb2ludFggLSB0aWxlLnggfCAwO1xuICAgICAgbGV0IHkgPSBwb2ludFkgLSB0aWxlLnkgfCAwO1xuICAgICAgbGV0IHcgPSB0aGlzLmxldmVsLnNvbGlkTGF5ZXIudGlsZVdpZHRoO1xuXG4gICAgICBsZXQgY29uZGl0aW9ucyA9IFtjID09PSBcInNvbGlkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjID09PSBcInNsb3BlUlVcIiAmJiB5ID49IHgsXG4gICAgICAgICAgICAgICAgICAgICAgICBjID09PSBcInNsb3BlTFVcIiAmJiB5ID49IHcgLSB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9PT0gXCJzbG9wZVJSVTFcIiAmJiB5ID49ICh4ICsgdykgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9PT0gXCJzbG9wZVJSVTJcIiAmJiB5ID49IHggLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9PT0gXCJzbG9wZVJVVTFcIiAmJiB5ID49IHggKiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9PT0gXCJzbG9wZVJVVTJcIiAmJiB5ID49IHggKiAyIC0gdyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPT09IFwic2xvcGVMTFUxXCIgJiYgeSA+PSB3IC0geCAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjID09PSBcInNsb3BlTExVMlwiICYmIHkgPj0gKHcgLSB4KSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjID09PSBcInNsb3BlTFVVMVwiICYmIHkgPj0gKHcgLSB4KSAqIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjID09PSBcInNsb3BlTFVVMlwiICYmIHkgPj0gdyAtIHggKiAyXTtcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNvbmRpdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGNvbmRpdGlvbnNbaV0pIHtcbiAgICAgICAgICByZXR1cm4gdGlsZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IE1vdmluZ1Nwcml0ZSBmcm9tIFwiLi9tb3Zpbmctc3ByaXRlXCI7XG5cbmxldCBDT0xMRUNUSU9OX1BST1hJTUlUWSA9IDE2O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBNb3ZpbmdTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUsIGxldmVsKSB7XG4gICAgc3VwZXIoZW5naW5lLCBsZXZlbCk7XG5cbiAgICB0aGlzLndpZHRoID0gMzI7XG4gICAgdGhpcy5oZWlnaHQgPSA0MDtcbiAgICB0aGlzLmhpdGJveCA9IHtcbiAgICAgIGxlZnQ6IC00LFxuICAgICAgdXA6IC0xMixcbiAgICAgIHJpZ2h0OiA0LFxuICAgICAgZG93bjogMTJcbiAgICB9O1xuXG4gICAgdGhpcy5sb2FkU3ByaXRlU2hlZXQoXCJmaWdwbGF5ZXJcIik7XG4gICAgdGhpcy5jcmVhdGVBbmltYXRpb24oXCJsb29rUmlnaHRcIiwgMCwgMCwgMiwgMjUwKTtcbiAgICB0aGlzLmNyZWF0ZUFuaW1hdGlvbihcImxvb2tMZWZ0XCIsIDAsIDQwLCAyLCAyNTApO1xuICAgIHRoaXMuY3JlYXRlQW5pbWF0aW9uKFwid2Fsa1JpZ2h0XCIsIDY0LCAwLCA0LCAxMDApO1xuICAgIHRoaXMuY3JlYXRlQW5pbWF0aW9uKFwid2Fsa0xlZnRcIiwgNjQsIDQwLCA0LCAxMDApO1xuICAgIHRoaXMuc2V0QW5pbWF0aW9uKFwibG9va1JpZ2h0XCIpO1xuXG4gICAgdGhpcy5kaXJlY3Rpb24gPSBcInJpZ2h0XCI7XG4gICAgdGhpcy5haXJib3JuZSA9IGZhbHNlO1xuICAgIHRoaXMuZGlyZWN0aW9uUHJlc3NlZCA9IGZhbHNlO1xuICAgIHRoaXMuanVtcFN0aWxsUHJlc3NlZCA9IGZhbHNlO1xuICAgIHRoaXMuaG9yaXpWZWwgPSAwO1xuICAgIHRoaXMudmVydFZlbCA9IDA7XG4gICAgdGhpcy5mbHlNb2RlID0gZmFsc2U7XG4gICAgdGhpcy5jb2luQ291bnQgPSAwO1xuXG4gICAgdGhpcy50b0NvbGxlY3QgPSBbXTtcbiAgfVxuXG4gIHVwZGF0ZSh0aWNrLCBkZWx0YSkge1xuICAgIHN1cGVyLnVwZGF0ZSh0aWNrLCBkZWx0YSk7XG5cbiAgICBpZiAodGhpcy5mbHlNb2RlKSB7XG4gICAgICB0aGlzLmhhbmRsZUZseU1vZGVLZXlzKGRlbHRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYW5kbGVLZXlzKGRlbHRhKTtcbiAgICB9XG4gICAgdGhpcy5jaG9vc2VBbmltYXRpb24oKTtcbiAgICB0aGlzLmhhbmRsZUNvbGxlY3RpbmcoKTtcblxuICAgIHRoaXMudXBkYXRlQ2FtZXJhKCk7XG4gIH1cblxuICBjaGVja0NvbGxpc2lvbnMoZGVsdGEpIHtcbiAgICBpZiAoIXRoaXMuZmx5TW9kZSkge1xuICAgICAgc3VwZXIuY2hlY2tDb2xsaXNpb25zKGRlbHRhKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5sZXZlbC5vYmplY3RzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBsZXQgb2JqID0gdGhpcy5sZXZlbC5vYmplY3RzW2ldO1xuXG4gICAgICBpZiAob2JqLmlzQ29sbGVjdGlibGUgJiYgdGhpcy5jbG9zZVRvKG9iaiwgQ09MTEVDVElPTl9QUk9YSU1JVFkpIHx8IG9iai55ID4gMTAwMDApIHtcbiAgICAgICAgdGhpcy5jb2xsZWN0KG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRmx5TW9kZUtleXMoZGVsdGEpIHtcbiAgICB0aGlzLmRpcmVjdGlvblByZXNzZWQgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5lbmdpbmUuaXNQcmVzc2VkKFwicmlnaHRcIikpIHtcbiAgICAgIHRoaXMuZGlyZWN0aW9uID0gXCJyaWdodFwiO1xuICAgICAgdGhpcy5kaXJlY3Rpb25QcmVzc2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuaG9yaXpWZWwgKz0gODAgKiBkZWx0YTtcbiAgICAgIHRoaXMuaG9yaXpWZWwgPSBNYXRoLm1pbihNYXRoLm1heCh0aGlzLmhvcml6VmVsLCAxKSwgOCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmVuZ2luZS5pc1ByZXNzZWQoXCJsZWZ0XCIpKSB7XG4gICAgICB0aGlzLmRpcmVjdGlvbiA9IFwibGVmdFwiO1xuICAgICAgdGhpcy5kaXJlY3Rpb25QcmVzc2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuaG9yaXpWZWwgLT0gODAgKiBkZWx0YTtcbiAgICAgIHRoaXMuaG9yaXpWZWwgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLmhvcml6VmVsLCAtMSksIC04KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZW5naW5lLmlzUHJlc3NlZChcInVwXCIpKSB7XG4gICAgICB0aGlzLmRpcmVjdGlvblByZXNzZWQgPSB0cnVlO1xuICAgICAgdGhpcy52ZXJ0VmVsIC09IDgwICogZGVsdGE7XG4gICAgICB0aGlzLnZlcnRWZWwgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLnZlcnRWZWwsIC0xKSwgLTgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5lbmdpbmUuaXNQcmVzc2VkKFwiZG93blwiKSkge1xuICAgICAgdGhpcy5kaXJlY3Rpb25QcmVzc2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMudmVydFZlbCArPSA4MCAqIGRlbHRhO1xuICAgICAgdGhpcy52ZXJ0VmVsID0gTWF0aC5taW4oTWF0aC5tYXgodGhpcy52ZXJ0VmVsLCAxKSwgOCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW92ZW1lbnQoZGVsdGEpIHtcbiAgICBpZiAodGhpcy5mbHlNb2RlKSB7XG4gICAgICB0aGlzLnggKz0gdGhpcy5ob3JpelZlbCB8IDA7XG4gICAgICB0aGlzLnkgKz0gdGhpcy52ZXJ0VmVsIHwgMDtcbiAgICAgIGlmIChNYXRoLmFicyh0aGlzLmhvcml6VmVsKSA8IDAuMSkge1xuICAgICAgICB0aGlzLmhvcml6VmVsID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRoLmFicyh0aGlzLnZlcnRWZWwpIDwgMC4xKSB7XG4gICAgICAgIHRoaXMudmVydFZlbCA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1cGVyLmhhbmRsZU1vdmVtZW50KGRlbHRhKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlzKGRlbHRhKSB7XG4gICAgdGhpcy5kaXJlY3Rpb25QcmVzc2VkID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuZW5naW5lLmlzUHJlc3NlZChcInJpZ2h0XCIpKSB7XG4gICAgICB0aGlzLmRpcmVjdGlvbiA9IFwicmlnaHRcIjtcbiAgICAgIHRoaXMuZGlyZWN0aW9uUHJlc3NlZCA9IHRydWU7XG5cbiAgICAgIHRoaXMuaG9yaXpWZWwgKz0gMjAgKiBkZWx0YTtcbiAgICAgIHRoaXMuaG9yaXpWZWwgPSBNYXRoLm1pbih0aGlzLmhvcml6VmVsLCA4KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZW5naW5lLmlzUHJlc3NlZChcImxlZnRcIikpIHtcbiAgICAgIHRoaXMuZGlyZWN0aW9uID0gXCJsZWZ0XCI7XG4gICAgICB0aGlzLmRpcmVjdGlvblByZXNzZWQgPSB0cnVlO1xuXG4gICAgICB0aGlzLmhvcml6VmVsIC09IDIwICogZGVsdGE7XG4gICAgICB0aGlzLmhvcml6VmVsID0gTWF0aC5tYXgodGhpcy5ob3JpelZlbCwgLTgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVuZ2luZS5pc1ByZXNzZWQoXCJidXR0b25BXCIpICYmICF0aGlzLmp1bXBTdGlsbFByZXNzZWQgJiYgIXRoaXMuYWlyYm9ybmUpIHtcbiAgICAgIHRoaXMudmVydFZlbCA9IC01LjU7XG4gICAgICB0aGlzLmFpcmJvcm5lID0gdHJ1ZTtcbiAgICAgIHRoaXMuanVtcFN0aWxsUHJlc3NlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmVuZ2luZS5pc1ByZXNzZWQoXCJidXR0b25BXCIpKSB7XG4gICAgICB0aGlzLmp1bXBTdGlsbFByZXNzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjaG9vc2VBbmltYXRpb24oKSB7XG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uUHJlc3NlZCkge1xuICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oXCJ3YWxrUmlnaHRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldEFuaW1hdGlvbihcIndhbGtMZWZ0XCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFwicmlnaHRcIikge1xuICAgICAgICB0aGlzLnNldEFuaW1hdGlvbihcImxvb2tSaWdodFwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKFwibG9va0xlZnRcIik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvc2VUbyhpdGVtLCBkaXN0YW5jZSkge1xuICAgIGlmIChpdGVtID09PSB0aGlzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgZHggPSBpdGVtLnggLSB0aGlzLng7XG4gICAgbGV0IGR5ID0gaXRlbS55IC0gdGhpcy55O1xuXG4gICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSkgPD0gZGlzdGFuY2U7XG4gIH1cblxuICBjb2xsZWN0KGl0ZW0pIHtcbiAgICBpdGVtLmlzQ29sbGVjdGlibGUgPSBmYWxzZTtcbiAgICB0aGlzLnRvQ29sbGVjdC5wdXNoKGl0ZW0pO1xuICAgIGl0ZW0udmVydFZlbCA9IDA7XG4gICAgaXRlbS5zZXRBbmltYXRpb24oXCJkZXN0cm95XCIpO1xuICAgIHRoaXMuY29pbkNvdW50ICs9IDE7XG4gIH1cblxuICBpc09uQW55U29saWQodGlsZSkge1xuICAgIHJldHVybiB0aWxlICYmICh0aWxlLmN0eXBlID09PSBcInNvbGlkXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc09uU2xhbnRSaWdodCh0aWxlKSB8fFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzT25TbGFudExlZnQodGlsZSkpO1xuICB9XG5cbiAgaXNPblNsYW50UmlnaHQodGlsZSkge1xuICAgIGlmICh0aWxlLmN0eXBlID09PSBcInNsb3BlUlVcIikge1xuICAgICAgbGV0IHggPSB0aGlzLnggKyAxNiAtIHRpbGUueCB8IDA7XG4gICAgICBsZXQgeSA9IHRoaXMueSArIDMyIC0gdGlsZS55IHwgMDtcblxuICAgICAgaWYgKHkgPj0geCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc09uU2xhbnRMZWZ0KHRpbGUpIHtcbiAgICBpZiAodGlsZS5jdHlwZSA9PT0gXCJzbG9wZUxVXCIpIHtcbiAgICAgIGxldCB4ID0gdGhpcy54ICsgMTYgLSB0aWxlLnggfCAwO1xuICAgICAgbGV0IHkgPSB0aGlzLnkgKyAzMiAtIHRpbGUueSB8IDA7XG5cbiAgICAgIGlmICh5ID49IDE1IC0geCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBoYW5kbGVDb2xsZWN0aW5nKCkge1xuICAgIGxldCByYXRpbyA9IDAuMjtcbiAgICBsZXQgdG9SZW1vdmUgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b0NvbGxlY3QubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGxldCBvYmogPSB0aGlzLnRvQ29sbGVjdFtpXTtcblxuICAgICAgb2JqLnggLT0gKG9iai54IC0gdGhpcy54KSAqIHJhdGlvO1xuICAgICAgb2JqLnkgLT0gKG9iai55IC0gdGhpcy55KSAqIHJhdGlvO1xuXG4gICAgICBpZiAodGhpcy5jbG9zZVRvKG9iaiwgOCkpIHtcbiAgICAgICAgb2JqLmRlc3Ryb3koKTtcbiAgICAgICAgdG9SZW1vdmUucHVzaChvYmopO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9SZW1vdmUubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIHRoaXMudG9Db2xsZWN0LnNwbGljZSh0aGlzLnRvQ29sbGVjdC5pbmRleE9mKHRvUmVtb3ZlW2ldKSwgMSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ2FtZXJhKCkge1xuICAgIGxldCBvZmZzZXQ7XG5cbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFwicmlnaHRcIikge1xuICAgICAgb2Zmc2V0ID0gNDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9mZnNldCA9IC00MDtcbiAgICB9XG5cbiAgICB0aGlzLmVuZ2luZS5zZXRDYW1lcmEodGhpcy54ICsgdGhpcy53aWR0aCAvIDIgKyBvZmZzZXQsIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMik7XG4gIH1cblxuICBkcmF3KGcpIHtcbiAgICBzdXBlci5kcmF3KGcpO1xuICAgIGlmICh0aGlzLmVuZ2luZS5kZWJ1Z0VuYWJsZWQpIHtcbiAgICAgIHRoaXMuZW5naW5lLmFkZFRvcFJpZ2h0RGVidWdMaW5lKGBBaXJib3JuZTogJHt0aGlzLmFpcmJvcm5lfWApO1xuICAgICAgZy5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCA2NCwgMTkyLCAwLjMzKVwiO1xuICAgICAgZy5maWxsUmVjdCh0aGlzLnggKyB0aGlzLmhpdGJveC5sZWZ0LCB0aGlzLnkgKyB0aGlzLmhpdGJveC51cCxcbiAgICAgICAgICAgICAgICAgdGhpcy5oaXRib3gucmlnaHQgLSB0aGlzLmhpdGJveC5sZWZ0LCB0aGlzLmhpdGJveC5kb3duIC0gdGhpcy5oaXRib3gudXApO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IEZvbnRTcHJpdGUgZnJvbSBcIi4uLy4uL2ZpZ2VuZ2luZS9vYmplY3RzL2ZvbnQtc3ByaXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JlIGV4dGVuZHMgRm9udFNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKGVuZ2luZSwgbGV2ZWwpIHtcbiAgICBzdXBlcihlbmdpbmUsIGxldmVsLCBcInNjb3JlXCIpO1xuXG4gICAgdGhpcy50ZXh0QWxpZ24gPSBcInJpZ2h0XCI7XG4gICAgdGhpcy50ZXh0QmFzZWxpbmUgPSBcInRvcFwiO1xuICAgIHRoaXMueCA9IHRoaXMuZW5naW5lLnZpZXdwb3J0V2lkdGggLyAyIC0gOCB8IDA7XG4gICAgdGhpcy55ID0gLXRoaXMuZW5naW5lLnZpZXdwb3J0SGVpZ2h0IC8gMiArIDggfCAwO1xuICAgIHRoaXMub3BhY2l0eSA9IDE7XG4gICAgdGhpcy5vbGRDb2luQ291bnQgPSBudWxsO1xuICAgIHRoaXMuY2hhbmdlVGljayA9IG51bGw7XG4gIH1cblxuICB1cGRhdGUodGljaykge1xuICAgIGlmICghdGhpcy5lbmdpbmUubGV2ZWwgfHwgIXRoaXMuZW5naW5lLmxldmVsLnBsYXllcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjb2luQ291bnQgPSB0aGlzLmxldmVsLnBsYXllci5jb2luQ291bnQ7XG4gICAgaWYgKGNvaW5Db3VudCAhPSB0aGlzLm9sZENvaW5Db3VudCB8fCB0aGlzLmNoYW5nZVRpY2sgPT0gbnVsbCkge1xuICAgICAgdGhpcy50ZXh0ID0gYCR7Y29pbkNvdW50ICogMTAwfWA7XG4gICAgICB0aGlzLmNoYW5nZVRpY2sgPSB0aWNrO1xuICAgICAgdGhpcy5vcGFjaXR5ID0gMTtcbiAgICAgIHRoaXMub2xkQ29pbkNvdW50ID0gY29pbkNvdW50O1xuICAgIH1cblxuICAgIGlmICh0aWNrID49IHRoaXMuY2hhbmdlVGljayArIDMwMDApIHtcbiAgICAgIGlmICh0aGlzLm9wYWNpdHkgPiAwLjUpIHtcbiAgICAgICAgdGhpcy5vcGFjaXR5IC09IDAuMDE7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZHJhdyhnKSB7XG4gICAgZy5zYXZlKCk7XG4gICAgZy5nbG9iYWxBbHBoYSA9IHRoaXMub3BhY2l0eTtcbiAgICBzdXBlci5kcmF3KGcpO1xuICAgIGcucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgRmlnc2hhcmlvIGZyb20gXCIuL2ZpZ3NoYXJpby9maWdzaGFyaW9cIjtcblxubGV0IHZpZXdwb3J0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWV3cG9ydFwiKTtcbmxldCBmaWdzaGFyaW8gPSBuZXcgRmlnc2hhcmlvKHZpZXdwb3J0KTtcblxuZmlnc2hhcmlvLnN0YXJ0KCk7XG5maWdzaGFyaW8ubG9hZExldmVsKFwiYXNzZXRzL21hcHMvbGV2ZWwxYi5qc29uXCIpO1xuXG5sZXQgS0VZX1RSQU5TTEFUSU9OUyA9IHtcbiAgMzc6IFwibGVmdFwiLFxuICAzODogXCJ1cFwiLFxuICAzOTogXCJyaWdodFwiLFxuICA0MDogXCJkb3duXCIsXG4gIDEzOiBcInN0YXJ0XCIsXG4gIDE3OiBcImJ1dHRvbkJcIixcbiAgMzI6IFwiYnV0dG9uQVwiLFxuICAxMTQ6IFwiZGVidWdcIlxufTtcblxuZnVuY3Rpb24gaGFuZGxlS2V5KGV2dCkge1xuICByZXR1cm4gS0VZX1RSQU5TTEFUSU9OU1tldnQua2V5Q29kZV07XG59XG5cbmZ1bmN0aW9uIHJlc2l6ZSgpIHtcbiAgZmlnc2hhcmlvLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxucmVzaXplKCk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCByZXNpemUpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldnQpID0+IHtcbiAgbGV0IGtleTtcblxuICBrZXkgPSBoYW5kbGVLZXkoZXZ0KTtcblxuICBpZiAoa2V5KSB7XG4gICAgZmlnc2hhcmlvLmtleURvd24oa2V5KTtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxufSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChldnQpID0+IHtcbiAgbGV0IGtleTtcblxuICBpZiAoZXZ0LmtleUNvZGUgPT09IDEyMSkge1xuICAgIGZpZ3NoYXJpby5zdG9wKCk7XG4gIH1cbiAga2V5ID0gaGFuZGxlS2V5KGV2dCk7XG5cbiAgaWYgKGtleSkge1xuICAgIGZpZ3NoYXJpby5rZXlVcChrZXkpO1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG59KTtcbiIsImltcG9ydCBMYXllciBmcm9tIFwiLi9maWdlbmdpbmUvbGF5ZXJcIjtcbmltcG9ydCBMZXZlbCBmcm9tIFwiLi9maWdlbmdpbmUvbGV2ZWxcIjtcblxuY2xhc3MgVGlsZWRMYXllciBleHRlbmRzIExheWVyIHtcbiAgZmluZFRpbGVzZXQodGlsZXNldHMsIHRpbGVJbmRleCkge1xuICAgIGxldCBvdXRwdXQgPSBudWxsO1xuICAgIGxldCB0b3BHaWQgPSBudWxsO1xuICAgIGlmICh0aWxlSW5kZXggPiAwKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGlsZXNldHMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgbGV0IHRpbGVzZXQgPSB0aWxlc2V0c1tpXTtcbiAgICAgICAgaWYgKHRpbGVJbmRleCA+PSB0aWxlc2V0LmZpcnN0Z2lkICYmICghdG9wR2lkIHx8IHRpbGVzZXQuZmlyc3RnaWQgPiB0b3BHaWQpKSB7XG4gICAgICAgICAgb3V0cHV0ID0gdGlsZXNldDtcbiAgICAgICAgICB0b3BHaWQgPSB0aWxlc2V0LmZpcnN0Z2lkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIHdhdGNoVGlsZXNldCh0aWxlc2V0KSB7XG4gICAgaWYgKCF0aWxlc2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMudGlsZXNldHMubGVuZ3RoOyAhZm91bmQgJiYgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBpZiAodGlsZXNldCA9PT0gdGhpcy50aWxlc2V0c1tpXSkge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZm91bmQpIHtcbiAgICAgIHRoaXMudGlsZXNldHMucHVzaCh0aWxlc2V0KTtcbiAgICB9XG4gIH1cblxuICBsb2FkVGlsZWRMYXllckRhdGEodGlsZXNldHMsIGxheWVyRGF0YSkge1xuICAgIHRoaXMud2lkdGggPSBsYXllckRhdGEud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBsYXllckRhdGEuaGVpZ2h0O1xuICAgIGlmIChsYXllckRhdGEucHJvcGVydGllcyAmJiBsYXllckRhdGEucHJvcGVydGllcy50eXBlID09PSBcInBsYXlmaWVsZFwiKSB7XG4gICAgICB0aGlzLmlzU29saWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMudGlsZXNldHMgPSBbXTtcbiAgICBsZXQgdGlsZXMgPSBbXTtcbiAgICBmb3IgKGxldCB5ID0gMCwgeWxlbiA9IHRoaXMuaGVpZ2h0OyB5IDwgeWxlbjsgeSArPSAxKSB7XG4gICAgICB0aWxlcy5wdXNoKFtdKTtcbiAgICAgIGZvciAobGV0IHggPSAwLCB4bGVuID0gdGhpcy53aWR0aDsgeCA8IHhsZW47IHggKz0gMSkge1xuICAgICAgICBsZXQgdGlsZSA9IG51bGw7XG4gICAgICAgIGxldCB0aWxlSW5kZXggPSBsYXllckRhdGEuZGF0YVt5ICogdGhpcy53aWR0aCArIHhdO1xuICAgICAgICBsZXQgdGlsZXNldCA9IHRoaXMuZmluZFRpbGVzZXQodGlsZXNldHMsIHRpbGVJbmRleCk7XG5cbiAgICAgICAgdGhpcy53YXRjaFRpbGVzZXQodGlsZXNldCk7XG5cbiAgICAgICAgaWYgKHRpbGVJbmRleCAmJiB0aWxlc2V0KSB7XG4gICAgICAgICAgbGV0IHR3aWR0aCA9IHRpbGVzZXQudGlsZXdpZHRoO1xuICAgICAgICAgIGxldCB0aGVpZ2h0ID0gdGlsZXNldC50aWxlaGVpZ2h0O1xuXG4gICAgICAgICAgbGV0IHByb3BzID0gdGlsZXNldC50aWxlcHJvcGVydGllc1t0aWxlSW5kZXggLSB0aWxlc2V0LmZpcnN0Z2lkXTtcbiAgICAgICAgICBsZXQgY3R5cGUgPSBwcm9wcyA/IHByb3BzLmN0eXBlIDogbnVsbDtcbiAgICAgICAgICBsZXQgY2VsbHNYID0gdGlsZXNldC5pbWFnZXdpZHRoIC8gdHdpZHRoIHwgMDtcbiAgICAgICAgICBsZXQgb2Zmc2V0ID0gdGlsZUluZGV4IC0gdGlsZXNldC5maXJzdGdpZDtcblxuICAgICAgICAgIHRpbGUgPSB7XG4gICAgICAgICAgICB4OiB4ICogdHdpZHRoLFxuICAgICAgICAgICAgeTogeSAqIHRoZWlnaHQsXG4gICAgICAgICAgICB3OiB0d2lkdGgsXG4gICAgICAgICAgICBoOiB0aGVpZ2h0LFxuICAgICAgICAgICAgc3g6IG9mZnNldCAlIGNlbGxzWCAqIHR3aWR0aCxcbiAgICAgICAgICAgIHN5OiAob2Zmc2V0IC8gY2VsbHNYIHwgMCkgKiB0aGVpZ2h0LFxuICAgICAgICAgICAgaW1nOiB0aWxlc2V0LmltYWdlLFxuICAgICAgICAgICAgY3R5cGVcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdGlsZXNbeV1beF0gPSB0aWxlO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnRpbGVzID0gdGlsZXM7XG4gICAgdGhpcy5idWlsZEJhY2tncm91bmQoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWxlZExldmVsIGV4dGVuZHMgTGV2ZWwge1xuICBsb2FkTGV2ZWxEYXRhKGRhdGEpIHtcbiAgICBjb25zb2xlLmRlYnVnKGRhdGEpO1xuICAgIGxldCB0aWxlc2V0cyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBkYXRhLnRpbGVzZXRzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBsZXQgdGlsZXNldCA9IGRhdGEudGlsZXNldHNbaV07XG4gICAgICBsZXQgaW1hZ2VTcmMgPSB0aWxlc2V0LmltYWdlO1xuICAgICAgdGlsZXNldC5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgdGlsZXNldC5pbWFnZS5vbmxvYWQgPSAoKSA9PiBkYXRhLnRpbGVzZXRzW2ldLmxvYWRlZCA9IHRydWU7XG4gICAgICB0aWxlc2V0LmltYWdlLnNyYyA9IGltYWdlU3JjO1xuICAgICAgdGlsZXNldHMucHVzaCh0aWxlc2V0KTtcbiAgICB9XG5cbiAgICBsZXQgbGF5ZXJzID0gW107XG4gICAgZm9yIChsZXQgaiA9IDAsIGpsZW4gPSBkYXRhLmxheWVycy5sZW5ndGg7IGogPCBqbGVuOyBqICs9IDEpIHtcbiAgICAgIGxldCBsYXllckRhdGEgPSBkYXRhLmxheWVyc1tqXTtcbiAgICAgIGlmIChsYXllckRhdGEudHlwZSA9PT0gXCJ0aWxlbGF5ZXJcIikge1xuICAgICAgICBsZXQgbGF5ZXIgPSBuZXcgVGlsZWRMYXllcih0aGlzLmVuZ2luZSwgZGF0YS50aWxld2lkdGgsIGRhdGEudGlsZWhlaWdodCk7XG4gICAgICAgIGxheWVyLmxvYWRUaWxlZExheWVyRGF0YSh0aWxlc2V0cywgbGF5ZXJEYXRhKTtcbiAgICAgICAgaWYgKGxheWVyLmlzU29saWQpIHtcbiAgICAgICAgICB0aGlzLnNvbGlkTGF5ZXIgPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgICBsYXllcnMucHVzaChsYXllcik7XG4gICAgICB9IGVsc2UgaWYgKGxheWVyRGF0YS50eXBlID09PSBcIm9iamVjdGdyb3VwXCIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxheWVyRGF0YS5vYmplY3RzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVPYmplY3QobGF5ZXJEYXRhLm9iamVjdHNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubGF5ZXJzID0gbGF5ZXJzO1xuICB9XG59XG4iXX0=
