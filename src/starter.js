import { Figshario } from './figshario';
//import Preload from './util';

let viewport = document.getElementById('viewport');
let figshario = new Figshario(viewport);
//let preload;
//
//preload = new Preload(figshario);
//preload.preload([
//  'assets/images/grassy.gif',
//  'assets/images/figplayer.gif'
//], function () {
//  figshario.loadLevel('assets/maps/level1.json');
//});

figshario.start();
figshario.loadLevel('assets/maps/level1.json');

resize();
window.addEventListener('resize', resize);
window.addEventListener('keydown', function (evt) {
  let key;

  key = handleKey(evt);

  if (key) {
    figshario.keyDown(key);
    evt.preventDefault();
  }
});
window.addEventListener('keyup', function (evt) {
  let key;

  key = handleKey(evt);

  if (key) {
    figshario.keyUp(key);
    evt.preventDefault();
  }
});

function handleKey(evt) {
  let key;

  switch (evt.keyCode) {
  case 37:
    key = 'left';
    break;
  case 38:
    key = 'top';
    break;
  case 39:
    key = 'right';
    break;
  case 40:
    key = 'down';
    break;
  case 13:
    key = 'start';
    break;
  case 17:
    key = 'button_b';
    break;
  case 32:
    key = 'button_a';
    break;
  case 114:
    key = 'debug';
    break;
  default:
    key = null;
  }

  return key;
}

function resize() {
  figshario.resize(window.innerWidth, window.innerHeight);
}

