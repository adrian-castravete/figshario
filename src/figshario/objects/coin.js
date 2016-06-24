import MovingSprite from "../../figshario/objects/moving-sprite";
import Floaty from "./floaty";

let WORDS = `good nice awesome marvelous superb fantastic ok bravo bingo ka-ching grand awoooga haha
yabba-dabba-doo scooby-dooby-doo supercalifragilisticexpalidocious wow groovy eureka hurray yahoo
yes yeah aha abracadabra alleluia aloha allright amen aright yeaaaah aye ba-da-bing-ba-da-boom
ba-dum-tss bang bazinga bless-you blimey boo-ya bravissimo bring-it-on bulls-eye checkmate cheers
congrats congratulations derp diddly-doo boing doing ermagerd felicitations fire-in-the-hole fo-real
fo-sho geronimo golly golly-gee goo-goo-ga-ga goo-goo gratz great halleluiah hell-yeah heya
hocus-pocus hoorah ka-boom ka-pow meow nyan-nyan nice-one oh-yeah oh-my omg omfg rotf rotflol lmao
lmfao oompa-loompa peace pow rock-on the-cake-is-a-lie uuddlrlrba ooh-la-la ta-dah viva voila
way-to-go well-done wazzup woo-hoo woot w00t xoxo you-know-it yoopee yummy zomg zowie zzz xyzzy
`.trim().split(/\s+/);

export default class Coin extends MovingSprite {
  constructor(engine, level) {
    super(engine, level);

    this.width = 8;
    this.height = 8;
    this.loadSpriteSheet("assets/images/coin.gif");
    this.createAnimation("create", 0, 8, 8, 100, "default");
    this.createAnimation("default", 0, 0, 4, 100);
    this.createAnimation("destroy", 32, 0, 4, 100);
    this.setAnimation("create");

    this.hitbox = {
      left: -2,
      up: -2,
      right: 2,
      down: 2
    };

    this.isCollectible = true;
  }

  checkCollisions() {
    if (!this.airborne) {
      this.horizVel = (Math.random() - 0.5) * 4;
      this.vertVel = -1.5;
      this.airborne = true;
    }

    super.checkCollisions();
  }

  destroy() {
    let floaty = new Floaty(this.engine);
    floaty.x = this.x;
    floaty.y = this.y;
    floaty.text = WORDS[Math.random() * WORDS.length | 0];

    this.level.addObject(floaty);
    this.level.removeObject(this);
  }
}
