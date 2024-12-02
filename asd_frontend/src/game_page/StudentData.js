import React, { useState, useEffect } from "react";
import "../main_page/teacher/student-info.css";

const StudentInfo = ({ onClose, studentData }) => {
  const student = studentData?.[0];
  const [feedback, setFeedback] = useState(student?.student_opinion || "");
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalScore, setTotalScore] = useState({});
  const [totalHistory, setTotalHistory] = useState([]);
  const [totalHistoryDetail, setTotalHistoryDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandTotalHistoryDetail, setExpandTotalHistoryDetail] =
    useState(null);

  useEffect(() => {
    if (student) {
      console.log("Student Name:", student.student_name);
    }
  }, [student]);

  const handleEditClick = () => {
    setIsEditing(true);
    setErrorMessage("");
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/update_student_info/total_comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_opinion: feedback,
            student_id: student.student_id,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setIsEditing(false);
      } else {
        setErrorMessage("댓글 저장 실패");
      }
    } catch (error) {
      setErrorMessage("종합 의견 저장 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const scoreResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/get_student_info/total_score/${student.student_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!scoreResponse.ok)
          throw new Error(`Score fetch failed: ${scoreResponse.status}`);
        const scoreData = await scoreResponse.json();
        setTotalScore(scoreData.scores || {});

        const historyResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/get_student_info/total_history/${student.student_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!historyResponse.ok)
          throw new Error(`History fetch failed: ${historyResponse.status}`);
        const historyData = await historyResponse.json();
        setTotalHistory(historyData.rows || []);
      } catch (error) {
        console.error("Data fetching error", error);
        setTotalScore({});
        setTotalHistory([]);
        setErrorMessage("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };

    if (student?.student_id) {
      fetchData();
    }
  }, [student?.student_id]);

  const handleHistoryDetailClick = async (date) => {
    if (expandTotalHistoryDetail === date) {
      setExpandTotalHistoryDetail(null);
      setTotalHistoryDetail([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/get_student_info/total_history/history_detail/${student.student_id}/${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Detail fetch failed: ${response.status}`);
      }

      const data = await response.json();
      setTotalHistoryDetail(data.rows || []);
      setExpandTotalHistoryDetail(date);
    } catch (error) {
      console.error("Error fetching history detail", error);
      setTotalHistoryDetail([]);
    }
  };

  if (!student) {
    return <p>학생 정보 로딩 중...</p>;
  }

  return (
    <div className="feedback-list">
      <button className="close-feedback-list" onClick={onClose}>
        X 닫기
      </button>
      <div id="student-default-info">
        <div className="name-gender-birth">
          <h3 id="student-name">{student.student_name}</h3>
          <p id="gender">({student.student_gender})</p>
          <p id="birthday">{formatDate(student.student_birthday)}</p>
        </div>
        <div className="parent-info">
          <span>연락처:</span>
          <span id="parent-phone-number">{student.student_phone}</span>
        </div>
      </div>

      <div id="student-total-opinion">
        <p>종합 점수</p>
        <div className="total-emotion-data-div">
          <span className="total-emotion-data">행복: </span>
          <span id="total-happy">{totalScore.happy || 0}</span>
          <span className="total-emotion-data">슬픔: </span>
          <span id="total-sad">{totalScore.sad || 0}</span>
          <span className="total-emotion-data">분노: </span>
          <span id="total-angry">{totalScore.angry || 0}</span>
          <span className="total-emotion-data">공포: </span>
          <span id="current-fear">{totalScore.scary || 0}</span>
          <span className="total-emotion-data">혐오: </span>
          <span id="total-disgust">{totalScore.disgusting || 0}</span>
        </div>

        <div className="total-feedback-div">
          <div className="total-feedback-header">
            <p>종합 의견</p>
            {isEditing ? (
              <button
                id="save-total-feedback"
                onClick={handleSaveClick}
                className="feedback-button"
              >
                완료
              </button>
            ) : (
              <button
                id="edit-total-feedback"
                onClick={handleEditClick}
                className="feedback-button"
              >
                수정
              </button>
            )}
          </div>
          <div className="total-feedback">
            {isEditing ? (
              <input
                type="text"
                id="total-feedback-input"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            ) : (
              <p className="total-feedback-input">
                {feedback ||
                  "종합 의견 기록이 존재하지 않습니다. 추가해주세요!"}
              </p>
            )}
          </div>
        </div>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div id="previous-feedback">
        <p>이전 기록</p>
        {totalHistory.map((record, index) => (
          <div key={index} className="previous-feedback-detail">
            <span id="feedback-date">{record.date}</span>
            <div className="emotion-data-div">
              <span className="total-emotion-data">행복: </span>
              <span id="previous-happy">{record.happy || 0}</span>
              <span className="total-emotion-data">슬픔: </span>
              <span id="previous-sad">{record.sad || 0}</span>
              <span className="total-emotion-data">분노: </span>
              <span id="previous-angry">{record.angry || 0}</span>
              <span className="total-emotion-data">공포: </span>
              <span id="previous-fear">{record.scary || 0}</span>
              <span className="total-emotion-data">혐오: </span>
              <span id="previous-disgust">{record.disgusting || 0}</span>
            </div>
            <button
              className="history-detail-button"
              onClick={() => handleHistoryDetailClick(record.date)}
            >
              {expandTotalHistoryDetail === record.date
                ? "접기"
                : "자세히 보기"}
            </button>
            {expandTotalHistoryDetail === record.date && (
              <div className="expanded-history-detail">
                {totalHistoryDetail.length > 0 ? (
                  totalHistoryDetail.map((detail, idx) => (
                    <div key={idx} className="history-detail-item">
                      <p>{detail.detail_message || "상세 내용 없음"}</p>
                    </div>
                  ))
                ) : (
                  <p>상세 내용 없음</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentInfo;
