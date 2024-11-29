import React, { useState, useEffect } from "react";
import "./student-info.css";

const StudentInfo = ({ onClose, studentData }) => {
  const [feedback, setFeedback] = useState(studentData.student_opinion || "");
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalScore, setTotalScore] = useState({});
  const [totalHistory, setTotalHistory] = useState([]);
  const [totalHistoryDetail, setTotalHistoryDetail] = useState([]);
  const [expandTotalHistoryDetail, setExpandTotalHistoryDetail] =
    useState(null);

  const handleEditClick = () => {
    setIsEditing(true);
    setErrorMessage("");
  };

  const handleSaveClick = async () => {
    setLoading(true); // 수정 버튼 누르면 [ 수정 버튼 -> 완료 버튼 ] 활성화
    console.log(studentData);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/update_student_info/total_comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_opinion: feedback,
            student_id: studentData.student_id,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setIsEditing(false);
      } else {
        setErrorMessage("err");
      }
    } catch (error) {
      setErrorMessage("종합 의견 저장 중 오류가 발생했습니다."); // 오류 메시지 설정
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  // 학생 생일 날짜 형식
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchTotalScore = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/get_student_info/total_score/${studentData.student_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`oops... ${response.status}`);
        }

        const data = await response.json();
        setTotalScore(data.scores || {});
        console.log(data.scores);
      } catch (error) {
        console.error("err at fetchTotalScore", error);
        setTotalScore({});
      }
    };
    const fetchTotalHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/get_student_info/total_history/${studentData.student_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`oops... ${response.status}`);
        }

        const data = await response.json();
        setTotalHistory(data.rows || []);
        console.log(data.rows);
      } catch (error) {
        console.error("err at fetchTotalHistory", error);
      }
    };

    fetchTotalScore();
    fetchTotalHistory();
  }, [studentData.student_id]);

  const handleHistoryDetailClick = async (date) => {
    if (expandTotalHistoryDetail === date) {
      setExpandTotalHistoryDetail(null);
      setTotalHistoryDetail([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/get_student_info/total_history/history_detail/${studentData.student_id}/${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`oops... ${response.status}`);
      }

      const data = await response.json();
      setTotalHistoryDetail(data.rows || []);
      setExpandTotalHistoryDetail(date);
    } catch (error) {
      console.error("err at fetchTotalScore", error);
      setTotalHistoryDetail([]);
    }
  };

  return (
    <div className="feedback-list">
      <button className="close-feedback-list" onClick={onClose}>
        X 닫기
      </button>
      <div id="student-default-info">
        <div className="name-gender-birth">
          <h3 id="student-name">{studentData.student_name}</h3>
          <p id="gender">({studentData.student_gender})</p>
          <p id="birthday">{formatDate(studentData.student_birthday)}</p>
        </div>
        <div className="parent-info">
          <span>연락처:</span>
          <span id="parent-phone-number">{studentData.student_phone}</span>
        </div>
      </div>

      <div id="student-total-opinion">
        <p>종합 점수</p>
        <div className="total-emotion-data-div">
          {/* 감정 데이터를 보여주는 부분 */}
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
                disabled={loading}
                className="feedback-button"
              >
                {loading ? "저장 중..." : "완료"}
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
                disabled={loading}
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
              <span className="total-emotion-data">평균: </span>
              <span id="previous-average">{record.score || 0}</span>
            </div>
            <div>
              <p>gpt 의견: {record.opinion}</p>
            </div>
            <div
              onClick={() => handleHistoryDetailClick(record.date)}
              style={{ cursor: "pointer" }}
            >
              {expandTotalHistoryDetail === record.date
                ? "▼ 접기"
                : "▶ 상세 보기"}
            </div>
            <div>
              {totalHistoryDetail.length > 0 &&
                expandTotalHistoryDetail === record.date && (
                  <div className="history-detail">
                    <table>
                      <thead>
                        <tr>
                          <th>감정</th>
                          <th>점수</th>
                          <th>의견</th>
                        </tr>
                      </thead>
                      <tbody>
                        {totalHistoryDetail.map((detail, detailIndex) => (
                          <tr key={detailIndex}>
                            <td>{detail.student_action}</td>
                            <td>{detail.student_score}</td>
                            <td>{detail.student_opinion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentInfo;
