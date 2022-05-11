import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';

export default function Galleria({ gallery }) {
  return (
    <Container className="px-0 mx-0 pt-3 mt-2">
      <Carousel fade indicators={false}>
        {gallery.map((entry, index) => (
          <Carousel.Item interval={2500} key={entry.photoName}>
            <Container className="p-3">
              <Row>
                <Col md="2">
                  <Card className="px-2 pt-2" border="dark">
                    <Card.Img variant="top" src={`photos/${entry.photoName}`} key={index} />
                    <Card.Body className="px-0 pb-1 pt-3">
                      <Card.Text className="mb-0 pb-0 text-center" style={{ color: '#000' }} key={entry.comment}>
                        {entry.comment}
                      </Card.Text>
                      <br />
                      <Card.Text className="mb-0 py-0 timeStamp" style={{ color: '#000' }} key={entry.timePrint}>
                        {entry.timePrint}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
}
