import React, { useEffect, useRef } from "react";
import "../../styles/Student/GamePage.css";
import "../../styles/Student/global.css";


const GamePage = () => {
    const userVideoRef = useRef(null);
    const partnerVideoRef = useRef(null);
  
    useEffect(() => {
      // WebRTC 좀 더 수정 필요
      const startVideo = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("카메라 접근 실패", error);
        }
      };
  
      startVideo();
    }, []);
  
    return (
      <div className="gamepage-container">
        <div className="video-container">
          <video ref={userVideoRef} autoPlay muted />
          <video ref={partnerVideoRef} autoPlay />
        </div>
        <div className="message-container">
          <p>선생님과 연결 중...</p>
        </div>
      </div>
    );
  };
  
  export default GamePage;
