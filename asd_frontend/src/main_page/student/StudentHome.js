import React, { useEffect, useState } from "react";
import StudentTree from "./StudentTree";
import styles from "./StudentHome.module.css";

const address = process.env.REACT_APP_BACKEND_ADDRESS;

function StudentHome() {
  const [userId, setUserId] = useState(null);
  const [studentScore, setStudentScore] = useState();
  const checkAccessToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      window.location.href = "/student_login";
    } else {
      try {
        const response = await fetch(`${address}/home`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Bearer 형식으로 토큰 전송
          },
        });
        const result = await response.json();
        if (result.success) {
          //console.log(result.user.id);
          if (result.user.role !== "student") {
            localStorage.removeItem("token");
            window.location.href = "/main";
          } else {
            //console.log("good!");
            setUserId(result.user.id);
            fetchStudentScore(result.user.id);
          }
        } else {
          // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
          localStorage.removeItem("token");
          window.location.href = "/student_login";
        }
      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
        localStorage.removeItem("token");
        window.location.href = "/student_login";
      }
    }
  };

  const fetchStudentScore = async () => {
    const url = `${address}/scores_for_tree`;
    //console.log(`Requesting student score from: ${url}`);
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      //console.log(`Response status: ${response.status}`);
      //console.log(`Response headers:`, response.headers);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      //console.log(`Response data:`, result);
  
      if (result.success) {
        const numericScore = Number(result.student_total_score); 
        //console.log(`Student Score fetched from server:`, numericScore);
        //console.log(`Type of fetched score after conversion:`, typeof numericScore);
        setStudentScore(numericScore); 
      } else {
        console.error("Failed to fetch score:", result.message);
      }
    } catch (error) {
      console.error("Error fetching student score:", error);
    }
  };
  

  // 페이지 로드 시 토큰을 확인
  useEffect(() => {
    checkAccessToken();
  }, []);

  const handleGameStart = () => {
    if (userId) {
      window.location.href = `/room/${userId}`;
    }
  };

  return (
    <div className={styles.App}>
      <div className={styles.gameBoxOverlay}>
        <div className={styles.gameBox}>
          <button className={styles.gameButton} onClick={handleGameStart}>
            게임 시작
          </button>
        </div>
      </div>
      <StudentTree score={studentScore} />
    </div>
  );
}

export default StudentHome;
