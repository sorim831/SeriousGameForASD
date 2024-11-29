import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentInfo from "./StudentInfo";
import "./TeacherHome.css";

const address = process.env.REACT_APP_BACKEND_ADDRESS;

const GetStudent = () => {
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

        if (result.success) {
          if (result.user.role !== "teacher") {
            localStorage.removeItem("token");
            window.location.href = "/main";
          } else {
            setTeacher(result.user.id);
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
      const response = await axios.get(`${address}/access`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setStudents(response.data.students);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectStudent = async (studentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/main";
      return;
    }

    try {
      const response = await axios.post(
        `${address}/access/connect`,
        {
          student_id: studentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // 학생 연결 성공 시 학생 이름을 포함한 알림 표시
        alert(
          `${selectedStudent.student_name} 을(를) 내 학생으로 추가했습니다.`
        );
        checkAccessToken();
      } else {
        alert("연결에 실패했습니다.");
      }
    } catch (error) {
      setError(error);
      alert("서버 오류로 연결을 실패했습니다.");
    }
  };

  useEffect(() => {
    checkAccessToken();
  }, []);

  if (loading) return <p>loading....</p>;

  // "자세히 보기" 버튼 클릭 이벤트
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentInfo(true);
  };

  // StudentInfo 컴포넌트 닫기
  const handleCloseFeedback = () => {
    setShowStudentInfo(false);
    setSelectedStudent(null);
  };

  // 뒤로 가기 버튼 클릭 이벤트
  const handleBack = () => {
    navigate("/TeacherHome");
  };

  return (
    <div className="teacher-home">
      <h2 id="teacher-name">매칭 가능한 학생 리스트</h2>
      {error && <p>{error.message}</p>}
      <ul>
        {students.map((student, index) => (
          <li className="student-select" key={index}>
            <span className="student-name">{student.student_name}</span>
            <p className="student-gender">({student.student_gender})</p>
            <p className="student-birthday">{student.student_birthday}</p>
            <button
              className="student-is-online"
              onClick={() => handleViewDetails(student)}
            >
              자세히보기
            </button>
          </li>
        ))}
      </ul>

      {showStudentInfo && selectedStudent && (
        <StudentInfo
          onClose={handleCloseFeedback}
          studentData={selectedStudent} // 선택된 학생 데이터만 전달
        />
      )}
      <button id="student-add" onClick={handleBack}>
        뒤로 가기
      </button>
      <button
        id="logout"
        disabled={!selectedStudent}
        onClick={() => handleConnectStudent(selectedStudent.id)}
      >
        내 학생으로 등록
      </button>
    </div>
  );
};

export default GetStudent;
