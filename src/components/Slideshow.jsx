/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable quotes */
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Galleria from './Galleria.jsx';

export default function Slideshow() {
  // STATE Variables Read here
  const [emotion, setEmotion] = useState('');
  const [gallery, setGallery] = useState([]);
  const [mp3List, setMp3List] = useState([]);
  // stateVar generated in this AudioPlayer only
  const [data, setData] = useState();

  // use Refs
  const formRef = useRef();
  const cfmEmotionBtnRef = useRef();
  const audioPlayerRef = useRef();
  const sourceRef = useRef();
  const listRef = useRef();

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
      setMp3List(songs);
      /* handleSongChange(); */
      sourceRef.current.src = songs[0];
      audioPlayerRef.current.load();
      audioPlayerRef.current.play();

      // hide the form and button
      /* formRef.current.hidden = true;
      cfmEmotionBtnRef.current.hidden = true; */
    });
  };

  console.log('mp3List =', mp3List);

  function getSongName(fileName) {
    return fileName.split("/")[2].split(".mp3")[0].split("-")[0];
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
                  onClick={(e) => setEmotion(e.target.value)}
                >
                  <option value="console" key="console">in need of consolation</option>
                  <option value="family" key="family">miss my family</option>
                  <option value="father" key="father">miss my Dad</option>
                  <option value="inspire" key="inspire">feel like a loser</option>

                  <option value="joy" key="joy">feel happy</option>
                  <option value="lifepartner" key="lifepartner">I miss him/her...</option>
                  <option value="lyft" key="lyft">Feels like there's no more hope</option>
                  <option value="motivate" key="motivate">feels like the odds are impossible</option>

                  <option value="reassure" key="reassure">Nobody understands my pain</option>
                  <option value="recallGoodness" key="recallGoodness">My life is so bitter</option>
                  <option value="silly" key="silly">Life's so stressful</option>
                  <option value="wonder" key="wonder">The world is so terrible</option>
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
      <Galleria gallery={gallery} />
      <div className="text-center">
        <audio
          ref={audioPlayerRef}
          controls
        >
          <source
            ref={sourceRef}
            src=""
          />
        </audio>
        <ul
          ref={listRef}
          className="text-center mx-0 px-0"
          onClick={(e) => {
            e.preventDefault();
            const elm = e.target;
            sourceRef.current.src = elm.getAttribute('data-value');

            audioPlayerRef.current.load();
            audioPlayerRef.current.play();
          }}
        >
          { mp3List.map((song) => (
            <>
              {/*           <audio
            ref={audioPlayerRef}
            controls
          >
            <source
              ref={sourceRef}
              src={song}
            />
          </audio>                    */}
              <li><a href="#" data-value={song} key={song} className="songTitleDisp">{getSongName(song)}</a></li>
            </>
          ))}
        </ul>
      </div>
    </div>

  );
}
