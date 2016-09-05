/* global figengine */
(function() {
  let figshario = this.figshario || {};
  let KONAMI_CODE = ["up", "up", "down", "down", "left", "right", "left", "right", "buttonB", "buttonA", "start"];

  class Figshario extends figengine.Engine {
    constructor(canvas, config) {
      super(canvas, config);

      this.keyLog = [];
    }

    loadLevel(fileName) {
      this.level = new figshario.FigsharioLevel(this, fileName);
    }

    drawOSD(g) {
      if (this.score) {
        this.score.draw(g);
      }
    }

    update(tick) {
      super.update(tick);

      if (this.score) {
        this.score.update(tick);
      }
    }

    drawBackground() {
      let c = this.canvas;
      let g = this.context;

      let gd = g.createLinearGradient(0, 0, 0, c.height);
      gd.addColorStop(0.00, "#888899");
      gd.addColorStop(0.75, "#aaccff");
      gd.addColorStop(1.00, "#9999bb");

      g.fillStyle = gd;
      g.fillRect(0, 0, c.width, c.height);
    }

    keyUp(key) {
      super.keyUp(key);

      if (!this.level.player) {
        return;
      }

      this.keyLog.push(key);

      if (this.keyLog.length < 11) {
        return;
      }

      this.keyLog = this.keyLog.splice(-11, 11);

      let ok = true;
      for (let i = 0; ok && i < 11; i += 1) {
        if (this.keyLog[i] !== KONAMI_CODE[i]) {
          ok = false;
        }
      }

      if (ok) {
        this.level.player.flyMode = !this.level.player.flyMode;
      }
    }
  }

  figshario.Figshario = Figshario;
  this.figshario = figshario;
}).call(this);
