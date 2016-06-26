import MovingSprite from "../../figshario/objects/moving-sprite";
import Floaty from "./floaty";

let WORDS = `Good!, Nice!, Awesome!, Marvelous!, Superb!, Fantastic!, OK!, Bravo!, Bingo!, Ka Ching!, Grand!, Awoooga!,
    Haha!, Yabba Dabba Doo!, Scooby Dooby Doo!, SuperCaliFragilisticExpalidocious!, WOW!, Groovy!, Eureka!, Hurray!,
    Yahoo!, Yes!, Yeah!, Aha!, Abracadabra!, Alleluia!, Aloha!, Allright!, Amen!, Aright!, Yeaaaah!, Aye!,
    Ba Da Bing Ba Da Boom!, Ba Dum Tss!, BANG!, Bazinga!, Bless You!, Blimey!, Boo Ya!, Bravissimo!, Bring It On!,
    Bulls Eye!, Checkmate!, Cheers!, Congrats!, Congratulations!, Derp!, Diddly Doo!, Boing!, Doing!, Ermagerd!,
    Felicitations!, Fire in the Hole!, Fo Real!, Fo Sho!, Geronimo!, Golly!, Golly Gee!, Goo Goo Ga Ga!, Goo Goo!,
    Gratz!, Great!, Halleluiah!, Hell Yeah!, Heya!, Hocus Pocus!, Hoorah!, Ka Boom!, Ka Pow!, Meow!, Nyan-Nyan!,
    Nice One!, Oh Yeah!, Oh My!, OMG!, OMFG!, ROTF!, ROTFLOL!, LMAO!, LMFAO!, Oompa Loompa!, Peace!, POW!, Rock On!,
    The cake is a lie!, UUDDLRLRBA!, Ooh La La!, Ta Dah!, Viva!, Voila!, Way to Go!, Well Done!, Wazzup!, Woo Hoo!,
    Woot!, W00T!, XOXO!, You Know It!, Yoopee!, Yummy!, ZOMG!, Zowie!, ZZZ!, XYZZY!
`.trim().split(/\s*,\s*/);

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

  // checkCollisions() {
  //   if (!this.airborne) {
  //     this.horizVel = (Math.random() - 0.5) * 4;
  //     this.vertVel = -1.5;
  //     this.airborne = true;
  //   }

  //   super.checkCollisions();
  // }

  destroy() {
    let floaty = new Floaty(this.engine);
    floaty.x = this.x;
    floaty.y = this.y;
    floaty.text = WORDS[Math.random() * WORDS.length | 0];

    this.level.addObject(floaty);
    this.level.removeObject(this);
  }
}
