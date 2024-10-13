const express = require("express");
const router = express.Router();
const db = require("../lib/db");
const sql = require("../lib/sql");

// POST 요청으로 학생의 종합 의견을 student_table의 student_opinion 칼럼에 저장
router.post("/total-feedback", async (req, res) => {
  const { studentId, feedback } = req.body;

  // 학생 ID와 의견이 없을 때 에러 처리
  if (!studentId || !feedback) {
    return res.status(400).json({ error: "학생이 제대로 식별되지 않았거나, 의견이 입력되지 않았습니다." });
  }

  // SQL 쿼리 실행
  try {
    // values 배열 생성
    const values = [studentId, feedback];
    // 종합 의견을 데이터베이스에 업데이트
    const result = await db.query(sql.insertStudentOpinion, [...values, feedback]);

    // 성공적으로 업데이트되었을 경우
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "해당 학생을 찾을 수 없습니다." });
    }

    // 콘솔에 저장된 데이터 출력
    console.log(`학생 ID: ${studentId}, 종합 의견: ${feedback}`);

    res.status(200).json({ message: "종합 의견이 성공적으로 저장되었습니다." });
  } catch (error) {
    console.error("MySQL 쿼리 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
