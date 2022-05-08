/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable object-shorthand */
import React, { useState, useRef } from 'react';
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

export default function UploaderForSeeds() {
  // STOCK STATEVARs generated from Uploader
  const [photoName, setPhotoName] = useState();
  const [file, setFile] = useState();

  // BORROWED State Variables (from PageV2)
  const [mood, setMood] = useState('humor');

  // BORROWED input Refs (from PageV2)
  const commentRef = useRef();

  const send = (event) => {
    const data = new FormData();
    /*  data.append('name', name); */
    data.append('file', file);
    console.log('file =', file);
    console.log('new FormData sent from front End =', data);
    axios
      .post('/upload/photo', data)
      .then((response) => {
        /* setPhotoName(response.data.imagePath); */
        setPhotoName(response.data.imageKey);
      }).catch((error) => {
        console.log(error);
      });
  };

  // BORROWED CATEGORY GENERATOR (from PageV2):
  function assignCategory(moodInput) {
    let categoryId;

    switch (mood) {
      case 'love':
        categoryId = 6; // 'lifepartner'
        break;
      case 'joy':
        categoryId = 5; // 'joy'
        break;
      case 'amazed':
        categoryId = 12; // 'wonder'
        break;
      case 'inspired':
        categoryId = 4; // 'inspire'
        break;
      case 'motivated':
        categoryId = 8; // 'motivate'
        break;
      case 'humor':
        categoryId = 11; // 'silly'
        break;
      default:
        categoryId = 11; // 'silly'
    }
    return categoryId;
  }

  // Uploading SEED ENTRY
  const uploadSeedEntry = () => {
    // BOOROWED TIMESTAMP for Photo Taken (from PageV2)
    const newTimeString = moment().format('dddd,  D-MMM-YYYY, h:mm a');
    // BORROWED Construct new Seed Entry Object (from PageV2)
    const newEntry = {
      photoName: photoName,
      comment: commentRef.current.value,
      mood,
      categoryId: assignCategory(mood),
      timePrint: newTimeString,
    };
    console.log('SeedEntry Object formed =', newEntry);
    axios
      .post('/newEntry', newEntry)
      .then((response) => {
        console.log(response);
        commentRef.current.value = null;
        setPhotoName(undefined);
        setFile();
      })
      .catch((error) => { console.log(error); });
  };

  console.log('photoName =', photoName);
  return (
    <div>
      <form action="#">
        <div className="flexCtr">
          <label
            htmlFor="file"
            className="pb-2"
          >
            Photo Journal Seed Entry Upload
          </label>

          <input
            type="file"
            id="file"
            accept=".jpg"
            onChange={(event) => {
              const uploadedFile = event.target.files[0];
              setFile(uploadedFile);
            }}
            className="pb-3"
          />
        </div>
        <div className="px-2 py-1">
          <Button
            type="button"
            onClick={send}
            className="btnGrey"
          >
            Upload Photo
          </Button>
        </div>
      </form>
      <Container className="p-0">
        <Row>
          <Col md="2">
            {photoName !== undefined
            && (
            <Card className="px-0 pt-0" border="dark">
              <img
                src={`/photos/${photoName}`}
                /* width="414"
                height="233" */
                alt="Newly Uploaded"
              />
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
                  {/* <div>
                      <Button
                        className="closeBtn bdrRd100"
                        type="button"
                        onClick={closePhoto}
                      >
                        ❌
                      </Button>
                    </div> */}
                  <div>
                    <Button
                      className="cameraBtn bdrRd100"
                      type="button"
                      onClick={uploadSeedEntry}
                    >
                      ✔
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
