import React, { useState } from "react";
import "./ScoreAndFeedBack.css";
import "./score-input.css";
import "./feedback-form.css";
import SelectedQuestion from "./SelectedQuestion";

function ScoreAndFeedBack({ selectedId }) {
  const [inputScore, setInputScore] = useState();
  const [feedback, setFeedback] = useState("");
  const PORT = process.env.REACT_APP_BACKEND_ADDRESS;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const score = Number(inputScore); // 점수 입력 값
    const feedbackText = feedback; // 피드백 입력 값

    // 0~10점 사이 점수 부여
    if (isNaN(score) || score < 0 || score > 10) {
      alert("점수는 0에서 10 사이의 숫자로 입력해주세요.");
      return;
    }

    const generateQuestionText = (selectedId) => {
      if (!selectedId) return "문제";
      const [category, number] = selectedId.split("-");
      return `${category}-${number}`;
    };

    const emotionCategory = (category) => {
      const emotionMap = {
        1: "기쁨",
        2: "슬픔",
        3: "공포",
        4: "혐오",
        5: "분노",
        6: "놀람",
      };

      return emotionMap[category] || ""; // 해당 카테고리가 없으면 빈 문자열
    };

    //피드백 데이터만 서버에 전달, 점수 데이터는 classdata 컴포넌트에 전송 (classdata 컴포넌트에서 서버로 점수 데이터 전송)

    /*
    try {
      const response = await fetch(`${PORT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score, feedback: feedbackText }),
      });

      console.log("Response status:", response.status);

      const contentType = response.headers.get("content-type");
      // 데이터 전송 성공
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        alert(data.message);
        // 데이터 전송 실패
      } else {
        const text = await response.text();
        console.error("Unexpected response:", text);
        throw new Error("서버에서 예상치 못한 응답을 받았습니다.");
      }
    } catch (error) {
      console.error("Error during fetch:", error.message);
      alert(error.message);
    } */
  };

  return (
    <div className="score-and-feedback-container">
      <form onSubmit={handleSubmit}>
        <div className="score-input-div">
          <span className="emotion">{selectedId}</span>
          <input
            type="number"
            className="teacher-score"
            value={inputScore}
            onChange={(e) => setInputScore(e.target.value)}
            required // 점수 입력은 필수
          />
          {}점
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
