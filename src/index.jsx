/* may not be able to import pg? */
import axios from 'axios';
import 'core-js/es/function';
import React from 'react';
import { render } from 'react-dom';
import './main.scss'; /* for stylesheet */


/* Javascript variable initialisation */
const myRandomNum = Math.random();

/* url variable */
const myURL = 'http://google.com';

// Create JSX element and log it.
const myEl = (
  <div>
    <h1 className="wowText">
      Hey <span className="warning">Wow!</span>
    </h1>
    {/* <p>Lorem Ipsum!!</p> */}
    <p>Random value = {Math.random() * 100}</p>
    <a href={myURL}>Random Value: {Math.random() * 100}</a>
  </div>
);
console.log('myEl: ', myEl);

// Create root element to render other elements into, add root element to DOM.
const rootElement = document.createElement('div');
document.body.appendChild(rootElement);

// Render the myEl JSX element into the root element with React.
render(myEl, rootElement);