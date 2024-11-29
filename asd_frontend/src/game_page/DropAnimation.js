import React from 'react';

// DropAnimation 컴포넌트 -> 이모지 비의 각 드롭을 나타냄
const DropAnimation = ({ left, bottom, delay, duration, emoji }) => (
  <div 
    className="drop" 
    style={{ 
      left: `${left}%`, 
      bottom: `${bottom}%`,
      animationDelay: `${delay}s`, 
      animationDuration: `${duration}s`
    }}
  >
    <div 
      className="emoji" 
      style={{ 
        animationDelay: `${delay}s`, 
        animationDuration: `${duration}s`
      }}
    >
      {emoji} {/* 랜덤으로 선택된 이모지 */}
    </div>
  </div>
);

export default DropAnimation;
