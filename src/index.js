/* may not be able to import pg? */
import { cat } from './cat.js';
import { mouse } from './mouse.js';
import 'core-js/es/function';
import { arrow } from './arrowFn.js';
import './main.scss'; /* for stylesheet */


console.log('This is from index.js');
console.log('This is from cat.js', cat);
console.log('This is from mouse.js', mouse);

const obj = {
  a: 'apple',
  b: 'buffalo',
};

const newObj = { ...obj, c: 'cheetah' };
console.log('new obj', newObj);

const result = arrow();
console.log('result', result);