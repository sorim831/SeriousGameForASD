import React, { useState, useEffect } from "react";
import FeedbackList from "./FeedbackList";
import "./TeacherHome.css";
const address = process.env.REACT_APP_BACKEND_ADDRESS;

function TeacherHome() {
  const [showFeedbackList, setShowFeedbackList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const checkAccessToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      // window.location.href = "/teacher_login";
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
          console.log("홈페이지에 정상적으로 접근했습니다.");
        } else {
          // alert("로그인 화면으로 넘어갑니다.");
          // window.location.href = "/teacher_login";
        }
      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
        // window.location.href = "/teacher_login";
      }
    }
  };

  const [studentData, setStudentData] = useState({
    student_name: "",
    student_gender: "",
    student_birthday: "",
    student_parent_name: "",
    student_phone: "",
  });

  // 페이지 마운트 될 때 일어나는 이벤트 
  useEffect(() => {
    checkAccessToken(); // 페이지 로드 시 토큰을 확인
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${address}`);
        const data = await response.json();

        // 서버에서 학생 정보 가져오기
        setStudentData({
          student_name: data.student_name,
          student_gender: data.student_gender,
          student_birthday: data.student_birthday,
          student_parent_name: data.student_parent_name,
          student_phone: data.student_phone,
        });
      } catch (error) {
        setErrorMessage("학생 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData(); // 함수 호출
  }, []);

  // "자세히 보기" 버튼 클릭 시 FeedbackList 컴포넌트 띄우기
  const handleViewDetails = () => {
    setShowFeedbackList(true);
  };

  // FeedbackList 닫기
  const handleCloseFeedback = () => {
    setShowFeedbackList(false);
  };

  // 로그아웃 기능 임시로 만듦
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("로그인 화면으로 넘어갑니다.");
    window.location.href = "/teacher_login";
  };

  return (
    <div className="teacher-home">
      <h2 id="teacher-name">김철수 선생님</h2>
      <ul>
        <li className="student-select">
          <span className="student-name">{studentData.student_name}</span>
          <p className="student-gender">({studentData.student_gender})</p>
          <p className="student-birthday">{studentData.student_birthday}</p>
          <button className="student-info-button" onClick={handleViewDetails}>
            자세히보기
          </button>
        </li>
        <li className="student-select">
          <span className="student-name">홍길동</span>
          <p className="student-gender">(남)</p>
          <p className="student-birthday">030929</p>
          <button className="student-info-button" onClick={handleViewDetails}>
            자세히보기
          </button>
        </li>
        {/* 동적으로 리스트 추가됨 */}
      </ul>
      {/* showFeedbackList가 true일 때 FeedbackList를 오른쪽 화면에 표시 */}
      {showFeedbackList && (
        <FeedbackList
          onClose={handleCloseFeedback}
          studentData={studentData} // studentData를 props로 전달
        />
      )}
      <button id="student-add">학생 추가</button>
      {/* 로그아웃 기능 임시로 */}
      <button id="logout" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}

export default TeacherHome;
