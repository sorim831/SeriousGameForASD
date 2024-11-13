const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
//const bodyParser = require("body-parser");

const studentregisterRouter = require("./routes/student_register_process");
const teacherregisterRouter = require("./routes/teacher_register_process");
const studentloginRouter = require("./routes/student_login_process");
const teacherloginRouter = require("./routes/teacher_login_process");

const studentAccessRouter = require("./routes/access");
const getStudnetsListRouter = require("./routes/get_students");

const homeRouter = require("./routes/home");

const feedbackRouter = require("./routes/total_feedback_list");
const getStudentInfo = require("./routes/get_student_info");
const getNoTeacherStudent = require("./routes/get_no_teacher_student");

//const tokenRouter = require("./routes/token");

const cors = require("cors");

const app = express();
app.use(cors());
app.set("port", process.env.PORT || 8000);

/*
app.get("/", (req, res) => {
  res.send("Hello Express");
});
*/

// 루트 경로에서 /login으로 리다이렉트
/*
app.get("/", function (req, res) {
  res.redirect("/home");
});
*/

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/student_register_process", studentregisterRouter);
app.use("/teacher_register_process", teacherregisterRouter);
app.use("/student_login_process", studentloginRouter);
app.use("/teacher_login_process", teacherloginRouter);
app.use("/home", homeRouter);
app.use("/access", studentAccessRouter);
app.use("/get_students", getStudnetsListRouter);
app.use("/total-feedback", feedbackRouter);
app.use("/get_student_info", getStudentInfo);
app.use("/get_no_teacher_student", getNoTeacherStudent);

//app.use("/token", tokenRouter);

module.exports = app;
