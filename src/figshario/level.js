import Level from "../figengine/level.js";
import Coin from "./objects/coin";

export default class FigsharioLevel extends Level {
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

  loadLevelData(levelData) {
    levelData = levelData.replace("\r\n", "\n").replace("\r", "\n");

    let lines = levelData.split();
    for (let j = 0, len = lines.length; j < len; j++) {
      let chars = lines[j];
      for (let i = 0, clen = chars.length; i < clen; i++) {
        let cell = chars[i];
        cell = cell;
      }
    }
  }
}
