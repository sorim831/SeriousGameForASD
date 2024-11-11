import React, { useState, useEffect } from "react";
import "./classroom.css";
import QuestionSelect from "./QuestionSelect";
import SelectedQuestion from "./SelectedQuestion";
import ClassData from "./ClassData";
import ScoreAndFeedBack from "./ScoreAndFeedBack";
import axios from "axios"; // axios를 사용하여 서버로 데이터 전송

const address = process.env.REACT_APP_BACKEND_ADDRESS;

function Classroom() {
  const [selectedButtonId, setSelectedButtonId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [studentId, setStudentId] = useState(null); // 서버에서 받아올 studentId 상태 추가
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

  // studentId를 서버에서 받아오기
  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const response = await axios.get(`${address}/get_student_id`);
        setStudentId(response.data.studentId);
      } catch (error) {
        console.error("studentId 가져오기 실패:", error);
      }
    };
    fetchStudentId();
  }, []);

  // 수업 종료 버튼 클릭 시 데이터를 서버로 전송
  const handleEndClass = async () => {
    const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD 형식)

    const endClassData = {
      studentId,
      date: today,
      scoreData: scoreAndFeedBackData.score,
      feedback: scoreAndFeedBackData.feedback,
    };

    try {
      const response = await axios.post(`${address}/end_class`, endClassData);
      if (response.status === 200) {
        alert("수업 종료 데이터가 성공적으로 전송되었습니다.");
      }
    } catch (error) {
      console.error("데이터 전송 중 오류 발생:", error);
      alert("데이터 전송에 실패했습니다.");
    }
  };

  return (
    <div className="classroom-container">
      {/* 수업 종료 버튼 */}
      <button className="end-class-button" onClick={handleEndClass}>
        수업 종료
      </button>

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
