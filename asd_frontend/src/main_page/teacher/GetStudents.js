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
      //console.log(response.data);
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

  if (loading)
    return (
      <div className="loader">
        <div className="spinner"></div>
        <p>불러오는 중...</p>
      </div>
    );

  // "자세히 보기" 버튼 클릭 이벤트
  const handleViewDetails = (student) => {
    if (selectedStudent && selectedStudent.id === student.id) {
      setShowStudentInfo(false);
      setSelectedStudent(null);
    } else {
      setSelectedStudent(student);
      setShowStudentInfo(true);
    }
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

  const formatGender = (gender) => {
    return gender === "male" ? "남" : "여";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="teacher-home">
      <h2 id="teacher-name" style={{ marginBottom: "30px" }}>
        학생 추가
      </h2>
      {error && <p>{error.message}</p>}
      <ul className="teacher-home-student-list">
        {students.map((student, index) => (
          <li
            className="teacher-home-student-item"
            key={index}
            onClick={() => handleViewDetails(student)}
            style={{ height: "43px" }}
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
            {showStudentInfo &&
              selectedStudent &&
              selectedStudent.id === student.id && (
                <div>
                  <StudentInfo
                    onClose={handleCloseFeedback}
                    studentData={selectedStudent}
                  />
                  <button
                    id="student-add"
                    style={{ float: "right" }}
                    onClick={() => handleConnectStudent(selectedStudent.id)}
                  >
                    내 학생으로 등록
                  </button>
                </div>
              )}
          </li>
        ))}
      </ul>

      <button id="go-back" onClick={handleBack}>
        뒤로 가기
      </button>
    </div>
  );
};

export default GetStudent;
