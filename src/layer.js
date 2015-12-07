export class Layer {
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

  loadTiledLayerData(tilesets, layerData) {
    let tileIndex, tileset, tiles, tile;

    this.width = layerData.width;
    this.height = layerData.height;
    if (layerData.properties && layerData.properties.type === 'playfield') {
      this.isSolid = true;
    }

    this.tilesets = [];
    tiles = [];
    for (let y = 0; y < this.height; y++) {
      tiles.push([]);
      for (let x = 0; x < this.width; x++) {
        tile = null;

        tileIndex = layerData.data[y * this.width + x];
        tileset = this.findTileset(tilesets, tileIndex);
        this.watchTileset(tileset);

        if (tileIndex && tileset) {
          let props, ctype, cellsX, offset, twidth, theight;

          twidth = tileset.tilewidth;
          theight = tileset.tileheight;

          props = tileset.tileproperties[tileIndex - tileset.firstgid];
          ctype = props ? props.ctype : null;
          cellsX = tileset.imagewidth / twidth | 0;
          offset = tileIndex - tileset.firstgid;

          tile = {
            x: x * twidth,
            y: y * theight,
            w: twidth,
            h: theight,
            sx: offset % cellsX * twidth,
            sy: (offset / cellsX | 0) * theight,
            img: tileset.image,
            ctype: ctype
          };
        }

        tiles[y][x] = tile;
      }
    }
    this.tiles = tiles;
    this.buildBackground();
  }

  findTileset(tilesets, tileIndex) {
    let output, topGid, tileset;

    output = null;
    if (tileIndex > 0) {
      for (let i = 0; i < tilesets.length; i++) {
        tileset = tilesets[i];
        if (tileIndex >= tileset.firstgid && (!topGid || tileset.firstgid > topGid)) {
          output = tileset;
          topGid = tileset.firstgid;
        }
      }
    }

    return output;
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

  watchTileset(tileset) {
    if (!tileset) {
      return;
    }

    let found = false;
    for (let i = 0; !found && i < this.tilesets.length; i++) {
      if (tileset === this.tilesets[i]) {
        found = true;
      }
    }
    if (!found) {
      this.tilesets.push(tileset);
    }
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
