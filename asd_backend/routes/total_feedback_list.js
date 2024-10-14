const express = require("express");
const router = express.Router();
const db = require("../lib/db");
const sql = require("../lib/sql");

router.post("/total-feedback", async (req, res) => {
  const { studentId, feedback } = req.body;

  // 학생 ID와 의견이 전달되지 않은 경우 에러 처리
  if (!studentId || !feedback) {
    return res.status(400).json({
      error: "학생이 제대로 식별되지 않았거나, 의견이 입력되지 않았습니다.",
    });
  }

  try {
    // 학생 ID가 데이터베이스에 있는지 확인
    const [existingFeedback] = await db.query(sql.getStudentOpinion, [
      studentId,
    ]);

    if (existingFeedback) {
      // 기존 의견이 있을 경우 업데이트
      const updateResult = await db.query(sql.updateStudentOpinion, [
        feedback,
        studentId,
      ]);

      return res
        .status(200)
        .json({ message: "종합 의견이 성공적으로 업데이트되었습니다." });
    } else {
      // 기존 의견이 없을 경우 새로 등록
      const insertResult = await db.query(sql.insertStudentOpinion, [
        studentId,
        feedback,
      ]);

      return res
        .status(200)
        .json({ message: "종합 의견이 성공적으로 추가되었습니다." });
    }
  } catch (error) {
    console.error("MySQL 쿼리 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
