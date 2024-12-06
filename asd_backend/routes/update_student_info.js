const express = require("express");
const router = express.Router();
const db = require("../lib/db");
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.get("/", (req, res) => {
  console.log("in update_student_info");
  res.send("update_student_info");
});

// 학생 정보 업데이트 라우터
router.post("/total_comment", (req, res) => {
  console.log(req.body);
  const student_id = req.body.student_id;
  const student_opinion = req.body.student_opinion;
  console.log("in total_comment");

  const query = "updateStudentTotalComment";

  db.query(query, [student_opinion, student_id])
    .then((result) => {
      if (result.affectedRows > 0) {
        res.json({
          code: 200,
          success: true,
          message: "updated!",
        });
      } else {
        res.status(404).json({
          code: 404,
          success: false,
          message: "not found",
        });
      }
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.status(500).json({
        code: 500,
        success: false,
        message: "db err",
      });
    });
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/update_opinion", async (req, res) => {
  console.log(req.body);
  const student_id = req.body.student_id;
  console.log("testtesttesttest");

  const query = "getUnsavedDates";
  const save_query = "insertStudentTotalComment";

  try {
    const result = await db.query(query, [student_id]);
    console.log("result: result: result:", result);
    console.log("result.length: ", result.length);

    if (result.length > 0) {
      for (const dateResult of result) {
        const prompt = `학생이 수행할 수 있는 과제는 happy, sad, angry, disgusting, scary가 있으며, 수행한 과제에 따른 의견이 적혀져있습니다. 당신은 ASD 이러한 의견을 바탕으로 두 줄로 종합 의견을 작성해야 합니다. 그 외에는 어떠한 답도 하지 마세요.
        
        학생이 수행한 과제와 의견: ${dateResult.student_total_action_and_opinion}`;

        const llm_result = await model.generateContent(prompt);
        console.log(
          `${dateResult.formatted_date} 결과:`,
          llm_result.response.text()
        );

        await db.query(save_query, [
          student_id,
          llm_result.response.text(),
          dateResult.formatted_date,
        ]);
        console.log("saved!");
      }

      res.json({
        code: 200,
        success: true,
        message: "good!",
      });
    } else {
      res.json({
        code: 200,
        success: false,
        message: "not found",
      });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      code: 500,
      success: false,
      message: "Error processing request",
    });
  }
});

module.exports = router;
