/*
`/classroom 결과 저장` (학생id, 총 점수 (or평균점수), 통합 코멘트)  task 화면에서 → DB
프론트엔드 Classroom.js에서----------->     try {
      const response = await axios.post(`${address}/end_class`, endClassData);
      if (response.status === 200) {
        alert("수업 종료 데이터가 성공적으로 전송되었습니다.");
      }

        -

    const endClassData = {
      studentId,
      date: today,
      scoreData: scoreAndFeedBackData.score,
      feedback: scoreAndFeedBackData.feedback,
    };

*/


// Classroom 결과 저장
const express = require("express");
const router = express.Router();
const db = require("../lib/db");

router.post("/", async (req, res) => {
  const { studentId, date, scoreData, feedback } = req.body;

  const checkScore = "getStduentScore";
  const updateStudent = "updateStudentInfo"; 

  try { 
    // 기존 점수
    const [preScore] = await db.query(
      checkScore,
      [studentId]
    );
    console.log(preScore);

    // 현재 점수 업데이트 : 기존 점수 + score 점수
    const currScore = preScore.student_score + scoreData; // 점수 업데이트

    await db.query(
        updateStudent,
      [currScore, date, feedback, studentId]
    );

    res.json({ message: "데이터가 성공적으로 저장되었습니당" });
  } catch (error) {
    console.error(err);
    res.json({ message: "DB 저장 +중 오류 발생" });
  }
});

module.exports = router;
