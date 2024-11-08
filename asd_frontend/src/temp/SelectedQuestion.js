import React from "react";
import "./selected-question.css";

const SelectedQuestion = () => {
  return (
    <div className="selected-question-container">
      <div id="selected-question"></div>
      <div id="question-description-container">
        <p id="question-description">신나는 놀이공원에 왔어요.</p>
        <button id="send-question">확인</button>
      </div>
    </div>
  );
};

export default SelectedQuestion;
