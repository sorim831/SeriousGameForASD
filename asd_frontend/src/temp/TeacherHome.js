import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import 추가
import StudentInfo from "./StudentInfo";
import "./TeacherHome.css";
import AddStudent from "./AddStudent";
const address = process.env.REACT_APP_BACKEND_ADDRESS;

function TeacherHome() {
  const navigate = useNavigate(); // useNavigate 훅 선언
  const [showStudentInfo, setShowStudentInfo] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [studentData, setStudentData] = useState([
    {
      student_name: "이민지",
      student_gender: "여",
      student_birthday: "2010-06-15",
      student_parent_name: "김가연",
      student_phone: "010-1234-1234",
      isOnline: false,
    },
    {
      student_name: "박준영",
      student_gender: "남",
      student_birthday: "2011-03-22",
      student_parent_name: "김가연",
      student_phone: "010-1234-1234",
      isOnline: true,
    },
    {
      student_name: "정수빈",
      student_gender: "여",
      student_birthday: "2012-09-05",
      student_parent_name: "김가연",
      student_phone: "010-1234-1234",
      isOnline: true,
    },
  ]);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentInfo(true);
  };

  const handleCloseFeedback = () => {
    setShowStudentInfo(false);
    setSelectedStudent(null);
  };

  const handleGameStart = (student) => {
    console.log(`${student.student_name}의 게임이 시작되었습니다.`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("로그인 화면으로 넘어갑니다.");
    window.location.href = "/teacher_login";
  };

  // 학생 추가 버튼 클릭 시 /add_student 페이지로 이동
  const handleAddStudent = () => {
    navigate("/add_student");
  };

  return (
    <div className="teacher-home">
      <h2 id="teacher-name">김철수 선생님</h2>
      <ul>
        {studentData.map((student, index) => (
          <li className="student-select" key={index}>
            <span className="student-name">{student.student_name}</span>
            <p className="student-gender">({student.student_gender})</p>
            <p className="student-birthday">{student.student_birthday}</p>
            {student.isOnline ? (
              <button
                className="student-is-online"
                onClick={() => handleViewDetails(student)}
              >
                자세히보기
              </button>
            ) : (
              <button
                className="student-is-online"
                onClick={() => handleGameStart(student)}
              >
                게임시작
              </button>
            )}
          </li>
        ))}
      </ul>
      {showStudentInfo && selectedStudent && (
        <StudentInfo
          onClose={handleCloseFeedback}
          studentData={selectedStudent}
        />
      )}
      <button id="student-add" onClick={handleAddStudent}>
        내 학생 추가
      </button>
      <button id="logout" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}

export default TeacherHome;
