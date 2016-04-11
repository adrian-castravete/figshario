import FSObject from './fsobject';

export default class Sprite extends FSObject {
  constructor(engine, level) {
    super(engine, level);

    this.animations = {};
    this.currentAnim = null;
    this.frame = 0;
    this.spriteOldTick = null;
  }

  loadSpriteSheet(sheetName) {
    let spr;

    spr = new Image();
    spr.src = sheetName;

    this.spriteSheet = spr;
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
    let anim, otick;

    if (this.spriteOldTick == null) {
      this.spriteOldTick = tick;
    }
    super.update(tick, delta);
    anim = this.animations[this.currentAnim];
    if (anim) {
      otick = this.spriteOldTick;
      if (otick < tick - anim.delay) {
        this.frame++;
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
        if (typeof anim.callback === 'function') {
          anim.callback();
        } else {
          this.setAnimation(anim.callback);
        }
      }
    }
  }
}
