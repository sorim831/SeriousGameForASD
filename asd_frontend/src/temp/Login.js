import React, { useState, useEffect } from "react";
import "./Login.css";

function Login() {
  const address = process.env.REACT_APP_BACKEND_ADDRESS;

  const [Student, setStudent] = useState(false);
  const [studentYear, setStudentYear] = useState([]);
  const [studentMonth, setStudentMonth] = useState([]);
  const [studentDay, setStudentDay] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentBirthday, setStudentBirthday] = useState({
    year: "",
    month: "",
    day: "",
  });

  const [teacherId, setTeacherId] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherName, setTeacherName] = useState("");

  // 반응형 웹 생성
  useEffect(() => {
    const handleResize = () => {
      setStudent(window.innerWidth <= 700);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 학생 : 생년월일 선택 핸들러
  const handleStudentBirthdayChange = (e) => {
    setStudentBirthday({ ...studentBirthday, [e.target.name]: e.target.value });
  };

  // 학생 : 생년월일 옵션 동적 생성
  useEffect(() => {
    const years = [];
    const months = [];
    const days = [];
    for (let i = 2010; i <= 2022; i++) {
      years.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    setStudentYear(years);
    setStudentMonth(months);
    setStudentDay(days);
  }, []);

  // 학생 : 로그인 처리 함수
  const handleStudentLogin = async (e) => {
    e.preventDefault();

    const fullBirthday = `${studentBirthday.year}-${String(
      studentBirthday.month
    ).padStart(2, "0")}-${String(studentBirthday.day).padStart(2, "0")}`;

    try {
      const response = await fetch(`${address}/student_login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_name: studentName,
          student_birthday: fullBirthday,
        }),
      });

      const result = await response.json();
      // alert(result.message);
      if (result.success) {
        localStorage.setItem("token", result.token); // 토큰 저장
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Error:", error);
      alert("학생 로그인 중 오류 발생");
    }
  };

  // 선생 : 로그인 처리 함수
  const handleTeacherLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${address}/teacher_login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          teacher_password: teacherPassword,
          //teacher_name: teacherName,
        }),
      });

      const result = await response.json();
      // alert(result.message);
      if (result.success) {
        localStorage.setItem("token", result.token); // 토큰 저장
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Error details:", error);
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        alert(
          `네트워크 연결 오류: 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.
          ${error.message}`
        );
      }
    }
  };

  // 회원가입 버튼 누르면 회원가입 페이지로 이동
  const RegisterBtn = () => {
    window.location.href = "/register";
  };

  return (
    <div className="App">
      {Student ? (
        // 학생 화면: 이름과 생년월일 입력
        <>
          <form
            className="login-form"
            action="/student_login"
            onSubmit={handleStudentLogin}
          >
            <p>
              <input
                type="text"
                name="name"
                placeholder="이름"
                onChange={(e) => setStudentName(e.target.value)}
              />
            </p>
            <div className="info" id="info__birth">
              <select
                className="box"
                name="year"
                onChange={handleStudentBirthdayChange}
              >
                <option disabled selected>
                  출생 연도
                </option>
                {studentYear.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                className="box"
                name="month"
                onChange={handleStudentBirthdayChange}
              >
                <option disabled selected>
                  월
                </option>
                {studentMonth.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="box"
                name="day"
                onChange={handleStudentBirthdayChange}
              >
                <option disabled selected>
                  일
                </option>
                {studentDay.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="btn">
              <button type="button" onClick={RegisterBtn}>
                회원가입
              </button>
              <button type="submit">로그인</button>
            </div>
          </form>
        </>
      ) : (
        // 선생님 화면: 아이디와 비밀번호 입력
        <>
          <form
            className="login-form"
            action="/teacher_login"
            method="post"
            onSubmit={handleTeacherLogin}
          >
            <input
              type="text"
              name="id"
              placeholder="아이디"
              onChange={(e) => setTeacherId(e.target.value)}
            />
            <input
              type="password"
              name="teacherPassword"
              placeholder="비밀번호"
              onChange={(e) => setTeacherPassword(e.target.value)}
            />
            <div className="btn">
              <button type="button" onClick={RegisterBtn}>
                회원가입
              </button>
              <button type="submit">로그인</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default Login;
