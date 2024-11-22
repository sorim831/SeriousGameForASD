import React, { useState } from "react";
import "./ScoreAndFeedBack.css";
import "./score-input.css";
import "./feedback-form.css";
import SelectedQuestion from "./SelectedQuestion";

function ScoreAndFeedBack({ selectedId, onSubmitFeedback }) {
  const [inputScore, setInputScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const ADDRESS = process.env.REACT_APP_BACKEND_ADDRESS;

  // 감정 카테고리 반환 함수
  const getEmotionCategory = (id) => {
    const category = id.split("-")[0];
    const emotionMap = {
      1: "기쁨",
      2: "슬픔",
      3: "공포",
      4: "혐오",
      5: "분노",
      6: "놀람",
    };
    return emotionMap[category] || "";
  };

  // 감정 카테고리와 문제 ID로 문제 텍스트 생성
  const generateQuestionText = (selectedId) => {
    if (!selectedId) return "문제";
    const [category, number] = selectedId.split("-");
    return `${getEmotionCategory(category)}문제`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 입력된 점수가 숫자이고 0~10 사이의 범위에 있는지 확인
    const score = Number(inputScore);
    if (isNaN(score) || score < 0 || score > 10) {
      alert("점수는 0에서 10 사이의 숫자로 입력해주세요.");
      return;
    }

    // 점수와 점수 아이디 값과 피드백을 `ClassData`로 전달
    onSubmitFeedback({ score, selectedId, feedback });
  };

  return (
    <div className="score-and-feedback-container">
      <span className="emotion">{generateQuestionText(selectedId)}</span>
      <form onSubmit={handleSubmit}>
        <div className="score-input-div">
          <input
            type="number"
            className="teacher-score"
            value={inputScore}
            onChange={(e) => setInputScore(e.target.value)}
            placeholder="0 ~ 10"
          />
          <span>점</span>
        </div>
        <p className="feedback-p">의견</p>
        <div className="feedback-textarea-div">
          <textarea
            placeholder="피드백을 입력하세요"
            className="feedback-textarea"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
        <button type="submit" className="feedback-button">
          저장 및 다음 상황
        </button>
      </form>
    </div>
  );
}

export default ScoreAndFeedBack;
