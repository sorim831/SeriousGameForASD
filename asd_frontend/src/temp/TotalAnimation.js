import React, { useEffect, useState } from 'react';
import DropAnimation from './DropAnimation';
import './TotalAnimation.css';

const TotalAnimation = () => {
  // 이모지 비를 나타내기 위한 상태 변수
  const [drops, setDrops] = useState([]);
  const [backDrops, setBackDrops] = useState([]);

  // 사용할 이모지 리스트
  const emojis = ['☀️', '💧', '🌼', '✨', '🌳', '🌱']; 

  // 이모지 비를 생성하는 함수
  const makeItRain = () => {
    let increment = 0; // 왼쪽에서의 이모지 위치를 위한 변수
    let newDrops = []; // 전면 이모지 배열
    let newBackDrops = []; // 배경 이모지 배열

    // 100px 위치까지 이모지를 생성
    while (increment < 100) {
      const randoHundo = Math.floor(Math.random() * 98) + 1; // 1~98 사이의 랜덤 숫자
      const randoFiver = Math.floor(Math.random() * 4) + 2; // 2~5 사이의 랜덤 숫자
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]; // 이모지 랜덤 선택
      increment += randoFiver; // 증가값을 더하여 다음 위치 설정

      // 새로운 이모지 데이터 추가
      newDrops.push({ 
        left: increment, 
        bottom: randoFiver * 2 + 100, 
        delay: 0.1 * randoHundo, 
        duration: 2.5 + randoHundo * 0.01, 
        emoji: randomEmoji 
      });
      newBackDrops.push({ 
        left: increment, 
        bottom: randoFiver * 2 + 100, 
        delay: 0.1 * randoHundo, 
        duration: 2.5 + randoHundo * 0.01, 
        emoji: randomEmoji 
      });
    }

    // 상태 업데이트
    setDrops(newDrops);
    setBackDrops(newBackDrops);
  };

  // 컴포넌트가 마운트되면 이모지 비 생성
  useEffect(() => {
    makeItRain();
  }, []);

  return (
    <div>
      <div className="rain front-row">
        {/* 전면 이모지 렌더링 */}
        {drops.map((drop, idx) => (
          <DropAnimation key={idx} {...drop} />
        ))}
      </div>
      <div className="rain back-row">
        {/* 배경 이모지 렌더링 */}
        {backDrops.map((drop, idx) => (
          <DropAnimation key={idx} {...drop} />
        ))}
      </div>
    </div>
  );
};

export default TotalAnimation;
