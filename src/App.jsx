import React,{ useState, useEffect } from 'react'
import './App.css'
import Webcam from './components/Webcam.jsx' 
import io from "socket.io-client";
import { Button, Text,Description, Card} from '@geist-ui/core'
import { AiFillCamera } from "react-icons/ai";
import { FaQuestion } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { CiCamera } from "react-icons/ci";

function App() {

  const socket = io("http://localhost:5000", {
    transports: ["websocket"],  // Ensure WebSocket is used
    withCredentials: true       // Helps maintain secure session (optional)
  });
  const [prediction,setPrediction] = useState('initial')
  const [text, setText] = useState('')
  const [showWebcam, setShowWebcam] = useState(false)
  const [showPopup, setShowPopup] = useState(false);

  // Turn camera off once user gives web browser permission
  const requestCameraAccess = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        // Call backend to start camera 
        fetch("http://localhost:5000/start_camera",{method:"POST"})
          .then(response=>response.json())
          .then(msg=>{
            console.log(msg)
            setShowWebcam(true); // Show webcam when access is granted
          })
          .catch(error=>{
            console.log("Error starting camera", error)
          })
      .catch(error =>{
          console.log("Error sending POST request to start_camera", error)
      })
      });
  };

  useEffect(() => {
    fetch("http://localhost:5000/stop_camera", { method: "POST" })
      .then(response => response.json())
      .then(msg => console.log("Camera stopped on refresh:", msg))
      .catch(error => console.error("Error stopping camera:", error));
  }, []);

  useEffect(() => {
    // Listen for "prediction" event from Flask
    socket.on("prediction", (data) => {
      console.log("Received prediction:", data);
      setPrediction(data.character); // Update the UI with predicted ASL letter

      // Append prediction to text
      setText(prevText => prevText + data.character)
      console.log('Total text')
      console.log(text)
    });

    // Clean up event listener on unmount
    return () => {
      socket.off("prediction");
    };
  }, []);

  return (
    <div className= "h-screen w-screen flex items-center justify-center bg-[#f5faf5] flex-col">

      
      {/* <div className="absolute border-[#217dba] w-[90%] top-8">
        <div className=' m-0 leading-tight text-3xl text-black border-amber-950 text-[33px]'>Hand 2 Text </div>
        <div className='text-[20px] leading-tight'>Translate American Sign Language to Text</div>
      </div> */}


       <div className="h-[80%] w-[90%] rounded-2xl bg-[#f5faf5] flex flex-row px-7 py-3 gap-7 ">
       
       <div className=" rounded-xl border-2  w-[50%] overflow-hidden flex flex-col justify-center items-center bg-[#4986b8] ">

          {showWebcam ? (
            <Webcam />

          ) : (
            <button className='webcam-button flex flex-col justify-center h-full w-full items-center ' onClick={requestCameraAccess} 
            style={{
              backgroundColor: "transparent",  // bg-red-700
              outline: "none",  // Removes blue outline
              border: "none",   // Ensures no border is causing the effect
              color: "#f5faf5"
            }}
            >
  <CiCamera style={{ fill: "#f5faf5"}} size={53} />

  {/* Existing Text Element */}
  <div style={{ color: "#f5faf5"}} className="mt-3 h-fit w-fit text-lg">Turn on camera</div>
            </button>
          )}
            {/* Popup div */}
            <div 
                    className={`absolute bottom-24 left-16 bg-[#FFF8E1] text-gray-600 py-4 px-3 border-2 rounded-lg shadow-lg overflow-scroll
                    transition-opacity duration-500 ${showPopup ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                  >
                    <button className="absolute top-0 right-0 p-3 bg-transparent " style={{ backgroundColor: "transparent"}} onClick={()=>setShowPopup(!showPopup)}><IoCloseSharp/></button>
                    <img className='w-[250px] h-[200px]'src='/asl_alphabet.jpg'></img>
                  </div>
          
        </div>

 

          <div className="flex flex-col flex-1  rounded-2xl px-5 w-[30%] ">
              <div className="flex flex-1 flex-col  border-amber-600 ">
              <textarea 
                  placeholder="Turn on your camera and start signing to see text appear here." 
                  className=" box-border rounded-md h-[295px] py-3 px-2 "
                  style={{ fontSize: "57px" }}
                  value={text}
                  autoFocus
                ></textarea>
                <div className='bottom-4 border-2'>
               <img className='h-[365px] w-full ' src='images/asl_alphabet.jpg'></img>
               </div>
              
              </div>
          </div>
      
      </div>
      
    </div>
  )
}

export default App
