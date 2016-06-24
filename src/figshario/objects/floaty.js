import FontSprite from "../../figengine/objects/font-sprite";

let FONT_CONFIG = [
  {
    i: " ",
    x: 0,
    y: 0
  }, {
    i: ["a", "z"],
    x: 1,
    y: 0
  }, {
    i: ["0", "9"],
    x: 0,
    y: 1
  }
];

export default class Floaty extends FontSprite {
  constructor(engine) {
    super(engine, "assets/images/words.gif", FONT_CONFIG);

    this.textAlign = "center";
    this.textBaseline = "middle";
    this.charWidth = 6;
    this.charHeight = 6;
    this.charSpacing = 6;

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
