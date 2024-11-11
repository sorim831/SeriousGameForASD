import React, { useState } from "react";
import "./ScoreAndFeedBack.css";
import "./score-input.css";
import "./feedback-form.css";

function ScoreAndFeedBack() {
  const [inputScore, setInputScore] = useState();
  const [feedback, setFeedback] = useState("");
  const PORT = process.env.REACT_APP_BACKEND_ADDRESS;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const score = Number(inputScore); // 점수 입력 값
    const feedbackText = feedback; // 피드백 입력 값

    // 점수가 유효한지 확인
    if (isNaN(score) || score < 0 || score > 10) {
      alert("점수는 0에서 10 사이의 숫자로 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:${PORT}`, {
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
    }
  };

  return (
    <div className="score-and-feedback-container">
      <form>
        <div className="score-input-div">
          <input
            type="number"
            className="teacher-score"
            required // 점수 입력은 필수
          />
          {}점
        </div>
        <p className="feedback-p">의견</p>
        <div className="feedback-textarea-div">
          <textarea
            placeholder="피드백을 입력하세요"
            className="feedback-textarea"
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
