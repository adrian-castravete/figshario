import Figengine from '../figengine/engine';
import FigsharioLevel from './level';

export default class Figshario extends Figengine {
  loadLevel(fileName) {
    this.level = new FigsharioLevel(this, fileName);
  }

  drawBackground() {
    let g, c, gd;

    c = this.canvas;
    g = this.context;

    gd = g.createLinearGradient(0, 0, 0, c.height);
    gd.addColorStop(0.00, '#242448');
    gd.addColorStop(0.75, '#486bff');
    gd.addColorStop(1.00, '#2448b6');

    g.fillStyle = gd;
    g.fillRect(0, 0, c.width, c.height);
  }

}
