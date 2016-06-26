import SmartFontSprite from "../../figengine/objects/smart-font-sprite";

export default class Floaty extends SmartFontSprite {
  constructor(engine, level) {
    super(engine, level, "floaty");

    this.textAlign = "center";
    this.textBaseline = "middle";

    this.climbed = 0;
    this.blinking = false;
    this.drawMe = true;
  }

  update(tick, delta) {
    let climb = delta * 25;
    this.climbed += climb;
    this.y -= climb;

    if (this.climbed > 32) {
      this.blinking = true;
    }
    if (this.climbed >= 48) {
      this.destroy();
    }
  }

  draw(g) {
    if (this.blinking) {
      this.drawMe = !this.drawMe;
    }

    if (this.drawMe) {
      super.draw(g);
    }
  }

  destroy() {
    this.level.removeObject(this);
  }
}
