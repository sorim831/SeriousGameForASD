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
  updateTotalStudentInfo:
    "UPDATE student_table SET student_score = ?, student_opinion = ? WHERE student_id = ?", // 최종 결과 저장

  getStudentTotalHistory:
    "SELECT " +
    "formatted_date as date, " +
    "happy, sad, scary, disgusting, angry, score, " +
    "MAX(crt.student_opinion) as student_opinion " +
    "FROM (" +
    "SELECT " +
    "DATE_FORMAT(sst.date, '%y.%m.%d') as formatted_date, " +
    "ROUND(AVG(CASE WHEN sst.student_action = 'happy' THEN sst.student_score END), 2) as happy, " +
    "ROUND(AVG(CASE WHEN sst.student_action = 'sad' THEN sst.student_score END), 2) as sad, " +
    "ROUND(AVG(CASE WHEN sst.student_action = 'scary' THEN sst.student_score END), 2) as scary, " +
    "ROUND(AVG(CASE WHEN sst.student_action = 'disgusting' THEN sst.student_score END), 2) as disgusting, " +
    "ROUND(AVG(CASE WHEN sst.student_action = 'angry' THEN sst.student_score END), 2) as angry, " +
    "ROUND(AVG(sst.student_score), 2) as score, " +
    "sst.student_fk " +
    "FROM student_scores_table sst " +
    "WHERE sst.student_fk = ? " +
    "GROUP BY DATE_FORMAT(sst.date, '%y.%m.%d'), sst.student_fk " +
    ") scores " +
    "LEFT JOIN class_result_table crt ON " +
    "crt.student_fk = scores.student_fk AND " +
    "DATE_FORMAT(crt.date, '%y.%m.%d') = formatted_date " +
    "GROUP BY formatted_date, happy, sad, scary, disgusting, angry, score " +
    "ORDER BY formatted_date",

  getStudentHistoryDetail:
    "SELECT sst.* FROM student_scores_table sst " +
    "WHERE sst.student_fk = ? AND DATE_FORMAT(sst.date, '%y.%m.%d') = ?",

  updateAverageScore:
    "UPDATE student_table SET ?? = (SELECT AVG(student_score) FROM student_scores_table WHERE student_fk = ? AND student_action = ?) WHERE student_id = ?",

  sumStudentScore:
    "SELECT SUM(student_score) AS student_total_score FROM student_scores_table WHERE student_fk = ?",

  getUnsavedDates: `
    SELECT 
      DATE_FORMAT(sst.date, '%y.%m.%d') as formatted_date,
      GROUP_CONCAT(
        CONCAT(sst.student_action, ': ', sst.student_opinion)
        ORDER BY sst.student_action
        SEPARATOR ', '
      ) as student_total_action_and_opinion
    FROM student_scores_table sst
    WHERE sst.student_fk = ?
    AND NOT EXISTS (
      SELECT 1 
      FROM class_result_table crt 
      WHERE crt.student_fk = sst.student_fk 
      AND DATE_FORMAT(crt.date, '%y.%m.%d') = DATE_FORMAT(sst.date, '%y.%m.%d')
    )
    GROUP BY DATE_FORMAT(sst.date, '%y.%m.%d')
    ORDER BY formatted_date
  `,
  insertStudentTotalComment:
    "INSERT INTO class_result_table (student_fk, student_opinion, date) VALUES (?, ?, ?)",
};
