// Classroom 최종 결과 저장
const express = require("express");
const router = express.Router();
const db = require("../lib/db");

router.post("/", async (req, res) => {
  const { studentId, scoreData, feedback } = req.body;

  const checkScore = "getStduentScore";
  const updateStudent = "updateTotalStudentInfo";

  try {
    // 기존 점수
    const [preScore] = await db.query(checkScore, [studentId]);
    console.log(preScore);

    // 현재 점수 업데이트 : 기존 점수 + score 점수 << 요거를 처음 점수랑 비교해서 증감 비교??
    const currScore = preScore.student_score + scoreData; // 점수 업데이트

    await db.query(updateStudent, [currScore, feedback, studentId]);

    res.json({ message: "데이터가 성공적으로 저장되었습니당" });
  } catch (error) {
    console.error(err);
    res.json({ message: "DB 저장 +중 오류 발생" });
  }
});

module.exports = router;
