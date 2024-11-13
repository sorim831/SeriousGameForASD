const express = require("express");
const router = express.Router();
const db = require("../lib/db");

// 특정 학생 정보 조회
router.get("/student/info", async (req, res) => {
  const { studentId, studentName } = req.query;

  const query = "getStudentInfo";

  try {
    // studentId와 studentName으로 학생 조회
    const result = await db.query(query, [studentId, studentName]);

    // 학생 데이터가 없을 경우
    if (result.length === 0) {
      return res.status(404).json({ message: "해당 학생을 찾을 수 없습니다." });
    }

    // 성공적으로 학생 데이터 반환
    res.status(200).json(result[0]);
  } catch (error) {
    console.error("학생 정보 조회 중 오류:", error);
    res
      .status(500)
      .json({ message: "학생 정보를 가져오는 중 오류가 발생했습니다." });
  }
});

module.exports = router;
