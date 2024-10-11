const express = require("express");
const router = express.Router();
const db = require("../lib/db");

router.post("/", (req, res) => {
  const { teacher_id, teacher_password, teacher_name } = req.body;

  const query = "insertTeacher"; // "INSERT INTO teacher_table (teacher_id, teacher_password, teacher_name) VALUES (?, ?, ?)",

  db.query(query, [teacher_id, teacher_password, teacher_name])
    .then((result) => {
      res.send("선생이 성공적으로 등록되었습니다");
      //window.location.href = "/";
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.status(500).send("선생 등록 중 오류 발생");
    });
});

router.post("/checkid", (req, res) => {
  const { teacher_id } = req.body;

  const queryCheckId = "checkTeacherId"; // "SELECT * FROM teacher_table WHERE teacher_id = ?",

  db.query(queryCheckId, [teacher_id])
    .then((result) => {
      if (result.length > 0) {
        res.json({ available: false });
      } else {
        res.json({ available: true });
      }
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.status(500).send("중복 체크 중 오류 발생");
    });
});

module.exports = router;
