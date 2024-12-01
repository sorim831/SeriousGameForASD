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

  // 감정 카테고리와 문제 ID로 문제 텍스트 생성
  const generateQuestionText = (selectedId) => {
    if (!selectedId) return "문제";
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

    // 입력된 점수가 숫자인지 확인
    const score = Number(inputScore);

    console.log("전달할 데이터:", { score, selectedId }); // 데이터 확인

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
      student_id: studentId, // 학생 아이디
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
        console.log(result.message || "피드백이 성공적으로 저장되었습니다!");

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
    return <p>학생 정보를 불러오는 중입니다...</p>;
  }

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
            placeholder="0~10 점 입력"
            min="0"
            max="10"
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
