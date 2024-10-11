const express = require("express");
const router = express.Router();
const db = require("../lib/db");

router.post("/", (req, res) => {
  const { student_name, student_birthday } = req.body;

  const birthdayFormatted = student_birthday.replace(/-/g, "");
  const student_id = `${student_name}_${birthdayFormatted}`;

  const queryCheckId = "checkStudentId"; // "SELECT * FROM student_table WHERE student_id = ?",

  db.query(queryCheckId, [student_id])
    .then((rows) => {
      if (rows.length > 0) {
        res.status(400).send("이미 가입되어 있는 회원입니다.");
      } else {
        const insertQuery = "insertStudent"; // "INSERT INTO student_table (student_id, student_name, student_birthday) VALUES (?, ?, ?)",

        db.query(insertQuery, [student_id, student_name, birthdayFormatted])
          .then((result) => {
            res.send("학생이 성공적으로 등록되었습니다");
          })
          .catch((err) => {
            console.error("Database error:", err);
            res.status(500).send("학생 등록 중 오류 발생");
          });
      }
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.status(500).send("데이터베이스 오류 발생");
    });
});

module.exports = router;
