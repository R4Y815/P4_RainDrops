import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function Page() {
  const [comment, setComment] = useState('');
  const [photoName, setPhotoName] = useState('');

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

    // arrangements for photoName
    const filename = `image${Math.floor(Math.random() * 1000)}.png`;
    setPhotoName(filename);
    console.log('filename before download', filename);
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

  const send = (file) => {
    const data = new FormData();
    data.append('originalname', photoName);
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

  const uploadPhoto = () => {
    // get img URI from canvas object
    const canvas = photoRef.current;
    console.log('canvas =', canvas);
    // canvas to base64
    /* const imageUri = canvas.toDataURL('image/png'); // if jpg, write jpeg
    console.log('imageURI =', imageUri); */
    // create a dummy anchor element
    /*     const a = document.createElement('a');
    a.href = imageUri;
    a.download = photoName; // this file name has to have random count and has to be linked to StateVariable as name of photo to comment
    document.body.appendChild(a);
    console.log('a=', a);
    a.click(); */

    // TRY: canvas to blob first
    canvas.toBlob((blob) => send(blob), 'image/png', 1.0);

    // ALREADY TRIED TO STICK UPLOADER COMPONENT NEW FORM DATA FUNCTION OVER HERE BUT IT DIN WORK
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
      <img src="/photos/5d820cb3bdc163e32bc00fd3b9645787" />
      <div className={`result ${hasPhoto ? 'hasPhoto' : ''}`}>
        <Container className="p-4">
          <Row>
            <Col md="2">
              <Card className="px-1 pt-2" border="dark">
                <canvas ref={photoRef} />
                <Card.Body>
                  <Card.Text>
                    INPUT for User's Comments
                  </Card.Text>
                  <div className="d-flex justify-content-end">
                    <div>
                      <button
                        className="cameraBtn"
                        type="button"
                        onClick={closePhoto}
                      >
                        CLOSE!
                      </button>

                    </div>
                    <div>
                      <button
                        type="button"
                        ref={downloadRef}
                        href=""
                        onClick={uploadPhoto}
                      >
                        UPLOAD!
                      </button>
                    </div>

                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
