import React from "react";
import "./selected-question.css";

const SelectedQuestion = ({ selectedId, sendButtonClick }) => {
  const generateQuestionText = (id) => {
    if (!id) return "문제";
    const [category, number] = id.split("-");
    return `${category}-${number} 문제`;
  };

  const questionText = generateQuestionText(selectedId);

  return (
    <div className="selected-question-container">
      <span className="selected-question">
        {selectedId ? `${selectedId}` : "선택된 질문이 없습니다."}
      </span>
      <div id="question-description-container">
        <p id="question-description">{questionText}</p>
        <button id="send-question" onClick={() => sendButtonClick(selectedId)}>
          확인
        </button>
      </div>
    </div>
  );
};

export default SelectedQuestion;
