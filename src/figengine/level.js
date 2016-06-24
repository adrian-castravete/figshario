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
    for (let i = 0, len = this.objects.length; i < len; i++) {
      let obj = this.objects[i];

      if (obj) {
        obj.update(tick, delta);
      }
    }
  }

  draw(g) {
    let e = this.engine;
    let gw = e.viewportWidth;
    let gh = e.viewportHeight;
    let cx = e.cameraX - gw * 0.5 | 0;
    let cy = e.cameraY - gh * 0.5 | 0;

    g.save();
    g.translate(-this.engine.cameraX | 0, -this.engine.cameraY | 0);
    for (let i = 0, len = this.layers.length; i < len; i++) {
      let layer = this.layers[i];
      if (layer.isBackground) {
        layer.draw(g);
      }
    }

    for (let i = 0, len = this.objects.length; i < len; i++) {
      let obj = this.objects[i];
      if (obj.x >= cx - obj.width && obj.y >= cy - obj.height &&
          obj.x < cx + gw && obj.y < cy + gh) {
        obj.draw(g);
      }
    }

    for (let i = 0, len = this.layers.length; i < len; i++) {
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
}

