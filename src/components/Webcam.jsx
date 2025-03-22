import React, { useState } from 'react';

function Webcam() {
  const [isCameraOn, setIsCameraOn] = useState(true);

  const startCamera = () => {
    setIsCameraOn(true);
  };

  return (
    <img className="w-full h-full object-cover" src="http://localhost:5000/video_feed" alt="Webcam Feed" />

  );
}

export default Webcam;
