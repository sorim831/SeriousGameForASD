import React, { useState, useEffect } from "react";
import "./student-info.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StudentInfo = ({ onClose, studentData }) => {
  const [feedback, setFeedback] = useState("");
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalScore, setTotalScore] = useState({});
  const [totalHistory, setTotalHistory] = useState([]);
  const [totalHistoryDetail, setTotalHistoryDetail] = useState([]);
  const [expandTotalHistoryDetail, setExpandTotalHistoryDetail] =
    useState(null);

  useEffect(() => {
    setFeedback(studentData.student_opinion || "");
  }, [studentData]);

  const handleSaveClick = async () => {
    setLoading(true);
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
        setShowSaveButton(false);
      } else {
        setErrorMessage("err");
      }
    } catch (error) {
      setErrorMessage("종합 의견 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
    setShowSaveButton(true);
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

  const chartData = {
    labels: totalHistory.map((record) => record.date),
    datasets: [
      {
        label: "행복",
        data: totalHistory.map((record) => record.happy),
        borderColor: "#FFD700",
        tension: 0.1,
      },
      {
        label: "슬픔",
        data: totalHistory.map((record) => record.sad),
        borderColor: "#4169E1",
        tension: 0.1,
      },
      {
        label: "분노",
        data: totalHistory.map((record) => record.angry),
        borderColor: "#DC143C",
        tension: 0.1,
      },
      {
        label: "공포",
        data: totalHistory.map((record) => record.scary),
        borderColor: "#9400D3",
        tension: 0.1,
      },
      {
        label: "혐오",
        data: totalHistory.map((record) => record.disgusting),
        borderColor: "#006400",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 10,
      },
    },
    spanGaps: true,
  };

  return (
    <div className="feedback-list">
      <button className="close-feedback-list" onClick={onClose}>
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 4V20M4 12H16M16 12L12 8M16 12L12 16"
            stroke="#999999"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div id="student-default-info">
        <div className="student-info-name-gender">
          <h3 className="student-info-name">{studentData.student_name}</h3>
          <p className="student-info-gender">
            ({studentData.student_gender === "male" ? "남" : "여"})
          </p>
        </div>
        <div className="student-info-birthday">
          <span>생년월일: </span>
          <span className="student-info-birthday">
            {formatDate(studentData.student_birthday)}
          </span>
        </div>
        <div className="student-info-phone">
          <span>연락처:</span>
          <span id="parent-phone-number">
            {studentData.student_phone.replace(
              /(\d{3})(\d{4})(\d{4})/,
              "$1-$2-$3"
            )}
          </span>
        </div>
      </div>

      <div id="student-total-opinion">
        <p>종합 점수</p>
        <div className="total-emotion-data-div">
          {/* 감정 데이터를 보여주는 부분 */}
          <div className="total-emotion-data-div-item">
            <div>
              <span className="total-emotion-data">😄행복: </span>
              <span id="total-happy">{totalScore.happy || 0}</span>
            </div>
            <div>
              <span className="total-emotion-data">😭슬픔: </span>
              <span id="total-sad">{totalScore.sad || 0}</span>
            </div>
            <div>
              <span className="total-emotion-data">😡분노: </span>
              <span id="total-angry">{totalScore.angry || 0}</span>
            </div>
          </div>
          <div className="total-emotion-data-div-item">
            <div>
              <span className="total-emotion-data">😬공포: </span>
              <span id="current-fear">{totalScore.scary || 0}</span>
            </div>
            <div>
              <span className="total-emotion-data">😨혐오: </span>
              <span id="total-disgust">{totalScore.disgusting || 0}</span>
            </div>
            <div>
              <span className="total-emotion-data">📈평균: </span>
              <span id="total-average">
                {(parseFloat(totalScore.happy || 0) +
                  parseFloat(totalScore.sad || 0) +
                  parseFloat(totalScore.angry || 0) +
                  parseFloat(totalScore.scary || 0) +
                  parseFloat(totalScore.disgusting || 0)) /
                  5}
              </span>
            </div>
          </div>
        </div>

        <div style={{ width: "100%", height: "300px", marginTop: 20 }}>
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="total-feedback-div">
          <div className="total-feedback-header">
            <p>종합 의견</p>
          </div>
          <div className="total-feedback">
            <textarea
              id="total-feedback-input"
              value={feedback}
              onChange={handleFeedbackChange}
              disabled={loading}
              placeholder="종합 의견을 입력해주세요"
            />
            {showSaveButton && (
              <button
                onClick={handleSaveClick}
                disabled={loading}
                className="student-info-save-total-feedback"
              >
                {loading ? "저장 중..." : "완료"}
              </button>
            )}
          </div>
        </div>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div id="previous-feedback">
        {/* 이전 기록들 바탕으로 그래프도 보여주도록*/}
        {totalHistory.map((record, index) => (
          <div key={index} className="previous-feedback-detail">
            <span id="feedback-date">{record.date}</span>
            <div className="emotion-data-div">
              <div className="total-emotion-data-div-item">
                <div>
                  <span className="total-emotion-data">😄행복: </span>
                  <span id="previous-happy">{record.happy || 0}</span>
                </div>
                <div>
                  <span className="total-emotion-data">😭슬픔: </span>
                  <span id="previous-sad">{record.sad || 0}</span>
                </div>
                <div>
                  <span className="total-emotion-data">😡분노: </span>
                  <span id="previous-angry">{record.angry || 0}</span>
                </div>
              </div>
              <div className="total-emotion-data-div-item">
                <div>
                  <span className="total-emotion-data">😬공포: </span>
                  <span id="previous-fear">{record.scary || 0}</span>
                </div>
                <div>
                  <span className="total-emotion-data">😨혐오: </span>
                  <span id="previous-disgust">{record.disgusting || 0}</span>
                </div>
                <div>
                  <span className="total-emotion-data">📈평균: </span>
                  <span id="previous-average">{record.score || 0}</span>
                </div>
              </div>
            </div>
            <div className="student-info-gpt-opinion">
              <p className="student-info-gpt-opinion-title">
                gpt가 의견을 요약했어요.
              </p>
              <p className="student-info-gpt-opinion-content">
                {record.opinion}
              </p>
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
                          <tr key={detailIndex} className="history-detail-row">
                            <td>{detail.student_action}</td>
                            <td className="history-detail-score">
                              {parseInt(detail.student_score)}
                            </td>
                            <td className="history-detail-opinion">
                              {detail.student_opinion}
                            </td>
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
