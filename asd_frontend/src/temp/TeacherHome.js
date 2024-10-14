import React, { useState } from "react";
import FeedbackList from "./FeedbackList";
import "./TeacherHome.css";
const address = process.env.REACT_APP_BACKEND_ADDRESS;


function TeacherHome() {
  const [showFeedbackList, setShowFeedbackList] = useState(false); // 상태 관리

  const checkAccessToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      // window.location.href = "/teacher_login";
    } else {
      /*
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("토큰 형식이 올바르지 않습니다:", token);
        window.location.href = "/login";
        return;
      }
      */

      try {
        const response = await fetch(`${address}/home`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Bearer 형식으로 토큰 전송
          },
        });

        const result = await response.json();

        if (result.success) {
          console.log("홈페이지에 정상적으로 접근했습니다.");
        } else {
          // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
          // alert("로그인 화면으로 넘어갑니다.");
          // window.location.href = "/teacher_login";
        }
      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
        // window.location.href = "/teacher_login";
      }
    }
  };

  // 페이지 로드 시 토큰을 확인
  window.onload = checkAccessToken;

   // "자세히 보기" 버튼 클릭 시 호출되는 함수
   const handleViewDetails = () => {
    setShowFeedbackList(true); // 피드백 리스트 표시
  };

  return (
    <div className="teacher-home">
      <h2 id="teacher-name">김철수 선생님</h2>
      <ul>
        <li className="student-select">
          <span className="student-name">홍길동</span>
          <p className="student-sex">(남)</p>
          <p className="student-birthday">030929</p>
          <button className="student-info-button" onClick={handleViewDetails}>
            자세히보기
          </button>
        </li>
        <li className="student-select">
          <span className="student-name">홍길동</span>
          <p className="student-sex">(남)</p>
          <p className="student-birthday">030929</p>
          <button className="student-info-button" onClick={handleViewDetails}>
            자세히보기
          </button>
        </li>
        {/* 동적으로 리스트 추가됨 */}
      </ul>
      {/* showFeedbackList가 true일 때 FeedbackList를 렌더링 */}
      {showFeedbackList && <FeedbackList />}
      <button id="student-add">학생 추가</button>
    </div>
  );
}

export default TeacherHome;
