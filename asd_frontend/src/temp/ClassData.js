import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./class-data.css";

// Chart.js 모듈 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ClassData = ({ scoreAndFeedBackData }) => {
  // 각 감정별 점수를 저장하는 객체
  const [emotionScores, setEmotionScores] = useState({
    joy: [],
    sadness: [],
    fear: [],
    disgust: [],
    anger: [],
    surprise: [],
  });

  // 감정별 평균 점수를 계산하여 차트 데이터에 반영
  const [chartData, setChartData] = useState({
    labels: [
      "😄기쁨😄",
      "😭슬픔😭",
      "😬공포😬",
      "😨혐오😨",
      "😡분노😡",
      "😲놀람😲",
    ],
    datasets: [
      {
        label: "각 감정에 대한 평균 점수",
        data: [0, 0, 0, 0, 0, 0], // 초기 평균 점수 값
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
      },
    ],
  });

  // selectedId 값의 첫 자리 숫자로 감정 분류
  const getEmotionCategory = (selectedId) => {
    const category = selectedId ? selectedId.split("-")[0] : "";
    switch (category) {
      case "1":
        return "joy";
      case "2":
        return "sadness";
      case "3":
        return "fear";
      case "4":
        return "disgust";
      case "5":
        return "anger";
      case "6":
        return "surprise";
      default:
        return null;
    }
  };

  // 새로운 피드백 데이터가 들어올 때 감정별로 점수 업데이트
  useEffect(() => {
    if (
      scoreAndFeedBackData &&
      scoreAndFeedBackData.score != null &&
      scoreAndFeedBackData.selectedId
    ) {
      const emotion = getEmotionCategory(scoreAndFeedBackData.selectedId);
      if (emotion) {
        setEmotionScores((prevScores) => {
          const updatedScores = { ...prevScores };
          updatedScores[emotion].push(scoreAndFeedBackData.score);
          return updatedScores;
        });
      }
    }
  }, [scoreAndFeedBackData]);

  // 감정별 평균 점수를 계산하고 차트 데이터를 업데이트
  useEffect(() => {
    const calculateAverage = (scores) => {
      const sum = scores.reduce((a, b) => a + b, 0);
      return scores.length ? sum / scores.length : 0;
    };

    setChartData((prevChartData) => ({
      ...prevChartData,
      datasets: [
        {
          ...prevChartData.datasets[0],
          data: [
            calculateAverage(emotionScores.joy),
            calculateAverage(emotionScores.sadness),
            calculateAverage(emotionScores.fear),
            calculateAverage(emotionScores.disgust),
            calculateAverage(emotionScores.anger),
            calculateAverage(emotionScores.surprise),
          ],
        },
      ],
    }));
  }, [emotionScores]);

  return (
    <div className="classdata-container">
      <div className="header">
        <p className="graph-name">오늘의 수업 데이터</p>
        {/* 학생 과거 데이터 불러오기 메뉴 */}
        <li className="ham-btn">
          <button className="hamburger-button" href="#">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </li>
      </div>
      <div className="graph">
        {/* 그래프 컴포넌트 */}
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default ClassData;
