import React, { useState, useRef } from 'react';
import axios from 'axios';
import './styles.scss';

// Import the other child component files here:
import Page from './components/PageV2.jsx';
import Slideshow from './components/Slideshow.jsx';
import Uploader from './components/UploaderFile.jsx';
import UploaderForSeeds from './components/UploaderForSeeds.jsx';
import Camera from './components/Camera.jsx';

export default function App() {
  const objTest = {
    a: 2,
    v: 'b',
    q: 12,
    g: '2',
  };

  return (
    <div className="App">
      <UploaderForSeeds />
      {/* <Camera /> */}
      {/* <Uploader /> */}
      {/* <Slideshow /> */}
      {/* <Page /> */}
      {/* <div className="container">
        <div className="row">
          <div className="col">
              Bs Grid Template
          </div>
        </div>
      </div> */}
    </div>

  );
}
