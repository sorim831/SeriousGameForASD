import React, { useState, useEffect } from "react";
import "./feedback-list.css";

const FeedbackList = () => {
  // 학생 ID를 상수로 선언 ()
  const studentId = 1;

  // 종합 의견 수정 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 컴포넌트가 마운트될 때 피드백 데이터 가져오기
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/get-feedback`); // 학생 ID로 피드백 요청
        if (!response.ok) {
          throw new Error("피드백을 불러오는 중 오류가 발생했습니다.");
        }
        const data = await response.json();
        setFeedback(data.feedback); // 받은 피드백을 상태에 저장
      } catch (error) {
        setErrorMessage(error.message || "피드백을 가져오는 중 문제가 발생했습니다.");
      }
    };

    fetchFeedback();
  }, [studentId]); // 컴포넌트가 처음 렌더링될 때만 호출

  // 수정 버튼 클릭 시, 수정 상태를 변경
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 수정 완료 버튼 클릭 시, 수정된 의견을 저장하고 수정 불가 상태로 전환
  const handleSaveClick = async () => {
    setLoading(true); // 저장 중 상태로 전환
    setErrorMessage(""); // 에러 메시지 초기화
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/total-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,  // 학생 ID 사용
          feedback,   // 의견
        }),
      });
  
      if (response.ok) {
        // 저장이 성공했을 경우
        setIsEditing(false);
        setLoading(false);
      } else {
        // 응답이 정상적이지 않을 경우 에러 처리
        throw new Error("서버에서 오류가 발생했습니다.");
      }
    } catch (error) {
      // 네트워크 에러 또는 API 호출 실패 처리
      setErrorMessage(error.message || "의견을 저장하는 중 문제가 발생했습니다.");
      setLoading(false); // 로딩 상태 해제
    }
  };

  return (
    <div>
      <div id="student-default-info">
        <div className="name-sex-birth">
          <h3 id="student-name">홍길동</h3>
          <p id="sex">(남)</p>
          <p id="birthday">030929</p>
        </div>
        <div className="parent-info">
          <span>보호자:</span>
          <span id="parent-name">o o o</span>
          <span>연락처:</span>
          <span id="parent-phone-number">010-1234-5678</span>
        </div>
      </div>

      <div id="student-total-opinion">
        <p>종합 점수</p>
        <div className="total-emotion-data-div">
          <span className="total-emotion-data">행복: </span>
          <span id="total-happy">5</span>
          <span className="total-emotion-data">슬픔: </span>
          <span id="total-sad">5</span>
          <span className="total-emotion-data">분노: </span>
          <span id="total-angry">5</span>
          <span className="total-emotion-data">공포: </span>
          <span id="current-fear">5</span>
          <span className="total-emotion-data">혐오: </span>
          <span id="total-disgust">5</span>
          <span className="total-emotion-data">놀람: </span>
          <span id="total-surprise">5</span>
        </div>

        <div className="total-feedback-header">
          <span>종합 의견</span>
          {isEditing ? (
            <button id="save-total-feedback" onClick={handleSaveClick} disabled={loading}>
              {loading ? "저장 중..." : "완료"}
            </button>
          ) : (
            <button id="edit-total-feedback" onClick={handleEditClick}>수정</button>
          )}
        </div>
        <div className="total-feedback">
          {isEditing ? (
            <input
              type="text"
              id="total-feedback-input"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={loading}
            />
          ) : (
            <p>{feedback || "피드백이 없습니다."}</p> // 피드백이 없을 경우 메시지 표시
          )}
        </div>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* 에러 메시지 표시 */}

      <p>이전 기록</p>

      <div id="previous-feedback">
        <div className="previous-feedback-detail">
          <span id="feedback-date">24.09.29</span>
          <div className="emotion-data-div">
            <span className="total-emotion-data">행복: </span>
            <span id="previous-happy">5</span>
            <span className="total-emotion-data">슬픔: </span>
            <span id="previous-sad">5</span>
            <span className="total-emotion-data">분노: </span>
            <span id="previous-angry">5</span>
            <span className="total-emotion-data">공포: </span>
            <span id="previous-fear">5</span>
            <span className="total-emotion-data">혐오: </span>
            <span id="previous-disgust">5</span>
            <span className="total-emotion-data">놀람: </span>
            <span id="previous-surprise">5</span>
          </div>
          <div id="feedback-details">
            수업 때 학생에 대한 의견을 적으면 여기에 기록됨.
          </div>
        </div>
        {/* 기록이 동적으로 추가 */}
      </div>
    </div>
  );
};

export default FeedbackList;
