import Loader from './util';

export default class Level extends Loader {
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

  createObject() {  /* objData */
  }
}

