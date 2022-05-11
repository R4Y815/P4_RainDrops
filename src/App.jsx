import React, { useState, useRef } from 'react';
import axios from 'axios';
import './styles.scss';
import Button from 'react-bootstrap/Button';

// Import the other child component files here:
import Page from './components/PageV2.jsx';
import Slideshow from './components/Slideshow.jsx';
import UploaderForSeeds from './components/UploaderForSeeds.jsx';

export default function App() {
  const cameraRef = useRef();
  const galleryRef = useRef();

  const display = 'gallery';

  return (
    <div className="App">
      <div className="container navBar">
        <div className="row">
          <div className="col-4 text-center">
            <Button
              type="button"
              onClick={() => {
                cameraRef.current.hidden = false;
                galleryRef.current.hidden = true;
              }}
              className="bkgd"
            >
              📷
            </Button>
          </div>
          <div className="col-4 text-center">
            <Button
              type="button"
              onClick={() => {
                galleryRef.current.hidden = true;
                cameraRef.current.hidden = true;
              }}
              className="filmProjector bkgd"
            >
              🏠
            </Button>
          </div>
          <div className="col-4 text-center">
            <Button
              type="button"
              onClick={() => {
                galleryRef.current.hidden = false;
                cameraRef.current.hidden = true;
              }}
              className="filmProjector bkgd"
            >
              🎥
            </Button>
          </div>
        </div>
      </div>

      {/* <UploaderForSeeds /> */}

      <div
        hidden
        ref={galleryRef}
      >
        <Slideshow />
      </div>
      <div
        hidden
        ref={cameraRef}
      >
        <Page />
      </div>
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
