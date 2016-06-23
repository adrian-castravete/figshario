import Sprite from "../../figengine/objects/sprite";

export default class MovingSprite extends Sprite {
  constructor(engine, level) {
    super(engine, level);

    this.airborne = false;
    this.solidBounceFactor = 0;
    this.horizVel = 0;
    this.vertVel = 0;
    this.friction = 0.8;
    this.hitbox = null;
  }

  update(tick, delta) {
    super.update(tick, delta);

    this.handleMovement();
    this.checkCollisions();
  }

  handleMovement() {
    if (!this.level.solidLayer || !this.hitbox) {
      return;
    }

    this.x += this.horizVel | 0;
    this.y += this.vertVel | 0;

    this.horizVel *= this.friction;
    if (Math.abs(this.horizVel) < 0.1) {
      this.horizVel = 0;
    }
    if (!this.airborne) {
      if (!this.getSolidAt(this.x, this.y + this.hitbox.down)) {
        this.airborne = true;
      }
    }
    if (this.airborne) {
      this.vertVel = Math.min(this.level.solidLayer.tileHeight, this.vertVel + 0.4);
    }
  }

  checkCollisions() {
    if (!this.level.solidLayer || !this.hitbox) {
      return;
    }

    // Under ceiling
    let tile = this.getSolidAt(this.x, this.y + this.hitbox.up + 1);
    if (tile && this.vertVel < 0) {
      this.vertVel = 0;
      this.positionUnderSolid(tile);
    }

    // On ground
    tile = this.getSolidAt(this.x, this.y + this.hitbox.down - 1);
    if (this.airborne && tile) {
      this.airborne = false;
      if (this.vertVel >= 0) {
        this.vertVel = 0;
      }
    }
    if (tile) {
      this.positionOnSolid(tile);
    }

    // Left wall
    tile = this.getSolidAt(this.x + this.hitbox.left + 1, this.y);
    if (tile && tile.ctype === "solid") {
      this.x = tile.x + tile.w + this.hitbox.right;
    }

    // Right wall
    tile = this.getSolidAt(this.x + this.hitbox.right - 1, this.y);
    if (tile) {
      this.x = tile.x + this.hitbox.left;
    }

    // Inside wall
    if (this.getSolidAt(this.x, this.y)) {
      this.horizVel = 0;
      this.vertVel = 0;
    }
  }

  positionOnSolid(tile) {
    let layer = this.level.solidLayer;
    let d = this.hitbox.down;

    if (!tile) {
      return;
    }

    let x = this.x - tile.x | 0;
    let w = layer.tileWidth;
    let c = tile.ctype;
    if (c === "solid") {
      this.y = tile.y - d | 0;
    } else if (c === "slopeRU") {
      this.y = tile.y + x - d | 0;
    } else if (c === "slopeLU") {
      this.y = tile.y + w - x - d | 0;
    } else if (c === "slopeRRU1") {
      this.y = tile.y + (w + x) / 2 - d | 0;
    } else if (c === "slopeRRU2") {
      this.y = tile.y + x / 2 - d | 0;
    } else if (c === "slopeRUU1") {
      this.y = tile.y + x * 2 - d | 0;
    } else if (c === "slopeRUU2") {
      this.y = tile.y + x * 2 - w - d | 0;
    } else if (c === "slopeLLU1") {
      this.y = tile.y + w - x / 2 - d | 0;
    } else if (c === "slopeLLU2") {
      this.y = tile.y + (w - x) / 2 - d | 0;
    } else if (c === "slopeLUU1") {
      this.y = tile.y + (w - x) * 2 - d | 0;
    } else if (c === "slopeLUU2") {
      this.y = tile.y + w - x * 2 - d | 0;
    }
    this.airborne = false;
  }

  positionUnderSolid(tile) {
    let layer = this.level.solidLayer;
    let u = layer.tileHeight - this.hitbox.up;

    if (!tile) {
      return;
    }

    let x = this.x - tile.x | 0;
    let w = layer.tileWidth;
    let c = tile.ctype;
    if (c === "solid") {
      this.y = tile.y + u | 0;
    } else if (c === "slopeLD") {
      this.y = tile.y + x + u | 0;
    } else if (c === "slopeRD") {
      this.y = tile.y + w - x + u | 0;
    } else if (c === "slopeLLD1") {
      this.y = tile.y + (w + x) / 2 + u | 0;
    } else if (c === "slopeLLD2") {
      this.y = tile.y + x / 2 + u | 0;
    } else if (c === "slopeLDD1") {
      this.y = tile.y + x * 2 + u | 0;
    } else if (c === "slopeLDD2") {
      this.y = tile.y + x * 2 - w + u | 0;
    } else if (c === "slopeRRD1") {
      this.y = tile.y + w - x / 2 + u | 0;
    } else if (c === "slopeRRD2") {
      this.y = tile.y + (w - x) / 2 + u | 0;
    } else if (c === "slopeRDD1") {
      this.y = tile.y + (w - x) * 2 + u | 0;
    } else if (c === "slopeRDD2") {
      this.y = tile.y + w - x * 2 + u | 0;
    }
    this.airborne = false;
  }

  getSolidAt(pointX, pointY) {
    let tile = this.level.solidLayer.getAt(pointX, pointY);

    if (tile) {
      let c = tile.ctype;
      let x = pointX - tile.x | 0;
      let y = pointY - tile.y | 0;
      let w = this.level.solidLayer.tileWidth;

      let conditions = [c === "solid",
                        c === "slopeRU" && y >= x,
                        c === "slopeLU" && y >= w - x,
                        c === "slopeRRU1" && y >= (x + w) / 2,
                        c === "slopeRRU2" && y >= x / 2,
                        c === "slopeRUU1" && y >= x * 2,
                        c === "slopeRUU2" && y >= x * 2 - w,
                        c === "slopeLLU1" && y >= w - x / 2,
                        c === "slopeLLU2" && y >= (w - x) / 2,
                        c === "slopeLUU1" && y >= (w - x) * 2,
                        c === "slopeLUU2" && y >= w - x * 2];

      for (let i = 0, len = conditions.length; i < len; i += 1) {
        if (conditions[i]) {
          return tile;
        }
      }
    }

    return false;
  }
}
