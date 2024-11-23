// 학생이 수행한 과제 저장
const express = require("express");
const router = express.Router();
const db = require("../lib/db");

router.post("/", async (req, res) => {
  const { student_id, student_action, student_score, student_opinion } =
    req.body;

  const updateStudent = "updateStudentInfo";

  try {
    await db.query(updateStudent, [
      student_id,
      student_action,
      student_score,
      student_opinion,
    ]);

    res.json({ message: "데이터가 성공적으로 저장되었습니당" });
  } catch (error) {
    console.error(err);
    res.json({ message: "DB 저장 +중 오류 발생" });
  }
});

module.exports = router;
