/* global window */

export default class Figengine {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.viewportWidth = 320;
    this.viewportHeight = 200;
    this.zoom = 2;
    this.maskOutExtents = true;
    this.running = false;
    this.cameraX = 0;
    this.cameraY = 0;
    this.cameraFollowX = 0;
    this.cameraFollowY = 0;
    this.cameraFollowRatio = 5;
    this.keys = {
      left: false,
      up: false,
      right: false,
      down: false,
      start: false,
      buttonA: false,
      buttonB: false,
      debug: false
    };
    this.oldTick = null;
    this.debugEnabled = false;
    this.debugTopLeftText = "";
    this.debugTopRightText = "";
    this.debugBottomLeftText = "";
    this.debugBottomRightText = "";
  }

  start() {
    this.startLoop();
  }

  stop() {
    this.stopLoop();
  }

  startLoop() {
    this.running = true;
    this.update(0);
    this.draw(0);
  }

  stopLoop() {
    this.running = false;
  }

  update(tick) {
    let delta;

    if (this.running && this.level) {
      if (this.oldTick == null) {
        this.oldTick = tick;
      }
      delta = (tick - this.oldTick) / 1000.0;
      this.moveCamera(delta);
      this.level.update(tick, delta);
      this.oldTick = tick;
    }
    if (this.running) {
      this.zoom = Math.min(this.canvas.width / this.viewportWidth, this.canvas.height / this.viewportHeight) | 0;
      setTimeout((newTick) => this.update(newTick), 10, Date.now());
    }
  }

  draw() {
    let g;

    if (this.running) {
      g = this.context;
      this.drawBackground();
      if (this.level) {
        g.save();
        g.translate(this.canvas.width * 0.5 | 0, this.canvas.height * 0.5 | 0);
        g.scale(this.zoom, this.zoom);
        if (this.maskOutExtents) {
          this.clipExtents();
        }
        g.imageSmoothingEnabled = false;
        this.level.draw(g);
        g.restore();
        this.debugScreen(g);
      }
      window.requestAnimationFrame(() => this.draw());
    }
  }

  clipExtents() {
    let g = this.context;
    let gw = this.viewportWidth;
    let gh = this.viewportHeight;

    g.beginPath();
    g.rect(-gw * 0.5, -gh * 0.5, gw, gh);
    g.closePath();
    g.clip();
  }

  drawBackground() {
  }

  debugScreen(g) {
    if (this.debugEnabled) {
      this.debugTopLeftText = `Debug Screen\n${this.debugTopLeftText}`;

      g.save();
      g.font = "bold 12px monospace";
      g.shadowColor = "#000000";
      g.shadowBlur = 2;
      g.fillStyle = "#ffffff";

      g.textBaseline = "top";
      g.textAlign = "left";
      let lines = this.debugTopLeftText.split("\n");
      for (let i = 0; i < lines.length; i += 1) {
        g.fillText(lines[i], 0, 12 * i);
      }

      g.textAlign = "right";
      lines = this.debugTopRightText.split("\n");
      for (let i = 0; i < lines.length; i += 1) {
        g.fillText(lines[i], window.innerWidth - 1, 12 * i);
      }

      g.textBaseline = "bottom";
      lines = this.debugBottomRightText.split("\n");
      let offset = window.innerHeight - 1 - lines.length * 12;
      for (let i = 0; i < lines.length; i += 1) {
        g.fillText(lines[i], window.innerWidth - 1, offset + 12 * i);
      }

      g.textAlign = "left";
      lines = this.debugBottomLeftText.split("\n");
      offset = window.innerHeight - 1 - lines.length * 12;
      for (let i = 0; i < lines.length; i += 1) {
        g.fillText(lines[i], 0, offset + 12 * i);
      }

      g.restore();

      this.debugTopLeftText = "";
      this.debugTopRightText = "";
      this.debugBottomLeftText = "";
      this.debugBottomRightText = "";
    }
  }

  addDebugLine(line) {
    this.addTopLeftDebugLine(line);
  }

  addTopLeftDebugLine(line) {
    if (this.debugEnabled) {
      this.debugTopLeftText += `${line}\n`;
    }
  }

  addTopRightDebugLine(line) {
    if (this.debugEnabled) {
      this.debugTopRightText += `${line}\n`;
    }
  }

  addBottomLeftDebugLine(line) {
    if (this.debugEnabled) {
      this.debugBottomLeftText += `${line}\n`;
    }
  }

  addBottomRightDebugLine(line) {
    if (this.debugEnabled) {
      this.debugTopLeftText += `${line}\n`;
    }
  }

  resize(width, height) {
    let c;

    c = this.canvas;
    c.width = width;
    c.height = height;
  }

  setCamera(x, y, reset = false) {
    // TODO: make sure the camera doesn't make the viewport overflow
    this.cameraFollowX = x;
    this.cameraFollowY = y;
    if (reset) {
      this.cameraX = x;
      this.cameraY = y;
    }
  }

  keyDown(key) {
    this.keys[key] = true;
  }

  keyUp(key) {
    this.keys[key] = false;
    if (key === "debug") {
      this.debugEnabled = !this.debugEnabled;
    }
  }

  isPressed(key) {
    return this.keys[key];
  }

  moveCamera(delta) {
    let dx = this.cameraX - this.cameraFollowX;
    let dy = this.cameraY - this.cameraFollowY;

    if (Math.sqrt(dx * dx + dy * dy) > 0.001) {
      this.cameraX = this.cameraX - dx * this.cameraFollowRatio * delta;
      this.cameraY = this.cameraY - dy * this.cameraFollowRatio * delta;
    } else {
      this.cameraX = this.cameraFollowX;
      this.cameraY = this.cameraFollowY;
    }
  }

  playSound(sound) {
    if (sound.ended || !sound.playedAtLeastOnce) {
      sound.play();
      sound.playedAtLeastOnce = true;
    } else {
      sound.currentTime = 0;
    }
  }
}
