module.exports = {
  insertStudent:
    "INSERT INTO student_table (student_id, student_name, student_birthday, student_gender, student_phone, student_parent_name) VALUES (?, ?, ?, ?, ?, ?)",
  checkStudentId: "SELECT * FROM student_table WHERE student_id = ?",
  //checkStudentId:  "SELECT * FROM student_table WHERE student_name = ? AND student_birthday = ?",
  insertTeacher:
    "INSERT INTO teacher_table (teacher_id, teacher_password, teacher_name) VALUES (?, ?, ?)",
  loginStudent:
    "SELECT * FROM student_table WHERE student_name = ? AND student_birthday = ?",
  loginTeacher:
    "SELECT * FROM teacher_table WHERE teacher_id = ? AND teacher_password = ?",
  findTeacherId: "SELECT * FROM teacher_table WHERE teacher_id = ? ",
  getNoAccessedStudent: "SELECT * FROM student_table WHERE teacher_id IS NULL",
  getConnectedStudent: "SELECT * FROM student_table WHERE teacher_id = ?",
  connectToNoAccessedStudent:
    "UPDATE student_table SET teacher_id = ? WHERE id = ?",
  getTeacherIdQuery: "SELECT id FROM teacher_table WHERE teacher_id = ?",

  insertStudentOpinion:
    "INSERT INTO asd_serious_game.student_table (student_id, student_opinion) VALUES (?, ?)",

  updateStudentOpinion:
    "UPDATE asd_serious_game.student_table SET student_opinion = ? WHERE student_id = ?",

  getStudentOpinion:
    "SELECT student_opinion FROM asd_serious_game.student_table WHERE student_id = ?",

  getStudentInfo: `SELECT student_id, student_name, student_gender, student_birthday, parent_name, parent_contact FROM student_table WHERE student_id = ? AND student_name = ?`,
  checkTeacherId: `SELECT * FROM teacher_table WHERE teacher_id = ?`,

  getStudentScore : `SELECT student_score FROM student_table WHERE student_id = ?`,

  updateStuentInfo : `UPDATE student_table SET student_score = ?, student_score_date = ?, student_opinion = ? WHERE student_id = ?`  // 이렇게 저장되는게 맞나여?
};
