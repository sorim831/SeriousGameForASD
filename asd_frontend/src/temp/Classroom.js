import React, { useState } from "react";
import "./classroom.css";
import QuestionSelect from "./QuestionSelect";
import SelectedQuestion from "./SelectedQuestion";
import ClassData from "./ClassData";
import ScoreAndFeedBack from "./ScoreAndFeedBack";

function Classroom() {
  const [selectedButtonId, setSelectedButtonId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [scoreAndFeedBackData, setScoreAndFeedBackData] = useState({
    score: null,
    feedback: "",
  });

  const handleButtonClick = (id) => {
    setSelectedButtonId(id);
  };

  // 확인 버튼 클릭 시 selectedId를 설정하여 ScoreAndFeedback 컴포넌트로 전송
  const sendButtonClick = () => {
    setSelectedId(selectedButtonId);
  };

  // ScoreAndFeedBack 컴포넌트에서 점수와 피드백 데이터를 받아옴
  const handleFeedbackSubmit = (data) => {
    setScoreAndFeedBackData(data);
  };

  return (
    <div className="classroom-container">
      {/* 상단 화면 */}
      <div className="top">
        <div className="QuestionSelect">
          <QuestionSelect onButtonClick={handleButtonClick} />
        </div>
      </div>

      {/* 하단 화면 */}
      <div className="bottom">
        <div className="SelectedQuestion">
          <SelectedQuestion
            selectedId={selectedButtonId}
            sendButtonClick={sendButtonClick}
          />
        </div>
        <div>
          <ScoreAndFeedBack
            selectedId={selectedId}
            onSubmitFeedback={handleFeedbackSubmit}
          />
        </div>
        <div className="ClassData">
          <ClassData scoreAndFeedBackData={scoreAndFeedBackData} />
        </div>
      </div>
    </div>
  );
}

export default Classroom;
