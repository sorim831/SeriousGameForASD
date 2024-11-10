import React, { useState, useEffect } from "react";
import "./StudentLogin.css";

function Login() {
  const address = process.env.REACT_APP_BACKEND_ADDRESS;

  //const [Student, setStudent] = useState(false);
  const [studentYear, setStudentYear] = useState([]);
  const [studentMonth, setStudentMonth] = useState([]);
  const [studentDay, setStudentDay] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentBirthday, setStudentBirthday] = useState({
    year: "",
    month: "",
    day: "",
  });

  const checkAccessToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // 토큰이 없으면 검증하지 않음
    else {
      try {
        const response = await fetch(`${address}/home`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Bearer 형식으로 토큰 전송
          },
        });

        const result = await response.json();

        if (result.success) {
          window.location.href = "/student_home";
        }
      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
        //window.location.href = "/main";
      }
    }
  };

  useEffect(() => {
    checkAccessToken();
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
      const response = await fetch(`${address}/student_login_process`, {
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
      //alert(result.message);
      if (result.success) {
        localStorage.setItem("token", result.token); // 토큰 저장
        window.location.href = "/student_home";
      } else {
        alert(result.message); // 실패 메시지 표시
      }
    } catch (error) {
      console.error("Error:", error);
      alert("학생 로그인 중 오류 발생");
    }
  };

  // 회원가입 버튼 누르면 회원가입 페이지로 이동
  const RegisterBtn = () => {
    window.location.href = "/student_register";
  };

  return (
    <div className="App">
      <form
        className="login-form"
        action="/student_login_process"
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
          <button type="submit">로그인</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
