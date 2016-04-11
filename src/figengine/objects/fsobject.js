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

  update(tick, delta) {
  }

  draw(g) {
    if (this.spriteSheet) {
      g.save();
      g.translate(this.x, this.y);
      g.rotate(this.rotation);
      g.drawImage(this.spriteSheet, this.sprX, this.sprY, this.width, this.height,
                  0, 0, this.width, this.height);
      g.restore();
    }
  }
}
