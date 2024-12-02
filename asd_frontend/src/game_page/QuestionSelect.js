import React, { useState } from "react";
import "./questionSelect.css";

const QuestionSelect = ({ onButtonClick }) => {
  const [selectedButtonId, setSelectedButtonId] = useState(null);

  // 버튼 클릭 시 실행되는 함수
  const handleButtonClick = (id) => {
    setSelectedButtonId(id);
    onButtonClick(id);
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
              1-{index + 1}
            </button>
          </li>
        ))}
      </ul>
      <ul>
        <li>😭슬픔😭</li>
        {Array.from({ length: 3 }).map((_, index) => (
          <li key={`2-${index + 1}`}>
            <button
              className={`question ${
                selectedButtonId === `2-${index + 1}` ? "selected" : ""
              }`}
              id={`2-${index + 1}`}
              onClick={() => handleButtonClick(`2-${index + 1}`)}
            >
              2-{index + 1}
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
              3-{index + 1}
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
              4-{index + 1}
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
              5-{index + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionSelect;
