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
const getStudentInfo = require("./routes/get_student_info");
const updateStudentInfo = require("./routes/update_student_info");

//const endClass = require("./routes/end_class");
const loadGameHistory = require("./routes/load_game_history");
const saveGameTask = require("./routes/save_task");

const sumScore = require("./routes/scores_for_tree");

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

// app.listen(app.get("port"), () => {
//   console.log(app.get("port"), "번 포트에서 대기 중");
// });

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
app.use("/get_student_info", getStudentInfo);
app.use("/update_student_info", updateStudentInfo);

//app.use("/end_class", endClass);
app.use("/load_game_history", loadGameHistory);
app.use("/save_task", saveGameTask);

app.use("/scores_for_tree", sumScore);
//app.use("/token", tokenRouter);

module.exports = app;
