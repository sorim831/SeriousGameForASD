import React, { useState, useEffect } from "react";
import StudentInfo from "./StudentInfo";
import "./TeacherHome.css";
const address = process.env.REACT_APP_BACKEND_ADDRESS;

function TeacherHome() {
  const [showStudentInfo, setShowStudentInfo] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  //const [studentData, setStudentData] = useState([]);

  // 더미 데이터
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

  /*const checkAccessToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트 (추가적으로 구현해야 할 부분 있어서 임시 주석처리 함)
      // window.location.href = "/teacher_login";
    } else {
      try {
        const response = await fetch(`${address}/home`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Bearer 형식으로 토큰 전송
          },
        });

        const result = await response.json();

        if (result.success) {
          console.log("홈페이지에 정상적으로 접근했습니다.");
          document.getElementById(
            "teacher-name"
          ).textContent = `${result.user.name} 선생님`;
        } else {
          // alert("로그인 화면으로 넘어갑니다.");
          // window.location.href = "/teacher_login";
        }
      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
        // window.location.href = "/teacher_login";
      }
    }
  };*/

  // 페이지 마운트 될 때 실행되는 이벤트
  useEffect(() => {
    //checkAccessToken(); // 페이지 로드 시 토큰을 확인
    /*const fetchStudentData = async () => {
      const token = localStorage.getItem("token"); // 토큰 가져오기

      if (!token) {
        setErrorMessage("인증된 사용자가 아닙니다. 로그인 해주세요.");
        // window.location.href = "/teacher_login";
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${address}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Bearer 형식으로 토큰 포함
          },
        });

        const data = await response.json();

        if (response.ok) {
          // 학생 데이터 배열로 설정
          setStudentData(data.students);
        } else {
          setErrorMessage(
            data.message || "학생 정보를 불러오는 중 오류가 발생했습니다."
          );
        }
      } catch (error) {
        setErrorMessage("서버와의 통신에 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };*/
    //fetchStudentData(); // 학생 정보 가져오기 함수 호출
  }, []);

  // "자세히 보기" 버튼 클릭 시 StudentInfo 컴포넌트 띄우기
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentInfo(true);
  };

  // StudentInfo 컴포넌트 닫기
  const handleCloseFeedback = () => {
    setShowStudentInfo(false);
    setSelectedStudent(null);
  };

  // 게임 시작
  const handleGameStart = (student) => {
    console.log(`${student.student_name}의 게임이 시작되었습니다.`); // TODO: 실제 게임 시작 로직 추가
  };

  // 로그아웃 기능 임시로 만듦
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("로그인 화면으로 넘어갑니다.");
    window.location.href = "/teacher_login";
  };

  return (
    <div className="teacher-home">
      <h2 id="teacher-name"></h2> 
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
          studentData={selectedStudent} // 선택된 학생 데이터만 전달
        />
      )}
      <button id="student-add">학생 추가</button>
      <button id="logout" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}

export default TeacherHome;
