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

  useEffect(() => {
    console.log("selectedId", selectedId);
  }, [selectedId]);

  return (
    <div
      className="selected-question-container"
      style={{ position: "relative" }}
    >
      {!selectedId && (
        <div className="no-selected-question-overlay">
          <p className="no-selected-question-overlay-text">
            "문제 목록 중에서 문제를 선택해주세요."
          </p>
        </div>
      )}
      <img className="selected-image" src={imageLocation} alt="" />
      <div id="question-description-container">
        <p id="question-description">{questionText}</p>
        <p>{selectedId}</p>
        <button
          id="send-question"
          className={selectedId ? "" : "send-question-disabled"}
          onClick={() => sendButtonClick(selectedId)}
          disabled={!selectedId}
        >
          확인
        </button>
      </div>
    </div>
  );
};

// TODO: 애니메이션 socket으로 학생에게 전달하는 부분 구현

export default SelectedQuestion;
