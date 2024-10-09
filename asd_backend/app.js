const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
//const bodyParser = require("body-parser");

const studentregisterRouter = require("./routes/student_register");
const teacherregisterRouter = require("./routes/teacher_register");
const studentloginRouter = require("./routes/student_login");
const teacherloginRouter = require("./routes/teacher_login");

const cors = require("cors");

const app = express();
app.use(cors());
app.set("port", process.env.PORT || 8000);

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/student_register", studentregisterRouter);
app.use("/teacher_register", teacherregisterRouter);
app.use("/student_login", studentloginRouter);
app.use("/teacher_login", teacherloginRouter);

module.exports = app;
