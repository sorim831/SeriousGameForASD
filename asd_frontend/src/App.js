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
import Access from "./temp/Access";
import GetStudents from "./temp/GetStudents";

import StudentLogin from "./temp/StudentLogin";
import StudentRegister from "./temp/StudentRegister";
import TeacherLogin from "./temp/TeacherLogin";
import TeacherRegister from "./temp/TeacherRegister";
import StudentHome from "./temp/StudentHome";
import TeacherHome from "./temp/TeacherHome";
import ScoreAndFeedBack from "./temp/ScoreAndFeedBack";
import AddStudent from "./temp/AddStudent";
import Classroom from "./temp/Classroom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<First />} />
        <Route path="/" element={<Navigate to="/main" />} />
        <Route path="/student_home" element={<StudentHome />} />
        <Route path="/teacher_home" element={<TeacherHome />} />
        <Route path="/teacher_register" element={<TeacherRegister />} />
        <Route path="/student_register" element={<StudentRegister />} />
        <Route path="/teacher_login" element={<TeacherLogin />} />
        <Route path="/student_login" element={<StudentLogin />} />
        <Route path="/access" element={<Access />} />
        <Route path="/list" element={<GetStudents />} />
        <Route path="/add_student" element={<AddStudent />} />
        <Route path="/classroom" element={<Classroom />} />
      </Routes>
    </Router>
  );
}

export default App;
