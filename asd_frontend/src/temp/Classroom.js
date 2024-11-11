import React, { useState } from "react";
import "./classroom.css";
import QuestionSelect from "./QuestionSelect";
import SelectedQuestion from "./SelectedQuestion";
import ClassData from "./ClassData";
import ScoreAndFeedBack from "./ScoreAndFeedBack";

function Classroom() {
  const [selectedButtonId, setSelectedButtonId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const handleButtonClick = (id) => {
    setSelectedButtonId(id);
  };

  // 확인 버튼 누르면 selectedId 값 ScoreAndFeedback 컴포넌트에 전송
  const sendButtonClick = () => {
    setSelectedId(selectedButtonId);
  };

  return (
    <div className="classroom-container">
      {/*상단 화면*/}
      <div className="top">
        <div className="QuestionSelect">
          <QuestionSelect onButtonClick={handleButtonClick} />
        </div>
      </div>

      {/*하단 화면*/}
      <div className="bottom">
        <div className="SelectedQuestion">
          <SelectedQuestion
            selectedId={selectedButtonId}
            sendButtonClick={sendButtonClick}
          />
        </div>
        <div>
          <ScoreAndFeedBack selectedId={selectedId} />
        </div>
        <div className="ClassData">
          <ClassData />
        </div>
      </div>
    </div>
  );
}

export default Classroom;
