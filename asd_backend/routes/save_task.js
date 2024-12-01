// 학생이 수행한 과제 저장
const express = require("express");
const router = express.Router();
const db = require("../lib/db");

router.post("/", async (req, res) => {
  const { student_id, student_action, student_score, student_opinion } =
    req.body;

  const updateStudent = "updateStudentInfo";
  const updateAverage = "updateAverageScore";
  /*
  updateAverageScore :
  "UPDATE student_table SET ?? = (SELECT AVG(student_score) FROM student_scores_table WHERE student_id = ? AND student_action = ?) WHERE student_id = ?" 
  */

  try {
    await db.query(updateStudent, [
      student_id,
      student_action,
      student_score,
      student_opinion,
    ]);

    // 감정들
    const emotions = {
      happy: "student_score_happy",
      sad: "student_score_sad",
      scary: "student_score_scary",
      disgusting: "student_score_disgusting",
      angry: "student_score_angry",
    };

    const action_name = emotions[student_action];
    if (!action_name) {
      return res.json({ message: "잘못된 값입니다." });
    }
    await db.query(updateAverage, [
      action_name,
      student_id,
      student_action,
      student_id,
    ]);

    res.json({ message: "데이터가 성공적으로 저장되었습니당" });
  } catch (error) {
    console.error(err);
    res.json({ message: "DB 저장 +중 오류 발생" });
  }
});

module.exports = router;
