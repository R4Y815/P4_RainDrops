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
  const [audioTrack, setAudioTrack] = useState();
  const [songlist, setSongList] = useState([]);
  // use Refs
  const musicPlayerRef = useRef();
  const startAudio = useRef();
  const formRef = useRef();
  const cfmEmotionBtnRef = useRef();

  useEffect(() => {
    axios
      .get('/allCategories')
      .then((response) => {
        console.log('responses for Category Index =', response.data.allCategories);
      });
  }, []);

  // FNs for playlist songs:

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

      // Set songlist
      const songlist = response.data.results.songs;
      const songs = Array.from(songlist);
      setSongList(songs);

      // activate music
      musicPlayerRef.current.hidden = false;
      musicPlayerRef.current.play();

      // hide the form and button
      formRef.current.hidden = true;
      cfmEmotionBtnRef.current.hidden = true;
    });
  };

  // set audio track based on emotion selected
  let track;
  switch (emotion) {
    case 'console':
      track = "music/console/FixYou-Coldplay.mp3";
      break;
    case 'family':
      track = "music/family/IfWeHaveEachOther-AlecBenjamin.mp3";
      break;
    case 'father':
      track = "music/father/NotAllHeroesWearCapes-OwlCity.mp3";
      break;
    case 'inspire':
      track = "music/inspire/KingsandQueens-ThirtySecondstoMars.mp3";
      break;
    case 'joy':
      track = "music/joy/OpenHappiness-ButchWalker.mp3";
      break;
    case 'lifepartner':
      track = "music/lifepartner/Enchanted-OwlCity.mp3";
      break;
    case 'lyft':
      track = "music/lyft/High-LighthouseFamily.mp3";
      break;
    case 'motivate':
      track = "music/motivate/FightSong-RachelPlatten.mp3";
      break;
    case 'reassure':
      track = "music/reassure/ByYourSide-TenthAvenueNorth.mp3";
      break;
    case 'recallGoodness':
      track = "music/recall/LostInSpace-LighthouseFamily.mp3";
      break;
    case 'silly':
      track = "music/silly/GangstasParadise-Coolio.mp3";
      break;
    case 'wonder':
      track = "music/wonder/WhatAWonderfulWorld-LouisArmstrong.mp3";
      break;
    default:
      track = "music/family/SeeYouAgain-CharliePuth.mp3";
  }

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
                  <option value="console">in need of consolation</option>
                  <option value="family">miss my family</option>
                  <option value="father">father`s day</option>
                  <option value="inspire">feel dejected and bored</option>

                  <option value="joy">feel happy</option>
                  <option value="lifepartner">thinking of him/her...</option>
                  <option value="lyft">going thru a very hard time...</option>
                  <option value="motivate">feels like I'm never win</option>

                  <option value="reassure">feeling tired and unsure of myself</option>
                  <option value="recallGoodness">feeling like giving up</option>
                  <option value="silly">feeling very stressed</option>
                  <option value="wonder">the world is a terrible place</option>
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
      <Container className="px-0 mx-0 pt-5 mt-3">
        <Carousel fade indicators={false}>
          {gallery.map((entry) => (
            <Carousel.Item interval={2500} key={uuidv4}>
              <Container className="p-3">
                <Row key={uuidv4}>
                  <Col md="2" key={uuidv4}>
                    <Card className="px-2 pt-2" border="dark" key={uuidv4}>
                      <Card.Img variant="top" src={`photos/${entry.photoName}`} key={uuidv4} />
                      <Card.Body className="px-0 pb-1 pt-3">
                        <Card.Text className="mb-0 pb-0 text-center" style={{ color: '#000' }} key={uuidv4}>
                          {entry.comment}
                        </Card.Text>
                        <br />
                        <Card.Text className="mb-0 py-0 timeStamp" style={{ color: '#000' }} key={uuidv4}>
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
        <div className="text-center">
          {' '}
          <iframe
            title="startPlay"
            src="music/silence.mp3"
            allow="autoplay"
            ref={startAudio}
            style={{ display: 'none' }}
          />
          <audio // eslint-disable-line jsx-a11y/media-has-caption
            ref={musicPlayerRef}
          /* autoPlay
          muted */
          /* className="audPlyrColor" */
            controls
            loop
            hidden="true"
          >
            <source
              type="audio/mp3"
              src="music/wonder/WhatAWonderfulWorld-LouisArmstrong.mp3"
              /* src="music/silly/GangstasParadise-Coolio.mp3" */
            />
          </audio>
        </div>
      </div>
    </div>

  );
}
