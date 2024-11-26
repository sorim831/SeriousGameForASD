import React, { useEffect, useState } from "react";
import styles from "./StudentTree.module.css";

const score = 10;
const TREE_SIZE = 50; // 나무 크기 (px)
const MIN_DISTANCE = 40; // 나무들 사이의 최소 거리

const StudentTree = () => {
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

    for (let i = 0; i < score; i++) {
      let validPosition = false;
      let attempts = 0;

      while (!validPosition && attempts < maxAttempts) {
        const newPosition = {
          left: Math.random() * 60 + 20,
          top: Math.random() * 60 + 20,
          treeImage: treeImages[Math.floor(Math.random() * treeImages.length)],
        };

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

    setTreePositions(
      positions.map((pos) => ({
        ...pos,
        left: pos.left + "%",
        top: pos.top + "%",
      }))
    );
  }, [treeImages]);

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
