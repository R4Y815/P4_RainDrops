import React, { useState, useRef } from 'react';
import axios from 'axios';
import './styles.scss';

// Import the other child component files here:
import Page from './components/Page.jsx';

export default function App() {
  const objTest = {
    a: 2,
    v: 'b',
    q: 12,
    g: '2',
  };

  return (
    <div>
      <Page />
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
