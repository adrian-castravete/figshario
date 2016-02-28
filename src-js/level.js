import { Layer } from './layer';
import { Player, Coin } from './objects';
import { Loader } from './util';

export class Level extends Loader {
  constructor(engine, fileName) {
    super();

    this.engine = engine;
    this.objects = [];
    this.layers = [];
    this.solidLayer = null;

    if (fileName) {
      this.loadFile(fileName);
    }
  }

  resetLevelData() {
    this.objects = [];
    this.layers = [];
  }

  update(tick, delta) {
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].update(tick, delta);
    }
  }

  draw(g) {
    let layer, obj;

    g.save();
    g.translate(-this.engine.cameraX | 0, -this.engine.cameraY | 0);
    for (let i = 0; i < this.layers.length; i++) {
      layer = this.layers[i];
      if (layer.isBackground) {
        layer.draw(g);
      }
    }

    for (let i = 0; i < this.objects.length; i++) {
      obj = this.objects[i];
      obj.draw(g);
    }

    for (let i = 0; i < this.layers.length; i++) {
      layer = this.layers[i];
      if (!layer.isBackground) {
        layer.draw(g);
      }
    }
    g.restore();
  }

  onLoaded(data) {
    data = JSON.parse(data);
    this.resetLevelData();
    this.loadTiledData(data);
  }

  loadTiledData(data) {
    let layers, layer, tileset, tilesets, imageSrc, layerData;

    console.debug(data);
    tilesets = [];
    for (let i = 0; i < data.tilesets.length; i++) {
      tileset = data.tilesets[i];
      imageSrc = tileset.image;
      tileset.image = new Image();
      tileset.image.onload = () => data.tilesets[i].loaded = true;
      tileset.image.src = imageSrc;
      tilesets.push(tileset);
    }

    layers = [];
    for (let j = 0; j < data.layers.length; j++) {
      layerData = data.layers[j];
      if (layerData.type === 'tilelayer') {
        layer = new Layer(this.engine, data.tilewidth, data.tileheight);
        layer.loadTiledLayerData(tilesets, layerData);
        if (layer.isSolid) {
          this.solidLayer = layer;
        }
        layers.push(layer);
      } else if (layerData.type === 'objectgroup') {
        for (let i = 0; i < layerData.objects.length; i++) {
          this.createObject(layerData.objects[i]);
        }
      }
    }
    this.layers = layers;
  }

  createObject(objData) {
  }
}

export class FigsharioLevel extends Level {
  constructor(engine, fileName) {
    super(engine, fileName);

    this.lastCollectibleTick = null;
    this.collectibleDelay = 0;
    this.player = null;
  }

  update(tick, delta) {
    super.update(tick, delta);

    if (this.lastCollectibleTick == null || tick - this.lastCollectibleTick >= this.collectibleDelay) {
      this.generateCollectible();
      this.lastCollectibleTick = tick;
    }

    if (this.player) {
      this.engine.addDebugLine('Player:');
      this.engine.addDebugLine('  .position: ' + this.player.x + '×' + this.player.y);
      this.engine.addDebugLine('  .velocity: ' + this.player.horizVel.toFixed(4) + '×' + this.player.vertVel.toFixed(4));
    }
    this.engine.addDebugLine('Objects: ' + this.objects.length);
  }

  generateCollectible() {
    let x, y, c, tile, w, h, s;

    s = this.solidLayer;
    if (!s) {
      return;
    }

    w = s.width * s.tileWidth;
    h = s.height * s.tileHeight;
    x = Math.random() * w;
    y = Math.random() * h;
    tile = s.getAt(x, y);

    if (!tile || tile.ctype === 'empty') {
      c = new Coin(this.engine, this);
      c.x = x - 4;
      c.y = y - 4;

      this.objects.push(c);
    }
    this.collectibleDelay = Math.random() * 500 + 500 | 0;
  }

  createObject(objData) {
    let obj, oCls;

    switch (objData.name) {
    case 'figplayer':
      oCls = Player;
      break;
    }

    if (oCls) {
      obj = new oCls(this.engine, this);
      obj.x = objData.x|0;
      obj.y = (objData.y|0) - (objData.height|0);

      if (objData.name === 'figplayer') {
        this.player = obj;
      }

      this.objects.push(obj);
    }
  }

  removeObject(obj) {
    let index;

    index = this.objects.indexOf(obj);

    if (index >= 0) {
      this.objects.splice(index, 1);
    }
  }
}

