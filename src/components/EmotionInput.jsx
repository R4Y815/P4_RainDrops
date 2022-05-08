import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import { v4 as uuidv4 } from 'uuid';

import Slideshow from './Slideshow.jsx';

export default function EmotionInput() {
  // state Variables here
  const [emotion, setEmotion] = useState();
  const [displayShow, setDisplayShow] = useState(1);

  useEffect(() => {
    /* axios.get(`/gallery/${category}`).then((response) => {
      /*  console.log('response received from backend =', response); */
    /* const currentGallery = response.data.gallery;
      const display = Array.from(currentGallery);
      setGallery(display);
    }); */

    axios
      .get('/allCategories')
      .then((response) => {
        console.log('responses for Category Index =', response.data.allCategories);
      });
  }, []);

  const confirmGallery = () => {
    setDisplayShow(2);
  };

  return (
    <>
      <Container className="p-0">
        <Row>
          <Col md="2">
            <Card className="px-0 pt-0" border="dark">
              <Card.Body className="p-1">
                <Form.Select
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                >
                  <option value="console">in need of consolation</option>
                  <option value="family">miss my family</option>
                  <option value="father">father's day</option>
                  <option value="inspire">feel dejected and bored</option>

                  <option value="joy">feel happy</option>
                  <option value="lifepartner">thinking of him/her...</option>
                  <option value="lyft">going thru a very hard time...</option>
                  <option value="motivate">feels like I'm never gonna win</option>

                  <option value="reassure">feel worried and anxious</option>
                  <option value="recallGoodness">feel like giving up</option>
                  <option value="silly">feel very stressed</option>
                  <option value="wonder">feel discouraged and hurt</option>
                </Form.Select>
                <Button
                  className="cameraBtn bdrRd100"
                  type="button"
                  onClick={confirmGallery}
                >
                  ✔
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </Container>
      <div>
        {displayShow === 2 ?? (
        <Slideshow emotion={emotion} />
        )}
      </div>
    </>
  );
}
