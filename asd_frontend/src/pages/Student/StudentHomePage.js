import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/Student/StudentHomePage.css";
import "../../styles/Student/global.css";


const StudentHomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
  
    const name = new URLSearchParams(location.search).get("name") || "학생";
  
    const handleStartGame = () => {
      navigate(`/GamePage/${name}`);
    };
  
    return (
      <div className="home-container">
        <div className="home-background">
          <div className="home-content">
            <h1>{name}님!</h1>
            <p>어제는 이만큼의 나무를 심었어요!</p>
            <p>오늘도 나무를 많이 심어봐요!</p>
            <button onClick={handleStartGame}>게임 시작하기</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default StudentHomePage;
  