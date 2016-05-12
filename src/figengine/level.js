import Loader from "./util";

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
    for (let i = 0, len = this.objects.length; i < len; i += 1) {
      let obj = this.objects[i];

      if (obj) {
        obj.update(tick, delta);
      }
    }
  }

  draw(g) {
    g.save();
    g.translate(-this.engine.cameraX | 0, -this.engine.cameraY | 0);
    for (let i = 0, len = this.layers.length; i < len; i += 1) {
      let layer = this.layers[i];
      if (layer.isBackground) {
        layer.draw(g);
      }
    }

    for (let i = 0, len = this.objects.length; i < len; i += 1) {
      this.objects[i].draw(g);
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
    this.resetLevelData();
    this.loadLevelData(data);
  }

  loadLevelData() {  /* levelData */
  }
}

