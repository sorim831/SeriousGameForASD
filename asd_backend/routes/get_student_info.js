const express = require("express");
const router = express.Router();
const db = require("../lib/db");

// 학생 정보 조회 라우터
router.get("/", (req, res) => {
  const student_id = req.decoded.id;

  const query = "getStudentInfo";

  db.query(query, [student_id])
    .then((rows) => {
      if (rows.length > 0) {
        const student = rows[0];
        res.json({
          code: 200,
          success: true,
          students: [
            {
              id: student.student_id,
              name: student.student_name,
              gender: student.student_gender,
              birthday: student.student_birthday,
              score: student.student_score,
              score_date: student.student_score_date,
              opinion: student.student_opinion,
              parent_name: student.student_parent_name,
              phone: student.student_phone,
            },
          ],
        });
      } else {
        res.status(404).json({
          code: 404,
          success: false,
          message: "해당 학생 정보를 찾을 수 없습니다.",
          students: [],
        });
      }
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.status(500).json({
        code: 500,
        success: false,
        message: "데이터베이스 오류 발생",
        students: [],
      });
    });
});

module.exports = router;
