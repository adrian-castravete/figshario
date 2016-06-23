import Sprite from "./sprite";

export default class FontSprite extends Sprite {
  constructor(engine, fontFileName, fontConfig) {
    super(engine, engine.level);

    this.loadSpriteSheet(fontFileName);
    this.text = "";
    this.fontConfig = fontConfig;
    this.textAlign = "left";
    this.textBaseline = "bottom";
    this.charWidth = 8;
    this.charHeight = 8;
    this.charSpacing = 8;
  }

  draw(g) {
    let cw = this.charWidth;
    let ch = this.charHeight;
    let cs = this.charSpacing;

    for (let i = 0, len = this.text.length; i < len; i += 1) {
      let c = this.text[i].charCodeAt();

      for (let j = 0, rlen = this.fontConfig.length; j < rlen; j += 1) {
        let cf = this.fontConfig[j];
        let x = this.x;
        let y = this.y - ch;
        if (this.textBaseline === "middle") {
          y += ch / 2;
        } else if (this.textBaseline === "top") {
          y += ch;
        }
        if (this.textAlign === "center") {
          x -= len * cs / 2 | 0;
        } else if (this.textAlign === "right") {
          x -= len * cs | 0;
        }

        x += i * cs;
        y = y | 0;

        let sx = 0;
        let sy = 0;

        if (typeof cf.i === "string") {
          if (c === cf.i.charCodeAt()) {
            sx = cf.x * cw;
            sy = cf.y * ch;
          }
        } else {
          if (c >= cf.i[0].charCodeAt() && c <= cf.i[1].charCodeAt()) {
            sx = (cf.x + c - cf.i[0].charCodeAt()) * cw;
            sy = cf.y * ch;
          }
        }

        g.drawImage(this.spriteSheet, sx, sy, cw, ch, x, y, cw, ch);
      }
    }
  }
}
