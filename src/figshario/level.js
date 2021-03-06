import Coin, { StaticCoin } from "./objects/coin";
import Player from "./objects/player";
import Score from "./objects/score";
import TiledLevel from "../tiled";

let OBJ_CLASS_MAPPING = {
  "figplayer": Player,
  "coin": Coin,
  "scoin": StaticCoin
};

export default class FigsharioLevel extends TiledLevel {
  constructor(engine, fileName) {
    super(engine, fileName);

    this.lastCollectibleTick = null;
    this.collectibleDelay = 0;
    this.player = null;

    this.loadAssets({
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
    }, () => {
      this.loadAssets({
        fonts: {
          floaty: {
            type: "smart",
            image: "smallFont",
            spaceWidth: 4,
            charHeight: 10,
            charSpacing: 1,
            ranges: [
              ["!", "!"],
              ["0", "9"],
              ["A", "O"],
              ["P", "Z"],
              ["a", "o"],
              ["p", "z"]
            ]
          },
          score: {
            type: "normal",
            image: "scoreFont",
            charWidth: 16,
            charHeight: 24,
            charSpacing: 1,
            ranges: [
              ["0", "9"]
            ]
          }
        }
      }, () => {
        this.loadFile();
        this.score = new Score(this.engine, this);
      });
    });
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

    if (this.score) {
      this.score.update(tick, delta);
    }
  }

  draw(g) {
    super.draw(g);

    if (this.score) {
      this.score.draw(g);
    }
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
      c.x = x + s.tileWidth / 2;
      c.y = y + s.tileHeight / 2;

      this.objects.push(c);
    }
    this.collectibleDelay = Math.random() * 500 + 500 | 0;
  }

  createObject(objData) {
    let oCls = OBJ_CLASS_MAPPING[objData.name];

    if (oCls) {
      let obj = new oCls(this.engine, this);
      obj.x = objData.x + objData.width / 2 | 0;
      obj.y = objData.y - objData.height / 2 | 0;

      if (objData.name === "figplayer") {
        this.engine.setCamera(obj.x, obj.y, true);
        this.player = obj;
      }

      this.objects.push(obj);
    }
  }
}
