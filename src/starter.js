"use strict";

import Figshario from './figshario';

let viewport = document.getElementById('viewport');
let figshario = new Figshario(viewport);
figshario.setString('Adrian Castravete');
figshario.generate();

let textField = document.createElement('input');
textField.setAttribute('type', 'text');
textField.setAttribute('size', '40');
textField.setAttribute('value', '');
textField.addEventListener('keyup', function () {
  let value = textField.value;

  if (/^[0-9a-f]+$/i.test(value)) {
    figshario.setHexString(value);
  } else {
    figshario.setString(value);
  }
  figshario.generate();
});
document.body.appendChild(textField);

