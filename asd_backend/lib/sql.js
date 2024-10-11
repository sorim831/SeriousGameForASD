module.exports = {
  insertStudent:
    "INSERT INTO student_table (student_id, student_name, student_birthday) VALUES (?, ?, ?)",
  checkStudentId: "SELECT * FROM student_table WHERE student_id = ?",
  insertTeacher:
    "INSERT INTO teacher_table (teacher_id, teacher_password, teacher_name) VALUES (?, ?, ?)",
  checkTeacherId: "SELECT * FROM teacher_table WHERE teacher_id = ?",
  loginStudent:
    "SELECT * FROM student_table WHERE student_name = ? AND student_birthday = ?",
  loginTeacher:
    "SELECT * FROM teacher_table WHERE teacher_id = ? AND teacher_password = ?",
  getNoAccessedStudent: "SELECT * FROM student_table WHERE teacher_id IS NULL",
  connectToNoAccessedStudnet:
    "UPDATE student_table SET teacher_id = ? WHERE id = ?",
  getTeacherIdQuery: "SELECT id FROM teacher_table WHERE teacher_id = ?",
};
