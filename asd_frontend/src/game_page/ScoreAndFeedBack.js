import React, { useState, useEffect } from "react";
import "./ScoreAndFeedBack.css";
import "./score-input.css";
import "./feedback-form.css";

function ScoreAndFeedBack({ selectedId, onSubmitFeedback, studentId }) {
  const [inputScore, setInputScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const ADDRESS = process.env.REACT_APP_BACKEND_ADDRESS;

  // 감정 카테고리 반환 함수
  const getEmotionCategory = (id) => {
    const category = id.split("-")[0];
    const emotionMap = {
      1: "happy",
      2: "sad",
      3: "scary",
      4: "disgusting",
      5: "angry",
    };
    return emotionMap[category] || "";
  };

  const handleScoreChange = (e) => {
    if (!selectedId) return;
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value === "" || (Number(value) >= 0 && Number(value) <= 10)) {
      setInputScore(value);
    }
  };

  // 감정 카테고리와 문제 ID로 문제 텍스트 생성
  const generateQuestionText = (selectedId) => {
    if (!selectedId) return "";
    const [category, number] = selectedId.split("-");
    return `${getEmotionCategory(category)}문제`;
  };

  useEffect(() => {
    if (studentId) {
      setIsLoading(false);
    } else {
      console.error("학생 ID가 없습니다. 다시 확인해주세요.");
    }
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId || inputScore === "") return;

    // 입력된 점수가 숫자인지 확인
    const score = Number(inputScore);

    //console.log("전달할 데이터:", { score, selectedId }); // 데이터 확인

    // 점수와 점수 아이디 값을 `ClassData`로 전달
    onSubmitFeedback({ score, selectedId });

    // 감정 이름 추출
    const emotionCategory = getEmotionCategory(selectedId);

    if (!studentId) {
      alert("학생 ID가 없습니다. 다시 시도해주세요.");
      return;
    }

    // 데이터 전송 객체 생성
    const feedbackData = {
      student_fk: studentId, // 학생 아이디
      student_action: emotionCategory, // 감정 이름
      student_score: score, // 점수
      student_opinion: feedback, // 피드백
    };

    try {
      const response = await fetch(`${ADDRESS}/save_task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        const result = await response.json();
        //console.log(result.message || "피드백이 성공적으로 저장되었습니다!");

        onSubmitFeedback({ score, selectedId });

        // 입력값 초기화
        setInputScore("");
        setFeedback("");
      } else {
        alert("서버 오류로 인해 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };
  if (isLoading) {
    return (
      <div className="score-and-feedback-container">
        <div className="loader">
          <div className="spinner"></div>
          <p>학생 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="score-and-feedback-container"
      style={{ position: "relative" }}
    >
      <form onSubmit={handleSubmit}>
        <div className="score-input-div">
          {!selectedId && (
            <div className="score-input-div-disabled-overlay">
              <p className="score-input-div-disabled-overlay-text">
                문제를 제시하지 않았어요.
              </p>
            </div>
          )}
          <span className="emotion">{generateQuestionText(selectedId)}</span>

          <input
            type="number"
            min="0"
            max="10"
            step="1"
            className={`teacher-score ${
              !selectedId ? "score-and-feedback-text-disabled" : ""
            }`}
            value={inputScore}
            onChange={handleScoreChange}
            placeholder="0~10 점 입력"
            style={{ textAlign: "right" }}
            disabled={!selectedId}
          />
          <span>점</span>
        </div>
        <p className="feedback-p">의견</p>
        <div className="feedback-textarea-div">
          <textarea
            placeholder="피드백을 입력하세요"
            className={`feedback-textarea ${
              !selectedId ? "score-and-feedback-text-disabled" : ""
            }`}
            value={feedback}
            onChange={(e) => selectedId && setFeedback(e.target.value)}
            disabled={!selectedId}
          />
        </div>
        <button
          type="submit"
          className={`game-feedback-button ${
            !selectedId || inputScore === ""
              ? "score-and-feedback-text-disabled"
              : ""
          }`}
          disabled={!selectedId || inputScore === ""}
        >
          저장 및 다음 상황
        </button>
      </form>
    </div>
  );
}

export default ScoreAndFeedBack;
