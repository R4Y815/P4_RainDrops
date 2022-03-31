/* may not be able to import pg? */
import axios from 'axios';
import './main.scss'; /* for stylesheet */

/* BELOW: Test examples for importing modules to front-end */
import { mouse } from './mouse.js';
import 'core-js/es/function';
import { arrow } from './arrowFn.js';

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
/* ABOVE: Test examples for importing modules to front-end */


// Test Example: Make a request for all the items
axios.get('/items')
  .then((response) => {
    // handle success
    console.log(response.data.items);

    const itemCont = document.createElement('div');

    response.data.items.forEach((item) => {
      const itemEl = document.createElement('div');
      itemEl.innerText = JSON.stringify(item);
      itemEl.classList.add('item');
      document.body.appendChild(itemEl);
    });

    document.body.appendChild(itemCont);
  })
  .catch((error) => {
    // handle error
    console.log(error);
  });

  