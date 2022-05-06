import React, { useState, useRef } from 'react';

export default function MoodSelector({ mood, setMood }) {
  function onChangeValue(event) {
    setMood(event.target.value);
    console.log(event.target.value);
  }

  return (
    <div className="px-2" onChange={onChangeValue}>
      <label className="text-danger">
        <input
          type="radio"
          name="mood-select"
          value="love"
          checked={mood === 'love'}
        />
        ❤
      </label>
      <label>
        <input
          type="radio"
          name="mood-select"
          value="joy"
          checked={mood === 'joy'}
        />
        😇
      </label>
      <label>
        <input
          type="radio"
          name="mood-select"
          value="amazed"
          checked={mood === 'amazed'}
        />
        😮
      </label>
      <label>
        <input
          type="radio"
          name="mood-select"
          value="inspired"
          checked={mood === 'inspired'}
        />
        💡
      </label>
    </div>

  );
}
