// 학생의 이전 게임 기록 불러오기
const express = require("express");
const router = express.Router();
const db = require("../lib/db");

router.post("/", async (req, res) => {
  const { student_id } = req.body;

  const loadGameHistory = "loadStudentHistory";

  try {
    const [history] = await db.query(loadGameHistory, [student_id]);
    res.json({
      success: true,
      data: history,
      message: "데이터가 성공적으로 저장되었습니당",
    });
  } catch (error) {
    console.error(err);
    res.json({ message: "DB 저장 +중 오류 발생" });
  }
});

module.exports = router;
