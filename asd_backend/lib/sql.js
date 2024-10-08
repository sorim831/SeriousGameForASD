module.exports = {
  insertStudent:
    "INSERT INTO student_table (student_id, student_name, student_birthday) VALUES (?, ?, ?)",
  checkStudentId: "SELECT * FROM student_table WHERE student_id = ?",
  insertTeacher:
    "INSERT INTO teacher_table (teacher_id, teacher_password, teacher_name) VALUES (?, ?, ?)",
  checkTeacherId: "SELECT * FROM teacher_table WHERE teacher_id = ?",
};
