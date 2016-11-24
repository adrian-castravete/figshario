(function() {
  let figengine = this.figengine || {};

  class TiledLayer extends figengine.Layer {
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

    loadTiledLayerData(tilesets, layerData, tileWidth, tileHeight) {
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
          let tileIndex = layerData.data[y * this.width + x];
          let tileset = this.findTileset(tilesets, tileIndex);

          this.watchTileset(tileset);

          let ctype = "empty";
          let sx = -tileWidth;
          let sy = -tileHeight;
          let img = null;

          if (tileIndex && tileset) {
            let props = tileset.tileproperties[tileIndex - tileset.firstgid];
            ctype = props ? props.ctype : "empty";
            let cellsX = tileset.imagewidth / tileWidth | 0;
            let offset = tileIndex - tileset.firstgid;

            sx = offset % cellsX * tileWidth;
            sy = (offset / cellsX | 0) * tileHeight;

            img = tileset.image;
          }

          tiles[y][x] = {
            x: x * tileWidth,
            y: y * tileHeight,
            w: tileWidth,
            h: tileHeight,
            sx,
            sy,
            img,
            ctype
          };
        }
      }
      this.tiles = tiles;
      this.buildBackground();
    }
  }

  class TiledLevel extends figengine.Level {
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
          layer.loadTiledLayerData(tilesets, layerData, data.tilewidth, data.tileheight);
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

  figengine.TiledLevel = TiledLevel;
  this.figengine = figengine;
}).call(this);
