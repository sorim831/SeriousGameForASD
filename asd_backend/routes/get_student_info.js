// 학생 정보 조회 라우터
router.get("/", verifyToken, (req, res) => {
  const student_id = req.decoded.id;

  const querySelectStudent = getStudentInfo; //"SELECT student_name, student_gender, student_birthday, is_online FROM student_table WHERE student_id = ?";

  db.query(querySelectStudent, [student_id])
    .then((rows) => {
      if (rows.length > 0) {
        const student = rows[0];
        res.json({
          code: 200,
          success: true,
          students: [
            {
              name: student.student_name,
              gender: student.student_gender,
              birthday: student.student_birthday,
              // isOnline: student.is_online, // TODO: 학생이 온라인 상태인지 확인하는 isOnline 칼럼써야됨
            },
          ],
        });
      } else {
        res.status(404).json({
          code: 404,
          success: false,
          message: "해당 학생 정보를 찾을 수 없습니다.",
          students: [],
        });
      }
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.status(500).json({
        code: 500,
        success: false,
        message: "데이터베이스 오류 발생",
        students: [],
      });
    });
});
