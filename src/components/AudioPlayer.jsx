import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function AudioPlayer({ mp3List }) {
  // Refs
  const audioPlayerRef = useRef();
  const startAudio = useRef();
  const sourceRef = useRef();
  const songDeckInputRef = useRef();

  return (
    <div>
      <div className="text-center">
        <iframe
          title="startPlay"
          src="music/silence.mp3"
          allow="autoplay"
          ref={startAudio}
          style={{ display: 'none' }}
        />
        {/* <input
            ref={songDeckInputRef}
            type="file"
            multiple
            onChange={handleSongChange}
          /> */}

        <audio // eslint-disable-line jsx-a11y/media-has-caption
          ref={audioPlayerRef}
          /* autoPlay
          muted */
          /* className="audPlyrColor" */
          controls
        >
          <source
            ref={sourceRef}
            type="audio/mp3"
            src={mp3List[0]}
          />
        </audio>
      </div>

    </div>
  );
}
