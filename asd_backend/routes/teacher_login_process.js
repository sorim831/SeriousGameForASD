const express = require("express");
const router = express.Router();
const db = require("../lib/db");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

function hashingPassword(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, key) => {
      if (err) reject(err);
      resolve(key.toString("base64"));
    });
  });
}

router.post("/", async (req, res) => {
  const { teacher_id, teacher_password } = req.body;

  const query = "loginTeacher"; // "SELECT * FROM teacher_table WHERE teacher_id = ? AND teacher_password = ?",

  if (!teacher_id || !teacher_password) {
    return res.send({
      success: false,
      message: "아이디와 비밀번호를 모두 입력해주세요.",
    });
  }

  try {
    const teacher_hashed_password = await hashingPassword(
      teacher_password,
      teacher_id
    );

    const result = await db.query(query, [teacher_id, teacher_hashed_password]);

    if (result.length > 0) {
      // 토큰 부여
      try {
        const id = result[0].teacher_id;
        const name = result[0].teacher_name;
        const role = "teacher";
        const token = jwt.sign(
          {
            id,
            name,
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
          message: "로그인에 성공하였습니다.",
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

      // return res.send({ success: true, message: "로그인에 성공하였습니다." });
    } else {
      //res.send("아이디 또는 비밀번호가 유효하지 않습니다");
      res.send({
        success: false,
        message: "아이디 또는 비밀번호가 유효하지 않습니다",
      });
    }
  } catch (err) {
    console.error(err);
    res.send({ success: false, message: "로그인 중 오류 발생" });
  }
});
module.exports = router;
