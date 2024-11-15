const express = require("express");
const { verifyToken } = require("./middlewares");
const db = require("../lib/db");
const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  const teacher_id = req.decoded.id; // 토큰에서 교사 ID 추출

  const query = "getNoAccessedStudent";
  db.query(query)
    .then((students) => {
      res.json({
        success: true,
        students: students,
      });
    })
    .catch((err) => {
      console.error("err getNoAccessedStudent", err);
      res.status(500).send("err getNoAccessedStudent");
    });
});

router.post("/connect", verifyToken, (req, res) => {
  const teacher_id = req.decoded.id; // 토큰에서 교사 ID 추출
  const { student_id } = req.body; // 학생 ID 추출

  if (!student_id) {
    return res.status(400).json({ success: false, message: "!student_id" });
  }

  db.query("getTeacherIdQuery", [teacher_id])
    .then((results) => {
      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "teacher no exist " });
      }

      const actualTeacherId = results[0].id; // 실제 교사의 ID

      // 학생을 교사와 연결
      return db.query("connectToNoAccessedStudent", [
        actualTeacherId,
        student_id,
      ]);
    })
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.error("err connectToNoAccessedStudent", err);
      res.status(500).send("err connectToNoAccessedStudent");
    });
});

module.exports = router;
