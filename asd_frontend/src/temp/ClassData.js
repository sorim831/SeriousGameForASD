import React, { useState } from "react";
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
import ScoreAndFeedBack from "./ScoreAndFeedBack"; // 이 컴포넌트에서 받아오는 점수 바탕으로 각 감정별로 평균을 계산. 그 데이터를 그래프에 표시

// Chart.js 모듈 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ClassData = () => {
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
        data: [12, 19, 3, 5, 2, 3],
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

  const updateData = () => {
    setChartData({
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          data: chartData.datasets[0].data.map(() =>
            Math.floor(Math.random() * 20)
          ),
        },
      ],
    });
  };

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
