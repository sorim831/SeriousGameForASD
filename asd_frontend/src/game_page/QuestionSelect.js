import React, { useState } from "react";
import "./questionSelect.css";
import problemData from "./problemData.json";

const QuestionSelect = ({ onButtonClick }) => {
  const [selectedButtonId, setSelectedButtonId] = useState(null);

  // 버튼 클릭 시 실행되는 함수
  const handleButtonClick = (id) => {
    setSelectedButtonId(id);
    const image = problemData[id]?.teacher_image;
    onButtonClick(id, image);
  };

  return (
    <div className="question-container">
      <ul>
        <li>😄기쁨😄</li>
        {Array.from({ length: 3 }).map((_, index) => (
          <li key={`1-${index + 1}`}>
            <button
              className={`question ${
                selectedButtonId === `1-${index + 1}` ? "selected" : ""
              }`}
              id={`1-${index + 1}`}
              onClick={() => handleButtonClick(`1-${index + 1}`)}
            >
              <img
                src={problemData[`1-${index + 1}`]?.teacher_image}
                alt={`1-${index + 1}`}
                className="question-image"
              />
            </button>
          </li>
        ))}
      </ul>
      <ul>
        <li>😭슬픔😭</li>
        {Array.from({ length: 2 }).map((_, index) => (
          <li key={`2-${index + 1}`}>
            <button
              className={`question ${
                selectedButtonId === `2-${index + 1}` ? "selected" : ""
              }`}
              id={`2-${index + 1}`}
              onClick={() => handleButtonClick(`2-${index + 1}`)}
            >
              <img
                src={problemData[`2-${index + 1}`]?.teacher_image}
                alt={`2-${index + 1}`}
                className="question-image"
              />
            </button>
          </li>
        ))}
      </ul>
      <ul>
        <li>😬공포😬</li>
        {Array.from({ length: 2 }).map((_, index) => (
          <li key={`3-${index + 1}`}>
            <button
              className={`question ${
                selectedButtonId === `3-${index + 1}` ? "selected" : ""
              }`}
              id={`3-${index + 1}`}
              onClick={() => handleButtonClick(`3-${index + 1}`)}
            >
              <img
                src={problemData[`3-${index + 1}`]?.teacher_image}
                alt={`3-${index + 1}`}
                className="question-image"
              />
            </button>
          </li>
        ))}
      </ul>
      <ul>
        <li>😨혐오😨</li>
        {Array.from({ length: 2 }).map((_, index) => (
          <li key={`4-${index + 1}`}>
            <button
              className={`question ${
                selectedButtonId === `4-${index + 1}` ? "selected" : ""
              }`}
              id={`4-${index + 1}`}
              onClick={() => handleButtonClick(`4-${index + 1}`)}
            >
              <img
                src={problemData[`4-${index + 1}`]?.teacher_image}
                alt={`4-${index + 1}`}
                className="question-image"
              />
            </button>
          </li>
        ))}
      </ul>
      <ul>
        <li>😡분노😡</li>
        {Array.from({ length: 2 }).map((_, index) => (
          <li key={`5-${index + 1}`}>
            <button
              className={`question ${
                selectedButtonId === `5-${index + 1}` ? "selected" : ""
              }`}
              id={`5-${index + 1}`}
              onClick={() => handleButtonClick(`5-${index + 1}`)}
            >
              <img
                src={problemData[`5-${index + 1}`]?.teacher_image}
                alt={`5-${index + 1}`}
                className="question-image"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionSelect;
