import Coin from './objects/coin';
import Player from './objects/player';
import TiledLevel from '../tiled';

export default class FigsharioLevel extends TiledLevel {
  constructor(engine, fileName) {
    super(engine, fileName);

    this.lastCollectibleTick = null;
    this.collectibleDelay = 0;
    this.player = null;
  }

  update(tick, delta) {
    super.update(tick, delta);

    if (this.lastCollectibleTick == null || tick - this.lastCollectibleTick >= this.collectibleDelay) {
      this.generateCollectible();
      this.lastCollectibleTick = tick;
    }

    if (this.player) {
      this.engine.addDebugLine('Player:');
      this.engine.addDebugLine('  .position: ' + this.player.x + '×' + this.player.y);
      this.engine.addDebugLine('  .velocity: ' + this.player.horizVel.toFixed(4) + '×' + this.player.vertVel.toFixed(4));
    }
    this.engine.addDebugLine('Objects: ' + this.objects.length);
  }

  generateCollectible() {
    let x, y, c, tile, w, h, s;

    s = this.solidLayer;
    if (!s) {
      return;
    }

    w = s.width * s.tileWidth;
    h = s.height * s.tileHeight;
    x = Math.random() * w;
    y = Math.random() * h;
    tile = s.getAt(x, y);

    if (!tile || tile.ctype === 'empty') {
      c = new Coin(this.engine, this);
      c.x = x - 4;
      c.y = y - 4;

      this.objects.push(c);
    }
    this.collectibleDelay = Math.random() * 500 + 500 | 0;
  }

  createObject(objData) {
    let obj, oCls;

    switch (objData.name) {
    case 'figplayer':
      oCls = Player;
      break;
    }

    if (oCls) {
      obj = new oCls(this.engine, this);
      obj.x = objData.x|0;
      obj.y = (objData.y|0) - (objData.height|0);

      if (objData.name === 'figplayer') {
        this.player = obj;
      }

      this.objects.push(obj);
    }
  }

  removeObject(obj) {
    let index;

    index = this.objects.indexOf(obj);

    if (index >= 0) {
      this.objects.splice(index, 1);
    }
  }
}
