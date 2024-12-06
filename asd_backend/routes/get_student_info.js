const express = require("express");
const router = express.Router();
const db = require("../lib/db");
const { verifyToken } = require("./middlewares");

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
              name: student.student_name,
              gender: student.student_gender,
              birthday: student.student_birthday,
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

router.get("/total_score/:student_id", verifyToken, (req, res) => {
  const student_id = req.params.student_id;
  const query = "getStudentTotalScore";

  db.query(query, [student_id])
    .then((rows) => {
      if (rows.length === 0) {
        return res.status(404);
      }

      res.json({
        success: true,
        scores: {
          happy: rows[0].student_score_happy,
          sad: rows[0].student_score_sad,
          scary: rows[0].student_score_scary,
          disgusting: rows[0].student_score_disgusting,
          angry: rows[0].student_score_angry,
        },
      });
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.status(500);
    });
});

router.get("/total_history/:student_id", verifyToken, (req, res) => {
  const student_id = req.params.student_id;
  const query = "getStudentTotalHistory";

  db.query(query, [student_id])
    .then((rows) => {
      const rowsWithOpinion = rows.map((row) => {
        return {
          date: row.date,
          happy: row.happy,
          sad: row.sad,
          scary: row.scary,
          disgusting: row.disgusting,
          angry: row.angry,
          score: row.score,
          opinion: "테스트용 opinion... 아마 gpt 쓰지 않을까요?",
        };
      });
      res.json({ rows: rowsWithOpinion });
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.status(500);
    });
});

router.get(
  "/total_history/history_detail/:student_id/:date",
  verifyToken,
  (req, res) => {
    const student_id = req.params.student_id;
    const date = req.params.date;
    const query = "getStudentHistoryDetail";
    //console.log(student_id, date);

    db.query(query, [student_id, date])
      .then((rows) => {
        res.json({ rows });
      })
      .catch((error) => {
        console.error("/total/history_detail/:student_id/:date err", error);
        res.status(500);
      });
  }
);

module.exports = router;
