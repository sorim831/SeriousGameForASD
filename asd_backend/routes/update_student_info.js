const express = require("express");
const router = express.Router();
const db = require("../lib/db");

router.get("/", (req, res) => {
  //console.log("in update_student_info");
  res.send("update_student_info");
});

// 학생 정보 업데이트 라우터
router.post("/total_comment", (req, res) => {
  //console.log(req.body);
  const student_id = req.body.student_id;
  const student_opinion = req.body.student_opinion;
  //console.log("in total_comment");

  const query = "updateStudentTotalComment";

  db.query(query, [student_opinion, student_id])
    .then((result) => {
      if (result.affectedRows > 0) {
        res.json({
          code: 200,
          success: true,
          message: "updated!",
        });
      } else {
        res.status(404).json({
          code: 404,
          success: false,
          message: "not found",
        });
      }
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.status(500).json({
        code: 500,
        success: false,
        message: "db err",
      });
    });
});

module.exports = router;
