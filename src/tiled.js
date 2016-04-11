import Layer from './figengine/layer';
import Level from './figengine/level';

class TiledLayer extends Layer {
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
}

export default class TiledLevel extends Level {
  loadTiledData(data) {
    let layers, layer, tileset, tilesets, imageSrc, layerData;

    console.debug(data);
    tilesets = [];
    for (let i = 0; i < data.tilesets.length; i++) {
      tileset = data.tilesets[i];
      imageSrc = tileset.image;
      tileset.image = new Image();
      tileset.image.onload = () => data.tilesets[i].loaded = true;
      tileset.image.src = imageSrc;
      tilesets.push(tileset);
    }

    layers = [];
    for (let j = 0; j < data.layers.length; j++) {
      layerData = data.layers[j];
      if (layerData.type === 'tilelayer') {
        layer = new TiledLayer(this.engine, data.tilewidth, data.tileheight);
        layer.loadTiledLayerData(tilesets, layerData);
        if (layer.isSolid) {
          this.solidLayer = layer;
        }
        layers.push(layer);
      } else if (layerData.type === 'objectgroup') {
        for (let i = 0; i < layerData.objects.length; i++) {
          this.createObject(layerData.objects[i]);
        }
      }
    }
    this.layers = layers;
  }
}
