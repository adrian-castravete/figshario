import Sprite from '../../figengine/objects/sprite';

export default class MovingSprite extends Sprite {
  constructor(engine, level) {
    super(engine, level);

    this.airborne = false;
    this.solidBounceFactor = 0;
    this.horizVel = 0;
    this.vertVel = 0;
    this.friction = 0.8;
    this.bounds = {
      left: 2,
      up: 2,
      right: 6,
      down: 6,
      centerX: 4,
      centerY: 4
    };
  }

  update(tick, delta) {
    super.update(tick, delta);

    this.handleMovement();
    this.checkCollisions();
  }

  handleMovement() {
    let tile;

    if (!this.level.solidLayer) {
      return;
    }

    this.x += this.horizVel | 0;
    this.y += this.vertVel | 0;

    this.horizVel *= this.friction;
    if (Math.abs(this.horizVel) < 0.1) {
      this.horizVel = 0;
    }
    if (!this.airborne) {
      tile = this.level.solidLayer.getAt(this.x + this.bounds.centerX,
                                         this.y + this.bounds.down);
      if (!this.isOnAnySolid(tile)) {
        this.airborne = true;
      }
    }
    if (this.airborne) {
      this.vertVel = Math.min(this.level.solidLayer.tileHeight, this.vertVel + 1);
    }
  }

  checkCollisions() {
    let tile;

    if (!this.level.solidLayer) {
      return;
    }

    // On ground
    tile = this.level.solidLayer.getAt(this.x + this.bounds.centerX, this.y + this.bounds.down - 1);
    if (this.airborne && this.isOnAnySolid(tile)) {
      this.airborne = false;
      if (this.vertVel >= 0) {
        let xDiff;
        this.vertVel = -this.solidBounceFactor * this.vertVel;
        xDiff = this.x + this.bounds.centerX - tile.x | 0;
        if (this.isOnSlantRight(tile)) {
          if (this.solidBounceFactor) {
            this.horizVel = -this.vertVel * this.solidBounceFactor;
          }
          this.y = tile.y + xDiff - this.bounds.down;
        } else if (this.isOnSlantLeft(tile)) {
          if (this.solidBounceFactor) {
            this.horizVel = this.vertVel * this.solidBounceFactor;
          }
          this.y = tile.y + (tile.w - xDiff) - this.bounds.down;
        } else {
          this.y = tile.y - this.bounds.down;
        }
      }
    }

    // Inside wall
    tile = this.level.solidLayer.getAt(this.x + this.bounds.centerX, this.y + this.bounds.centerY);
    if (tile && tile.ctype === 'solid') {
      this.horizVel = 0;
      this.vertVel = 0;
    }
  }

  isOnAnySolid(tile) {
    return tile && (tile.ctype === 'solid' ||
                    this.isOnSlantRight(tile) ||
                    this.isOnSlantLeft(tile));
  }

  isOnSlantRight(tile) {
    let x, y;

    if (tile.ctype === 'slantRight') {
      x = this.x + this.bounds.centerX - tile.x | 0;
      y = this.y + this.bounds.down - tile.y | 0;

      if (y >= x) {
        return true;
      }
    }

    return false;
  }

  isOnSlantLeft(tile) {
    let x, y;

    if (tile.ctype === 'slantLeft') {
      x = this.x + this.bounds.centerX - tile.x | 0;
      y = this.y + this.bounds.down - tile.y | 0;

      if (y >= this.level.solidLayer.tileHeight - 1 - x) {
        return true;
      }
    }

    return false;
  }
}
