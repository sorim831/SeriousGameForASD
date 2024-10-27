import React, { useState, useEffect } from "react";
import "./feedback-list.css";

const FeedbackList = ({ onClose }) => {
  const [feedback, setFeedback] = useState(""); // 종합 의견 상태
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 컴포넌트가 마운트 될 때 서버에서 studentId와 피드백을 가져옴
  useEffect(() => {
    const fetchStudentFeedback = async () => {
      try {
        // 서버에서 로그인된 사용자 정보를 이용해 피드백을 가져옴
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/get-feedback`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("피드백을 불러오는 중 오류가 발생했습니다.");
        }

        const data = await response.json();
        if (data.feedback) {
          setFeedback(data.feedback); // 피드백이 있으면 상태로 저장
        } else {
          setFeedback(""); // 피드백이 없으면 빈 값 설정
        }
      } catch (error) {
        setErrorMessage(
          error.message || "피드백을 가져오는 중 문제가 발생했습니다."
        );
      }
    };

    fetchStudentFeedback();
  }, []);

  // 수정 버튼을 눌렀을 때 수정 모드로 전환
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 완료 버튼을 눌렀을 때 수정 내용을 저장하기
  const handleSaveClick = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      // 서버로 피드백 전송
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/total-feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            feedback, // 현재 피드백 값을 서버에 전달
          }),
        }
      );

      if (!response.ok) {
        throw new Error("서버에서 오류가 발생했습니다.");
      }

      // 피드백 저장이 완료된 후 수정 모드 해제
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(
        error.message || "의견을 저장하는 중 문제가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-list">
      <button className="close-feedback-list" onClick={onClose}>
        X 닫기
      </button>
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
            <button
              id="save-total-feedback"
              onClick={handleSaveClick}
              disabled={loading}
              className="feedback-button"
            >
              {loading ? "저장 중..." : "완료"}
            </button>
          ) : (
            <button
              id="edit-total-feedback"
              onClick={handleEditClick}
              className="feedback-button"
            >
              수정
            </button>
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
            <p className="total-feedback-input">
              {feedback || "종합 의견 기록이 존재하지 않습니다. 추가해주세요!"}
            </p>
          )}
        </div>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default FeedbackList;
