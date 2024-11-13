const express = require("express");
const router = express.Router();
const db = require("../lib/db");
const { verifyToken } = require("./middlewares");

// 선생님과 매칭되지 않은 학생 목록 가져오기
router.get("/", verifyToken, async (req, res) => {
  try {
    // 매칭되지 않은 학생 데이터 가져오는 쿼리
    const [noStudentData] = await db.query(`
      SELECT 
        student_id,
        student_name,
        student_birthday,
        student_gender,
        student_score,
        student_score_date,
        student_opinion,
        student_parent_name,
        student_phone
      FROM asd_serious_game.student_table
      WHERE teacher_id IS NULL
    `);

    // 학생 데이터가 없을 경우
    if (noStudentData.length === 0) {
      return res
        .status(404)
        .json({ message: "매칭되지 않은 학생이 없습니다." });
    }

    // 성공적으로 학생 데이터 반환
    res.status(200).json({ students: noStudentData });
  } catch (error) {
    console.error("매칭되지 않은 학생 목록 가져오는 중 오류:", error);
    res
      .status(500)
      .json({ message: "학생 정보를 가져오는 중 오류가 발생했습니다." });
  }
});

module.exports = router;
