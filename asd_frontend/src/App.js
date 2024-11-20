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
import ScoreAndFeedBack from "./temp/ScoreAndFeedBack";

import Room from "./temp/Room";

// Student
import StudentLoginPage from "./pages/Student/StudentLoginPage";
import StudentHomePage from "./pages/Student/StudentHomePage";
import GamePage from "./pages/Student/GamePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<First />} />
        <Route path="/" element={<Navigate to="/main" />} />
        <Route path="/student_home" element={<StudentHome />} />
        <Route path="/teacher_register" element={<TeacherRegister />} />
        <Route path="/student_register" element={<StudentRegister />} />
        <Route path="/teacher_login" element={<TeacherLogin />} />
        <Route path="/student_login" element={<StudentLogin />} />
        <Route path="/access" element={<Access />} />
        <Route path="/list" element={<GetStudents />} />
        <Route path="/score_and_feedback" element={<ScoreAndFeedBack />} />
        <Route path="/room/:roomId" element={<Room />} />

        {/*Student*/}
        <Route path="/student_login_page" element={<StudentLoginPage />} />
        <Route path="/student_home_page" element={<StudentHomePage />} />
        <Route path="/GamePage/:studentId" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
