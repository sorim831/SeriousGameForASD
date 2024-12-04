module.exports = {
  insertStudent:
    "INSERT INTO student_table (student_id, student_name, student_birthday, student_gender, student_phone) VALUES (?, ?, ?, ?, ?)",
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

  getStudentInfo: `SELECT student_id, student_name, student_birthday, student_gender, student_score, student_score_date, student_opinion, student_parent_name, student_phone FROM student_table WHERE student_id = ?`,
  noStudentData: `SELECT student_id, student_name, student_birthday, student_gender, student_score, student_score_date, student_opinion, student_parent_name, student_phone FROM asd_serious_game.student_table WHERE teacher_id IS NULL`, //아직 선생님과 매칭되지 않은 학생 목록
  checkTeacherId: `SELECT * FROM teacher_table WHERE teacher_id = ?`,
  updateStudentTotalComment: `UPDATE student_table SET student_opinion = ? WHERE student_id = ?`,

  getStudentTotalScore:
    "SELECT student_score_happy, student_score_sad, student_score_scary, student_score_disgusting, student_score_angry FROM student_table WHERE student_id = ?",
  updateStudentInfo:
    "INSERT INTO student_scores_table (student_fk, student_action, student_score, student_opinion) VALUES (?,?,?,?)", // 학생 게임 기록 저장
  updateTotalStuentInfo:
    "UPDATE student_table SET student_score = ?, student_opinion = ? WHERE student_id = ?", // 최종 결과 저장

  getStudentTotalHistory:
    "SELECT DATE_FORMAT(date, '%y.%m.%d') as date, " +
    "ROUND(AVG(CASE WHEN student_action = 'happy' THEN student_score END), 2) as happy, " +
    "ROUND(AVG(CASE WHEN student_action = 'sad' THEN student_score END), 2) as sad, " +
    "ROUND(AVG(CASE WHEN student_action = 'scary' THEN student_score END), 2) as scary, " +
    "ROUND(AVG(CASE WHEN student_action = 'disgusting' THEN student_score END), 2) as disgusting, " +
    "ROUND(AVG(CASE WHEN student_action = 'angry' THEN student_score END), 2) as angry, " +
    "ROUND(AVG(student_score), 2) as score " +
    "FROM student_scores_table " +
    "WHERE student_fk = ? " +
    "GROUP BY DATE_FORMAT(date, '%y.%m.%d') " +
    "ORDER BY date;",

  getStudentHistoryDetail:
    "SELECT sst.* FROM student_scores_table sst " +
    "WHERE sst.student_fk = ? AND DATE_FORMAT(sst.date, '%y.%m.%d') = ?",

  updateAverageScore:
    "UPDATE student_table SET ?? = (SELECT AVG(student_score) FROM student_scores_table WHERE student_id = ? AND student_action = ?) WHERE student_id = ?",

  sumStudentScore:
    "SELECT SUM(student_score) AS student_total_score FROM student_scores_table WHERE student_id = ?",
};
