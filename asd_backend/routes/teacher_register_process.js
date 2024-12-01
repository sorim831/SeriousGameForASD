const express = require("express");
const router = express.Router();
const db = require("../lib/db");
const crypto = require("crypto");

router.post("/", (req, res) => {
  try {
    const { teacher_id, teacher_password, teacher_name } = req.body;

    if (!teacher_id || !teacher_password || !teacher_name) {
      return res
        .status(400)
        .json({ error: "!teacher_id || !teacher_password || !teacher_name" });
    }

    const query = "insertTeacher"; // "INSERT INTO teacher_table (teacher_id, teacher_password, teacher_name) VALUES (?, ?, ?)",

    const salt = teacher_id;

    crypto.pbkdf2(teacher_password, salt, 100000, 64, "sha512", (err, key) => {
      if (err) {
        console.error("pw hashing err", err);
        return res.status(500).json({ error: "hash err" });
      }

      const teacher_hashed_password = key.toString("base64");

      db.query(query, [teacher_id, teacher_hashed_password, teacher_name])
        .then((result) => {
          res.json({ message: "good!" });
        })
        .catch((err) => {
          console.error("Database error:", err);
          res.status(500).json({ error: "선생님 등록 중 오류 발생" });
        });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "server err" });
  }
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
      res.status(500).json({ error: "중복 체크 중 오류 발생" });
    });
});

module.exports = router;
