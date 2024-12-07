import React, { useEffect, useState } from "react";
import styles from "./StudentTree.module.css";

const TREE_SIZE = 50;
const MIN_DISTANCE = 40;
const MAX_WIDTH = 400;

const calculateTreeCount = (score) => {
  return Math.floor(Math.log(1 + score) * 4);
};

const StudentTree = ({ score }) => {
  const [treePositions, setTreePositions] = useState([]);
  const [treeImages, setTreeImages] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    const excludeAreas = [{ left: 45, right: 55, bottom: 90, top: 100 }];

    const isInsideExcludedArea = (x, y) => {
      return excludeAreas.some((area) => {
        return (
          x >= area.left && x <= area.right && y >= area.bottom && y <= area.top
        );
      });
    };

    const getRandomPosition = () => {
      if (windowWidth > MAX_WIDTH) {
        const margin = (windowWidth - MAX_WIDTH + 30) / 2;
        const randomX = Math.random() * MAX_WIDTH + margin;
        return (randomX / windowWidth) * 90;
      }
      return Math.random() * 85 + 1;
    };

    for (let i = 0; i < treeCount; i++) {
      let validPosition = false;
      let attempts = 0;

      while (!validPosition && attempts < maxAttempts) {
        const newPosition = {
          left: getRandomPosition(),
          bottom: Math.random() * 30 + 10,
          treeImage: treeImages[Math.floor(Math.random() * treeImages.length)],
        };

        if (isInsideExcludedArea(newPosition.left, newPosition.bottom)) {
          attempts++;
          continue;
        }

        validPosition = positions.every((pos) => {
          const dx = Math.abs(pos.left - newPosition.left);
          const dy = Math.abs(pos.bottom - newPosition.bottom);
          const distance = Math.sqrt(dx * dx + dy * dy);
          return (distance * windowWidth) / 100 > MIN_DISTANCE;
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
        bottom: pos.bottom + "%",
      }))
    );
  }, [treeImages, score, windowWidth]);

  return (
    <div className={styles.tree}>
      {treePositions.map((position, index) => (
        <img
          key={index}
          src={position.treeImage}
          alt="Tree"
          style={{
            position: "fixed",
            left: position.left,
            bottom: position.bottom,
            width: `${TREE_SIZE}px`,
            height: "auto",
          }}
        />
      ))}
    </div>
  );
};

export default StudentTree;
