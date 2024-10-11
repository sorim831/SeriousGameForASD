const express = require("express");
const { verifyToken } = require("./middlewares");
const db = require("../lib/db");
const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  const teacher_id = req.decoded.id;
  console.log(teacher_id);

  db.query("getTeacherIdQuery", [teacher_id]).then((results) => {
    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "teacher no exist " });
    }

    const actualTeacherId = results[0].id;

    db.query("getConnectedStudent", actualTeacherId) // SELECT * FROM student_table WHERE teacher_id = ?
      .then((students) => {
        res.json({
          success: true,
          students: students,
        });
      })
      .catch((err) => {
        console.error("err getConnectedStudent", err);
        res.status(500).send("err getConnectedStudent");
      });
  });
});

module.exports = router;
