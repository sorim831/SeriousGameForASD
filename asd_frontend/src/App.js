import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import First from "./temp/First";
//import Login from "./temp/Login";
import Home from "./temp/Home";
//import Register from "./temp/Register";
import Access from "./temp/Access";
import GetStudents from "./temp/GetStudents";

import StudentLogin from "./temp/StudentLogin";
import StudentRegister from "./temp/StudentRegister";
import TeacherLogin from "./temp/TeacherLogin";
import TeacherRegister from "./temp/TeacherRegister";
import FeedbackList from "./temp/feedbackList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<First />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/teacher_register" element={<TeacherRegister />} />
        <Route path="/student_register" element={<StudentRegister />} />
        <Route path="/teacher_login" element={<TeacherLogin />} />
        <Route path="/student_login" element={<StudentLogin />} />
        <Route path="/access" element={<Access />} />
        <Route path="/list" element={<GetStudents />} />
        <Route path="/teacher_start" element={<FeedbackList />} />
      </Routes>
    </Router>
  );
}

export default App;
