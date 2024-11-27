import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentInfo from "./StudentInfo";
import "./TeacherHome.css";

const address = process.env.REACT_APP_BACKEND_ADDRESS;

const TeacherHome = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacher, setTeacher] = useState("");
  const [showStudentInfo, setShowStudentInfo] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 토큰 검증
  const checkAccessToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/main";
      return;
    } else {
      try {
        const response = await fetch(`${address}/home`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        console.log(result);

        if (result.success) {
          if (result.user.role !== "teacher") {
            window.location.href = "/main";
          } else {
            setTeacher(result.user.name);
          }
        } else {
          window.location.href = "/main";
        }
      } catch (error) {
        console.error(error);
        window.location.href = "/main";
      }
    }

    try {
      const response = await axios.get(`${address}/get_students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data.students);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccessToken();
  }, []);

  if (loading) return <p>loading....</p>;

  // 학생 추가 버튼 클릭 시 /get_students 페이지로 이동
  const handleAddStudent = () => {
    navigate("/get_students");
  };

  // 학생 정보 자세히보기 버튼 이벤트
  const handleViewDetails = (student) => {
    setSelectedStudent(student); // 학생 객체 전체를 저장
    setShowStudentInfo(true);
  };

  // 자세히 보기 창 닫기
  const handleCloseFeedback = () => {
    setShowStudentInfo(false);
    setSelectedStudent(null);
  };

  // 게임 시작
  const handleGameStart = (studentId) => {
    console.log(`${studentId}의 게임이 시작되었습니다.`);
    navigate(`/room/${studentId}`); // studentId를 URL에 포함
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("로그인 화면으로 넘어갑니다.");
    window.location.href = "/teacher_login";
  };

  return (
    <div className="teacher-home">
      <h2 id="teacher-name">{teacher} 선생님</h2>
      {error}
      <ul>
        {students.map((student, index) => (
          <li className="student-select" key={index}>
            <span className="student-name">{student.student_name}</span>
            <p className="student-gender">({student.student_gender})</p>
            <p className="student-birthday">{student.student_birthday}</p>
            <button
              className="student-view-details"
              onClick={() => handleViewDetails(student)} // 학생 객체 전체 전달
            >
              자세히보기
            </button>
            <button
              className="student-game-start"
              onClick={() => handleGameStart(student.id)}
            >
              게임시작
            </button>
          </li>
        ))}
      </ul>

      {showStudentInfo && selectedStudent && (
        <StudentInfo
          onClose={handleCloseFeedback}
          studentData={selectedStudent} // 전체 학생 객체를 전달
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
};

export default TeacherHome;
