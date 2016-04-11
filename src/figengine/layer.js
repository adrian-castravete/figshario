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
    let tile, backScreen, g;

    backScreen = document.createElement('canvas');
    backScreen.width = this.tileWidth * this.width;
    backScreen.height = this.tileHeight * this.height;

    g = backScreen.getContext('2d');
    for (let j = 0; j < this.tiles.length; j++) {
      for (let i = 0; i < this.tiles[j].length; i++) {
        tile = this.tiles[j][i];
        if (tile) {
          g.drawImage(tile.img, tile.sx, tile.sy, tile.w, tile.h,
                      i * this.tileWidth, j * this.tileHeight, tile.w, tile.h);
          // g.strokeStyle = '#000000';
          // g.strokeRect(i * this.tileWidth + 0.5, j * this.tileHeight + 0.5, 16, 16);
        }
      }
    }

    this.backScreen = backScreen;
  }

  draw(g) {
    if (!this.everythingLoaded) {
      let dorebuild = true;
      for (let i = 0; i < this.tilesets.length; i++) {
        if (!this.tilesets[i].loaded) {
          dorebuild = false;
        }
      }
      if (dorebuild) {
        this.buildBackground();
        this.everythingLoaded = true;
      }
    }
    g.drawImage(this.backScreen, 0, 0);
  }

  getAt(x, y) {
    let cx, cy;

    cx = x / this.tileWidth | 0;
    cy = y / this.tileHeight | 0;

    if (cx >= 0 && cy >= 0 &&
        cy < this.tiles.length && cx < this.tiles[cy].length) {
      return this.tiles[cy][cx];
    }
  }
}
