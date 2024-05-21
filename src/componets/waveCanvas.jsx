import React, { useState, useEffect, useCallback } from "react";

import Parse from "./parse";

const WaveCanvas = ({
  $canvas,
  waveCanvas,
  draw,
  currentTime,
  duration,
  url,
  audioData,
  updateAudioData
}) => {
  useEffect(() => {
    if (waveCanvas === null) return;
    //绘制
    draw();
  }, [waveCanvas,duration, currentTime,audioData]);

  return (
    <React.Fragment>
      <canvas
        ref={$canvas}
        className="w-full h-full z-0 pointer-events-auto"
        id="shcanvas"
      ></canvas>
      <Parse url={url} updateAudioData={updateAudioData}/>
    </React.Fragment>
  );
};

export default React.memo(WaveCanvas);
