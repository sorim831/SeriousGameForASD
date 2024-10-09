const express = require("express");
const router = express.Router();
const db = require("../lib/db");

router.post("/", async (req, res) => {
  const { teacher_id, teacher_password } = req.body;

  const query = "loginTeacher";

  try {
    const result = await db.query(query, [teacher_id, teacher_password]);
    if (!teacher_id || !teacher_password) {
      return res.send({
        sucess: true,
        message: "아이디와 비밀번호를 모두 입력해주세요.",
      });
    }
    if (result.length > 0) {
      //res.send("로그인에 성공하였습니다.")
      return res.send({ success: true, message: "로그인에 성공하였습니다." });
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
