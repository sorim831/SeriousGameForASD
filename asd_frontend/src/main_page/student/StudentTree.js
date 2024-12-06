import React, { useEffect, useState } from "react";
import styles from "./StudentTree.module.css";

const TREE_SIZE = 50; 
const MIN_DISTANCE = 40; 

const calculateTreeCount = (score) => {
  // console.log("Input Score:", score);
  // console.log("Math.log(1 + score):", Math.log(1 + score));
  // console.log("Calculated Tree Count:", Math.floor(Math.log(1 + score) * 3));
  return Math.floor(Math.log(1 + score) * 4);
};

const StudentTree = ({ score }) => {
  const [treePositions, setTreePositions] = useState([]);
  const [treeImages, setTreeImages] = useState([]);

  useEffect(() => {
    const importAll = (r) => r.keys().map(r);
    const images = importAll(
      require.context("./tree", false, /\.(png|jpe?g)$/)
    );
    setTreeImages(images);
  }, []);

  useEffect(() => {
    if (treeImages.length === 0) return;

    const positions = [];
    const maxAttempts = 100;
    const treeCount = calculateTreeCount(score);
    // console.log("Calculated Tree Count:", treeCount);

    const excludeAreas = [
      { left: 10, right: 90, top: 55, bottom: 70 }, 
      { left: 40, right: 60, top: 85, bottom: 95 }, 
    ];

    const isInsideExcludedArea = (x, y) => {
      return excludeAreas.some((area) => {
        return x >= area.left && x <= area.right && y >= area.top && y <= area.bottom;
      });
    };

    for (let i = 0; i < treeCount; i++) {
      let validPosition = false;
      let attempts = 0;

      while (!validPosition && attempts < maxAttempts) {
        const newPosition = {
          left: Math.random() * 80 + 10, // 가로 10% ~ 90%
          top: Math.random() * 40 + 50, // 세로 50% ~ 100%
          treeImage: treeImages[Math.floor(Math.random() * treeImages.length)],
        };

        if (isInsideExcludedArea(newPosition.left, newPosition.top)) {
          attempts++;
          continue;
        }

        validPosition = positions.every((pos) => {
          const dx = Math.abs(pos.left - newPosition.left);
          const dy = Math.abs(pos.top - newPosition.top);
          const distance = Math.sqrt(dx * dx + dy * dy);
          return (distance * window.innerWidth) / 100 > MIN_DISTANCE;
        });

        if (validPosition) {
          positions.push(newPosition);
        }
        attempts++;
      }
    }

    // console.log("Generated Tree Positions:", positions.length);

    setTreePositions(
      positions.map((pos) => ({
        ...pos,
        left: pos.left + "%",
        top: pos.top + "%",
      }))
    );
  }, [treeImages, score]);

  return (
    <div className={styles.tree}>
      {treePositions.map((position, index) => (
        <img
          key={index}
          src={position.treeImage}
          alt="Student Tree"
          style={{
            position: "absolute",
            left: position.left,
            top: position.top,
            width: `${TREE_SIZE}px`,
            height: "auto",
          }}
        />
      ))}
    </div>
  );
};

export default StudentTree;
