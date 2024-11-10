import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // chart.js 설정 자동 로드
import "./class-data.css";

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
        label: "감정 데이터",
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
      <p className="header">오늘의 수업 데이터</p>
      <div className="graph">
        {/* 그래프 컴포넌트 */}
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default ClassData;
