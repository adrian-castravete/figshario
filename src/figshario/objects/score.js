import FontSprite from "../../figengine/objects/font-sprite";

export default class Score extends FontSprite {
  constructor(engine, level) {
    super(engine, level, "score");

    this.textAlign = "right";
    this.textBaseline = "top";
    this.x = this.engine.viewportWidth / 2 - 8 | 0;
    this.y = -this.engine.viewportHeight / 2 + 8 | 0;
    this.opacity = 1;
    this.oldCoinCount = null;
    this.changeTick = null;
  }

  update(tick) {
    if (!this.engine.level || !this.engine.level.player) {
      return;
    }

    let coinCount = this.level.player.coinCount;
    if (coinCount != this.oldCoinCount || this.changeTick == null) {
      this.text = `${coinCount * 100}`;
      this.changeTick = tick;
      this.opacity = 1;
      this.oldCoinCount = coinCount;
    }

    if (tick >= this.changeTick + 3000) {
      if (this.opacity > 0.5) {
        this.opacity -= 0.01;
      }
    }
  }

  draw(g) {
    g.save();
    g.globalAlpha = this.opacity;
    super.draw(g);
    g.restore();
  }
}
