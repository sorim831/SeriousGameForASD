import React, { useState, useEffect } from "react";
import StudentInfo from "./StudentInfo";
import "./TeacherHome.css";
import { useNavigate } from "react-router-dom";
const address = process.env.REACT_APP_BACKEND_ADDRESS;

function AddStudent() {
  const [showStudentInfo, setShowStudentInfo] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  //const [studentData, setStudentData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  //const [noTeacherStudentData, setNoTeacherStudentData] = useState([]);

  // navigate 훅 초기화
  const navigate = useNavigate();

  // 선생님 매칭이 되지 않은 학생들 더미 데이터
  const [noTeacherStudentData, setNoTeacherStudentData] = useState([]);

  // 페이지가 처음 렌더링될 때 선생님 매칭되지 않은 학생들의 데이터 요청
  useEffect(() => {
    const fetchNoTeacherStudents = async () => {
      try {
        const response = await fetch(`${address}/get_no_teacher_student`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("데이터를 불러오는 중 문제가 발생했습니다.");
        }

        const data = await response.json();
        setNoTeacherStudentData(data.students); // 받아온 데이터 설정
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };
    fetchNoTeacherStudents();
  }, []);

  // "자세히 보기" 버튼 클릭 시 StudentInfo 컴포넌트 띄우기 (선생님 매칭되지 않은 학생들의 정보)
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentInfo(true);
  };

  // StudentInfo 컴포넌트 닫기
  const handleCloseFeedback = () => {
    setShowStudentInfo(false);
    setSelectedStudent(null);
  };

  // 뒤로 가기 버튼 클릭 이벤트 -> /teacher_home으로 이동
  const handleBack = () => {
    navigate("/teacher_home");
  };

  return (
    <div className="teacher-home">
      <h2 id="teacher-name">매칭 가능한 학생 리스트</h2>
      <ul>
        {noTeacherStudentData.map((student, index) => (
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
      <button id="logout" disabled={!selectedStudent}>
        내 학생으로 등록
      </button>
    </div>
  );
}

export default AddStudent;
