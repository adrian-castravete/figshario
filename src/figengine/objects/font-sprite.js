import Sprite from "./sprite";

export default class FontSprite extends Sprite {
  constructor(engine, level, fontName) {
    super(engine, level);

    this.text = "";
    this.textAlign = "left";
    this.textBaseline = "bottom";

    let fc = level.getFontAsset(fontName);
    this.charWidth = fc.charWidth || 8;
    this.charHeight = fc.charHeight || 8;
    this.charSpacing = fc.charSpacing || 0;

    this.fontConfig = fc;
  }

  draw(g) {
    let cw = this.charWidth;
    let ch = this.charHeight;
    let cs = this.charSpacing + cw;

    let y = this.y - ch;
    if (this.textBaseline === "middle") {
      y += ch / 2;
    } else if (this.textBaseline === "top") {
      y += ch;
    }
    y = y | 0;

    let len = this.text.length;
    let ox = this.x;
    if (this.textAlign === "center") {
      ox -= len * cs / 2 | 0;
    } else if (this.textAlign === "right") {
      ox -= len * cs | 0;
    }

    let ranges = this.fontConfig.ranges;
    for (let i = 0; i < len; i += 1) {
      let c = this.text[i].charCodeAt();

      for (let j = 0, rlen = ranges.length; j < rlen; j += 1) {
        let cf = ranges[j];

        let x = ox + i * cs | 0;

        let sx = 0;
        let sy = 0;

        if (c >= cf[0].charCodeAt() && c <= cf[1].charCodeAt()) {
          sx = (c - cf[0].charCodeAt()) * cw;
          sy = j * ch;
        }

        g.drawImage(this.fontConfig.spriteSheet, sx, sy, cw, ch,
                    x, y, cw, ch);
      }
    }
  }
}
