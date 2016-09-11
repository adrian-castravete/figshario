/* global figengine */
(function() {
  let figshario = this.figshario || {};

  let COLLECTION_PROXIMITY = 16;
  let WORDS = `Good!, Nice!, Awesome!, Marvelous!, Superb!, Fantastic!, OK!, Bravo!, Bingo!, Ka Ching!, Grand!,
Awoooga!, Haha!, Yabba Dabba Doo!, Scooby Dooby Doo!, SuperCaliFragilisticExpalidocious!, WOW!, Groovy!, Eureka!,
Hurray!, Yahoo!, Yes!, Yeah!, Aha!, Abracadabra!, Alleluia!, Aloha!, Allright!, Amen!, Aright!, Yeaaaah!, Aye!,
Ba Da Bing Ba Da Boom!, Ba Dum Tss!, BANG!, Bazinga!, Bless You!, Blimey!, Boo Ya!, Bravissimo!, Bring It On!,
Bulls Eye!, Checkmate!, Cheers!, Congrats!, Congratulations!, Derp!, Diddly Doo!, Boing!, Doing!, Ermagerd!,
Felicitations!, Fire in the Hole!, Fo Real!, Fo Sho!, Geronimo!, Golly!, Golly Gee!, Goo Goo Ga Ga!, Goo Goo!, Gratz!,
Great!, Halleluiah!, Hell Yeah!, Heya!, Hocus Pocus!, Hoorah!, Ka Boom!, Ka Pow!, Meow!, Nyan-Nyan!, Nice One!,
Oh Yeah!, Oh My!, OMG!, OMFG!, ROTF!, ROTFLOL!, LMAO!, LMFAO!, Oompa Loompa!, Peace!, POW!, Rock On!,
The cake is a lie!, UUDDLRLRBA!, Ooh La La!, Ta Dah!, Viva!, Voila!, Way to Go!, Well Done!, Wazzup!, Woo Hoo!, Woot!,
W00T!, XOXO!, You Know It!, Yoopee!, Yummy!, ZOMG!, Zowie!, ZZZ!, XYZZY!
  `.trim().split(/\s*,\s*/);


  class MovingSprite extends figengine.Sprite {
    constructor(engine, level) {
      super(engine, level);

      this.airborne = false;
      this.solidBounceFactor = 0;
      this.horizVel = 0;
      this.vertVel = 0;
      this.friction = 0.9;
      this.hitbox = null;
      this.fallSpeed = 15;
    }

    update(tick, delta) {
      super.update(tick, delta);

      this.handleMovement(delta);
      this.checkCollisions(delta);
    }

    handleMovement(delta) {
      if (!this.level.solidLayer || !this.hitbox) {
        return;
      }

      this.x += this.horizVel | 0;
      this.y += this.vertVel | 0;

      this.horizVel *= this.friction;
      if (Math.abs(this.horizVel) < 0.1) {
        this.horizVel = 0;
      }
      if (!this.airborne) {
        if (!this.getSolidAt(this.x, this.y + this.hitbox.down)) {
          this.airborne = true;
        }
      }
      if (this.airborne) {
        this.vertVel = Math.min(this.level.solidLayer.tileHeight, this.vertVel + this.fallSpeed * delta);
      }
    }

    checkCollisions() {
      if (!this.level.solidLayer || !this.hitbox) {
        return;
      }

      // Under ceiling
      let tile = this.getSolidAt(this.x, this.y + this.hitbox.up + 1);
      if (tile && this.vertVel < 0) {
        this.vertVel = 0;
        this.positionUnderSolid(tile);
      }

      // On ground
      tile = this.getSolidAt(this.x, this.y + this.hitbox.down - 1);
      if (this.airborne && tile) {
        this.airborne = false;
        if (this.vertVel >= 0) {
          this.vertVel = 0;
        }
      }
      if (tile) {
        this.positionOnSolid(tile);
      }

      // Left wall
      tile = this.getSolidAt(this.x + this.hitbox.left + 1, this.y);
      if (tile && tile.ctype === "solid") {
        this.x = tile.x + tile.w + this.hitbox.right;
      }

      // Right wall
      tile = this.getSolidAt(this.x + this.hitbox.right - 1, this.y);
      if (tile) {
        this.x = tile.x + this.hitbox.left;
      }

      // Inside wall
      if (this.getSolidAt(this.x, this.y)) {
        this.horizVel = 0;
        this.vertVel = 0;
      }
    }

    positionOnSolid(tile) {
      let layer = this.level.solidLayer;
      let d = this.hitbox.down;

      if (!tile) {
        return;
      }

      let x = this.x - tile.x | 0;
      let w = layer.tileWidth;
      let c = tile.ctype;
      if (c === "solid") {
        this.y = tile.y - d | 0;
      } else if (c === "slopeRU") {
        this.y = tile.y + x - d | 0;
      } else if (c === "slopeLU") {
        this.y = tile.y + w - x - d | 0;
      } else if (c === "slopeRRU1") {
        this.y = tile.y + (w + x) / 2 - d | 0;
      } else if (c === "slopeRRU2") {
        this.y = tile.y + x / 2 - d | 0;
      } else if (c === "slopeRUU1") {
        this.y = tile.y + x * 2 - d | 0;
      } else if (c === "slopeRUU2") {
        this.y = tile.y + x * 2 - w - d | 0;
      } else if (c === "slopeLLU1") {
        this.y = tile.y + w - x / 2 - d | 0;
      } else if (c === "slopeLLU2") {
        this.y = tile.y + (w - x) / 2 - d | 0;
      } else if (c === "slopeLUU1") {
        this.y = tile.y + (w - x) * 2 - d | 0;
      } else if (c === "slopeLUU2") {
        this.y = tile.y + w - x * 2 - d | 0;
      }
      this.airborne = false;
    }

    positionUnderSolid(tile) {
      let layer = this.level.solidLayer;
      let u = layer.tileHeight - this.hitbox.up;

      if (!tile) {
        return;
      }

      let x = this.x - tile.x | 0;
      let w = layer.tileWidth;
      let c = tile.ctype;
      if (c === "solid") {
        this.y = tile.y + u | 0;
      } else if (c === "slopeLD") {
        this.y = tile.y + x + u | 0;
      } else if (c === "slopeRD") {
        this.y = tile.y + w - x + u | 0;
      } else if (c === "slopeLLD1") {
        this.y = tile.y + (w + x) / 2 + u | 0;
      } else if (c === "slopeLLD2") {
        this.y = tile.y + x / 2 + u | 0;
      } else if (c === "slopeLDD1") {
        this.y = tile.y + x * 2 + u | 0;
      } else if (c === "slopeLDD2") {
        this.y = tile.y + x * 2 - w + u | 0;
      } else if (c === "slopeRRD1") {
        this.y = tile.y + w - x / 2 + u | 0;
      } else if (c === "slopeRRD2") {
        this.y = tile.y + (w - x) / 2 + u | 0;
      } else if (c === "slopeRDD1") {
        this.y = tile.y + (w - x) * 2 + u | 0;
      } else if (c === "slopeRDD2") {
        this.y = tile.y + w - x * 2 + u | 0;
      }
      this.airborne = false;
    }

    getSolidAt(pointX, pointY) {
      let tile = this.level.solidLayer.getAt(pointX, pointY);

      if (tile) {
        let c = tile.ctype;
        let x = pointX - tile.x | 0;
        let y = pointY - tile.y | 0;
        let w = this.level.solidLayer.tileWidth;

        let conditions = [c === "solid",
                          c === "slopeRU" && y >= x,
                          c === "slopeLU" && y >= w - x,
                          c === "slopeRRU1" && y >= (x + w) / 2,
                          c === "slopeRRU2" && y >= x / 2,
                          c === "slopeRUU1" && y >= x * 2,
                          c === "slopeRUU2" && y >= x * 2 - w,
                          c === "slopeLLU1" && y >= w - x / 2,
                          c === "slopeLLU2" && y >= (w - x) / 2,
                          c === "slopeLUU1" && y >= (w - x) * 2,
                          c === "slopeLUU2" && y >= w - x * 2];

        for (let i = 0, len = conditions.length; i < len; i += 1) {
          if (conditions[i]) {
            return tile;
          }
        }
      }

      return false;
    }
  }

  class Player extends MovingSprite {
    constructor(engine, level) {
      super(engine, level);

      this.width = 32;
      this.height = 40;
      this.hitbox = {
        left: -4,
        up: -12,
        right: 4,
        down: 12
      };

      this.loadSpriteSheet("figplayer");
      this.createAnimation("lookRight", 0, 0, 2, 250);
      this.createAnimation("lookLeft", 0, 40, 2, 250);
      this.createAnimation("walkRight", 64, 0, 4, 100);
      this.createAnimation("walkLeft", 64, 40, 4, 100);
      this.setAnimation("lookRight");

      this.direction = "right";
      this.airborne = false;
      this.directionPressed = false;
      this.jumpStillPressed = false;
      this.horizVel = 0;
      this.vertVel = 0;
      this.flyMode = false;
      this.coinCount = 0;
      this.jumpSound = this.level.getSoundAsset("boing");

      this.toCollect = [];
    }

    update(tick, delta) {
      super.update(tick, delta);

      if (this.flyMode) {
        this.handleFlyModeKeys(delta);
      } else {
        this.handleKeys(delta);
      }
      this.chooseAnimation();
      this.handleCollecting();

      this.updateCamera();
    }

    checkCollisions(delta) {
      if (!this.flyMode) {
        super.checkCollisions(delta);
      }

      for (let i = 0, len = this.level.objects.length; i < len; i += 1) {
        let obj = this.level.objects[i];

        if (obj.isCollectible && this.closeTo(obj, COLLECTION_PROXIMITY) || obj.y > 10000) {
          this.collect(obj);
        }
      }
    }

    handleFlyModeKeys(delta) {
      this.directionPressed = false;
      if (this.engine.isPressed("right")) {
        this.direction = "right";
        this.directionPressed = true;
        this.horizVel += 80 * delta;
        this.horizVel = Math.min(Math.max(this.horizVel, 1), 8);
      }
      if (this.engine.isPressed("left")) {
        this.direction = "left";
        this.directionPressed = true;
        this.horizVel -= 80 * delta;
        this.horizVel = Math.max(Math.min(this.horizVel, -1), -8);
      }
      if (this.engine.isPressed("up")) {
        this.directionPressed = true;
        this.vertVel -= 80 * delta;
        this.vertVel = Math.max(Math.min(this.vertVel, -1), -8);
      }
      if (this.engine.isPressed("down")) {
        this.directionPressed = true;
        this.vertVel += 80 * delta;
        this.vertVel = Math.min(Math.max(this.vertVel, 1), 8);
      }
    }

    handleMovement(delta) {
      if (this.flyMode) {
        this.x += this.horizVel | 0;
        this.y += this.vertVel | 0;
        if (Math.abs(this.horizVel) < 0.1) {
          this.horizVel = 0;
        }
        if (Math.abs(this.vertVel) < 0.1) {
          this.vertVel = 0;
        }
      } else {
        super.handleMovement(delta);
      }
    }

    handleKeys(delta) {
      this.directionPressed = false;
      if (this.engine.isPressed("right")) {
        this.direction = "right";
        this.directionPressed = true;

        this.horizVel += 20 * delta;
        this.horizVel = Math.min(this.horizVel, 8);
      } else if (this.engine.isPressed("left")) {
        this.direction = "left";
        this.directionPressed = true;

        this.horizVel -= 20 * delta;
        this.horizVel = Math.max(this.horizVel, -8);
      }

      if (this.engine.isPressed("buttonA") && !this.jumpStillPressed && !this.airborne) {
        this.vertVel = -5.5;
        this.airborne = true;
        this.jumpStillPressed = true;
        this.engine.playSound(this.jumpSound);
      }

      if (!this.engine.isPressed("buttonA")) {
        this.jumpStillPressed = false;
      }
    }

    chooseAnimation() {
      if (this.directionPressed) {
        if (this.direction === "right") {
          this.setAnimation("walkRight");
        } else {
          this.setAnimation("walkLeft");
        }
      } else {
        if (this.direction === "right") {
          this.setAnimation("lookRight");
        } else {
          this.setAnimation("lookLeft");
        }
      }
    }

    closeTo(item, distance) {
      if (item === this) {
        return null;
      }

      let dx = item.x - this.x;
      let dy = item.y - this.y;

      return Math.sqrt(dx * dx + dy * dy) <= distance;
    }

    collect(item) {
      item.isCollectible = false;
      this.toCollect.push(item);
      item.vertVel = 0;
      item.setAnimation("destroy");
      this.coinCount += 1;
    }

    isOnAnySolid(tile) {
      return tile && (tile.ctype === "solid" ||
                      this.isOnSlantRight(tile) ||
                      this.isOnSlantLeft(tile));
    }

    isOnSlantRight(tile) {
      if (tile.ctype === "slopeRU") {
        let x = this.x + 16 - tile.x | 0;
        let y = this.y + 32 - tile.y | 0;

        if (y >= x) {
          return true;
        }
      }

      return false;
    }

    isOnSlantLeft(tile) {
      if (tile.ctype === "slopeLU") {
        let x = this.x + 16 - tile.x | 0;
        let y = this.y + 32 - tile.y | 0;

        if (y >= 15 - x) {
          return true;
        }
      }

      return false;
    }

    handleCollecting() {
      let ratio = 0.2;
      let toRemove = [];

      for (let i = 0; i < this.toCollect.length; i += 1) {
        let obj = this.toCollect[i];

        obj.x -= (obj.x - this.x) * ratio;
        obj.y -= (obj.y - this.y) * ratio;

        if (this.closeTo(obj, 8)) {
          obj.destroy();
          toRemove.push(obj);
        }
      }

      for (let i = 0; i < toRemove.length; i += 1) {
        this.toCollect.splice(this.toCollect.indexOf(toRemove[i]), 1);
      }
    }

    updateCamera() {
      let offset;

      if (this.direction === "right") {
        offset = 40;
      } else {
        offset = -40;
      }

      this.engine.setCamera(this.x + this.width / 2 + offset, this.y + this.height / 2);
    }

    draw(g) {
      super.draw(g);
      if (this.engine.debugEnabled) {
        this.engine.addTopRightDebugLine(`Airborne: ${this.airborne}`);
        g.fillStyle = "rgba(255, 64, 192, 0.33)";
        g.fillRect(this.x + this.hitbox.left, this.y + this.hitbox.up,
                  this.hitbox.right - this.hitbox.left, this.hitbox.down - this.hitbox.up);
      }
    }
  }

  class Score extends figengine.FontSprite {
    constructor(engine, level) {
      super(engine, level, "score");

      this.textAlign = "right";
      this.textBaseline = "top";
      this.x = this.engine.viewportWidth / 2 - 8 | 0;
      this.y = -this.engine.viewportHeight / 2 + 8 | 0;
      this.opacity = 1;
      this.oldCoinCount = null;
      this.changeTick = null;
    }

    update(tick) {
      if (!this.engine.level || !this.engine.level.player) {
        return;
      }

      let coinCount = this.level.player.coinCount;
      if (coinCount != this.oldCoinCount || this.changeTick == null) {
        this.text = `${coinCount * 100}`;
        this.changeTick = tick;
        this.opacity = 1;
        this.oldCoinCount = coinCount;
      }

      if (tick >= this.changeTick + 3000) {
        if (this.opacity > 0.5) {
          this.opacity -= 0.01;
        }
      }
    }

    draw(g) {
      g.save();
      g.globalAlpha = this.opacity;
      super.draw(g);
      g.restore();
    }
  }

  class Floaty extends figengine.SmartFontSprite {
    constructor(engine, level) {
      super(engine, level, "floaty");

      this.textAlign = "center";
      this.textBaseline = "middle";

      this.climbed = 0;
      this.blinking = false;
      this.drawMe = true;
    }

    update(tick, delta) {
      let climb = delta * 25;
      this.climbed += climb;
      this.y -= climb;

      if (this.climbed > 32) {
        this.blinking = true;
      }
      if (this.climbed >= 48) {
        this.destroy();
      }
    }

    draw(g) {
      if (this.blinking) {
        this.drawMe = !this.drawMe;
      }

      if (this.drawMe) {
        super.draw(g);
      }
    }

    destroy() {
      this.level.removeObject(this);
    }
  }

  function makeCoinLike(obj) {
    obj.width = 8;
    obj.height = 8;
    obj.loadSpriteSheet("coin");
    obj.createAnimation("create", 0, 8, 8, 100, "default");
    obj.createAnimation("default", 0, 0, 4, 100);
    obj.createAnimation("destroy", 32, 0, 4, 100);
    obj.setAnimation("create");

    obj.hitbox = {
      left: -2,
      up: -2,
      right: 2,
      down: 2
    };

    obj.isCollectible = true;
    obj.destroy = function() {
      let floaty = new Floaty(this.engine, this.level);
      floaty.x = this.x;
      floaty.y = this.y;
      floaty.text = WORDS[Math.random() * WORDS.length | 0];

      let sound = this.level.getSoundAsset("coin-ching");
      this.engine.playSound(sound);

      this.level.addObject(floaty);
      this.level.removeObject(this);
    };
  }

  class StaticCoin extends figengine.Sprite {
    constructor(engine, level) {
      super(engine, level);

      makeCoinLike(this);
    }
  }

  class Coin extends MovingSprite {
    constructor(engine, level) {
      super(engine, level);

      makeCoinLike(this);
    }
  }

  figshario.MovingSprite = MovingSprite;
  figshario.Player = Player;
  figshario.Score = Score;
  figshario.Floaty = Floaty;
  figshario.StaticCoin = StaticCoin;
  figshario.Coin = Coin;
  this.figshario = figshario;
}).call(this);