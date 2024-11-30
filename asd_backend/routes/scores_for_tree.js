//scores_for_tree.js
const express = require("express");
const { verifyToken } = require("./middlewares");
const db = require("../lib/db");
const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  const studentId = req.user.id;

  db.query("sumStudentScore", [studentId])
    .then(([results]) => {
      const totalScore = results[0].student_total_score || 0;

      res.json({
        success: true,
        student_total_score: totalScore,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        success: false,
        message: "오류가 발생했습니다.",
      });
    });
});
module.exports = router;
