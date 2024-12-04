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
          console.log(result.user.id);
          if (result.user.role !== "student") {
            localStorage.removeItem("token");
            window.location.href = "/main";
          } else {
            console.log("good!");
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
    try {
      const response = await fetch(`${address}/scores_for_tree.js`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      const result = await response.json();
      console.log("dddcc");
      if (result.success) {
        setStudentScore(result.student_total_score); 
      } else {
        console.error("점수 불러오기 실패:", result.message);
      }
    } catch (error) {
      console.error("점수 불러오는 중 오류 발생:", error);
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
