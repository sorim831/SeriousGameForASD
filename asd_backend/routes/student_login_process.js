const express = require("express");
const router = express.Router();
const db = require("../lib/db");

const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { student_name, student_birthday } = req.body;

  const birthdayFormatted = student_birthday.replace(/-/g, "");
  const studentId = `${student_name}_${birthdayFormatted}`;

  const query = "loginStudent"; // "SELECT * FROM student_table WHERE student_name = ? AND student_birthday = ?",

  if (!student_name || !student_birthday) {
    return res.send({
      success: false,
      message: "이름과 생일을 모두 입력해주세요.",
    });
  }
  try {
    const result = await db.query(query, [student_name, birthdayFormatted]);
    const role = "student";
    if (result.length > 0) {
      // 토큰 부여
      try {
        const id = studentId;
        const token = jwt.sign(
          {
            id,
            role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "100m",
            issuer: "tada",
          }
        );
        return res.json({
          code: 200,
          success: true,
          message: `${student_name}님, 환영합니다!`,
          token,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          code: 500,
          success: false,
          message: "서버 에러",
        });
      }
      /*
      return res.send({
        success: true,
        message: `${student_name}님, 환영합니다!`,
        
      });*/
    } else {
      res.send({
        success: false,
        message: "이름 또는 생일이 유효하지 않아요.",
      });
    }
  } catch (err) {
    console.error(err);
    res.send({
      success: false,
      message: "예상치 못한 오류가 발생했어요. 한번 더 시도해주세요.",
    });
  }
});

module.exports = router;
