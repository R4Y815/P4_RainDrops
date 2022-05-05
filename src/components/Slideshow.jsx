import React, { useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Carousel } from 'react-bootstrap';

export default function Slideshow() {
  // useEffect here to load images from axios
  // OR do we pull it from the StateVariables?
  // problem: I can't pass the stateVariable itself without the property attributes to map.
  const musicPlayerRef = useRef();
  const startAudio = useRef();

  const animals = [
    {
      id: 1,
      filename: 'mathew-schwartz-Fiv1bfEOAds-unsplash.jpg',
      comment: 'saw this bird riding a thermal this afternoon, and somehow made me feel things are gonna get better',
    },
    {
      id: 2,
      filename: 'bruce-jastrow-s_4tNHp_p3w-unsplash.jpg',
      comment: 'Looks ugly as heck but i think it was probably sunbathing, instead of trying to pose for my camera',
    },
    {
      id: 3,
      filename: 'michael-baird-ST6YltRNdGA-unsplash.jpg',
      comment: 'Look at that awesome form...',
    },
  ];

  return (
    <div>
      <iframe
        title="startPlay"
        src="music/silence.mp3"
        allow="autoplay"
        ref={startAudio}
        style={{ display: 'none' }}
      />
      <audio
        ref={musicPlayerRef}
        autoPlay
        muted
        controls
        loop
      >
        {/* <source src="music/ToTheSky-OwlCity.ogg" type="audio/ogg" /> */}
        <source src="music/ToTheSky-OwlCity.mp3" type="audio/mp3" />
      </audio>
      <Carousel fade>
        {animals.map((animal) => (
          <Carousel.Item interval={2000}>
            <Container className="p-4">
              <Row>
                <Col md="2">
                  <Card className="px-4 pt-4" border="dark">
                    <Card.Img variant="top" src={`animals/${animal.filename}`} />
                    <Card.Body className="px-0 pb-4 pt-4">
                      <Card.Text className="mb-4" style={{ color: '#000' }}>
                        {animal.comment}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
            {/*           <img />
          <Carousel.Caption>
            <h3> Gallery Name: Animals </h3>
            <p> Comment: Amet excepteur aute fugiat amet dolore deserunt voluptate. </p>
          </Carousel.Caption> */}
          </Carousel.Item>
        ))}
      </Carousel>
    </div>

  );
}
