import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function AudioPlayer({ audioTrack }) {
  const musicPlayerRef = useRef();
  return (
    <>
      {/* <iframe
          title="startPlay"
          src="music/silence.mp3"
          allow="autoplay"
          ref={startAudio}
          style={{ display: 'none' }}
        /> */}
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
          src={audioTrack}
        />
      </audio>
    </>
  );
}
