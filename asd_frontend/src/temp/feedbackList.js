import React from "react";
import "./feedback-list.css";

const FeedbackList = () => {
  return (
    <div>
      <div id="student-default-info">
        <div className="name-sex-birth">
          <h3 id="student-name">홍길동</h3>
          <p id="sex">(남)</p>
          <p id="birthday">030929</p>
        </div>
        <div className="parent-info">
          <span>보호자:</span>
          <span id="parent-name">o o o</span>
          <span>연락처:</span>
          <span id="parent-phone-number">010-1234-5678</span>
        </div>
      </div>

      <div id="student-total-opinion">
        <p>종합 점수</p>
        <div className="total-emotion-data-div">
          <span className="total-emotion-data">행복: </span>
          <span id="total-happy">5</span>
          <span className="total-emotion-data">슬픔: </span>
          <span id="total-sad">5</span>
          <span className="total-emotion-data">분노: </span>
          <span id="total-angry">5</span>
          <span className="total-emotion-data">공포: </span>
          <span id="current-fear">5</span>
          <span className="total-emotion-data">혐오: </span>
          <span id="total-disgust">5</span>
          <span className="total-emotion-data">놀람: </span>
          <span id="total-surprise">5</span>
        </div>

        <div className="total-feedback-header">
          <span>종합 의견</span>
          <button id="edit-total-feedback">수정</button>
        </div>
        <div className="total-feedback">
          <input type="text" id="total-feedback-input" />
        </div>
      </div>

      <p>이전 기록</p>

      <div id="previous-feedback">
        <div className="previous-feedback-detail">
          <span id="feedback-date">24.09.29</span>
          <div className="emotion-data-div">
            <span className="total-emotion-data">행복: </span>
            <span id="previous-happy">5</span>
            <span className="total-emotion-data">슬픔: </span>
            <span id="previous-sad">5</span>
            <span className="total-emotion-data">분노: </span>
            <span id="previous-angry">5</span>
            <span className="total-emotion-data">공포: </span>
            <span id="previous-fear">5</span>
            <span className="total-emotion-data">혐오: </span>
            <span id="previous-disgust">5</span>
            <span className="total-emotion-data">놀람: </span>
            <span id="previous-surprise">5</span>
          </div>
          <div id="feedback-details">
            수업 때 학생에 대한 의견을 적으면 여기에 기록됨.
          </div>
        </div>
        {/* 기록이 동적으로 추가 */}
      </div>
    </div>
  );
};

export default FeedbackList;
