import Figengine from "../figengine/engine";
import FigsharioLevel from "./level";

let KONAMI_CODE = ["up", "up", "down", "down", "left", "right", "left", "right", "buttonB", "buttonA", "start"];

export default class Figshario extends Figengine {
  constructor(canvas) {
    super(canvas);

    this.keyLog = [];
  }

  loadLevel(fileName) {
    this.level = new FigsharioLevel(this, fileName);
  }

  drawBackground() {
    let c = this.canvas;
    let g = this.context;

    let gd = g.createLinearGradient(0, 0, 0, c.height);
    gd.addColorStop(0.00, "#888899");
    gd.addColorStop(0.75, "#aaccff");
    gd.addColorStop(1.00, "#9999bb");

    g.fillStyle = gd;
    g.fillRect(0, 0, c.width, c.height);
  }

  keyUp(key) {
    super.keyUp(key);

    if (!this.level.player) {
      return;
    }

    this.keyLog.push(key);

    if (this.keyLog.length < 11) {
      return;
    }

    this.keyLog = this.keyLog.splice(-11, 11);

    let ok = true;
    for (let i = 0; ok && i < 11; i++) {
      if (this.keyLog[i] !== KONAMI_CODE[i]) {
        ok = false;
      }
    }

    if (ok) {
      this.level.player.flyMode = !this.level.player.flyMode;
    }
  }
}
