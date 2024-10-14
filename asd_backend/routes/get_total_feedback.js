const express = require("express");
const router = express.Router();
const db = require("../lib/db");
const sql = require("../lib/sql");

// POST 요청으로 학생의 id와 의견을 조회
router.post("/", async (req, res) => {
  const { studentId } = req.body;

  // 학생 ID가 없는 경우 처리
  if (!studentId) {
    return res.status(400).json({ error: "학생 ID를 받아오지 못 했습니다." });
  }

  try {
    // 학생 ID가 존재하는지 확인하는 쿼리
    const studentCheck = await db.query(
      "SELECT student_id FROM student_table WHERE student_id = ?",
      [studentId]
    );

    // ID가 없는 경우 오류 반환
    if (studentCheck.length === 0) {
      return res.status(404).json({ error: "등록된 ID가 없습니다." });
    }

    // ID가 있을 경우 student_opinion을 확인하는 쿼리
    const result = await db.query(
      "SELECT student_id, student_opinion FROM student_table WHERE student_id = ?",
      [studentId]
    );

    // 의견이 없는 경우 빈값 반환
    if (!result[0].student_opinion) {
      return res.status(200).json({ feedback: "", studentId: studentId });
    }

    // 의견이 있는 경우 의견을 반환
    res.status(200).json({
      studentId: result[0].student_id,
      feedback: result[0].student_opinion,
    });
  } catch (error) {
    console.error("MySQL 쿼리 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
