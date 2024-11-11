import React from "react";
import "./selected-question.css";

const SelectedQuestion = ({ selectedId }) => {
  // QuestionSelect 컴포넌트에서 id 값 받아오기
  const generateQuestionText = (id) => {
    // 받아온 아이디 값이 없을 경우
    if (!id) return "문제";
    // id 값을 "-" 기준으로 분리해서 category와 number로 나누기
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
        <button id="send-question">확인</button>{" "}
        {/* scoreandfeedback 컴포넌트로 선택된 id값 전송. 아이디의 첫번째 숫자 보고 어떤 감정인지 구분 할 수 있음 */}
      </div>
    </div>
  );
};

export default SelectedQuestion;
