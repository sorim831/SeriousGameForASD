import React, { useState, useEffect } from "react";
import "./selected-question.css";

const SelectedQuestion = ({ selectedId, sendButtonClick }) => {
  const [imageLocation, setImageLocation] = useState("");
  useEffect(() => {
    window.socket.on("overlay_image", (overlay_image) => {
      setImageLocation(overlay_image);
      //const imagelocation = document.querySelector(".questionImage");
      //imagelocation.src = overlay_image;
    });
  });

  const generateQuestionText = (id) => {
    if (!id) return "문제";
    const [category, number] = id.split("-");
    return `${category}-${number} 문제`;
  };

  const questionText = generateQuestionText(selectedId);

  return (
    <div className="selected-question-container">
      <p className="selected-question">
        {selectedId ? `${selectedId}` : "선택된 질문이 없습니다."}
      </p>
      <img className="selected-image" src={imageLocation} alt="" />
      <div id="question-description-container">
        <p id="question-description">{questionText}</p>
        <button id="send-question" onClick={() => sendButtonClick(selectedId)}>
          확인
        </button>
      </div>
    </div>
  );
};

// TODO: 애니메이션 socket으로 학생에게 전달하는 부분 구현

export default SelectedQuestion;
