import FontSprite from "./font-sprite";

export default class SmartFontSprite extends FontSprite {
  constructor(engine, fontFileName, fontConfig) {
    super(engine, fontFileName, fontConfig);

    this.charRanges = [];
    this.charSpacing = 0;
    this.spaceWidth = 8;
    this.enableKerning = false;  // TODO: Actually use kerning.
  }

  onSpriteSheetLoaded() {
    this.spriteSheetImageData = this.getSpriteSheetImageData();
    this.extractFontConfig();
  }

  extractFontConfig() {
    let cfg = this.fontConfig;
    let chars = {};

    this.spaceWidth = cfg.spaceWidth || this.spaceWidth;
    this.charHeight = cfg.charHeight || this.charHeight;

    for (let i = 0, len = cfg.ranges.length; i < len; i += 1) {
      let range = cfg.ranges[i];

      chars[range] = this.extractFontRange(range, i, len);
    }

    this.charRanges = chars;
  }

  extractFontRange(range, index) {
    let crange = [];
    let ch = this.charHeight;
    let id = this.spriteSheetImageData;

    let x = 0;
    for (let i = range[0].charCodeAt(); i <= range[1].charCodeAt(); i += 1) {
      let c = {
        c: String.fromCharCode(i),
        x,
        y: index * ch
      };
      let empty = false;
      while (!empty) {
        empty = this.isLineEmpty(id, x, index * ch);
        x += 1;
      }
      c.w = x - 1 - c.x;
      while (empty) {
        empty = this.isLineEmpty(id, x, index * ch);
        x += 1;
      }
      x -= 1;
      crange.push(c);
    }

    return crange;
  }

  isLineEmpty(id, x, y) {
    let empty = true;
    for (let j = 0; j < this.charHeight; j += 1) {
      if (!this.isEmptyAt(id, x, y + j)) {
        empty = false;
      }
    }

    return empty;
  }

  getSpriteSheetImageData() {
    let cvs = document.createElement("canvas");
    let ctx = cvs.getContext("2d");
    let img = this.spriteSheet;

    cvs.width = img.width;
    cvs.height = img.height;

    ctx.drawImage(img, 0, 0);

    return ctx.getImageData(0, 0, img.width, img.height);
  }

  isEmptyAt(id, x, y) {
    return id.data[(y * id.width + x) * 4 + 3] === 0;
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
        g.drawImage(this.spriteSheet, sx, sy, cw, ch, x, y, cw, ch);
        x += cw + this.charSpacing;
      } else {
        x += this.spaceWidth + this.charSpacing;
      }
    }
  }
}
