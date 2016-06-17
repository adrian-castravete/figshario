export default class FSObject {
  constructor(engine, level) {
    this.engine = engine;
    this.level = level;
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.width = 16;
    this.height = 16;
    this.spriteSheet = null;
    this.sprX = 0;
    this.sprY = 0;
  }

  update() {}

  draw(g) {
    if (this.spriteSheet) {
      let w = this.width;
      let h = this.height;
      g.save();
      g.translate(this.x, this.y);
      g.rotate(this.rotation);
      g.drawImage(this.spriteSheet, this.sprX, this.sprY, w, h, -w / 2, -h / 2, w, h);
      g.restore();
    }
  }
}
