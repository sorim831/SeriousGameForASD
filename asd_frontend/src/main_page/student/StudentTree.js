import React, { useEffect, useState } from "react";
import styles from "./StudentTree.module.css";

const TREE_SIZE = 50;
const MIN_DISTANCE = 40;

const calculateTreeCount = (score) => {
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

    const excludeAreas = [{ left: 45, right: 55, top: 0, bottom: 10 }];

    const isInsideExcludedArea = (x, y) => {
      return excludeAreas.some((area) => {
        return (
          x >= area.left && x <= area.right && y >= area.top && y <= area.bottom
        );
      });
    };

    for (let i = 0; i < treeCount; i++) {
      let validPosition = false;
      let attempts = 0;

      while (!validPosition && attempts < maxAttempts) {
        const newPosition = {
          left: Math.random() * 80 + 10,
          top: Math.random() * 30 + 50,
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
          alt="Tree"
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
