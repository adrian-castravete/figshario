import MovingSprite from "../../figshario/objects/moving-sprite";

export default class Coin extends MovingSprite {
  constructor(engine, level) {
    super(engine, level);

    this.width = 8;
    this.height = 8;
    this.solidBounceFactor = 0.5;
    this.loadSpriteSheet("assets/images/coin.gif");
    this.createAnimation("create", 0, 8, 8, 100, "default");
    this.createAnimation("default", 0, 0, 4, 100);
    this.createAnimation("destroy", 32, 0, 4, 100);
    this.setAnimation("create");

    this.isCollectible = true;
  }

  destroy() {
    this.level.removeObject(this);
  }
}
