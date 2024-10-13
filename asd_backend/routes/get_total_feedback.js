const express = require("express");
const router = express.Router();
const db = require("../lib/db");
const sql = require("../lib/sql");

// GET 요청으로 학생의 종합 의견을 student_table의 student_opinion 칼럼에서 조회
router.get("/get-feedback", async (req, res) => {
  const { studentId } = req.params;

  // 학생 ID가 없을 때 에러 처리
  if (!studentId) {
    return res.status(400).json({ error: "학생 ID가 필요합니다." });
  }

  // SQL 쿼리 실행
  try {
    // student_opinion을 조회하는 쿼리
    const result = await db.query(sql.getStudentOpinion, [studentId]);

    // 피드백이 없을 경우 처리
    if (result.length === 0) {
      return res.status(404).json({ error: "해당 학생의 피드백을 찾을 수 없습니다." });
    }

    // 조회된 데이터를 콘솔에 출력
    console.log(`학생 ID: ${studentId}, 조회된 종합 의견: ${result[0].student_opinion}`);

    // 성공적으로 조회되었을 경우
    res.status(200).json(result[0]); // 첫 번째 결과를 반환
  } catch (error) {
    console.error("MySQL 쿼리 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;