/* eslint-disable object-shorthand */
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import MoodSelector from './MoodSelector.jsx';

export default function Page() {
  // STATEVARs generated from Page
  const [mood, setMood] = useState('joy');
  const [photoName, setPhotoName] = useState('');

  // CODE BLOCK FOR USING CAMERA
  const videoRef = useRef();
  const photoRef = useRef();
  const [hasPhoto, setHasPhoto] = useState(false);

  // inputs
  const commentRef = useRef();

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

  // LOAD VIDEO AT THE START
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

  // FUNCTION TO SEND CAMERA STILLSHOT FROM CANVAS TO APP BACKEND
  const send = (file) => {
    const data = new FormData();
    data.append('originalname', photoName);
    data.append('file', file);
    console.log('file =', file);
    console.log('new FormData sent from front End =', data);
    axios
      .post('/upload/photo', data)
      .then((response) => {
        /* console.log('response.data.imagePath =', response.data.imagePath); */
        console.log('response.data.imageKey =', response.data.imageKey);

        // TIMESTAMP for Photo Taken
        const newTimeString = moment().format('dddd,  D-MMM-YYYY, h:mm a');

        // Construct new Entry Object
        const newEntry = {
          photoName: response.data.imageKey,
          comment: commentRef.current.value,
          mood: mood,
          timePrint: newTimeString,
        };
        console.log('Entry Object formed =', newEntry);

        // return an axios call here using response data to create new entry from sequelize back end
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // FUNCTION TO UPLOAD PHOTO & COMMENTs
  const uploadEntry = () => {
    // get img URI from canvas object
    const canvas = photoRef.current;

    // CANVAS to Blob and send image to S3
    canvas.toBlob((blob) => send(blob), 'image/png', 1.0);

    // CLOSE Camera slide after entry is submitted
    closePhoto();
  };

  return (
    <div>
      <div className="camera border border-primary">
        <video ref={videoRef}>
          <track default kind="captions" />
        </video>
        <button
          className="cameraBtn"
          type="button"
          onClick={takePhoto}
        >
          SNAP!
        </button>
      </div>
      <div className={`result ${hasPhoto ? 'hasPhoto' : ''}`}>
        <Container className="p-0">
          <Row>
            <Col md="2">
              <Card className="px-0 pt-0" border="dark">
                <canvas ref={photoRef} />
                <Card.Body className="p-1">
                  <ListGroup className="list-group-flush d-flex justify-content-center">
                    <div>
                      <textarea
                        className="px-1 widthSpan"
                        ref={commentRef}
                        type="text"
                        rows="5"
                        cols="22"
                        placeholder="captions, comments, etc"
                        autoFocus
                      />
                    </div>

                    <ListGroupItem className="px-0">
                      <MoodSelector mood={mood} setMood={setMood} />
                    </ListGroupItem>
                  </ListGroup>

                  <div className="d-flex justify-content-end">
                    <div>
                      <Button
                        className="closeBtn bdrRd100"
                        type="button"
                        onClick={closePhoto}
                      >
                        ❌
                      </Button>
                    </div>
                    <div />
                    <Button
                      className="cameraBtn bdrRd100"
                      type="button"
                      onClick={uploadEntry}
                    >
                      ✔
                    </Button>
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
