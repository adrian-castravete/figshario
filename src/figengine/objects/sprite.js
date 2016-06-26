import FSObject from "./fsobject";

export default class Sprite extends FSObject {
  constructor(engine, level) {
    super(engine, level);

    this.animations = {};
    this.currentAnim = null;
    this.frame = 0;
    this.spriteOldTick = null;
    this.spriteSheet = null;
  }

  createAnimation(name, x, y, length, delay, callback) {
    this.animations[name] = {x, y, length, delay, callback};
  }

  setAnimation(name) {
    if (name !== this.currentAnim) {
      this.currentAnim = name;
      this.frame = 0;
      this.spriteOldTick = null;
    }
  }

  update(tick, delta) {
    if (this.spriteOldTick == null) {
      this.spriteOldTick = tick;
    }
    super.update(tick, delta);
    let anim = this.animations[this.currentAnim];
    if (anim) {
      let otick = this.spriteOldTick;
      if (otick < tick - anim.delay) {
        this.frame += 1;
        this.resetFrame(anim);
        this.spriteOldTick = tick;
      }
      this.sprX = anim.x + this.frame * this.width;
      this.sprY = anim.y;
    }
  }

  resetFrame(anim) {
    if (this.frame >= anim.length) {
      this.frame = 0;
      if (anim.callback) {
        if (typeof anim.callback === "function") {
          anim.callback();
        } else {
          this.setAnimation(anim.callback);
        }
      }
    }
  }

  loadSpriteSheet(imageName) {
    this.spriteSheet = this.level.getImageAsset(imageName);
  }
}
