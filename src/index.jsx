import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.scss'; /* for stylesheet */
import 'core-js/es/function';

import App from './App.jsx';

// RENDERING OUT THE ELEMENT - updated way
const rootEl = document.createElement('div');
document.body.appendChild(rootEl);

const rootComponent = createRoot(rootEl);

rootComponent.render(<App />);

/*
// RA repo:
// create an element that React will render stuff into
const rootElement = document.createElement('div');

// put that element onto the page
document.body.appendChild(rootElement);

// have react render the JSX element into the root element.
render(<App />, rootElement);
 */
