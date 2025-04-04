import React, { useState } from 'react';
import './App.css';
import Webcam from './components/Webcam.jsx'; // Your custom webcam component
import { Text, Card } from '@geist-ui/core';
import { CiCamera } from "react-icons/ci";

function App() {
  const [text, setText] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const requestCameraAccess = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setShowWebcam(true); // Show webcam when access is granted
      })
      .catch((error) => {
        console.error("Camera access denied:", error);
        alert("Camera access is required to use this feature.");
      });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#f5faf5] flex-col">
      <div className="h-[600px] w-[1300px] rounded-2xl bg-[#f5faf5] flex flex-row px-7 py-3 gap-7">
        
        {/* Webcam or Camera Button */}
        <div className="rounded-xl border-2 w-[750px] overflow-hidden flex flex-col justify-center items-center bg-[#4986b8]">
          {showWebcam ? (
            <Webcam setText={setText} />
          ) : (
            <button
              className="webcam-button flex flex-col justify-center h-full w-full items-center"
              onClick={requestCameraAccess}
              style={{
                backgroundColor: "transparent",
                outline: "none",
                border: "none",
                color: "#f5faf5"
              }}
            >
              <CiCamera style={{ fill: "#f5faf5" }} size={53} />
              <div style={{ color: "#f5faf5" }} className="mt-3 h-fit w-fit text-lg">
                Turn on camera
              </div>
            </button>
          )}
        </div>

        {/* Text + Alphabet Display */}
        <div className="flex flex-col flex-1 rounded-2xl px-5 w-[600px]">
          <div className="flex flex-1 flex-col h-full border-amber-600">
            <textarea
              placeholder="Turn on your camera and start signing to see text appear here."
              className="box-border border-b-yellow-400 rounded-md h-[295px] py-3 px-2"
              style={{ fontSize: "57px" }}
              value={text}
              autoFocus
              readOnly
            ></textarea>

            <div className="">
              <img
                className="h-[330px] w-full"
                src="images/asl_alphabet.jpg"
                alt="ASL Alphabet"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
