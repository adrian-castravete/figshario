import Layer from "./figengine/layer";
import Level from "./figengine/level";

class TiledLayer extends Layer {
  findTileset(tilesets, tileIndex) {
    let output = null;
    let topGid = null;
    if (tileIndex > 0) {
      for (let i = 0, len = tilesets.length; i < len; i += 1) {
        let tileset = tilesets[i];
        if (tileIndex >= tileset.firstgid && (!topGid || tileset.firstgid > topGid)) {
          output = tileset;
          topGid = tileset.firstgid;
        }
      }
    }

    return output;
  }

  watchTileset(tileset) {
    if (!tileset) {
      return;
    }

    let found = false;
    for (let i = 0, len = this.tilesets.length; !found && i < len; i += 1) {
      if (tileset === this.tilesets[i]) {
        found = true;
      }
    }
    if (!found) {
      this.tilesets.push(tileset);
    }
  }

  loadTiledLayerData(tilesets, layerData) {
    this.width = layerData.width;
    this.height = layerData.height;
    if (layerData.properties && layerData.properties.type === "playfield") {
      this.isSolid = true;
    }

    this.tilesets = [];
    let tiles = [];
    for (let y = 0, ylen = this.height; y < ylen; y += 1) {
      tiles.push([]);
      for (let x = 0, xlen = this.width; x < xlen; x += 1) {
        let tile = null;
        let tileIndex = layerData.data[y * this.width + x];
        let tileset = this.findTileset(tilesets, tileIndex);

        this.watchTileset(tileset);

        if (tileIndex && tileset) {
          let twidth = tileset.tilewidth;
          let theight = tileset.tileheight;

          let props = tileset.tileproperties[tileIndex - tileset.firstgid];
          let ctype = props ? props.ctype : null;
          let cellsX = tileset.imagewidth / twidth | 0;
          let offset = tileIndex - tileset.firstgid;

          tile = {
            x: x * twidth,
            y: y * theight,
            w: twidth,
            h: theight,
            sx: offset % cellsX * twidth,
            sy: (offset / cellsX | 0) * theight,
            img: tileset.image,
            ctype
          };
        }

        tiles[y][x] = tile;
      }
    }
    this.tiles = tiles;
    this.buildBackground();
  }
}

export default class TiledLevel extends Level {
  loadLevelData(data) {
    console.debug(data);
    let tilesets = [];
    for (let i = 0, len = data.tilesets.length; i < len; i += 1) {
      let tileset = data.tilesets[i];
      let imageSrc = tileset.image;
      tileset.image = new Image();
      tileset.image.onload = () => data.tilesets[i].loaded = true;
      tileset.image.src = imageSrc;
      tilesets.push(tileset);
    }

    let layers = [];
    for (let j = 0, jlen = data.layers.length; j < jlen; j += 1) {
      let layerData = data.layers[j];
      if (layerData.type === "tilelayer") {
        let layer = new TiledLayer(this.engine, data.tilewidth, data.tileheight);
        layer.loadTiledLayerData(tilesets, layerData);
        if (layer.isSolid) {
          this.solidLayer = layer;
        }
        layers.push(layer);
      } else if (layerData.type === "objectgroup") {
        for (let i = 0, len = layerData.objects.length; i < len; i += 1) {
          this.createObject(layerData.objects[i]);
        }
      }
    }
    this.layers = layers;
  }
}
