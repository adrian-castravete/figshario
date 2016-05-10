import Sprite from "../../figengine/objects/sprite";

export default class Player extends Sprite {
  constructor(engine, level) {
    super(engine, level);

    this.width = 32;
    this.height = 40;
    this.loadSpriteSheet("assets/images/figplayer.gif");
    this.createAnimation("lookRight", 0, 0, 2, 250);
    this.createAnimation("lookLeft", 0, 40, 2, 250);
    this.createAnimation("walkRight", 64, 0, 4, 100);
    this.createAnimation("walkLeft", 64, 40, 4, 100);
    this.setAnimation("lookRight");

    this.direction = "right";
    this.airborne = false;
    this.keyPressed = false;
    this.jumpStillPressed = false;
    this.horizVel = 0;
    this.vertVel = 0;

    this.toCollect = [];
  }

  update(tick, delta) {
    super.update(tick, delta);

    this.handleKeys(delta);
    this.chooseAnimation();
    this.handleMovement(delta);
    this.checkCollisions();
    this.handleCollecting();

    this.updateCamera();
  }

  handleKeys() {
    this.keyPressed = false;
    if (this.engine.isPressed("right")) {
      this.direction = "right";
      this.keyPressed = true;

      this.horizVel += 1;
      this.horizVel = Math.min(Math.max(this.horizVel, 1), 8);
    } else if (this.engine.isPressed("left")) {
      this.direction = "left";
      this.keyPressed = true;

      this.horizVel -= 1;
      this.horizVel = Math.max(Math.min(this.horizVel, -1), -8);
    }

    if (this.engine.isPressed("buttonA") && !this.jumpStillPressed && !this.airborne) {
      this.vertVel = -12;
      this.airborne = true;
      this.jumpStillPressed = true;
    }

    if (!this.engine.isPressed("buttonA")) {
      this.jumpStillPressed = false;
    }
  }

  handleMovement() {
    let tile;

    this.x += this.horizVel | 0;
    this.y += this.vertVel | 0;

    this.horizVel *= 0.8;
    if (Math.abs(this.horizVel) < 0.1) {
      this.horizVel = 0;
    }
    if (!this.airborne) {
      if (!this.level.solidLayer) {
        return;
      }

      tile = this.level.solidLayer.getAt(this.x + 16, this.y + 32);
      if (!this.isOnAnySolid(tile)) {
        this.airborne = true;
      }
    }
    if (this.airborne) {
      this.vertVel = Math.min(16, this.vertVel + 1);
    }
  }

  chooseAnimation() {
    if (this.keyPressed) {
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

  checkCollisions() {
    if (!this.level.solidLayer) {
      return;
    }

    // Under ceiling
    let tile = this.level.solidLayer.getAt(this.x + 16, this.y + 8);
    if (tile && tile.ctype === "solid") {
      if (this.vertVel < 0) {
        this.vertVel = 0;
        this.y = tile.y + 8;
      }
    }

    // Right wall upper
    tile = this.level.solidLayer.getAt(this.x + 20, this.y + 8);
    if (tile && tile.ctype === "solid") {
      this.horizVel = 0;
      this.x = tile.x - 21;
    }

    // Left wall upper
    tile = this.level.solidLayer.getAt(this.x + 12, this.y + 8);
    if (tile && tile.ctype === "solid") {
      this.horizVel = 0;
      this.x = tile.x + 4;
    }

    // Right wall
    tile = this.level.solidLayer.getAt(this.x + 20, this.y + 23);
    if (tile && tile.ctype === "solid") {
      this.horizVel = 0;
      this.x = tile.x - 21;
    }

    // Left wall
    tile = this.level.solidLayer.getAt(this.x + 12, this.y + 23);
    if (tile && tile.ctype === "solid") {
      this.horizVel = 0;
      this.x = tile.x + 4;
    }

    // On ground
    tile = this.level.solidLayer.getAt(this.x + 16, this.y + 31);
    if (tile) {
      if (tile.ctype === "solid") {
        this.airborne = false;
        this.vertVel = 0;
        this.y = tile.y - 32;
      } else if (this.isOnSlantRight(tile)) {
        this.airborne = false;
        this.vertVel = 0;
        let x = this.x + 16 - tile.x | 0;
        this.y = tile.y + x - 32;
      } else if (this.isOnSlantLeft(tile)) {
        this.airborne = false;
        this.vertVel = 0;
        let x = this.x + 16 - tile.x | 0;
        this.y = tile.y + (16 - x) - 32;
      }
    }

    // Inside wall
    tile = this.level.solidLayer.getAt(this.x + 16, this.y + 20);
    if (tile && tile.ctype === "solid") {
      this.horizVel = 0;
      this.vertVel = 0;
    }

    for (let i = 0; i < this.level.objects.length; i++) {
      let obj = this.level.objects[i];

      if (obj.isCollectible && this.closeTo(obj, 16)) {
        this.collect(obj);
      }
    }
  }

  closeTo(item, distance) {
    if (item === this) {
      return null;
    }

    let dx = item.x + item.width / 2 - (this.x + this.width / 2);
    let dy = item.y + item.height / 2 - (this.y + this.height / 2);

    return Math.sqrt(dx * dx + dy * dy) <= distance;
  }

  collect(item) {
    item.isCollectible = false;
    this.toCollect.push(item);
    item.vertVel = 0;
    item.setAnimation("destroy");
  }

  isOnAnySolid(tile) {
    return tile && (tile.ctype === "solid" ||
                    this.isOnSlantRight(tile) ||
                    this.isOnSlantLeft(tile));
  }

  isOnSlantRight(tile) {
    if (tile.ctype === "slantRight") {
      let x = this.x + 16 - tile.x | 0;
      let y = this.y + 32 - tile.y | 0;

      if (y >= x) {
        return true;
      }
    }

    return false;
  }

  isOnSlantLeft(tile) {
    if (tile.ctype === "slantLeft") {
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
      let ox = obj.x + obj.width / 2;
      let oy = obj.y + obj.height / 2;
      let cx = this.x + this.width / 2;
      let cy = this.y + this.height / 2;

      obj.x -= (ox - cx) * ratio;
      obj.y -= (oy - cy) * ratio;

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
    this.engine.setCamera(this.x, this.y);
  }

  draw(g) {
    super.draw(g);
    if (this.engine.debugEnabled) {
      g.fillStyle = "rgba(255, 64, 192, 0.33)";
      g.fillRect(12 + this.x, 8 + this.y, 8, 24);
    }
  }
}
