/* eslint-disable quotes */
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
import AudioPlayer from './AudioPlayer.jsx';

export default function Slideshow() {
  // STATE Variables Read here
  const [emotion, setEmotion] = useState('zero');
  const [gallery, setGallery] = useState([]);
  const [mp3List, setMp3List] = useState([]);

  const [audioStatus, setAudioStatus] = useState("dontLoad");
  // use Refs
  const formRef = useRef();
  const cfmEmotionBtnRef = useRef();

  useEffect(() => {
    axios
      .get('/allCategories')
      .then((response) => {
        console.log('responses for Category Index =', response.data.allCategories);
      });
  }, []);

  // FN: get Photos on specific category from db
  const confirmGallery = () => {
    axios.get(`/gallery/${emotion}`).then((response) => {
      console.log('response.data received from backend =', response.data);
      console.log(response.data.results.gallery);
      console.log(response.data.results.songs);
      console.log(response.data.results.category);
      // set photo Display
      const currentGallery = response.data.results.gallery;
      const display = Array.from(currentGallery);
      setGallery(display);

      // Set songUrllist
      const catLabel = response.data.results.category;
      const songList = response.data.results.songs;
      const songs = [];
      for (let i = 0; i < songList.length; i += 1) {
        const songUrl = `music/${catLabel}/${songList[i].title}.mp3`;
        songs.push(songUrl);
      }

      // activate music
      /* handleSongChange(); */
      /* audioPlayerRef.hidden = false; */
      /* audioPlayerRef.current.play(); */
      setMp3List(songs);

      /* audioPlayerRef.load(); */
      setAudioStatus('load');

      // hide the form and button
      formRef.current.hidden = true;
      cfmEmotionBtnRef.current.hidden = true;
    });
  };

  console.log('mp3List =', mp3List);

  return (
    <div>
      <Container className="p-0">
        <Row>
          <Col md="2">
            <Card className="px-0 pt-0" border="dark">
              <Card.Body className="p-1">
                <select
                  ref={formRef}
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                >
                  <option value="console" key="console">in need of consolation</option>
                  <option value="family" key="family">miss my family</option>
                  <option value="father" key="father">father`s day</option>
                  <option value="inspire" key="inspire">feel dejected and bored</option>

                  <option value="joy" key="joy">feel happy</option>
                  <option value="lifepartner" key="lifepartner">thinking of him/her...</option>
                  <option value="lyft" key="lyft">going thru a very hard time...</option>
                  <option value="motivate" key="motivate">feels like Im never win</option>

                  <option value="reassure" key="reassure">feeling tired and unsure of myself</option>
                  <option value="recallGoodness" key="recallGoodness">feeling like giving up</option>
                  <option value="silly" key="silly">feeling very stressed</option>
                  <option value="wonder" key="wonder">the world is a terrible place</option>
                </select>
                <Button
                  ref={cfmEmotionBtnRef}
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

      <div>
        { audioStatus === "load" ?? (
        <AudioPlayer mp3List={mp3List} />
        )}
      </div>

    </div>

  );
}
