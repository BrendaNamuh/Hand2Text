// import React, { useState } from 'react';

// function Webcam() {
//   const [isCameraOn, setIsCameraOn] = useState(true);

//   const startCamera = () => {
//     setIsCameraOn(true);
//   };

//   return (
//     <img className="w-full h-full object-cover" src="http://localhost:5000/video_feed" alt="Webcam Feed" />

//   );
// }

// export default Webcam;

import React, { useRef, useEffect, useState } from 'react';

function Webcam() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState('');

  // Ask for camera access and display the stream
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => {
        console.error('Error accessing webcam:', err);
      });
  }, []);

  // Capture and send a frame every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      const imageData = canvasRef.current.toDataURL('image/jpeg');

      fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      })
        .then((res) => res.json())
        .then((data) => {
          setPrediction(data.character);
        })
        .catch((err) => console.error('Prediction error:', err));
    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <video ref={videoRef} className="w-full h-full object-cover" />

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: 'none' }}
      />

      <div className="absolute bottom-4 right-4 bg-white text-black p-2 rounded shadow">
        Prediction: {prediction || '...'}
      </div>
    </div>
  );
}

export default Webcam;

