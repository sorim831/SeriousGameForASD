const express = require("express");
const router = express.Router();
const db = require("../lib/db"); // MySQL 연결

router.post("/student_login", (req, res) => {
  const { name, birthday } = req.body;

  const birthdayFormatted = birthday.replace(/-/g, "");
  const studentId = `${name}_${birthdayFormatted}`;

  // student_table에서 Student_id를 확인하도록 수정
  const query = `SELECT * FROM student_table WHERE student_id = ?`;

  db.query(query, [studentId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("로그인 중 오류 발생");
    }
    if (result.length > 0) {
      res.send("로그인 성공");
      return res.redirect("/temp");
    } else {
      res.status(401).send("이름 또는 생일이 유효하지 않습니다");
    }
  });
});

module.exports = router;
