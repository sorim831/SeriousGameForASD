import React, { useState, useEffect } from "react";
import "./selected-question.css";

const SelectedQuestion = ({ selectedId, sendButtonClick, problemData }) => {
  const [imageLocation, setImageLocation] = useState("");

  useEffect(() => {
    window.socket.on("overlay_selected_image", (overlay_image, res) => {
      console.log("socket.on -> overlay_selected_image", overlay_image);
      setImageLocation(overlay_image);
    });

    if (selectedId) {
      const image = problemData[selectedId]?.teacher_image;
      setImageLocation(image);
    }

    return () => {
      window.socket.off("overlay_selected_image");
    };
  }, [selectedId, problemData]);

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
