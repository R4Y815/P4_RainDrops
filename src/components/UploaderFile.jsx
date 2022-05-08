import React, { useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

export default function Uploader() {
  const [name, setName] = useState();
  const [file, setFile] = useState();
  const send = (event) => {
    const data = new FormData();
    /*  data.append('name', name); */
    data.append('file', file);
    console.log('file =', file);
    console.log('new FormData sent from front End =', data);
    axios
      .post('/upload/photo', data)
      .then((response) => { console.log('response.data.imagePath =', response.data.imagePath); })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <form action="#">
        <div className="flexCtr">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            onChange={(event) => {
              const nameInput = event.target.value;
              setName(nameInput);
            }}
          />
        </div>
        <div className="flexCtr">
          <label htmlFor="file">File</label>
          <input
            type="file"
            id="file"
            accept=".jpg"
            onChange={(event) => {
              const uploadedFile = event.target.files[0];
              setFile(uploadedFile);
            }}
          />
        </div>
        <div className="flexCtr btnSmallWidth">
          <button type="button" onClick={send}>Submit</button>
        </div>
      </form>
      {/* <img src="/photos/7eee7645429a733070bdc7aeda648871" /> */}
    </div>
  );
}
