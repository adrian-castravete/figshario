export default class Layer {
  constructor(engine, tileWidth, tileHeight) {
    this.engine = engine;
    this.tiles = [];
    this.backScreen = null;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.width = 0;
    this.height = 0;
    this.isTiled = false;
    this.isBackground = true;
  }

  buildBackground() {
    if (!this.tiles) {
      return;
    }

    let backScreen = document.createElement("canvas");
    let g = backScreen.getContext("2d");
    if (this.isTiled) {
      backScreen.width = this.tileWidth * this.width;
      backScreen.height = this.tileHeight * this.height;

      for (let j = 0, jlen = this.tiles.length; j < jlen; j += 1) {
        for (let i = 0, ilen = this.tiles[j].length; i < ilen; i += 1) {
          let tile = this.tiles[j][i];
          if (tile) {
            g.drawImage(this.tileset, tile.sx, tile.sy, this.tileWidth, this.tileHeight,
                        i * this.tileWidth, j * this.tileHeight, this.tileWidth, this.tileHeight);
          }
        }
      }
    } else {
      backScreen.width = this.width;
      backScreen.height = this.height;

      for (let i = 0, len = this.tiles.length; i < len; i += 1) {
        let tile = this.tiles[i];
        if (tile) {
          g.drawImage(this.tileset, tile.sx, tile.sy, tile.w, tile.h,
                      tile.x, tile.y, tile.w, tile.h);
        }
      }
    }

    this.backScreen = backScreen;
  }

  draw(g) {
    if (this.backScreen) {
      g.drawImage(this.backScreen, 0, 0);
    }
  }

  getAt(x, y) {
    if (!this.tiles) {
      return null;
    }

    if (this.isTiled) {
      let cx = x / this.tileWidth | 0;
      let cy = y / this.tileHeight | 0;

      if (cx >= 0 && cy >= 0 &&
          cy < this.tiles.length && cx < this.tiles[cy].length) {
        return this.tiles[cy][cx];
      }
    } else {
      for (let i = 0, len = this.tiles.length; i < len; i += 1) {
        let tile = this.tiles[i];

        if (x >= tile.x && y >= tile.y && x < tile.x + tile.w && y < tile.y + tile.h) {
          return tile;
        }
      }
    }

    return null;
  }
}
