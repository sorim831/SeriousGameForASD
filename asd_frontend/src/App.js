import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import First from "./temp/First";
//import Login from "./temp/Login";
//import Home from "./temp/Home";
//import Register from "./temp/Register";

import TeacherHome from "./main_page/teacher/TeacherHome";
import GetStudents from "./main_page/teacher/GetStudents";

import StudentLogin from "./auth_page/student/StudentLogin";
import StudentRegister from "./auth_page/student/StudentRegister";
import TeacherLogin from "./auth_page/teacher/TeacherLogin";
import TeacherRegister from "./auth_page/teacher/TeacherRegister";
import StudentHome from "./main_page/student/StudentHome";
import ScoreAndFeedBack from "./game_page/ScoreAndFeedBack";
import TotalAnimation from "./game_page/TotalAnimation";

import Room from "./game_page/Room";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<First />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<StudentHome />} />
        <Route path="/teacher_register" element={<TeacherRegister />} />
        <Route path="/student_register" element={<StudentRegister />} />
        <Route path="/teacher_login" element={<TeacherLogin />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/TeacherHome" element={<TeacherHome />} />
        <Route path="/get_students" element={<GetStudents />} />
        <Route path="/score_and_feedback" element={<ScoreAndFeedBack />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/animation" element={<TotalAnimation />} />
        {/*Student*/}
        {/* <Route path="/student_login_page" element={<StudentLoginPage />} />
        <Route path="/student_home_page" element={<StudentHomePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
