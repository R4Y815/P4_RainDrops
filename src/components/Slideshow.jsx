import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';

export default function Slideshow() {
  // STATE Variables Read here
  const [emotion, setEmotion] = useState('zero');
  const [gallery, setGallery] = useState([]);
  const [audioTrack, setAudioTrack] = useState();
  const [songlist, setSongList] = useState([]);
  // use Refs
  const musicPlayerRef = useRef();
  const startAudio = useRef();
  const sourceRef = useRef();

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
       console.log('response received from backend =', response.data);
      const currentGallery = response.data.gallery;
      const display = Array.from(currentGallery);
      setGallery(display);

      const songlist = response.data.songs;
      const songs = Array.from(songlist);
      setSongList(songs);

      // activate
      musicPlayerRef.current.hidden = false;
      musicPlayerRef.current.play();
    });
  };

       // set audio track based on emotion selected
      switch (emotion) {
        case 'console':
          sourceRef.src='music/console/FixYou-Coldplay.mp3';
          break;
        case 'family':
          sourceRef.src='music/family/IfWeHaveEachOther-AlecBenjamin.mp3';
          break;
        case 'father':
          sourceRef.src='music/father/NotAllHeroesWearCapes-OwlCity.mp3';
          break;
        case 'inspire':
          sourceRef.src='music/inspire/KingsandQueens-ThirtySecondstoMars.mp3';
          break;
        case 'joy':
          sourceRef.src='music/joy/OpenHappiness-ButchWalker.mp3';
          break;
        case 'lifepartner':
          sourceRef.src='music/lifepartner/Enchanted-OwlCity.mp3';
          break;
        case 'lyft':
          sourceRef.src='music/lyft/High-LighthouseFamily.mp3';
          break;
        case 'motivate':
          sourceRef.src='music/motivate/FightSong-RachelPlatten.mp3';
          break;
        case 'reassure':
          sourceRef.src='music/reassure/ByYourSide-TenthAvenueNorth.mp3';
          break;
        case 'recallGoodness':
          sourceRef.src='music/recall/LostInSpace-LighthouseFamily.mp3';
          break;
        case 'silly':
          sourceRef.src='music/silly/GangstasParadise-Coolio.mp3';
          break;
        case 'wonder':
          sourceRef.src='music/wonder/ToTheSky-OwlCity.mp3';
          break;
        default:
          sourceRef.src='music/family/SeeYouAgain-CharliePuth.mp3';
      }
      console.log('emotion =', emotion);
      console.log('audioTrack =', audioTrack);

  return (
    <div>
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
                  <option value="father">father`s day</option>
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
        {/* <iframe
          title="startPlay"
          src="music/silence.mp3"
          allow="autoplay"
          ref={startAudio}
          style={{ display: 'none' }}
        /> */}
       
        <audio
          ref={musicPlayerRef}
          /* autoPlay
          muted */
          /* className="audPlyrColor" */
          controls
          loop
          hidden="true"
        >  
          <source 
          ref={sourceRef}
          type="audio/mp3" />
        </audio>
        <Carousel fade>
          {gallery.map((entry) => (
            <Carousel.Item interval={2000}>
              <Container className="p-4">
                <Row>
                  <Col md="2">
                    <Card className="px-2 pt-1" border="dark">
                      <Card.Img variant="top" src={`photos/${entry.photoName}`} />
                      <Card.Body className="px-0 pb-2 pt-4">
                        <Card.Text className="mb-2" style={{ color: '#000' }}>
                          {entry.comment}
                        </Card.Text>
                        <br />
                        <Card.Text className="mb-1 py-0" style={{ color: '#000' }}>
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
      </div>

    </div>

  );
}
