import FontSprite from "../../figengine/objects/font-sprite";

let FONT_CONFIG = [
  {
    i: ["0", "9"],
    x: 0,
    y: 0
  }
];

export default class Score extends FontSprite {
  constructor(engine) {
    super(engine, "assets/images/score.gif", FONT_CONFIG);

    this.textAlign = "right";
    this.textBaseline = "top";
    this.charWidth = 16;
    this.charHeight = 24;
    this.charSpacing = 17;
    this.x = this.engine.viewportWidth / 2 - 8 | 0;
    this.y = -this.engine.viewportHeight / 2 + 8 | 0;
  }

  draw(g) {
    if (!this.engine.level || !this.engine.level.player) {
      return;
    }

    this.text = `${this.level.player.coinCount * 100}`;
    super.draw(g);
  }
}
