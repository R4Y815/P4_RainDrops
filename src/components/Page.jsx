import React, { useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function Page({ animal }) {
  const [comment, setComment] = useState('');

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
      {animals.map((animal) => (
        <Container className="p-4">
          <Row>
            <Col md="2">
              <Card className="px-4 pt-4" border="dark">
                <Card.Img variant="top" src={`animals/${animal.filename}`} />
                <Card.Body className="px-0 pb-4 pt-4">
                  <Card.Text className="mb-4" style={{ color: '#000' }}>
                    {animal.comment}
                  </Card.Text>
                  <div className="d-flex justify-content-end">
                    <Button variant="primary" className="fontColor">
                      Submit
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      ))}

      <br />
      <h2 style={{ color: 'blue' }}>
        hello
      </h2>

      {/* how they are feeling after taking the photo */}
    </div>
  );
}
