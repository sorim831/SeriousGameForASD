const express = require("express");
const { verifyToken } = require("./middlewares");
const db = require("../lib/db");
const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  const teacher_id = req.decoded.id;

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
  const teacher_id = req.decoded.id;
  const { student_id } = req.body;

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

      const actualTeacherId = results[0].id;

      return db.query("connectToNoAccessedStudnet", [
        actualTeacherId,
        student_id,
      ]);
    })
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.error("err connectToNoAccessedStudnet", err);
      res.status(500).send("err connectToNoAccessedStudnet");
    });
});

module.exports = router;
