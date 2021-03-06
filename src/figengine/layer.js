export default class Layer {
  constructor(engine, tileWidth, tileHeight) {
    this.engine = engine;
    this.tiles = [];
    this.backScreen = null;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.width = 0;
    this.height = 0;
    this.isBackground = true;
    this.isSolid = false;
    this.tilesets = [];
    this.everythingLoaded = false;
  }

  buildBackground() {
    let backScreen = document.createElement("canvas");
    backScreen.width = this.tileWidth * this.width;
    backScreen.height = this.tileHeight * this.height;

    let g = backScreen.getContext("2d");
    for (let j = 0; j < this.tiles.length; j += 1) {
      for (let i = 0; i < this.tiles[j].length; i += 1) {
        let tile = this.tiles[j][i];
        if (tile) {
          g.drawImage(tile.img, tile.sx, tile.sy, tile.w, tile.h,
                      i * this.tileWidth, j * this.tileHeight, tile.w, tile.h);
          // g.strokeStyle = "#000000";
          // g.strokeRect(i * this.tileWidth + 0.5, j * this.tileHeight + 0.5, 16, 16);
        }
      }
    }

    this.backScreen = backScreen;
  }

  draw(g) {
    if (!this.everythingLoaded) {
      let dorebuild = true;
      for (let i = 0; i < this.tilesets.length; i += 1) {
        if (!this.tilesets[i].loaded) {
          dorebuild = false;
        }
      }
      if (dorebuild) {
        this.buildBackground();
        this.everythingLoaded = true;
      }
    }
    let e = this.engine;
    let gw = e.viewportWidth;
    let gh = e.viewportHeight;
    let ox = e.cameraX - gw * 0.5 | 0;
    let oy = e.cameraY - gh * 0.5 | 0;
    g.drawImage(this.backScreen, ox, oy, gw, gh, ox, oy, gw, gh);
  }

  getAt(x, y) {
    let cx = x / this.tileWidth | 0;
    let cy = y / this.tileHeight | 0;

    if (cx >= 0 && cy >= 0 &&
        cy < this.tiles.length && cx < this.tiles[cy].length) {
      return this.tiles[cy][cx];
    }

    return null;
  }
}
