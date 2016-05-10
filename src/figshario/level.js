import Coin from "./objects/coin";
import Player from "./objects/player";
import TiledLevel from "../tiled";

let OBJ_CLASS_MAPPING = {
  "figplayer": Player
};

export default class FigsharioLevel extends TiledLevel {
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
      this.engine.addDebugLine("Player:");
      this.engine.addDebugLine(`  .position: ${this.player.x}×${this.player.y}`);
      let hv = this.player.horizVel.toFixed(4);
      let vv = this.player.vertVel.toFixed(4);
      this.engine.addDebugLine(`  .velocity: ${hv}×${vv}`);
    }
    this.engine.addDebugLine(`Objects: ${this.objects.length}`);
  }

  generateCollectible() {
    let s = this.solidLayer;
    if (!s) {
      return;
    }

    let w = s.width * s.tileWidth;
    let h = s.height * s.tileHeight;
    let x = Math.random() * w;
    let y = Math.random() * h;
    let tile = s.getAt(x, y);

    if (!tile || tile.ctype === "empty") {
      let c = new Coin(this.engine, this);
      c.x = x - 4;
      c.y = y - 4;

      this.objects.push(c);
    }
    this.collectibleDelay = Math.random() * 500 + 500 | 0;
  }

  createObject(objData) {
    let oCls = OBJ_CLASS_MAPPING[objData.name];

    if (oCls) {
      let obj = new oCls(this.engine, this);
      obj.x = objData.x | 0;
      obj.y = (objData.y | 0) - (objData.height | 0);

      if (objData.name === "figplayer") {
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
