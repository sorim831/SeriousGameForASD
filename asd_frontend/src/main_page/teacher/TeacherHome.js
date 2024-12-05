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
            localStorage.removeItem("token");
            window.location.href = "/main";
          } else {
            setTeacher(result.user.name);
          }
        } else {
          localStorage.removeItem("token");
          window.location.href = "/main";
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
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

  if (loading)
    return (
      <div className="loader">
        <div className="spinner"></div>
        <p>불러오는 중...</p>
      </div>
    );

  // 학생 추가 버튼 클릭 시 /get_students 페이지로 이동
  const handleAddStudent = () => {
    navigate("/get_students");
  };

  // 학생 정보 자세히보기 버튼 이벤트
  const handleViewDetails = (student) => {
    if (selectedStudent && selectedStudent.student_id === student.student_id) {
      setShowStudentInfo(false);
      setSelectedStudent(null);
    } else {
      setSelectedStudent(student);
      setShowStudentInfo(true);
    }
  };

  // 자세히 보기 창 닫기
  const handleCloseFeedback = () => {
    setShowStudentInfo(false);
    setSelectedStudent(null);
  };

  // 게임 시작
  const handleGameStart = (studentId) => {
    console.log(`${studentId}의 게임이 시작되었습니다.`);
    navigate(`/room/${studentId}`, { state: { studentId, students } });
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/teacher_login";
  };

  // 학생 생일 날짜 형식
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 성별 변환
  const formatGender = (gender) => {
    return gender === "male" ? "남" : "여";
  };

  return (
    <div className="teacher-home">
      <div className="teacher-home-header">
        <h2 id="teacher-name">{teacher} 선생님</h2>
        <button
          id="logout"
          className="teacher-home-logout"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
      {error}
      <ul className="teacher-home-student-list">
        {students.map((student, index) => (
          <li
            className="teacher-home-student-item"
            key={index}
            onClick={() => handleViewDetails(student)}
          >
            <div className="teacher-home-student-info">
              <p className="teacher-home-student-name">
                {student.student_name}
              </p>
              <p className="teacher-home-student-gender">
                ({formatGender(student.student_gender)})
              </p>
              <p className="teacher-home-student-birthday">
                {formatDate(student.student_birthday)}
              </p>
            </div>
            <button
              className="teacher-home-student-game-start"
              onClick={() => handleGameStart(student.student_id)}
            >
              게임시작
            </button>
          </li>
        ))}
      </ul>

      {showStudentInfo && selectedStudent && (
        <StudentInfo
          onClose={handleCloseFeedback}
          studentData={selectedStudent}
          key={selectedStudent.student_id}
        />
      )}
      <button className="teacher-home-student-add" onClick={handleAddStudent}>
        내 학생 추가
      </button>
    </div>
  );
};

export default TeacherHome;
