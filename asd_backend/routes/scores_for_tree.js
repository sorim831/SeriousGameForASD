// scores_for_tree
const express = require("express");
const { verifyToken } = require("./middlewares");
const db = require("../lib/db");
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const studentId = req.decoded.id;

  console.log("Student ID received from token:", studentId); 

  try {
    const results = await db.query("sumStudentScore", [studentId]);
    console.log("Query Results:", results); 

    const totalScore = results[0]?.student_total_score || 0;
    console.log("Total Score Calculated:", totalScore); 

    res.json({
      success: true,
      student_total_score: totalScore,
    });
  } catch (err) {
    console.error("Database Error:", err); 
    res.json({
      success: false,
      message: "오류가 발생했습니다.",
    });
  }
});

module.exports = router;
