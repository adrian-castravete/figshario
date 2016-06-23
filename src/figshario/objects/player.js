import MovingSprite from "./moving-sprite";

let COLLECTION_PROXIMITY = 16;

export default class Player extends MovingSprite {
  constructor(engine, level) {
    super(engine, level);

    this.width = 32;
    this.height = 40;
    this.hitbox = {
      left: -4,
      up: -12,
      right: 4,
      down: 12
    };

    this.loadSpriteSheet("assets/images/figplayer.gif");
    this.createAnimation("lookRight", 0, 0, 2, 250);
    this.createAnimation("lookLeft", 0, 40, 2, 250);
    this.createAnimation("walkRight", 64, 0, 4, 100);
    this.createAnimation("walkLeft", 64, 40, 4, 100);
    this.setAnimation("lookRight");

    this.direction = "right";
    this.airborne = false;
    this.directionPressed = false;
    this.jumpStillPressed = false;
    this.horizVel = 0;
    this.vertVel = 0;
    this.flyMode = false;

    this.coinCount = 0;

    this.toCollect = [];
  }

  update(tick, delta) {
    super.update(tick, delta);

    if (this.flyMode) {
      this.handleFlyModeKeys(delta);
    } else {
      this.handleKeys(delta);
    }
    this.chooseAnimation();
    this.handleCollecting();

    this.updateCamera();
  }

  checkCollisions(delta) {
    if (!this.flyMode) {
      super.checkCollisions(delta);
    }

    for (let i = 0, len = this.level.objects.length; i < len; i += 1) {
      let obj = this.level.objects[i];

      if (obj.isCollectible && this.closeTo(obj, COLLECTION_PROXIMITY) || obj.y > 10000) {
        this.collect(obj);
      }
    }
  }

  handleFlyModeKeys(delta) {
    this.directionPressed = false;
    if (this.engine.isPressed("right")) {
      this.direction = "right";
      this.directionPressed = true;
      this.horizVel += 80 * delta;
      this.horizVel = Math.min(Math.max(this.horizVel, 1), 8);
    }
    if (this.engine.isPressed("left")) {
      this.direction = "left";
      this.directionPressed = true;
      this.horizVel -= 80 * delta;
      this.horizVel = Math.max(Math.min(this.horizVel, -1), -8);
    }
    if (this.engine.isPressed("up")) {
      this.directionPressed = true;
      this.vertVel -= 80 * delta;
      this.vertVel = Math.max(Math.min(this.vertVel, -1), -8);
    }
    if (this.engine.isPressed("down")) {
      this.directionPressed = true;
      this.vertVel += 80 * delta;
      this.vertVel = Math.min(Math.max(this.vertVel, 1), 8);
    }
  }

  handleMovement(delta) {
    if (this.flyMode) {
      this.x += this.horizVel | 0;
      this.y += this.vertVel | 0;
      this.horizVel *= this.friction;
      this.vertVel *= this.friction;
      if (Math.abs(this.horizVel) < 0.1) {
        this.horizVel = 0;
      }
      if (Math.abs(this.vertVel) < 0.1) {
        this.vertVel = 0;
      }
    } else {
      super.handleMovement(delta);
    }
  }

  handleKeys(delta) {
    this.directionPressed = false;
    if (this.engine.isPressed("right")) {
      this.direction = "right";
      this.directionPressed = true;

      this.horizVel += 80 * delta;
      this.horizVel = Math.min(Math.max(this.horizVel, 1), 4);
    } else if (this.engine.isPressed("left")) {
      this.direction = "left";
      this.directionPressed = true;

      this.horizVel -= 80 * delta;
      this.horizVel = Math.max(Math.min(this.horizVel, -1), -4);
    }

    if (this.engine.isPressed("buttonA") && !this.jumpStillPressed && !this.airborne) {
      this.vertVel = -3.6;
      this.airborne = true;
      this.jumpStillPressed = true;
    }

    if (!this.engine.isPressed("buttonA")) {
      this.jumpStillPressed = false;
    }
  }

  chooseAnimation() {
    if (this.directionPressed) {
      if (this.direction === "right") {
        this.setAnimation("walkRight");
      } else {
        this.setAnimation("walkLeft");
      }
    } else {
      if (this.direction === "right") {
        this.setAnimation("lookRight");
      } else {
        this.setAnimation("lookLeft");
      }
    }
  }

  closeTo(item, distance) {
    if (item === this) {
      return null;
    }

    let dx = item.x - this.x;
    let dy = item.y - this.y;

    return Math.sqrt(dx * dx + dy * dy) <= distance;
  }

  collect(item) {
    item.isCollectible = false;
    this.toCollect.push(item);
    item.vertVel = 0;
    item.setAnimation("destroy");
    this.coinCount += 1;
  }

  isOnAnySolid(tile) {
    return tile && (tile.ctype === "solid" ||
                    this.isOnSlantRight(tile) ||
                    this.isOnSlantLeft(tile));
  }

  isOnSlantRight(tile) {
    if (tile.ctype === "slopeRU") {
      let x = this.x + 16 - tile.x | 0;
      let y = this.y + 32 - tile.y | 0;

      if (y >= x) {
        return true;
      }
    }

    return false;
  }

  isOnSlantLeft(tile) {
    if (tile.ctype === "slopeLU") {
      let x = this.x + 16 - tile.x | 0;
      let y = this.y + 32 - tile.y | 0;

      if (y >= 15 - x) {
        return true;
      }
    }

    return false;
  }

  handleCollecting() {
    let ratio = 0.2;
    let toRemove = [];

    for (let i = 0; i < this.toCollect.length; i++) {
      let obj = this.toCollect[i];

      obj.x -= (obj.x - this.x) * ratio;
      obj.y -= (obj.y - this.y) * ratio;

      if (this.closeTo(obj, 8)) {
        obj.destroy();
        toRemove.push(obj);
      }
    }

    for (let i = 0; i < toRemove.length; i++) {
      this.toCollect.splice(this.toCollect.indexOf(toRemove[i]), 1);
    }
  }

  updateCamera() {
    let offset;

    if (this.direction === "right") {
      offset = 40;
    } else {
      offset = -40;
    }

    this.engine.setCamera(this.x + this.width / 2 + offset, this.y + this.height / 2);
  }

  draw(g) {
    super.draw(g);
    if (this.engine.debugEnabled) {
      this.engine.addTopRightDebugLine(`Airborne: ${this.airborne}`);
      g.fillStyle = "rgba(255, 64, 192, 0.33)";
      g.fillRect(this.x + this.hitbox.left, this.y + this.hitbox.up,
                 this.hitbox.right - this.hitbox.left, this.hitbox.down - this.hitbox.up);
    }
  }
}
