const express = require("express");
const router = express.Router();
const db = require("../lib/db");

router.post("/", async (req, res) => {
  const { student_name, student_birthday } = req.body;

  const birthdayFormatted = student_birthday.replace(/-/g, "");
  //const studentId = `${name}_${birthdayFormatted}`;

  const query = "loginStudent";

  try {
    const result = await db.query(query, [student_name, birthdayFormatted]);
    if (!student_name || !student_birthday) {
      return res.send({
        success: false,
        message: "이름과 생일을 모두 입력해주세요.",
      });
    }
    if (result.length > 0) {
      return res.send({
        success: true,
        message: `${student_name}님, 환영합니다!`,
      });
    } else {
      res.send({
        success: false,
        message: "이름 또는 생일이 유효하지 않습니다",
      });
    }
  } catch (err) {
    console.error(err);
    res.send({ success: false, message: "로그인 중 오류 발생" });
  }
});

module.exports = router;
