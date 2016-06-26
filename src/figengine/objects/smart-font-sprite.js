import FontSprite from "./font-sprite";

export default class SmartFontSprite extends FontSprite {
  constructor(engine, level, fontName) {
    super(engine, level, fontName);

    let fc = this.fontConfig;

    this.charSpacing = fc.charSpacing || 0;
    this.spaceWidth = fc.spaceWidth || 8;

    this.charRanges = fc.ranges;
  }

  draw(g) {
    let ch = this.charHeight;
    let x = this.x;
    let y = this.y - ch;

    if (this.textBaseline === "middle") {
      y += ch / 2;
    } else if (this.textBaseline === "top") {
      y += ch;
    }

    for (let i = 0, len = this.text.length; i < len; i += 1) {
      let c = this.text[i].charCodeAt();

      let sx = -1;
      let sy = -1;
      let cw;

      Object.keys(this.charRanges).forEach((key) => {
        let s = key[0].charCodeAt();
        let e = key[2].charCodeAt();
        if (c >= s && c <= e) {
          let o = this.charRanges[key][c - s];

          sx = o.x;
          sy = o.y;
          cw = o.w;
        }
      });

      if (sx >= 0 && sy >= 0) {
        g.drawImage(this.fontConfig.spriteSheet, sx, sy, cw, ch, x, y, cw, ch);
        x += cw + this.charSpacing;
      } else {
        x += this.spaceWidth + this.charSpacing;
      }
    }
  }
}
