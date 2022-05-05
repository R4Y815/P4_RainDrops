import React, { useState, useRef, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function Camera() {
  const videoRef = useRef();
  const photoRef = useRef();
  const downloadRef = useRef();
  const [hasPhoto, setHasPhoto] = useState(false);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 1920, height: 1080 },
      })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // useEffect to load video function on start,
  // it is important to set useEffect based on state of videoRef
  useEffect(() => {
    getVideo();
  }, [videoRef]);

  const takePhoto = () => {
    const width = 414;
    const height = width / (16 / 9);

    const video = videoRef.current;
    const photo = photoRef.current;
    photo.width = width;
    photo.height = height;

    const context = photo.getContext('2d');
    context.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);
  };

  const closePhoto = () => {
    const photo = photoRef.current;
    // to get a CanvasRenderingContext2D instance,
    // you must first have an HTML canvas element to work with
    // to get the canvas's 2D rendering context,
    // we call getContext() on the <canvas> element,
    // supplying '2d' as the argument
    const context = photo.getContext('2d');

    context.clearRect(0, 0, photo.width, photo.height);

    setHasPhoto(false);
  };

  const downloadPhoto = () => {
    // get img URI from canvas object
    const canvas = photoRef.current;
    const imageUrl = canvas.toDataURL('image/jpg', 1.0);
    console.log('imageURI =', imageUrl);
    // create a dummy anchor element
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `image${Math.floor(Math.random() * 1000)}.jpg`; // this file name has to have random count and has to be linked to StateVariable as name of photo to comment
    document.body.appendChild(a);
    a.click();
  };

  return (
    <div>
      <div className="camera border border-primary">
        <video ref={videoRef} />
        <button
          className="cameraBtn"
          type="button"
          onClick={takePhoto}
        >
          SNAP!
        </button>
      </div>
      <div className={`result ${hasPhoto ? 'hasPhoto' : ''}`}>
        <canvas ref={photoRef} />
        <span>
          <button
            className="cameraBtn"
            type="button"
            onClick={closePhoto}
          >
            CLOSE!
          </button>
        </span>
        <span>
          <button
            type="button"
            ref={downloadRef}
            href=""
            onClick={downloadPhoto}
          >
            DOWNLOAD!
          </button>
        </span>
      </div>
    </div>
  );
}
