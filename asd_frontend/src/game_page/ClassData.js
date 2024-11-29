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
import StudentInfo from "../main_page/teacher/StudentInfo";
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

const ClassData = ({ scoreAndFeedBackData, students }) => {
  const [emotionScores, setEmotionScores] = useState({
    joy: [],
    sadness: [],
    fear: [],
    disgust: [],
    anger: [],
    surprise: [],
  });

  const [chartData, setChartData] = useState({
    labels: ["😄기쁨😄", "😭슬픔😭", "😬공포😬", "😨혐오😨", "😡분노😡"],
    datasets: [
      {
        label: "각 감정에 대한 평균 점수",
        data: [0, 0, 0, 0, 0, 0],
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
      default:
        return null;
    }
  };

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
          ],
        },
      ],
    }));
  }, [emotionScores]);

  return (
    <div className="classdata-container">
      <div className="header">
        <p className="graph-name">오늘의 수업 데이터</p>
      </div>
      <div className="graph">
        <Bar
          data={chartData}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

// TODO: StudentInfo 그대로 복붙. 그래프 아래쪽으로 스크롤 하면 학생의 과거 정보 볼 수 있게 하기.
export default ClassData;
