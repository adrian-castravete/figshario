import Layer from "../figengine/layer.js";
import { AssetLoader } from "../figengine/util.js";

export default class PlaygroundLayer extends Layer {
  constructor(engine, gameMap) {
    super(engine, 16, 16);

    this.isTiled = true;

    this.createTiles(gameMap);

    let loader = new AssetLoader();
    loader.onLoadedAll = () => {
      console.debug("Loaded assets.");
      this.buildBackground();
    };
    loader.loadFiles(["assets/images/grassy.gif"]);
  }

  createTiles(gameMap) {
    let tiles = [];

    for (let j = 0, jlen = gameMap.length; j < jlen; j += 1) {
      tiles.push([]);
      for (let i = 0, ilen = gameMap[j].length; i < ilen; i += 1) {
        tiles[j].push(this.createTile(i, j, gameMap[j][i], gameMap));
      }
    }

    this.tiles = tiles;
  }

  createTile() {  /* x, y, cell, gameMap */
    // TODO: Handle cell data.
  }
}

export class ImageLayer extends Layer {
  constructor(engine, foreground = false) {
    super(engine, 0, 0);

    this.isBackground = !foreground;
    this.isTiled = false;
  }
}
