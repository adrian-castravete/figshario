import MovingSprite from "../../figshario/objects/moving-sprite";

export default class Coin extends MovingSprite {
  constructor(engine, level) {
    super(engine, level);

    this.width = 8;
    this.height = 8;
    this.loadSpriteSheet("assets/images/coin.gif");
    this.createAnimation("create", 0, 8, 8, 100, "default");
    this.createAnimation("default", 0, 0, 4, 100);
    this.createAnimation("destroy", 32, 0, 4, 100);
    this.setAnimation("create");

    this.hitbox = {
      left: -2,
      up: -2,
      right: 2,
      down: 2
    };

    this.isCollectible = true;
  }

  checkCollisions() {
    if (!this.airborne) {
      this.horizVel = (Math.random() - 0.5) * 4;
      this.vertVel = -2;
      this.airborne = true;
    }

    super.checkCollisions();
  }

  destroy() {
    this.level.removeObject(this);
  }
}
